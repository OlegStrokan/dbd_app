import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';
// import { ObjectType, Field } from "@nestjs/graphql";
import { ActionStatus } from '../../../core/services/action-logger/interfaces';

export interface ActionLogCreateAttr {
  id: string;
  name: string;
  type: ActionStatus;
  details?: string;
  parentActionId: string;
  authorId: string;
  authorEmail: string;
  timestamp: string;
}

// @ObjectType()
@Entity({ name: 'action-logger' })
@Index(['name'])
@Index(['type'])
@Index(['authorId'])
@Index(['authorEmail'])
@Index(['timestamp'])
export class ActionLogEntity implements ActionLogCreateAttr {
  // @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Field()
  @Column({ length: 255 })
  name: string;

  // @Field()
  @Column({ length: 255 })
  type: ActionStatus;

  // @Field()
  @Column({ nullable: true })
  details?: string;

  // @Field()
  @Column({ length: 255 })
  parentActionId: string;

  // @Field()
  @Column({ length: 255 })
  authorId: string;

  // @Field()
  @Column({ length: 255 })
  authorEmail: string;

  // @Field()
  @Column({ length: 255 })
  timestamp: string;
}
