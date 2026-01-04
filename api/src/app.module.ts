import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // Now it's registered globally
    ProjectsModule,
    AuthModule,
    ExpensesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
