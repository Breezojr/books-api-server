import { IsNotEmpty } from "class-validator";

export class BookRequestDto{
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    author: string;

    description: string;
}