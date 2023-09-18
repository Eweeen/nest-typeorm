import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
})
export class AuthModule {}
