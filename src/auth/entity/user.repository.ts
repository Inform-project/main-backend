import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { SignupUserDto } from "./user.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private newUser: User;

    public async signUp(userDto: SignupUserDto): Promise<User> {
        this.newUser = this.create(userDto);
        return await this.save(this.newUser);
    }

    public async findUserByEmail(email: string): Promise<User> {
        return await this.findOne({ email });
    }

    public async findUserByUsername(username: string): Promise<User> {
        return await this.findOne({ username });
    }
}