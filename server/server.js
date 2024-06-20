const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "fb793a528f5f498db25497b4a6d751e6",
    clientSecret: "47d395eba2fb4c069e3e71105226b868",
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((error) => {
      console.error("Error refreshing access token:", error);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "fb793a528f5f498db25497b4a6d751e6",
    clientSecret: "47d395eba2fb4c069e3e71105226b868",
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
    .catch((error) => {
      console.error("Error during login:", error);
      res.sendStatus(400);
    });
});

app.get("/lyrics", async (req, res) => {
  const artist = req.query.artist;
  const track = req.query.track;

  console.log(`Fetching lyrics for artist: ${artist}, track: ${track}`);

  try {
    const lyrics = (await lyricsFinder(artist, track)) || "No Lyrics Found";
    res.json({ lyrics });
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    res.status(500).json({ lyrics: "No Lyrics Found" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
