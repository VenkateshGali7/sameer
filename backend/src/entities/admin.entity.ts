import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';

  
  @Entity('Admin')
  export class Admin {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  