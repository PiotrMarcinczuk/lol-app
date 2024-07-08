const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
const baseUrl = "https://europe.api.riotgames.com";
const http = axios.create({
  headers: {
    "X-Riot-Token": "RGAPI-18c643f6-fb47-4a0d-b56a-de106a934d55",
  },
});
app.post("/getPuuid", async (req, res) => {
  const { nickname, tag } = req.body;
  try {
    const response = await http.get(
      `${baseUrl}/riot/account/v1/accounts/by-riot-id/${nickname}/${tag}`
    );
    res.json(response.data);
  } catch (e) {
    res.status(e.response ? e.response.status : 500).json({
      message: "Error while fetching puuid from Riot API",
      error: e.message,
    });
  }
});

app.post("/getChampionMastery", async (req, res) => {
  const { puuid, region } = req.body;
  let tempRegion = region;
  if (region === "EUNE") tempRegion = "eun1";
  if (region === "EUW") tempRegion = "euw1";

  try {
    const response = await http.get(
      `https://${tempRegion}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`
    );
    res.json(response.data);
  } catch (e) {
    res.status(e.response ? e.response.status : 500).json({
      message: "Error while fetching champion mastery from Riot API",
      error: e.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
