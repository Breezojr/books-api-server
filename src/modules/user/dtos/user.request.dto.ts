import { IsEmail, IsNotEmpty } from "class-validator"

export class CreateUser{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    firstName: string;

    lastName: string;

    @IsNotEmpty()
    password: string;
    
    @IsNotEmpty()
    confirmPassword: string;
}