import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import AuthDto from './dto/auth.dto';
import TokenModel from './token.model';
import { CookieOptions, Request, Response } from 'express';

@ApiTags('Auth')
@Controller({ path: 'auth' })
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  /**
   * Connecter un utilisateur.
   * @param {AuthDto} authDto - Les données de l'utilisateur à connecter.
   * @param {Response} res - La réponse.
   * @returns {Promise<Response<any, Record<string, any>>>} Une promesse résolue avec un TokenModel.
   * @async
   */
  @Post()
  @Throttle({ default: { limit: 20, ttl: 300 } }) // 20 requests max every 5 minutes for the same IP
  async login(
    @Body() authDto: AuthDto,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    // Tente de se connecter et on récupère le token si c'est bon
    const response: TokenModel | { message: string } =
      await this.authService.login(authDto);

    // Si ce n'est pas un TokenModel, c'est que le mot de passe ou l'email est incorrect
    if (!(response instanceof TokenModel)) {
      throw new HttpException(response, HttpStatus.UNAUTHORIZED);
    }

    const cookieOptions: CookieOptions =
      await this.authService.craftCookieOptions();

    // On met le refreshToken dans un cookie
    res.cookie('refreshToken', response.getRefreshToken(), cookieOptions);

    // Et on renvoie le token dans le body
    return res.send({ token: response.getToken() });
  }

  /**
   * Rafraîchir le token d'un utilisateur.
   * @param {Request} req - La requête.
   * @param {Response} res - La réponse.
   * @returns {Promise<Response<any, Record<string, any>>>} Une promesse résolue avec un TokenModel.
   * @async
   */
  @SkipThrottle()
  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    // Aucun cookie dans la requête
    if (!req.headers.cookie) {
      throw new HttpException(
        `La requête a été envoyé sans cookies`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // On rafraîchit le token, ou throw si le token est invalide
    const response: TokenModel = await this.authService
      .refresh(req.headers.cookie)
      .catch((err) => {
        throw new HttpException(err.response, err.status);
      });

    const cookieOptions: CookieOptions =
      await this.authService.craftCookieOptions();

    res.cookie('refreshToken', response.getRefreshToken(), cookieOptions);
    return res.send({ token: response.getToken() });
  }

  /**
   * Déconnecter un utilisateur.
   * @param {Response} res - La réponse.
   */
  @SkipThrottle()
  @Get('/logout')
  logout(@Res() res: Response): Response {
    res.clearCookie('refreshToken');
    return res.send({ message: 'Logout successfully' });
  }
}
