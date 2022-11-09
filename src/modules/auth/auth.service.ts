import {  HttpException, HttpStatus,Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/providers/users.service';
import { LoginRequestDto } from './dtos/login.request';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, 
        private jwtService: JwtService) { }

        logger = new Logger(AuthService.name)

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.getUser({ username });
        if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!user) {
            throw new NotAcceptableException('could not find the user');
        }
        if (user && passwordValid) {
            return user;
        }
        return null;
    }
    async login(body: LoginRequestDto) {
        const user = await this.usersService.getUser({ email: body.email});
        if (!user) {
            throw new NotAcceptableException('wrong email');
        }
        
        const passwordValid = await bcrypt.compare(body.password, user.password)
        if (!passwordValid) {
            throw new NotAcceptableException('wrong password');
        }

        if (user && passwordValid) {
            const payload = { username: body.email};
            return  {
                access_token: this.jwtService.sign(payload),
            };
        }

        throw new HttpException('Login fail', HttpStatus.BAD_REQUEST )
    }
}