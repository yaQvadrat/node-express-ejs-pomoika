"use strict"

import fs from 'fs'

export default class JSONStorage {
    constructor(pathToFile) {
        this.pathToFile = pathToFile;
        this.data = {};
        try {
            this.data = JSON.parse(fs.readFileSync(this.pathToFile, 'utf-8'));
        } catch (err) {
            console.error(`Error loading data to JSON from ${this.pathToFile}:`, err);
        }
    }

    saveState() {
        try {
            fs.writeFileSync(this.pathToFile, JSON.stringify(this.data));
        } catch (err) {
            console.error(`Error save data to ${this.pathToFile}:`, err);
        }
    }
}
