import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import spotify_authorize from "./spotify-authorize.js";
import user_api from "./user-api.js";

const port = 5050;

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan("dev"));

// enable only if you want static assets from folder static
app.use(express.static("static"));

// enable json message body for posting data to API
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

app.use("/auth", spotify_authorize);
app.use("/user", user_api);

// default index route
app.get("/", (req, res) => {
  res.send("Welcome to tune link!");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// START THE SERVER
// =============================================================================
async function startServer() {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/tune-link";
    await mongoose.connect(mongoURI);
    console.log(`Mongoose connected to: ${mongoURI}`);

    const port = process.env.PORT || 9090;
    app.listen(port);

    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

startServer();
