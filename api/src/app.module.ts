import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    
    imports: [TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db.sqlite',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // CUIDADO: em produção isso deve ser false
        }),
        ProjectsModule,
    ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
