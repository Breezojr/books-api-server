import { Body, Controller, Post, Get, Param, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../providers/users.service';
import { User } from '../schemas/user.model';
import { CreateUser } from '../dtos/user.dto';
import { UserResponseDto } from '../dtos/user.response';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    logger= new Logger(UsersController.name)

    @Post('/signup')
    async createUser(
        @Body() createUser: CreateUser,
        
    ): Promise<UserResponseDto> {
        const saltOrRounds = 10;
        return this.usersService.createUser( createUser);
    }
}