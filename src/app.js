"use strict"

import express from 'express';
import morgan from 'morgan';
import formData from 'express-form-data'
import JSONStorage from './storage/storage.js';
import { configureRouter } from './controller/router.js';
import BookService from './service/book.js';

export const bookStorage = new JSONStorage('src/storage/books.json');
export const app = express();

console.log(`initial storage state:\n${JSON.stringify(bookStorage.data, null, 2)}`);

const bookService = new BookService(bookStorage);

app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('src/public'));
app.use(formData.parse());
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
configureRouter(app, { book: bookService });
