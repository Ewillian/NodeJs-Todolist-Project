const express = require("express")
const PORT = process.env.PORT || 8080 
const db = require('sqlite')
const app = express()
const methodOverride = require("method-override")

db.open('todolist.db').then(() => {
    return Promise.all([
    db.run("CREATE TABLE IF NOT EXISTS todos (message, completion, updatedAt, createdAt, userId)"),
    db.run("CREATE TABLE IF NOT EXISTS users (firstname, lastname, username, password, email, createdAt, updatedAt)")
    ]).then(() => {
        console.log("Database ready")
    }).catch(() => {
        console.log("Une erreur s'est produite :", err)
    })
})

app.set('views', './views') 
app.set('view engine', 'pug')

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))
app.use('/todos', require('./routes/todos'))

app.listen(PORT);
console.log("http://localhost:8080/")