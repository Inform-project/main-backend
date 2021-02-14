import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
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

    // param
    @UseGuards(JwtAuthGuard)
    @Patch(':post_id')
    async updatePost(@Param('post_id') id: number, @Body() body: CreatePostDto) {
        await this.postService.updatePost(id, body);
        return "Post updated";
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':post_id')
    async deletePost(@Param('post_id') id: number) {
        await this.postService.deletePost(id);
        return "Post deleted";
    }
}
