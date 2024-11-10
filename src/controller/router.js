"use strict"

import BooksRoutes from "./books.js"
import IndexRoutes from "./index.js";

export function configureRouter(app, services) {
    const booksRoutes = new BooksRoutes(services.book);
    app.use('/books', booksRoutes.router);

    const indexRoutes = new IndexRoutes();
    app.use('/', indexRoutes.router);
}
