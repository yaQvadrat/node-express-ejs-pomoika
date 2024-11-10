"use strict"

import { Router } from "express"

export default class BooksRoutes {
    constructor(bookService) {
        this.router = new Router();
        this.bService = bookService;

        this.router.get('/', this.getAllBooks.bind(this));
        this.router.get('/:bookId([0-9]{1,})', this.getBookById.bind(this));
        this.router.post('/', this.newBook.bind(this));
        this.router.delete('/:bookId([0-9]{1,})', this.deleteBook.bind(this));
        this.router.get('/search', this.searchBook.bind(this));
        this.router.put('/:bookId([0-9]{1,})', this.editBook.bind(this));
    }

    getAllBooks(_, res) {
        let allBooks = Object.entries(this.bService.getAllBooks());

        res.render('books', {books: allBooks}, (err, html) => {
            if (err) {
                return res.status(500).send(`Error while rendering: ${err.message}`);
            }

            // Если первый шаблон отрендерился успешно, то вставляем в layout
            res.render('layout', {
                title: 'Library',
                customStyles: ['books'],
                customScripts: ['books'],
                body: html,
            });
        })
    }

    getBookById(req, res) {
        const book = this.bService.getBookById(req.params.bookId);
        if (book === undefined) {
            return res.status(404).json({ message: `Book with id=${req.params.bookId} not found`});
        }
        
        // Когда ждут только json, то не рендерим html
        if (req.get('accept') === 'application/json') {
            return res.status(200).json(book);
        }

        res.render('book', {id: req.params.bookId, book: book}, (err, html) => {
            if (err) {
                return res.status(500).send(`Error while rendering: ${err.message}`);
            }

            // Если первый шаблон отрендерился успешно, то вставляем в layout
            res.render('layout', {
                title: 'Library',
                customStyles: ['book'],
                customScripts: ['book'],
                body: html,
            })
        });
    }

    newBook(req, res) {
        const newBookWithId = this.bService.newBook(req.body);
        res.status(201).json({ id: newBookWithId.id.toString(), data: newBookWithId.book });
    }

    deleteBook(req, res) {
        const delResult = this.bService.deleteBook(req.params.bookId);
        if (delResult === null) {
            res.sendStatus(404);
        }

        res.sendStatus(200);
    }

    searchBook(req, res) {
        const results = this.bService.searchBook(req.query);

        res.render('partials/books_card', { books: results });
    }

    editBook(req, res) {
        const editedBook = this.bService.editBook(req.params.bookId, req.body);

        if (editedBook === null) {
            res.status(404).json( {message: 'Book with id=${req.params.bookId} not found' });
        }

        res.status(200).json(editedBook);
    }
}
