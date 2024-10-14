// Create a Node.js application to manage a library using a Map to store book details. Implement the following functionalities:
// a. Add a book with ID, title, and author. If the ID already exists, print an error message.
// b. Remove a book using its ID. If the book is not found, print an error message.
// c. Search for books by title, author, or ID and print the matching results.
// d. Update the title and/or author of a book using its ID. If the book is not found, print an error message.
// e. Print a summary report of all books in the library.

const { log } = require('console');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout

});

const bookDetails = new Map();

function bookStore() {
    console.log('The Task : 1-Add Book,2-Remove,3-update,4-search,5-display,6-exit');
    rl.question('Choose task : ', function (task) {

        switch (Number(task.trim())) {
            case 1: addBookDetails(); break;
            case 2: removeBookDetails(); break;
            case 3: updateBookDetails(); break;
            case 4: searchBookDetails(); break;
            case 5: displayBookDetails(); break;
            case 6: rl.close();break;
            default: console.log('Invalid input'); bookStore();
        }
    })
}

bookStore();



function addBookDetails() {
    rl.question('Enter the ID :', function (id) {
        rl.question('Enter the Book title :', function (title) {
            rl.question('Enter the author :', function (author) {
                bookDetails.set(id, { title, author });
                console.log("book added");
                console.log(bookDetails);
                bookStore();
            })
        })
    })
}

function removeBookDetails() {
    rl.question('Enter the book id :', function (id) {
        if (bookDetails.has(id)) {
            bookDetails.delete(id);
            console.log(bookDetails)
            bookStore();
        } else {
            console.log(`${id} not found`)
        }

    })
}

function updateBookDetails() {
    rl.question('enter the id', function (id) {
        const book = bookDetails.get(id);
        rl.question('enter the book new name :', function (newTitle) {
            rl.question('enter the author name :', function (newName) {
                book.title = newTitle !== undefined ? newTitle : book.title;
                book.author = newName !== undefined ? newName : book.name;

                bookDetails.set(id, book);
                console.log(bookDetails);
                bookStore();
            })
        })

    })
}

function searchBookDetails() {
    rl.question('enter the search item :', function (search) {
        const searchResult = [];
        for (const [id, item] of bookDetails) {
            if (id.includes(search) || item.title.includes(search) || item.author.includes(search)) {
                searchResult.push({ id, ...item });
            }
        }

        if (searchResult.length > 0) {
            console.log(`Seach Result : `, searchResult)
        } else {
            console.log(`${search} not found`);

        }
    });
    bookStore();
}

function displayBookDetails() {
    if (bookDetails.size > 0) {
        for (const [id, items] of bookDetails) {
            console.log('id :', id);
            console.log('Title :', items.title);
            console.log('Author :', items.author);
        }
    }else{
        console.log('Empty Books')
    }

    bookStore();
}