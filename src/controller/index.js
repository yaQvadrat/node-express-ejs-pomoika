"use strict"

import { Router } from "express"

export default class IndexRoutes {
    constructor() {
        this.router = Router();

        this.router.get('/', this.root.bind(this));
    }

    root(_, res) {
        res.redirect('/books');
    }
}