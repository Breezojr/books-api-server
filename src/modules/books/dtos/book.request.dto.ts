import { IsEmail, IsNotEmpty } from "class-validator"

export class BookRequestDto{
    title: string;

    author: string;

    description: string;
}