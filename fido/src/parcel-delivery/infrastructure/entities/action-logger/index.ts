import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';
import {ObjectType} from "@nestjs/graphql";


@ObjectType()
@Entity({ name: 'action-logger '})
@Index(['name'])
@Index(['type'])
@Index(['authorId'])
@Index(['authorEmail'])
@Index(['timestamp'])
export class ActionLoggerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    type: string;

    @Column('text')
    details: string;

    @Column({ length: 255 })
    parentActionId: string;

    @Column({ length: 255 })
    authorId: string;

    @Column({ length: 255 })
    authorEmail: string;

    @Column('timestamp')
    timestamp: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
