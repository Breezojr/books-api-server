import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.model';
import { UsersService } from './providers/users.service';
import { UsersController } from './controllers/users.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UserModule {}
