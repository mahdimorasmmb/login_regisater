import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connect from "./database/conn";
import router from "./router/route";
import config from "./config/config";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

const port = config.PORT || 7070;

app.get("/", (req, res) => {
  res.status(201).json("Home GET Requst");
});

app.use("/api", router);

connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Connot connect to the Server");
    }
  })
  .catch((error) => {
    console.log("Inalid database connection...");
  });
