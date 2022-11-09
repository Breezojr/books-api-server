import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { BookRequestDto } from '../dtos/book.request.dto';
import { BookResponseDto } from '../dtos/book.response';
import { EditBookRequestDto } from '../dtos/edit-book.request.dto';
import { Book, BookDocument } from '../schemas/book.model';
import { Request } from 'express';
import { UserDocument } from 'src/modules/user/schemas/user.model';

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
        const publicBooks = books.filter(book => book.isPublic)
        return publicBooks
    }

    async addBook(req, body: BookRequestDto): Promise<BookResponseDto> {
        const userEmail = req.user.username
        const user = await this.bookModel.findOne({ 'email': userEmail })

        if (!user) {
            throw new HttpException('user was not found', HttpStatus.NOT_FOUND)
        }

        Object.assign(body, { 'user': user._id })

        this.logger.log(body)


        const book = await this.bookModel.create(body)
            .catch(err => {
                throw new HttpException('Something went wrong during user save', HttpStatus.BAD_GATEWAY);
            })

        const res = new BookResponseDto()
        res.title = book.title
        return res
    }

    async getBook(query: object): Promise<Book> {
        const book = await this.bookModel.findOne(query);
        if (!book) {
            throw new HttpException('book was not found', HttpStatus.NOT_FOUND)
        }
        return book
    }

    async editBook(query: object, body: EditBookRequestDto, req): Promise<string> {
        const userEmail = req.user.username
        const user = await this.userModel.findOne({ 'email': userEmail })

        if (!user) {
            throw new HttpException('user was not found', HttpStatus.NOT_FOUND)
        }

        if (user.email === userEmail) {
            const book = await this.bookModel.findOne(query);
            if (!book) {
                throw new HttpException('book was not found', HttpStatus.NOT_FOUND)
            }
            const updatedBook = await this.bookModel.findOneAndUpdate(query, body)
            return `Book ${book.title} was updated succesfully`
        }

    }

    async deleteBook(query: object): Promise<string> {
        const book = await this.bookModel.findOne(query);
        if (!book) {
            throw new HttpException('book was not found', HttpStatus.NOT_FOUND)
        }

        const updatedBook = await this.bookModel.findOneAndDelete(query)

        return `Book ${book.title} was deleted succesfully`
    }

    async deactivateBook(query: object): Promise<string> {
        const book = await this.bookModel.findOne(query);
        if (!book) {
            throw new HttpException('book was not found', HttpStatus.NOT_FOUND)
        }

        const updatedBook = await this.bookModel.findOneAndUpdate(query, { "isPublic": !book.isPublic })

        return `Book ${book.title} status was changed succesfully`
    }



    // router.put("/edit/:newsId", authentication, async (req, res) => {
    //     try {
    //       let admin = await Admin.findById(req.user.id);
    //       if (!admin) {
    //         return res
    //           .status(501)
    //           .send({ message: "Provide a valid admin's token" });
    //       }

    //       let news = await News.findById(req.params.newsId);
    //       if (!news) {
    //         return res.status(404).send({ message: "News not found" });
    //       }

    //       let newNews = await News.findByIdAndUpdate(
    //         { _id: req.params.newsId },
    //         { $set: req.body },
    //         { new: true }
    //       );
    //       if (newNews) {
    //         return res.status(202).send({ data: "updated successfully" });
    //       } else {
    //         return res
    //           .status(500)
    //           .send({ message: "There is error occured, Please try again" });
    //       }
    //     } catch (error) {
    //       console.log(`kuna tatizo la kiufundi ${error.message}`);
    //       return res.status(500).send({ message: error.message });
    //     }
    //   });
}