"use strict"

import Book from '../entity/book.js'

export default class BookService {
    constructor(bookStorage) {
        this.storage = bookStorage;
    }

    _parseDate(stringDate) {
        if (!stringDate) {
            return null;
        }

        const [day, month, year] = stringDate.split('.');
        return new Date(year, month - 1, day);
    }

    getAllBooks() {
        return this.storage.data;
    }

    getBookById(id) {
        return this.storage.data[id];
    }

    newBook(body) {
        let maxId = Math.max(...Object.keys(this.storage.data)
                .map(key => parseInt(key)).filter(key => !isNaN(key)));

        if (Object.keys(this.storage.data).length == 0) {
            maxId = 0;
        }

        const newBook = {id: maxId + 1, book: new Book(body)};
        this.storage.data[newBook.id] = newBook.book;
        return newBook;
    }

    deleteBook(id) {
        if (!this.storage.data[id]) {
            return null;
        }

        this.storage.data[id] = undefined;
        return true;
    }

    editBook(id, body) {
        if (!this.storage.data[id]) {
            return null;
        }

        for (const key in body) {
            if (!this.storage.data[id].hasOwnProperty(key)) {
                continue;
            }

            if (key === 'returnDate' && body[key].length > 0) {
                const [year, month, day] = body[key].split('-');
                this.storage.data[id][key] = `${day}.${month}.${year}`;
            } else if (key === 'authors') {
                let authors = body[key].split(',');
                authors = authors.map(a => a.trim());
                this.storage.data[id][key] = authors
            } else {
                this.storage.data[id][key] = body[key];
            }
        }

        return this.storage.data[id];
    }

    searchBook(queryParams) {
        const query = queryParams.query;
        const in_stock = queryParams.in_stock === 'true';
        const order_by = queryParams.order_by;

        const sortFunctions = {
            return_asc: (a, b) => {
                const dateA = this._parseDate(a[1].returnDate);
                const dateB = this._parseDate(b[1].returnDate);

                if (!dateA) {
                    return 1
                }
                if (!dateB) {
                    return -1
                }

                return dateA - dateB
            },

            return_desc: (a, b) => {
                const dateA = this._parseDate(a[1].returnDate);
                const dateB = this._parseDate(b[1].returnDate);

                if (!dateA) {
                    return 1
                }
                if (!dateB) {
                    return -1
                }

                return dateB - dateA
            }
        }

        const searchRegex = query && query.length > 0 ? new RegExp(query, 'i') : /.*/;
        const results = Object.entries(this.storage.data).filter(([id, item]) => {
            if (in_stock && item['status'] !== "IN_STOCK") {
                return false;
            }
            return searchRegex.test(id) || ['title', 'authors', 'releaseDate', 'description'].some(field => searchRegex.test(item[field]));
        });

        if (order_by && order_by.length > 0 && sortFunctions[order_by]) {
            results.sort(sortFunctions[order_by]);
        }

        return results;
    }
}
