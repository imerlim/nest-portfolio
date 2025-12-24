import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma.service';


@Injectable()
export class ProjectsService {
  // Injetamos o PrismaService em vez do Repository
  constructor(private prisma: PrismaService) {}

  // Criar no banco PostgreSQL
  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
        data: createProjectDto as any, // O 'as any' remove a trava do TypeScript temporariamente
    });
    }

  // Buscar todos do banco PostgreSQL
  async findAll() {
    return this.prisma.project.findMany();
  }

  async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: number) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}