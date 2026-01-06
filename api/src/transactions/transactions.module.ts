import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // 👈 Add this import
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [
    // 👈 Import JwtModule with the same secret used in AuthModule
    JwtModule.register({
      secret: 'SUA_CHAVE_SUPER_SECRETA_123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
