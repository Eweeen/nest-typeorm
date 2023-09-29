import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';
import { Paginated } from './users.interface';
import { Auth } from '../auth/auth.decorator';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Créer un utilisateur
   * @param { SignUpDto } signUpRequest Les informations de l'utilisateur
   * @returns { Promise } L'utilisateur créé
   * @throws { HttpStatus.CONFLICT } L'utilisateur existe déjà
   */
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpRequest: SignUpDto): Promise<User> {
    const isEmailUsed: User = await this.usersService.findOneByEmail(
      signUpRequest.email,
    );

    if (isEmailUsed) {
      throw new HttpException(
        `Un utilisateur avec le même e-mail existe déjà`,
        HttpStatus.CONFLICT,
      );
    }

    return await this.usersService.signUp(signUpRequest);
  }

  /**
   * Récupère tous les utilisateurs
   * @param { number } page La page à récupérer
   * @returns { Promise } Les utilisateurs
   */
  @Auth('admin')
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page?: number): Promise<Paginated<User>> {
    return await this.usersService.findAll(page);
  }
}
