import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from '../prisma.service'; // Garanta que o PrismaService está aqui

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService], // Apenas o Service e o Prisma
})
export class ProjectsModule {}