import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { UsersService } from '../users/users.service';
import AuthDto from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
import { compare } from 'bcrypt';
import TokenModel from './token.model';
import { CookieOptions } from 'express';
import { addHours } from 'date-fns';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  public constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.privateKey = readFileSync('./jwt/id_rsa', 'utf8');
    this.publicKey = readFileSync('./jwt/id_rsa.pub', 'utf8');
  }

  /**
   * Connecter un utilisateur.
   * @param {AuthDto} authDto - Les données de l'utilisateur à connecter.
   * @returns {Promise<TokenModel | { message: string }>} Une promesse résolue avec un TokenModel ou un objet avec un message.
   * @async
   */
  public async login(
    authDto: AuthDto,
  ): Promise<TokenModel | { message: string }> {
    const user: User = await this.userService.findOneAuthentification(
      authDto.email,
    );

    // Si l'utilisateur n'existe pas ou que le mot de passe est incorrect
    if (!user || !(await compare(authDto.password, user.password))) {
      return { message: 'Identifiants incorrect' };
    }

    return this.generateTokens(user);
  }

  /**
   * Créer les options données aux cookies.
   * @returns {Promise<CookieOptions>} Une promesse résolue avec les options des cookies.
   * @async
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
   * @param {string} cookies - Chaîne de caractères représentant les cookies reçus.
   * @returns {Promise<TokenModel>} Une promesse résolue avec un TokenModel.
   * @async
   */
  public async refresh(cookies: string): Promise<TokenModel> {
    // Extrait le refreshToken
    const matchCookie: string = cookies
      .split('; ')
      .find((cookie: string) => cookie.includes('refreshToken'));

    if (!matchCookie) {
      throw new HttpException(
        'La requête a été envoyé sans refreshToken',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.jwtService.verifyAsync(
      matchCookie.replace('refreshToken=', '').trim(),
      {
        algorithms: ['RS256'],
        secret: this.publicKey,
      },
    );

    // On arrive à décoder le token ?
    if (!token?.id) {
      throw new HttpException(
        'Le refreshToken est malformé ou invalide.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Cherche l'utilisateur associé à l'id extrait du token
    const user: User = await this.userService.findOneById(token.id);

    if (!user) {
      throw new HttpException('Utilisateur introuvable', HttpStatus.NOT_FOUND);
    }

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

    const [accessToken, refreshToken]: string[] = await Promise.all([
      this.jwtService.signAsync(userToken, {
        algorithm: 'RS256',
        secret: this.privateKey,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE + 's',
      }),
      this.jwtService.signAsync(
        { id: user.id },
        {
          algorithm: 'RS256',
          secret: this.privateKey,
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE + 'h',
        },
      ),
    ]);

    return new TokenModel(accessToken, refreshToken);
  }
}
