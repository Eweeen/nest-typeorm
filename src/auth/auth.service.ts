import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { UsersService } from 'src/users/users.service';
import AuthDto from './dto/auth.dto';
import { User } from 'src/users/entities/user.entity';
import { compare } from 'bcrypt';
import TokenModel from './token.model';
import { decode, sign } from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { addHours } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly privateKey: string;

  public constructor(private readonly userService: UsersService) {
    this.privateKey = readFileSync('./jwt/id_rsa', 'utf8');
  }

  /**
   * Connecter un utilisateur.
   * @param {AuthDto} authDto - Les données de l'utilisateur à connecter.
   * @async
   */
  public async login(authDto: AuthDto) {
    const user: User = await this.userService.findOneAuthentification(
      authDto.email,
    );

    // If user not found or password not match
    if (!user || !(await compare(authDto.password, user.password))) {
      return { message: 'Identifiants incorrect' };
    }

    return this.generateTokens(user);
  }

  /**
   * Créer les options données aux cookies.
   * @returns Une promesse résolue avec les options des cookies.
   */
  public async craftCookieOptions(): Promise<CookieOptions> {
    return {
      expires: addHours(new Date(), +process.env.JWT_REFRESH_TOKEN_EXPIRE),
      sameSite: 'strict',
      httpOnly: true,
      secure: true,
    } as CookieOptions;
  }

  /**
   * Rafraîchit le refreshToken.
   *
   * @param cookies - Chaîne de caractères représentant les cookies reçus.
   * @returns Une promesse résolue avec un TokenModel.
   */
  public async refresh(cookies: string): Promise<TokenModel> {
    // Extrait refreshToken
    const matchCookie: string = cookies
      .split('; ')
      .find((cookie) => cookie.includes('refreshToken'));

    if (!matchCookie) {
      throw new HttpException(
        'La requête a été envoyé sans refreshToken',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Décode le refreshToken pour obtenir les informations de l'utilisateur
    const token: any = decode(matchCookie.replace('refreshToken=', '').trim());

    // On arrive à décoder le token ?
    if (!token || !token.email) {
      throw new HttpException(
        'Le refreshToken est malformé ou invalide.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Cherche l'utilisateur associé à l'email extrait du token
    const user: User = await this.userService
      .findOneAuthentification(token.email)
      .catch(() => {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      });

    // Génère de nouveaux tokens pour l'utilisateur trouvé
    return this.generateTokens(user);
  }

  /**
   * Générer les tokens d'authentification.
   * @param {User} user - L'utilisateur pour lequel générer les tokens.
   * @returns {Promise<TokenModel>} - Une promesse résolue avec les tokens générés.
   * @async
   */
  private async generateTokens(user: User): Promise<TokenModel> {
    const userToken = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return new TokenModel(
      sign(userToken, this.privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE + 's',
      }),
      sign(userToken, this.privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE + 'h',
      }),
    );
  }
}
