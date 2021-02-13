import { Body, Controller, Get, Headers, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './entity/user.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    async signUp(@Body() body: SignupUserDto) {
        await this.authService.signUp(body);
        return "Sign up success";
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('refresh')
    async refresh(@Headers('x-refresh-token') refresh_token: string) {
        return this.authService.refresh(refresh_token);
    }
}
