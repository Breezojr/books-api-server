import { IsEmail, IsNotEmpty } from "class-validator"

export class EditBookRequestDto{
    title: string;

    author: string;

    description: string;
}