import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.model';
import { CreateUser } from '../dtos/user.request.dto';
import { UserResponseDto } from '../dtos/user.response';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('user')
        private readonly userModel: Model<UserDocument>
    ) { }

    async createUser(createUser: CreateUser): Promise<UserResponseDto> {
        const isMatchPassword = createUser.password === createUser.confirmPassword
        if(!isMatchPassword){
            throw new HttpException('Passwords do not Match', HttpStatus.BAD_REQUEST);
        }
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(createUser.password, saltOrRounds);
        createUser.password = hashedPassword

        await this.userModel.create(createUser)
            .catch(err => {
                throw new HttpException('Something went wrong during user save', HttpStatus.BAD_GATEWAY);
            })

        const res = new UserResponseDto()
        res.name  = `${createUser.firstName} ${createUser.lastName}`
        return res
    }

    async getUser(query: object): Promise<User> {
        return this.userModel.findOne(query);
    }
}