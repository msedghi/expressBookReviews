const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Username or password is empty"});
    }

    if (!isValid(username)){
        users.push({ username: username, password: password });
        return res.status(200).json({message: "User registered successfully"});  
    } else {
        return res.status(404).json({message: "Username already exists"});       
    }
 });

 let getBooksFromDatabase = () => Promise.resolve(books);
 let getBookFromDatabase = (isbn) => Promise.resolve(books[isbn]);
 
 public_users.get('/', function (req, res) {
   getBooksFromDatabase()
     .then(books => {
       res.send(JSON.stringify({books},null,3));
     })
     .catch(err => {
       console.error(err);
       res.status(500).json({message: "Server error"});
     });
 });
 
 public_users.get('/isbn/:isbn',function (req, res) {
   const isbn = req.params.isbn;
 
   getBookFromDatabase(isbn)
     .then(book => {
       if (book) {
         res.send(JSON.stringify({book},null,3));      
       } else {
         res.status(404).json({message: "Book not found"});
       }
     })
     .catch(err => {
       console.error(err);
       res.status(500).json({message: "Server error"});
     });
 });
 
 public_users.get('/author/:author',function (req, res) {
     const author = req.params.author;
     getBooksFromDatabase()
     .then(books => {
         let filtered_books = [];
         for (let key in books) {
             if (books[key].author === author){
                 filtered_books.push(books[key]);
             }        
         }
         res.send(JSON.stringify({filtered_books},null,3));
     })
     .catch(err => {
       console.error(err);
       res.status(500).json({message: "Server error"});
     });
 });
 
 public_users.get('/title/:title',function (req, res) {
     const title = req.params.title;
     getBooksFromDatabase()
     .then(books => {
         let filtered_books = [];
         for (let key in books) {
             if (books[key].title === title){
                 filtered_books.push(books[key]);
             }        
         }
         res.send(JSON.stringify({filtered_books},null,3));
     })
     .catch(err => {
       console.error(err);
       res.status(500).json({message: "Server error"});
     });
 });
 
 public_users.get('/review/:isbn',function (req, res) {
     const isbn = req.params.isbn;
     getBookFromDatabase(isbn)
     .then(book => {
         if (book) {
             res.send(JSON.stringify(book.reviews,null,3));      
         } else {
             res.status(404).json({message: "Book not found"});
         }
     })
     .catch(err => {
       console.error(err);
       res.status(500).json({message: "Server error"});
     });
 });
 
 module.exports.general = public_users;
