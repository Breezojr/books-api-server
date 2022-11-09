import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.model';
import { CreateUser } from '../dtos/user.dto';
import { UserResponseDto } from '../dtos/user.response';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('user')
        private readonly userModel: Model<UserDocument>
    ) { }

    async createUser(createUser: CreateUser): Promise<UserResponseDto> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(createUser.password, saltOrRounds);
        createUser.password = hashedPassword

        await this.userModel.create(createUser)
            .catch(err => {
                throw new HttpException('Password providedis wrong', HttpStatus.BAD_GATEWAY);
            })

        const res = new UserResponseDto()
        res.firstName = createUser.firstName
        res.lastName = createUser.lastName
        return res
    }

    async getUser(query: object): Promise<User> {
        return this.userModel.findOne(query);
    }
}