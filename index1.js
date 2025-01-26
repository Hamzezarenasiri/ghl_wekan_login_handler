import dotenv from 'dotenv';
const mongoUri = process.env.mongodb_uri || "mongodb://tanha:FardapM5M5l5~KX5@flux.afarin.top:36017";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();

// Middleware for parsing JSON
app.use(bodyParser.json());

// Serve the client-side JavaScript
app.get("/script.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.send(`
    // Show loading message
    const showLoading = () => {
      const loadingDiv = document.createElement("div");
      loadingDiv.id = "loading";
      loadingDiv.textContent = "Loading...";
      loadingDiv.style.cssText = "font-size: 20px; color: blue; text-align: center; margin-top: 50px;";
      document.body.appendChild(loadingDiv);
    };

    // Hide loading message
    const hideLoading = () => {
      const loadingDiv = document.getElementById("loading");
      if (loadingDiv) {
        loadingDiv.remove();
      }
    };

    // Fetch the token and redirect
    const getTokenAndRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenKey = urlParams.get("tokenKey");

      if (tokenKey) {
        showLoading();
        fetch(\`/api/get-login-token?tokenKey=\${encodeURIComponent(tokenKey)}\`)
          .then((response) => response.json())
          .then((data) => {
            hideLoading();
            if (data.loginToken) {
              localStorage.setItem("Meteor.loginToken", data.loginToken);
              window.location.href = "/dashboard"; // Redirect URL
            } else {
              alert("Token not found or invalid.");
            }
          })
          .catch((error) => {
            hideLoading();
            console.error("Error fetching token:", error);
            alert("Error fetching token. Please try again.");
          });
      } else {
        alert("No tokenKey parameter found in the URL.");
      }
    };

    // Execute the function when the script is loaded
    getTokenAndRedirect();
  `);
});

// Define the API endpoint
app.get("/api/get-login-token", async (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: "Missing email parameter" });
    }

    try {
        const client = await MongoClient.connect(mongoUri);

        const db1 = client.db("test");
        const collection1 = db1.collection("users");

        // const db2 = client.db("FluxDB");
        // const collection2 = db2.collection("users");

        let user = await collection1.findOne({ "emails.address": email});
        client.close();

        if (user) {
            res.status(200).json({ loginToken: user.tokne });
        } else {
            res.status(404).json({ error: "Token not found" });
        }
        return res
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Serve a simple index page to include the script
app.get("/", (req, res) => {
    res.send(`
    <script src="/script.js"></script>
  `);
});


const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
