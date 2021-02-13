import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreatePostDto } from './entity/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPost(@Body() body: CreatePostDto) {
        await this.postService.createPost(body);
        return "Post created";
    }
}
