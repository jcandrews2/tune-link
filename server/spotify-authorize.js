import express from "express";
import request from "request";
import dotenv from "dotenv";
dotenv.config();

const spotify_authorize = express.Router();

global.access_token = "";

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotify_redirect_uri = "http://localhost:5050/auth/callback";

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

spotify_authorize.get("/login", (req, res) => {
  var scope = "streaming user-read-email user-read-private";
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

spotify_authorize.get("/callback", (req, res) => {
  var code = req.query.code;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      global.access_token = body.access_token;
      res.redirect("http://localhost:3000/");
    }
  });
});

spotify_authorize.get("/token", (req, res) => {
  res.json({ access_token: global.access_token });
});

export default spotify_authorize;
