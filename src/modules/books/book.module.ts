import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './providers/books.service';
import { BookSchema } from './schemas/book.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "book", schema: BookSchema }]),
        UserModule
    ],
    providers: [BooksService],
    controllers: [BooksController]
})
export class BookModule {}
