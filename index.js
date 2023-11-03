import express from "express";
import fs from "fs/promises";
import path from "path";
import process from "process";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import { MongoClient } from "mongodb";

const clearModule = (code) => {
  const regex = /(import|export).*?;|console.log\(.*?;|\/\/.*?;|\/\*.*\*\//g;
  return code.replaceAll(regex, "");
};

const getPlainCalculatorCode = async (code) => {
  const validator = await fs.readFile(
    path.resolve(process.cwd(), "validator.js"),
    "utf-8"
  );
  const calculator = await fs.readFile(
    path.resolve(process.cwd(), "calculator.js"),
    "utf-8"
  );

  const validatorClean = clearModule(validator);
  const calculatorClean = clearModule(calculator);

  return (
    validatorClean + calculatorClean + `\nconsole.log(calculator("${code}"));`
  );
};

async function init() {
  const client = new MongoClient(
    "mongodb+srv://isavitskiy8:ColnishkoMongo@cluster0.vajawtj.mongodb.net/"
  );
  const database = client.db("sample_mflix");
  const codeCollection = database.collection("code");

  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post("/submit", async (req, res) => {
    const expr = req.body.code;
    const code = await getPlainCalculatorCode(expr);

    const result = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions/?wait=true",
      {
        source_code: code,
        language_id: 93,
      },
      {
        headers: {
          "X-RapidAPI-Key":
            "b9565413aamsh5efbf11e95fe176p1d30a9jsn2988781db135",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );
    console.log(result.data);
    res.status(200);
    res.send(result.data);
  });

  app.get("/code", async (req, res) => {
    const result = await codeCollection.find({}).toArray();
    console.log(result);

    res.status(200);
    res.send(result);
  });

  app.post("/code", async (req, res) => {
    const { code, name } = req.body;
    await codeCollection.insertOne({ code, name, createdOn: new Date() });
    console.log(`created Code: {${code}, ${name}}`);
    res.status(201);
    res.send("created");
  });

  app.listen(8000);
}

init();
//CRUD code saving, editing, loading, name of code piece
