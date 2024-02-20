const express = require('express')
const pgp = require('pg-promise')();
const cors = require('cors')

const db = pgp('postgres://main:amongUs@1989@localhost:5432/uw_locations') //HIDE IN .ENV Username, password, host, port, database name
//0. Log in to AWS https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Tutorials.WebServerDB.CreateDBInstance.html
//1. Create user and password https://www.postgresql.org/docs/8.0/sql-createuser.html (CREATE USER name WITH PASSWORD 'password' CREATEDB;)
//2. Create database (CREATE DATABASE databasename; USE databasename;) 
//3. Create table 
/*
CREATE TABLE points (
    name TEXT,
    latitude FLOAT(53),
    longitude FLOAT(53),
    altitude FLOAT(53),
    neighbours TEXT,
    tag TEXT
);
*/
//4. Copy data \copy points from 'C:\Users\natha\Downloads\map.csv' WITH DELIMITER ',' CSV;

const app = express()
const port = 3000
app.use(cors())

app.get('/points/:tag', (req, res) => {
  db.manyOrNone('SELECT * FROM points WHERE tag LIKE \'%' + req.params["tag"] + '%\'').then(
    (data)=>{
      res.send(data);
    }
  ).catch(
    (err)=>{
      res.send(err);
    }
  );
})



app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})