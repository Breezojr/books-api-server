import { Body, Controller, Post, Logger } from '@nestjs/common';
import { UsersService } from '../providers/users.service';
import { CreateUser } from '../dtos/user.request.dto';
import { UserResponseDto } from '../dtos/user.response';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    logger= new Logger(UsersController.name)

    @Post('/signup')
    async createUser(
        @Body() createUser: CreateUser,
        
    ): Promise<UserResponseDto> {
        return this.usersService.createUser( createUser);
    }
}