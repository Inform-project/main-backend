import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupUserDto } from './entity/user.dto';
import { User } from './entity/user.entity';
import { UserRepository } from './entity/user.repository';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository) {}

    public async signUp(body: SignupUserDto): Promise<User> {
        if(await this.userRepository.findUserByEmail(body.email)) {
            throw new BadRequestException("Email is already registered");
        }
        if(await this.userRepository.findUserByUsername(body.username)) {
            throw new BadRequestException("Username is already used");
        }

        return await this.userRepository.signUp(body);
    }
}
