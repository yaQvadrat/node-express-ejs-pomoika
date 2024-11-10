"use strict"

import { app, bookStorage } from "./src/app.js";

const PORT = 3001;


const server = app.listen(PORT, () => { console.log(`server listening on port ${PORT}...`) });

function gracefulShutdown() {
    console.log('\nstarting graceful shutdown...');
    console.log(`final storage state:\n${JSON.stringify(bookStorage.data, null, 2)}`)
    bookStorage.saveState();
    console.log('storage state saved...')
    server.close(() => {
        console.log('server closed gracefully...');
        process.exit(0);
    });

    setTimeout(() => {
        console.log('forcing shutdown...');
        process.exit(1);
    }, 5000);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
