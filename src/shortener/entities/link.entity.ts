import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  originalUrl: string;

  @Column({ default: 0 })
  hits: number;

  @CreateDateColumn()
  createdAt: Date;
}
