import { Body, Controller, Post, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/providers/jwt-auth.guard';
import { BookRequestDto } from '../dtos/book.request.dto';
import { BookResponseDto } from '../dtos/book.response';
import { BooksService } from '../providers/books.service';

@Controller('books')
export class BooksController {
    constructor(private readonly bookService: BooksService) { }

    logger= new Logger(BooksController.name)

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    async createUser(
        @Body() createBook: BookRequestDto,
        
    ): Promise<BookResponseDto> {
        return this.bookService.addBook( createBook);
    }
}