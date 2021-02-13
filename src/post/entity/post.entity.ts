import { User } from "src/auth/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 80 })
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.post)
    @JoinColumn({ name: "user_id"})
    user: User;
}