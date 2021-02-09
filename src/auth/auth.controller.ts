import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './entity/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    async signUp(@Body() body: SignupUserDto) {
        await this.authService.signUp(body);
        return "Sign up success";
    }
}
