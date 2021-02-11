import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from './entity/user.dto';
import { User } from './entity/user.entity';
import { UserRepository } from './entity/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepository: UserRepository) {}

    public async signUp(body: SignupUserDto): Promise<string> {
        if(await this.userRepository.findUserByEmail(body.email)) {
            throw new BadRequestException("Email is already registered");
        }
        if(await this.userRepository.findUserByUsername(body.username)) {
            throw new BadRequestException("Username is already used");
        }

        body.password = bcrypt.hashSync(body.password, 12);
        await this.userRepository.signUp(body);
        return "Sign up success";
    }

    public async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findUserByUsername(username);
        if(user && bcrypt.compareSync(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
