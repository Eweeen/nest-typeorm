import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({ global: true }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
