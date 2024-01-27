const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: `User ${username} successfully registred. Now you can login`});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
    // Create a Promise to fetch the list of books
    const getBooksPromise = new Promise((resolve, reject) => {

    if (books) {
        resolve(books);
    } else {
        reject(new Error('No books available.'));
    }
    });
  
    // Handle the Promise using callbacks
    getBooksPromise
      .then((bookList) => {
        // Send the book list as a JSON response
        res.send(JSON.stringify(bookList, null, 4));
      })
      .catch((error) => {
        // Handle the error if the Promise is rejected
        res.status(500).send(JSON.stringify({ error: error.message }, null, 4));
      });
  });
  

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
  
    // Create a Promise to fetch book details based on ISBN
    const getBookDetailsPromise = new Promise((resolve, reject) => {
      
        if (books.hasOwnProperty(isbn)) {
          resolve(books[isbn]);
        } else {
          reject(new Error('Book not found for the given ISBN.'));
        }
    });
  
    // Handle the Promise using callbacks
    getBookDetailsPromise
      .then((bookDetails) => {
        // Send the book details as a JSON response
        res.send({
          ISBN: isbn,
          title: bookDetails.title,
          author: bookDetails.author
        });
      })
      .catch((error) => {
        // Handle the error if the Promise is rejected
        res.status(404).json({ message: error.message });
      });
  });
    
  
// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
  
    // Create a Promise to fetch book details based on author
    const getBookDetailsByAuthorPromise = new Promise((resolve, reject) => {
      
        let filteredBooks = Object.values(books).filter((book) => book.author === author);
  
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error(`No books found for the author: ${author}`));
        }
    });
  
    // Handle the Promise using callbacks
    getBookDetailsByAuthorPromise
      .then((filteredBooks) => {
        // Send the book details as a JSON response
        res.send(JSON.stringify(filteredBooks, null, 4));
      })
      .catch((error) => {
        // Handle the error if the Promise is rejected
        res.status(404).json({ message: error.message });
      });
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let title = req.params.title;
    let filtered_books;
    for (const [key] of Object.entries(books)) {
      if(books[key]['title'] == title){
          filtered_books = books[key]
      }
    }
    res.send(JSON.stringify(filtered_books,null,4)) 
    //return res.status(300).json({message: "Yet to be implemented"});
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    let filtered_books = books[isbn]
    res.send(`Book ISBN:${isbn} 
    Book review: ${JSON.stringify(filtered_books['reviews'],null,4)}`)
    //return res.status(300).json({message: "Yet to be implemented"});
  });
  

module.exports.general = public_users;
