# MosFilm API (Express, MongoDB, Swagger)
An API built to pair with MongoDB to offer access to a database of movies, in this case a database hosting movies from the MosFilm youtube channel. It provides the details and links to those movies and JWT auth to allow users to login and favorite the movies they like.
<br>
<br>

<img src="https://github.com/user-attachments/assets/97546db3-3149-4be2-8315-32fde588f57a" width=70% alt="Image of app"> 

## Tech-stack
- Express
- Mongo DB
- Postman
- Mongoose
- Swagger Documentation
- JS Doc
- Node

## Steps to Run 

### Clone repo
- Of course!

### Install Dependancies
```sh
 npm install
```

### Connect MongoDB
- To connect locally, change the second half of this conditional to your local MongoDB port from the Index.js. 
```js
mongoose.connect(process.env.CONNECTION_URI || "mongodb://localhost:27017/csmfdb");
```
- Otherwise follow the instructions for your host.

### Run locally
```sh
npm run dev
```

## Dependencies
- Mongo DB
