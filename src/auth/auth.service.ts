import { BadRequestException, ForbiddenException, GoneException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from './entity/user.dto';
import { User } from './entity/user.entity';
import { UserRepository } from './entity/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    public async signUp(body: SignupUserDto): Promise<void> {
        if(await this.userRepository.findUserByEmail(body.email)) {
            throw new BadRequestException("Email is already registered");
        }
        if(await this.userRepository.findUserByUsername(body.username)) {
            throw new BadRequestException("Username is already used");
        }

        body.password = bcrypt.hashSync(body.password, 12);
        await this.userRepository.signUp(body);
    }

    public async login({ username, id }: { username: string; id: number })
        : Promise<{ access_token: string; refresh_token: string }> {
            const access_token = this.generateToken({
                id,
                username,
                type: "access"
            });
            const refresh_token = this.generateToken({
                id,
                username,
                type: "refresh"
            });

            return { access_token, refresh_token };
    }

    public refresh(token: string): { access_token: string } {
        try {
            const splitToken = token.split(" ");
            if(splitToken[0] !== "Bearer") {
                throw new BadRequestException;
            }
            const refreshPayload = this.jwtService.verify(splitToken[1]);
            if(refreshPayload.type !== "refresh") {
                throw new ForbiddenException;
            }
            const access_token = this.generateToken({
                id: refreshPayload.id,
                username: refreshPayload.username,
                type: "access"
            });
            
            return { access_token };
        } catch (err) {
            if (err === TokenExpiredError) {
                throw new GoneException;
            } else if (err === JsonWebTokenError) {
                throw new BadRequestException;
            }
            throw err;
        }
    }

    public async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findUserByUsername(username);
        if(user && bcrypt.compareSync(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    private generateToken({ id, username, type }: { id: number; username: string; type: string; }) {
        return this.jwtService.sign({ id, username, type }, {
            expiresIn: type === "access" ? "2h" : type === "refresh" ? "14d" : 0,
        });
    }
}
