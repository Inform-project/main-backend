import { User } from "src/auth/entity/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreatePostDto, UpdatePostDto } from "./post.dto";
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

    public async updatePost(postDto: UpdatePostDto): Promise<void> {
        await this.update(postDto.id, postDto);
    }

    public async findUserByPostId(post_id: number): Promise<number> {
        const { user_id }: { user_id: number } = await this.createQueryBuilder("post")
            .innerJoin("post.user", "user")
            .select("user.id", "user_id")
            .where("post.id = :post_id", { post_id })
            .getRawOne();

        return user_id;
    }
}