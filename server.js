const express = require("express");
const ejs = require("ejs");
const server = express();

server.set("views", "./src/views");
server.set("view engine", "ejs");

const fetch = require("node-fetch");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

server.use(express.static("assets"));

server.get("/", (req, res) => {
  const API_URL = "https://api.nasa.gov/planetary/apod?api_key=" + API_KEY;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      res.render("index", { pic: data, page_name: "index" });
    })
    .catch((error) => console.log("API fetch error"));
});

server.get("/previous/:id", (req, res) => {
  const id = req.params.id;

  // Date object
  const date = new Date();
  let endDate = date.setDate((date.getDate() - 1) - (10 * (id - 1)));
  let currentDay = String(date.getDate()).padStart(2, "0");
  let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
  let currentYear = date.getFullYear();

  endDate = `${currentYear}-${currentMonth}-${currentDay}`;

  let startDate = date.setDate(date.getDate() - (9));
  let startDay = String(date.getDate()).padStart(2, "0");
  let startMonth = String(date.getMonth() + 1).padStart(2, "0");
  let startYear = date.getFullYear();

  startDate = `${startYear}-${startMonth}-${startDay}`;

  const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {

      res.render("previous", { prevArr: data, page_name: "previous", id: id });
    })
    .catch((error) => console.log("API fetch error"));
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log("Listening on ", PORT);
});
