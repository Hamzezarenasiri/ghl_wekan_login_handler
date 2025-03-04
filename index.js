import express from "express";
import {MongoClient} from "mongodb";

;
const app = express();
const port = 8888;
const DB_Name = "test"
// MongoDB connection URI
const mongoURI = "mongodb://tanha:FardapM5M5l5~KX5@flux.afarin.top:36017";
const client = new MongoClient(mongoURI);
let notFoundBoard = `
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

(async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(DB_Name);
        const usersCollection = db.collection('users');
        const boardsCollection = db.collection('boards');

        app.get('/ghl_login', async (req, res) => {
            const {email, location_id} = req.query;

            if (!email || !location_id) {
                return res.status(400).send("Missing 'email' or 'location_id' parameter");
            }

            try {
                // Find user by email
                const user = await usersCollection.findOne({"emails.address": email});
                if (!user) {
                    return res.status(404).send('User not found');
                }

                const token = user.token;
                if (!token) {
                    return res.status(404).send('User token not found');
                }

                // Find board using location_id
                const board = await boardsCollection.findOne({location_id, "members.userId": user._id});
                if (!board) {
                    return res.status(404).send(notFoundBoard);
                }

                const {_id, slug} = board;
                if (!_id || !slug) {
                    return res.status(404).send('Board data incomplete');
                }

                // Send a response with JavaScript for localStorage and redirection
                res.send(`
          <script>
            localStorage.setItem('Meteor.loginToken', '${token}');
            window.location.href = '/b/${_id}/${slug}';
          </script>
        `);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
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
