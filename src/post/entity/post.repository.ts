import { User } from "src/auth/entity/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreatePostDto } from "./post.dto";
import { Post } from "./post.entity";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
    private newPost: Post;

    public async createPost(postDto: CreatePostDto, user: User): Promise<void> {
        this.newPost = this.create({
            ...postDto,
            user
        });
        await this.save(this.newPost)
    }
}