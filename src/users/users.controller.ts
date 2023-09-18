import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Créer un utilisateur
   * @param user
   * @returns { Promise } L'utilisateur créé
   * @throws { HttpStatus.CONFLICT } L'utilisateur existe déjà
   */
  @HttpCode(201)
  @Post('/sign-up')
  async signUp(@Body() signUpRequest: SignUpDto): Promise<User> {
    const isEmailUsed = await this.usersService.findOneByEmail(
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
}
