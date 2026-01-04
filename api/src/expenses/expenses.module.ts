import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // 👈 Add this import
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';

@Module({
  imports: [
    // 👈 Import JwtModule with the same secret used in AuthModule
    JwtModule.register({
      secret: 'SUA_CHAVE_SUPER_SECRETA_123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
