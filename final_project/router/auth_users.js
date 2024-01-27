const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.username;
  const isbn = req.params.isbn;
  const reviewText = req.body.review;

  if (!isbn || !reviewText) {
    res.status(400).send("ISBN and review are required");
    return;
  }

  // Check if the user already has a review for the given ISBN
  if (books[isbn].reviews[username]) {
    // Modify existing review
    books[isbn].reviews[username] = reviewText;
    res.send('Review modified successfully.');
  } else {
    // Add a new review
    if (!books[isbn].reviews[username]) {
      books[isbn].reviews[username] = reviewText;
      res.send('Review added successfully.');
    }
    
    
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const username = req.session.username;
    const isbn = req.params.isbn;
  
    if (!isbn) {
      res.status(400).send('ISBN is required.');

    }
    
    // Check if the user has a review for the given ISBN
    if (books[isbn].reviews[username]) {
    // Delete the user's review for the given ISBN
    delete books[isbn].reviews[username];

    res.send('Review deleted successfully.');
    }
    else {
      res.status(400).send('No review found for the given user.');
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
