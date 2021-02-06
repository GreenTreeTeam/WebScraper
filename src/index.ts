//@ts-nocheck
import express from "express";
import cors from "cors";

import scraper from "website-scraper";
import ScraperPlugins from "website-scraper-puppeteer";

import path from "path";
import crypto from "crypto";

import fs from "fs";
import zipper from "zip-a-folder";

const app = express();

app.use(cors());
app.use(express.static(__dirname + "/sites"));
app.use(express.static(__dirname + "/assets"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/assets/index.html");
});

app.post("/scrape", async (req, res) => {
  let url_to_scrape: string = req.headers.url;

  var random_string = crypto.randomBytes(10).toString("base64");

  if (!url_to_scrape.startsWith("http"))
    url_to_scrape = "https://" + url_to_scrape;

  await scraper({
    urls: [url_to_scrape],
    directory: path.resolve(__dirname, "sites", random_string),
    plugins: [
      new ScraperPlugins({
        launchOptions: {
          headless: true,
        },
      }),
    ],
  });

  zipper.zipFolder(
    __dirname + "/sites/" + random_string,
    __dirname + "/sites/" + random_string + ".zip",
    (err) => {
      if (err) throw err;
      fs.rm(
        __dirname + "/sites/" + random_string,
        { force: true, recursive: true },
        (err) => {
          if (err) throw err;
          res.json({
            //@ts-expect-error Make sure to change this to URL ;-;-;-;-;-;-;-;
            url: `http://localhost/${random_string}.zip`,
          });
        }
      );
    }
  );
});

app.listen(80, () => console.log(`;-; 80 port check check`));
