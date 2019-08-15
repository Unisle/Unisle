const functions = require('firebase-functions')
const express = require('express')
const ejs = require("ejs")
const fs = require('fs')

const app = express()
app.engine('ejs', ejs.renderFile)
app.set('views', './public/views')
app.set('view engine', 'ejs')

app.use(express.static('./public'))

app.get('/', (request, response) => {
  response.render('index')
})

app.get('/login', (request, response) => {
  response.render('login')
})

app.get('/home', (request, response) => {
  response.render('home')
})

app.get('/logout', (request, response) => {
  response.render('logout')
})

app.get('/init', (request, response) => {
  response.render('init')
})

app.get('/test', (request, response) => {
  response.render('test2')
})



exports.app = functions.https.onRequest(app)