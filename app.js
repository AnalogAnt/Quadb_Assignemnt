import express from "express";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();
app.use(express.json());
import { open } from "sqlite";
import sqlite3 from "sqlite3";
let db = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, "details.db");
const startServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running on 3000");
    });
  } catch (e) {
    console.log(e);
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "app.html")); // Adjust the file path as needed
});
startServer();

const url = "https://api.wazirx.com/api/v2/tickers";
const options = {
  method: "GET",
};

app.get("/fetch-data", async (request, response) => {
  try {
    const apiResponse = await fetch(url, options);
    if (!apiResponse.ok) {
      throw new Error("Failed to fetch data from API");
    }
    const data = await apiResponse.json();
    for (const ticker in data) {
      const { name, last, buy, sell, volume, base_unit } = data[ticker];
      const dataQuery = `INSERT INTO details(name,last,buy,sell,volume,base_unit) VALUES ('${name}',${last},${buy},${sell},${volume},'${base_unit}');`;
      await db.run(dataQuery);
    }
    response.send("Data fetched and stored in the database.");
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .send("An error occurred while fetching and storing data.");
  }
});

app.get("/get-data", async (request, response) => {
  const getPriorityQuery = `SELECT * FROM details ORDER BY sell DESC LIMIT 10;`;
  const priorityList = await db.all(getPriorityQuery);
  response.json(priorityList); // Adjust the file path as needed
});

// Assuming your static files are in a 'public' directory
app.use(express.static("public"));

export default app;
