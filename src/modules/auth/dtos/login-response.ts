import { IsEmail, IsNotEmpty } from "class-validator"
export class LoginResponseDto{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    access_token: string
}