import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
}