import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/books/book.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/authentication'),
    UserModule,
    AuthModule,
    BookModule
  ]
})
export class AppModule { }
