const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "https://playlist-analyst.herokuapp.com/",
    clientId: "a3296c7d32264744a2a198e3ef62a255",
    clientSecret: "5d444c5a4fc64f2ea5084b9a4f25fe65",
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "https://playlist-analyst.herokuapp.com/",
    clientId: "a3296c7d32264744a2a198e3ef62a255",
    clientSecret: "5d444c5a4fc64f2ea5084b9a4f25fe65",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);
