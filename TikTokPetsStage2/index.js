// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");
// gets data out of HTTP request body 
// and attaches it to the request object
const app = express();
const bodyParser = require('body-parser');
// create object to interface with express


/////////////////////////////////////
// CALLING sqlWRAP and create the db
const fetch = require("cross-fetch");
// get Promise-based interface to sqlite3
const db = require('./sqlWrap');
// this also sets up the database
/////////////////////////////////////


// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
});

app.use(express.text());
// make all the files in 'public' available 

app.use(bodyParser.json());
// Code in this section sets up an express pipeline

app.use(function(req, res, next) {
  console.log("body contains",req.body);
  next();
});


app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myVideos.html");
  // send back a list of names, then display them on my videos page
});

// Handles post requests form the browser to store videoData to the database
app.post("/videoData", async function(req, res){
  console.log("sending Response");
  // parse the JSON body to Javascript Object type
  let info = req.body;
  // create a new object to pass into insertVideo function
  let vidObj = {
    "url": info.TikTokURL ,
    "nickname": info.VideoNickname,
    "userid": info.Username,
    "flag": 1
  }
  
  let result = await dumpTable();
  if(result.length < 8){
    await updateFlag();
    await insertVideo(vidObj);
    res.send("Got Video");
  }
  else{
    res.send("database full");
    console.log("Database is full");
  }
})


// 11. Post request receives a nickname, then delete the row with that nickname on the database 

app.post("/deleteVideo", async function(req, res){
  console.log("Receied Delete request to delete rowIdNum = ", req.body);
  let receivedrowIdNum = req.body;
  await deleteRow(receivedrowIdNum);
  res.send("Row Deleted");
})

// "/getList Get request"
app.get("/getList", (request, response) => {
  // get the video with flag value of 1
    dumpTable()
    //getNameList()
    .then(function(result){ 
        console.log(result);     
        // send back response in JSON
        response.json(result);
    })
    .catch(function(err){
      console.log("dumpTable not responding ",err);
    });  
});

//6. get Request gets the most recently added video from database
//NEED TO TEST THIS 
app.get("/getMostRecent", (request, response) => {
  // get the video with flag value of 1
  getMostRecentVideo(1)
    .then(function(result){ 
        // send back response in JSON
        response.json(result);
    })
    .catch(function(err){
      console.log("No video with flag value 1", err)});  
});

// Need to add response if page not found!
app.use(function(req, res){
  res.status(404); res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


// ******************************************** //
// Define async functions to perform the database 
// operations we need

// An async function to insert a video into the database
async function insertVideo(v) {
  try{
    const sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,TRUE)";

    await db.run(sql,[v.url, v.nickname, v.userid]);
  }
  catch(err){
    console.log(err);
  }
}

// an async function to get a video's database row by its nickname
async function getVideo(nickname) {
  try{
    // warning! You can only use ? to replace table data, not table name or column name.
    const sql = 'select * from VideoTable where nickname = ?';
  
    let result = await db.get(sql, [nickname]);
    return result;
  }
  catch(err){
    console.log(err);
  }
}

// an async function to get the whole contents of the database 
async function dumpTable() {
  try{ 
    const sql = "select * from VideoTable";
    
    let result = await db.all(sql);
    return result;
  }
  catch(err){
    console.log(err);
  }
}

// an async function to get a video if the flag is 1
async function getMostRecentVideo(flag) {
  try{
    // warning! You can only use ? to replace table data, not table name or column name.
    const sql = 'select * from VideoTable where flag = ?';
    let result = await db.get(sql, [flag]);
    
    return result;
  }
  catch(err){
    console.log(err);
  }
}

// An async function to change the flag to False
async function updateFlag() {
  try{  
    const sql = "update VideoTable set flag = 0 where flag = 1";
  
    await db.run(sql);
  }
  catch(err){
    console.log(err);
  }
}


// an async function to list of the nicknames from database
async function getNameList() {
  try{
    // warning! You can only use ? to replace table data, not table name or column name.
    const sql = 'select nickname from VideoTable ';
    let result = await db.all(sql);
    
    return result;
  }
  catch(err){
    console.log(err);
  }
}


// async delete function to delete an row on the database based on the name
async function deleteRow(rowId) {
  try{
    const sql = 'delete from VideoTable where rowIdNum = ?';
    await db.run(sql, [rowId]);
    await db.run("vacuum"); // cleanup videos.db
    console.log("Deleted row: ", rowId);
  }
  catch(err){
    console.log(err);
  }
}



























