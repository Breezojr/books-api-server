import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { BookRequestDto } from '../dtos/book.request.dto';
import { BookResponseDto } from '../dtos/book.response';
import { Book, BookDocument } from '../schemas/book.model';

@Injectable()
export class BooksService {
    constructor(
        @InjectModel('book')
        private readonly bookModel: Model<BookDocument>
    ) { }

    async addBook(body: BookRequestDto): Promise<BookResponseDto> {
      
      const book =  await this.bookModel.create(body)
            .catch(err => {
                throw new HttpException('Something went wrong during user save', HttpStatus.BAD_GATEWAY);
            })

        const res = new BookResponseDto()
        res.title  = book.title
        return res
    }

    async getBook(query: object): Promise<Book> {
        return this.bookModel.findOne(query);
    }

    async getAllBooks(query: object): Promise<Book[]> {
        return this.bookModel.find();
    }
}