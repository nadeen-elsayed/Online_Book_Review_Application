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
