import { Post } from "src/post/entity/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ unique: true, length: 16 })
    username: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Post, post => post.user, { onDelete: "CASCADE" })
    post: Post[];
}