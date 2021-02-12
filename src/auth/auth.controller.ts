import { BadRequestException, Body, Controller, Get, GoneException, Headers, Post, Request, UseGuards } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { SignupUserDto } from './entity/user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    async signUp(@Body() body: SignupUserDto) {
        await this.authService.signUp(body);
        return "Sign up success";
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    profile(@Request() req) {
        return req.user;
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('refresh')
    async refresh(@Headers('x-refresh-token') refresh_token: string) {
        try {
            return this.authService.refresh(refresh_token);
        } catch (err) {
            if (err === TokenExpiredError) {
                throw new GoneException;
            } else if (err === JsonWebTokenError) {
                throw new BadRequestException;
            }
            throw err;
        }
    }
}
