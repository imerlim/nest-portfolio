import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule, // Now it's registered globally
    ProjectsModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 👈 Aplica em TODAS as rotas da API
    },
  ],
})
export class AppModule {}
