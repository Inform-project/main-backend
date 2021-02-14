import { ForbiddenException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
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
        await this.postRepository.createPost(body, await this.getUser());
    }

    public async updatePost(id: number, body: CreatePostDto): Promise<void> {
        if(!await this.postRepository.findOne(id)){
            throw new NotFoundException;
        }
        if(!await this.checkMine(id)) {
            throw new ForbiddenException;
        }
        await this.postRepository.updatePost(id, body);
    }

    public async deletePost(id: number): Promise<void> {
        if(!await this.postRepository.findOne(id)){
            throw new NotFoundException;
        }
        if(!await this.checkMine(id)) {
            throw new ForbiddenException;
        }
        await this.postRepository.delete(id);
    }

    private async checkMine(id: number): Promise<boolean> {
        if(!((await this.getUser()).id === (await this.postRepository.findUserByPostId(id)))){
            return false;
        }
        return true;
    }

    private async getUser(): Promise<User> {
        const payload = this.request.user as TokenPayload;
        const user = await this.userRepository.findOne(payload.id);
        return user;
    }
}
