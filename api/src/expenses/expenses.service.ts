import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}
  async create(data: any, userId: number) {
    return this.prisma.expense.create({
      data: {
        description: data.description,
        amount: Number(data.amount),
        userId: userId, // Link to the logged-in user
        date: new Date(), // 👈 Add this line to satisfy the schema
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.expense.update({
      where: { id },
      data: {
        description: data.description,
        amount: Number(data.amount),
      },
    });
  }

  findAll() {
    return `This action returns all expenses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
