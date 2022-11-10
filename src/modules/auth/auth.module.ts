import { Module } from "@nestjs/common"
import { AuthService } from "./providers/auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { UserModule } from "../user/user.module";
import { UsersService } from "../user/providers/users.service";
import { UserSchema } from "../user/schemas/user.model";
import { JwtStrategy } from "./providers/jwt.stratergy";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: 'secretKey',
            signOptions: { expiresIn: '600s' },
        }),
        MongooseModule.forFeature([{
            name: "user", schema: UserSchema
        }])],
    providers: [
        AuthService,
        UsersService,
        JwtStrategy
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule { }