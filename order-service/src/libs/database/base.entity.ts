// path/to/base.entity.ts
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
