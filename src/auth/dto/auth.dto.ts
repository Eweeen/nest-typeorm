import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export default class AuthDto {
  @ApiProperty({ example: 'exemple@domain.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'secure-password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
