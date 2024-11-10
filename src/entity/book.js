"use strict"

export default class Book {
    constructor(book) {
        this.title = book.title;
        this.description = book.description;
        this.authors = book.authors;
        if (typeof book.authors === "string") {
            this.authors = this.authors.split(',');
            this.authors = this.authors.map(s => s.trim());
        }
        this.releaseDate = book.releaseDate;
        this.status = "IN_STOCK";
        this.returnDate = "";
        this.givenTo = "";
    }
}
