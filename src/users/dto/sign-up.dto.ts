import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { UserError } from '../users.enum';

const regex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!*?])(?=.*[^\s]).{8,}$/;

export class SignUpDto {
  @ApiProperty({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ name: 'password' })
  @IsNotEmpty()
  @IsString()
  @Matches(regex, { message: UserError.PASSWORD_REGEX })
  password: string;
}
