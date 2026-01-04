import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This makes PrismaService available everywhere without re-importing the module
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // This is the most important part!
})
export class PrismaModule {}
