import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ) {
    // O JwtAuthGuard valida o token e coloca o usuário no objeto 'req'
    const userId = req.user.id;
    return this.transactionsService.create(createTransactionDto, userId);
  }

  @Get()
  async findAll(@Query() query: any, @Request() req) {
    const userId = req.user.id;
    // This passes the whole query object (month, year, etc.) to the service
    return this.transactionsService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
