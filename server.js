 const app = require('./app');
 const cors = require('cors');
 require("dotenv").config();
 const express = require('express');
const connectDatabase = require('./Database/ConnectDatabase');
const router = require('./route');
 const port =process.env.SERVER_PORT || 5000;
 app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
 }));
app.use(express.json({ limit: "10mb" }));
 app.use(express.urlencoded({ limit: "10mb " ,extended: true }));

 app.use("/api/v1", router);
 app.get('/', (req, res) => {
    res.send('Hello World!')
  })

 app.listen(port, async() => {
   await connectDatabase();
    console.log(`Example app listening on port ${port}`)
  })

