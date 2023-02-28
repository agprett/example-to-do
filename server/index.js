const express = require('express')

require('dotenv').config()

const {SERVER_PORT} = process.env

const app = express()

app.use(express.json())

const {getTasks, addTask, updateTask, deleteTask} = require('./controller.js')

app.use(express.static(__dirname + '/../client'))

app.get('/api/tasks', getTasks)
app.post('/api/tasks', addTask)
app.put('/api/tasks', updateTask)
app.delete('/api/tasks/:id', deleteTask)

app.listen(SERVER_PORT, console.log(`Listening on port ${SERVER_PORT}`))