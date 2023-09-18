import { Global, Module, UseFilters } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { SeederCommand } from './database/seeder';
import { CommandModule } from 'nestjs-command';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'config.env', isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]), // 100 requests from the same IP in 1 minute
    // Import modules
    DatabaseModule,
    CommandModule,
    AuthModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard }, // Use the ThrottlerGuard to prevent too many requests from the same IP.
    // Import services
    UsersService,
    SeederCommand,
  ],
  exports: [
    // Import services
    UsersService,
    SeederCommand,
  ],
})
@UseFilters(HttpExceptionFilter)
export class AppModule {}
