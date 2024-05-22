require('dotenv').config()
const fetch = require('node-fetch')
const express = require('express')
const { v4 } = require('uuid')
const id = v4()
console.log(id)
const PLANNER =
  process.env.PLANNER !== undefined
    ? process.env.PLANNER
    : 'http://localhost:3000'
const MULT =
  process.env.MULT !== undefined ? JSON.parse(process.env.MULT) : true
const ADD = process.env.ADD !== undefined ? JSON.parse(process.env.ADD) : true
const app = express()
const port = process.env.PORT || 8080
const ADDRESS =
  process.env.ADDRESS !== undefined
    ? process.env.ADDRESS
    : 'http://localhost:' + port
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min
const register = () =>
  fetch(PLANNER + '/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: ADDRESS, id }),
  })
let mult = false
let add = false
let task = {}
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

if (MULT)
  app.post('/mult', (req, res) => {
    if (mult) {
      console.error('mult', 'Already working')
      res.status(403).send('Already working')
      return
    }
    mult = true
    const { a, b } = req.body
    task = { a, b }
    console.log('mult', req.body)
    const duration = randInt(3000, 12000)
    setTimeout(() => {
      mult = false
      res.send(JSON.stringify({ res: a * b, duration, id }))
    }, duration)
  })

if (ADD)
  app.post('/add', (req, res) => {
    if (add) {
      console.error('add', 'Already working')
      res.status(403).send('Already working')
      return
    }
    add = true
    const { a, b } = req.body
    task = { a, b }
    console.log('add', req.body)
    const duration = randInt(3000, 7000)
    setTimeout(() => {
      add = false
      res.send(JSON.stringify({ res: a + b, duration, id }))
    }, duration)
  })

app.get('/', (req, res) => {
  if (mult) {
    res.send(JSON.stringify({ type: 'mult', task, id }))
    return
  }
  if (add) {
    res.send(JSON.stringify({ type: 'add', task, id }))
    return
  }
  res.send('ready to work ' + id)
})

app.listen(port, () => {
  console.log("PLANNER " + PLANNER)
  console.log("ADRESSE " + ADDRESS)
   register()
  console.log(`Worker ${id} listening at http://localhost:${port}`)
})
