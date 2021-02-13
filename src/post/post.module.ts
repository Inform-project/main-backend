import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/entity/user.repository';
import { PostRepository } from './entity/post.repository';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository, UserRepository]),
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
