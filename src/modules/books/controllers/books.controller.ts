import { Body, Controller, Post, Logger, UseGuards, Get, Param, Put, Delete, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/providers/jwt-auth.guard';
import { BookRequestDto } from '../dtos/book.request.dto';
import { BookResponseDto } from '../dtos/book.response';
import { EditBookRequestDto } from '../dtos/edit-book.request.dto';
import { BooksService } from '../providers/books.service';
import { Book } from '../schemas/book.model';
import { Request } from 'express';

@Controller('books')
export class BooksController {
    constructor(private readonly bookService: BooksService) { }

    @Get()
    async allBooks(): Promise<Book[]> {
        return this.bookService.getAllBooks();
    }

    @Get(':title')
    async getBook(@Param('title') title: string): Promise<Book> {
        return this.bookService.getBook({"title": title});
    }


    @UseGuards(JwtAuthGuard)
    @Post('/add')
    async addBook(
        @Req() request: Request,
        @Body() createBook: BookRequestDto,
    ): Promise<BookResponseDto> {
        return this.bookService.addBook(request, createBook);
    }

    @Put('/edit/:title')
    async editBook(
        @Req() request: Request,
        @Param('title') title: string,
        @Body() editBook: EditBookRequestDto,
    ): Promise<string> {
        return this.bookService.editBook({"title": title}, editBook, request);
    }   

    @Delete('/delete/:title')
    async deleteBook(
        @Param('title') title: string,
    ): Promise<string> {
        return this.bookService.deleteBook({"title": title});
    }   

    @Get('/deactivate/:title')
    async deactivateBook(
        @Param('title') title: string,
    ): Promise<string> {
        return this.bookService.deactivateBook({"title": title});
    }  
}