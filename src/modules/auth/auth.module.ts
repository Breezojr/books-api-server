import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { UserModule } from "../user/user.module";
import { UsersService } from "../user/providers/users.service";
import { UserSchema } from "../user/schemas/user.model";
import { LocalStrategy } from "./local.stratergy";
import { JwtStrategy } from "./jwt.stratergy";


@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: 'secretKey',
            signOptions: { expiresIn: '60s' },
        }),
        MongooseModule.forFeature([{
            name: "user", schema: UserSchema
        }])],
    providers: [
        AuthService,
        UsersService,
        LocalStrategy,
        JwtStrategy
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule { }