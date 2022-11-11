import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookRequestDto } from '../dtos/book.request.dto';
import { BookResponseDto } from '../dtos/book.response';
import { EditBookRequestDto } from '../dtos/edit-book.request.dto';
import { Book, BookDocument } from '../schemas/book.model';
import { UserDocument } from 'src/modules/user/schemas/user.model';
import { QueryDTo } from '../dtos/query.input';

@Injectable()
export class BooksService {
    constructor(
        @InjectModel('book')
        private readonly bookModel: Model<BookDocument>,
        @InjectModel('user')
        private readonly userModel: Model<UserDocument>,
    ) { }

    logger = new Logger(BooksService.name)

    async getAllBooks(): Promise<Book[]> {
        const books = await this.bookModel.find()
        return books
    }

    async addBook(req, body: BookRequestDto): Promise<BookResponseDto> {
        const userEmail = req.user.username
        const user = await this.userModel.findOne({ 'email': userEmail })

        Object.assign(body, { 'user': user._id })

        const book = await this.bookModel.create(body)
            .catch(err => {
                throw new HttpException('Something went wrong during user save', HttpStatus.BAD_GATEWAY)
            })

        const res = new BookResponseDto()
        res.status = "200"
        res.message = `Book titled ${book.title} added successfully`
        return res
    }

    async getBook(query: QueryDTo): Promise<Book> {
        const book = await this.bookModel.findOne(query);
        if (!book && book.isPublic !== true) {
            throw new HttpException(`This book can not found`, HttpStatus.NOT_FOUND)
        }
        return book
    }

    async editBook(query: QueryDTo, body: EditBookRequestDto, req): Promise<BookResponseDto> {
        const userEmail = req.user.username

        const book = await this.bookModel.findOne(query);
        if (!book) {
            throw new HttpException('book was not found', HttpStatus.NOT_FOUND)
        }

        const userInBook = await this.userModel.findOne({ '_id': book.user })
        if (userInBook.email !== userEmail) {
            throw new HttpException('You cant edit this book', HttpStatus.NOT_ACCEPTABLE)
        }

      if (!body.author || !body.title ) {
        throw new HttpException('Provide data to edit', HttpStatus.BAD_REQUEST)
      }

        const updatedBook = await this.bookModel.findOneAndUpdate(query, body)
        const res = new BookResponseDto()
        res.status = "200"
        res.message = `Book titled ${book.title} edited successfully`
        return res    }

    async deleteBook(query: QueryDTo, req){
        const userEmail = req.user.username

        const book = await this.bookModel.findOne(query);
        if (!book) {
            throw new HttpException('book was not found', HttpStatus.NOT_FOUND)
        }
        
        const userInBook = await this.userModel.findOne({ '_id': book.user })
        if (userInBook.email !== userEmail) {
            throw new HttpException('You cant delete this book', HttpStatus.NOT_ACCEPTABLE)
        }

        const updatedBook = await this.bookModel.findOneAndDelete(query)

        const resp = {
            message: `Book ${book.title} was deleted succesfully`,
            status:  '200'
        }
        return resp
    }

    async deactivateBook(query: QueryDTo, req){
        const userEmail = req.user.username

        const book = await this.bookModel.findOne(query);
        if (!book) {
            throw new HttpException('book was not found', HttpStatus.NOT_FOUND)
        }
        
        const userInBook = await this.userModel.findOne({ '_id': book.user })
        if (userInBook.email !== userEmail) {
            throw new HttpException('You cant change status of this book', HttpStatus.NOT_ACCEPTABLE)
        }

        const updatedBook = await this.bookModel.findOneAndUpdate(query, { "isPublic": !book.isPublic })

        const resp = {
            isPublic:updatedBook.isPublic,
            status: '200'
        }

        return resp
    }
}