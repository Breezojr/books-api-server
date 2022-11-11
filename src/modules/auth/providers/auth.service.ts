import {  
    HttpException, 
    HttpStatus,
    Injectable, 
    Logger, 
    NotAcceptableException 
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../user/providers/users.service';
import { LoginRequestDto } from '../dtos/login.request';
import { LoginResponseDto } from '../dtos/login-response';
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, 
        private jwtService: JwtService) { }

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
            return {
                message: 'Email not found',
                status: '400'
                
            } 
        }
        
        const passwordValid = await bcrypt.compare(body.password, user.password)
        if (!passwordValid) {
            throw new NotAcceptableException('wrong password');
        }

        if (user && passwordValid) {
            const payload = { username: body.email};
            const access_token = this.jwtService.sign(payload)

            const response = new LoginResponseDto
            response.status = '200'
            response.id = user._id
            response.email = user.email;
            response.firstName = user.firstName;
            response.lastName = user.firstName;
            response.access_token = access_token
            return response
        }

        throw new HttpException('Login fail', HttpStatus.BAD_REQUEST )
    }
}