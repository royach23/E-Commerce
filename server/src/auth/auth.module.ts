import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
