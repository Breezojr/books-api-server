import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { LoginRequestDto } from '../dtos/login.request';
import { JwtAuthGuard } from '../providers/jwt-auth.guard';

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Body() loginRequestBody: LoginRequestDto) {
        return this.authService.login(loginRequestBody);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }
}