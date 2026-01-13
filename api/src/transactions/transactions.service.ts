import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  async create(data: any, userId: number) {
    return this.prisma.transaction.create({
      data: {
        description: data.description,
        amount: Number(data.amount),
        userId: userId, // Link to the logged-in user
        month: data.month,
        year: data.year,
        type: data.type,
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        description: data.description,
        amount: Number(data.amount),
      },
    });
  }

  async findAll(userId: number, filters: any) {
    // Destructure the filters from the query
    const { month, year, description, amount } = filters;

    return this.prisma.transaction.findMany({
      where: {
        userId: userId, // Always filter by user

        // The "when" logic: only filter if the value exists
        ...(month && { month }),
        ...(year && { year: Number(year) }),

        // Example of "Like" search for description (Laravel-style)
        ...(description && {
          description: { contains: description, mode: 'insensitive' },
        }),

        // Example of exact value
        ...(amount && { amount: Number(amount) }),
      },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async remove(id: number) {
    try {
      // No Prisma, você pode tentar deletar direto ou buscar primeiro
      return await this.prisma.transaction.delete({
        where: { id },
      });
    } catch (error) {
      // O Prisma lança um erro específico se o ID não existir
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }
}
