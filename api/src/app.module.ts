import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [ProjectsModule, AuthModule, ExpensesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}