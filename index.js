import express from "express";
import {MongoClient} from "mongodb";
import axios from 'axios';

const port = 8888;
const DB_Name = "test"
// MongoDB connection URI
const mongoURI = "mongodb://tanha:FardapM5M5l5~KX5@flux.afarin.top:36017";
const client = new MongoClient(mongoURI);
const notFoundBoard = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 - Board Not Found</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 50px;
      text-align: center;
    }
    .container {
      background-color: #fff;
      padding: 30px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      display: inline-block;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    p {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - Board Not Found</h1>
    <p>We couldn't find the board you're looking for.</p>
  </div>
</body>
</html>
`;
const BadRequestEmailLocationNOtFound = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>400 - Bad Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #fefefe;
      margin: 0;
      padding: 50px;
      text-align: center;
    }
    .container {
      background-color: #fff;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      display: inline-block;
    }
    h1 {
      color: #d9534f;
      margin-bottom: 20px;
    }
    p {
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>400 - Bad Request</h1>
    <p>Missing 'email' or 'location_id' parameter</p>
  </div>
</body>
</html>
`;
const UserNotFound = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 - User Not Found</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 50px;
      text-align: center;
    }
    .container {
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      display: inline-block;
    }
    h1 {
      color: #d9534f;
      margin-bottom: 20px;
    }
    p {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - User Not Found</h1>
    <p>The user you are looking for does not exist.</p>
  </div>
</body>
</html>
`;
const userTokenFotFound = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 - User Token Not Found</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 50px;
      text-align: center;
    }
    .container {
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      display: inline-block;
    }
    h1 {
      color: #d9534f;
      margin-bottom: 20px;
    }
    p {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - User Token Not Found</h1>
    <p>The token for the user could not be found.</p>
  </div>
</body>
</html>
`;
const boardDataEnCompleted = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 - Board Data Incomplete</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 50px;
      text-align: center;
    }
    .container {
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      display: inline-block;
    }
    h1 {
      color: #d9534f;
      margin-bottom: 20px;
    }
    p {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - Board Data Incomplete</h1>
    <p>The board data provided is incomplete. Please ensure all required fields are filled in.</p>
  </div>
</body>
</html>
`;
const serverError = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>500 - Internal Server Error</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 50px;
      text-align: center;
    }
    .container {
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      display: inline-block;
    }
    h1 {
      color: #c9302c;
      margin-bottom: 20px;
    }
    p {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>500 - Internal Server Error</h1>
    <p>Oops! Something went wrong on our end.</p>
  </div>
</body>
</html>
`;
const app = express();
const postData = async (url, body, headers = {}) => {
    try {
        const response = await axios.post(url, body, { headers });
        return response.data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};
const fetchData = async (url, params = {}) => {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};



(async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(DB_Name);
        const usersCollection = db.collection('users');
        const boardsCollection = db.collection('boards');

        app.get('/ghl_login', async (req, res) => {
            const {email, location_id} = req.query;

            if (!email || !location_id) {return res.status(400).send(BadRequestEmailLocationNOtFound);}

            try {
                const user = await usersCollection.findOne({"emails.address": email});
                if (!user) {return res.status(404).send(UserNotFound);}

                // const token = user.token;
                const wekan_response =await postData('https://flux-wekan.afarin.top/users/login', { email,
                    password:"BehtrinPasswordDonya",},{
                    "Content-type":"application/json",
                    "Authorization":"Bearer 3IB7lagm3R4UK8HHPyjykz2uRpGI-6LA_mET3l-USqr"
                });
                console.log(wekan_response)
                const token = wekan_response.token
                if (!token) {return res.status(404).send(userTokenFotFound);}

                let board = await boardsCollection.findOne({location_id, "members.userId": user._id});
                if (!board) {
                    await boardsCollection.updateOne({location_id},{
                        "$addToSet":{"members":{
                                "userId" : user?.id || user?._id,
                                "isAdmin" : false,
                                "isActive" : true,
                                "isNoComments" : false,
                                "isCommentOnly" : true,
                                "isWorker" : false
                            }}
                    })
                    board = await boardsCollection.findOne({location_id, "members.userId": user._id});
                    // console.log(updateBoard,user,board)
                    if (!board) {
                    return res.status(404).send(notFoundBoard);}
                }

                const {_id, slug} = board;
                if (!_id || !slug) {return res.status(404).send(boardDataEnCompleted);}

                res.send(`<script> localStorage.setItem('Meteor.loginToken', '${token}');
                                window.location.href = '/b/${_id}/${slug}';</script>`);
            } catch (error) {
                console.error(error);
                res.status(500).send(serverError);
            }
        });

        app.listen(port, () => {
            console.log(`App running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
})();
