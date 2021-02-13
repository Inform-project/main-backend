import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/entity/user.repository';
import { TokenPayload } from 'src/auth/interface/payload.interface';
import { CreatePostDto } from './entity/post.dto';
import { Post } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';

@Injectable({ scope: Scope.REQUEST })
export class PostService {
    constructor(
        @InjectRepository(Post) private postRepository: PostRepository,
        @InjectRepository(User) private userRepository: UserRepository,
        @Inject(REQUEST) private request: Request,
    ) {}

    public async createPost(body: CreatePostDto): Promise<void> {
        const payload = this.request.user as TokenPayload;
        const user: User = await this.userRepository.findOne(payload.id);
        
        await this.postRepository.createPost(body, user);
    }
}
