const ObjectsToCsv = require('objects-to-csv')
const author =  require('./author');
const megazine = require('./megazine');
const book = require('./book')
const authorUrl = "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/authors.csv"
const megazineUrl = "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv";
const bookUrl = "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv";

const cleanAuthorData = (authorArray) => {
    const authors = [];

    authorArray.forEach(function(element) {
        let author = {};
        let result2 =  Object.values(element)
        result2 = result2[0].split('-')[1].split(';')

        author.email = result2[0];
        author.firstName = result2[1];  
        author.lastName = result2[2];
        authors.push(author);
    });
    return authors;
}

const cleanBookData = (bookArray) => {
    let newArray = []
    bookArray.forEach(ele => {
        let book = {}; 
        let numbers = Object.values(ele);
        let firstMethod = numbers[0].split(';');
        book.title = firstMethod[0];
        book.isbn = firstMethod[1];
        book.email = [firstMethod[2].split('-')[1].trim()];
        numbers[0] = firstMethod.slice(3).join(',')
        numbers.forEach(element => {
            let emailStr
            if(element.search(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/ !== -1)) {
            emailStr = element.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
            if (emailStr) {
                book.email.push(emailStr[0].split('-')[1].trim())
            }
            numbers[numbers.indexOf(element)] = element.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/,"");

            }
        })

        book.description = numbers.join(',').trim().replace(/[;,]/g, '');

        newArray.push(book)
    })

    return newArray;
}

const cleanMegazineData = (bookArray) => {
    let newArray = []
    bookArray.forEach(ele => {
        let book = {}; 
        let numbers = Object.values(ele);
        let firstMethod = numbers[0].split(';');
        book.title = firstMethod[0];
        book.isbn = firstMethod[1];
        book.email = [firstMethod[2].split('-')[1].trim()];
        numbers[0] = firstMethod.slice(3).join(',')
            //  / filter emails from the rest
        numbers.forEach(element => {
            let emailStr
            if(element.search(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/ !== -1)) {
            emailStr = element.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
            if (emailStr) {
                book.email.push(emailStr[0].split('-')[1].trim())
            }
            numbers[numbers.indexOf(element)] = element.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/,"");

            }
        })

        book.date = numbers.join(',').trim().replace(/[;,]/g, '');

        newArray.push(book)
    })

    return newArray;
}


// print all books
const printAllBooks = async (url, cb) => {
    const result = await cb(url);
    let books = cleanBookData(result)
    books.forEach(el => {
      console.log(`Title: ${el.title}`);
      console.log(`ISBN: ${el.isbn}`);
      console.log(`Email: ${el.email}`);
      console.log(`Description: ${el.description}`);
      console.log('\n');
    })
};

// print all megazines
const printAllMegazines = async (url, cb) => {
    const result = await cb(url);
    let megazines = cleanBookData(result)
    megazines.forEach(el => {
      console.log(`Title: ${el.title}`);
      console.log(`ISBN: ${el.isbn}`);
      console.log(`Email: ${el.email}`);
      console.log(`Date: ${el.date}`);
      console.log('\n');
    })
};
// printAllMegazines(megazineUrl, megazine)


// find by ISBN 
const printBookByIsbn = async (url, cb, isbn) => {
    const result = await cb(url);
    let book = cleanMegazineData(result);
    let target = book.filter((obj) => obj.isbn === isbn);
    console.log(target);
}



// Find all books and magazines by their authors’ email.
const printBooksByEmail = async (bookUrl,megazineUrl, cbBook, cbMegazine, email) => {
    const bookResult = await cbBook(bookUrl);
    let book = cleanBookData(bookResult);


    const megazineResult = await cbMegazine(megazineUrl)
    let megazine = cleanMegazineData(megazineResult)

    let bookTarget = book.filter((obj) => obj.email.includes(email));
    let megazineTarget = megazine.filter((obj) => obj.email.includes(email));


    if (bookTarget && megazineTarget) {
        const mergedTarget = bookTarget.concat(megazineTarget);
        console.log(mergedTarget);
    } else if (!bookTarget) {
        console.log(megazineTarget);
    } else {
        console.log(bookTarget);
    }
}

// Print out all books and magazines with all their details sorted by title
const sortAllByTitle = async (bookUrl,megazineUrl, cbBook, cbMegazine) => {
    const bookResult = await cbBook(bookUrl);
    let book = cleanBookData(bookResult);

    const megazineResult = await cbMegazine(megazineUrl)
    let megazine = cleanMegazineData(megazineResult)

    const mergedTarget = book.concat(megazine);

    const sortedData = mergedTarget.sort(function(a,b){
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if(x>y){return 1;}
        if(x<y){return -1;}
        return 0;
    });

    console.log(sortedData);
}

// Add a book
const addBook = async (url, cb, newBookObject) => {
    const result = await cb(url);
    let books = cleanBookData(result)

    books.push(newBookObject);
    const csv = new ObjectsToCsv(books);
    await csv.toDisk('./books.csv')
    console.log('new book added');
}

// Add a megazine
const addMegazine = async (url, cb, newMegazineObject) => {
    const result = await cb(url);
    let megazines = cleanMegazineData(result)

    megazines.push(newMegazineObject);
    const csv = new ObjectsToCsv(megazines);
    await csv.toDisk('./megazines.csv')
    console.log('new megazine added');
}


// Function calls
printAllBooks(bookUrl, book);

printAllMegazines(megazineUrl, megazine)

printBookByIsbn(bookUrl, book, "1215-4545-5895");

printBooksByEmail(bookUrl, megazineUrl, book, megazine, "walter@echocat.org");

sortAllByTitle(bookUrl, megazineUrl, book, megazine);

addBook(bookUrl, book, { title: 'Da vinchi code', isbn: '827-727-223', email: 'abc@gmail.com', description: 'Symbologist Robert Langdon travels from Paris to London to unravel a bizarre murder. Accompanied by a cryptographer'})

addMegazine(megazineUrl, megazine, { title: 'India Today', isbn:'3424-712-834', email: 'abc@gmail.com', date: '12.12.2011'})