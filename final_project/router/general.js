const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books, null,4))
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    let filtered_books = books[isbn]
    res.send(`Book ISBN:${isbn} 
    Book author: ${filtered_books['author']}
    Book title: ${filtered_books['title']} `)
    //return res.status(300).json({message: "Yet to be implemented"});
   });
    
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let author = req.params.author;
    let filtered_books;
    for (const [key] of Object.entries(books)) {
      if(books[key]['author'] == author){
          filtered_books = books[key]
      }
    }
    res.send(JSON.stringify(filtered_books,null,4)) 
    //return res.status(300).json({message: "Yet to be implemented"});
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
