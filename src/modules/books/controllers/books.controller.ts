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

    @Get(':id')
    async getBook(@Param('id') id: string): Promise<Book> {
        return this.bookService.getBook({"_id": id});
    }

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    async addBook(
        @Req() request: Request,
        @Body() createBook: BookRequestDto,
    ): Promise<BookResponseDto> {
        return this.bookService.addBook(request, createBook);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/edit/:id')
    async editBook(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() editBook: EditBookRequestDto,
    ): Promise<string> {
        return this.bookService.editBook({"_id": id}, editBook, request);
    }   

    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    async deleteBook(
        @Req() request: Request,
        @Param('id') id: string,
    ): Promise<string> {
        return this.bookService.deleteBook({"_id": id}, request);
    }  
    
    @UseGuards(JwtAuthGuard)
    @Get('/deactivate/:id')
    async deactivateBook(
        @Req() request: Request,
        @Param('id') id: string,
    ): Promise<string> {
        return this.bookService.deactivateBook({"_id": id}, request);
    }  
}