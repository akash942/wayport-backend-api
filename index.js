import express from "express";
import cors from "cors";
import { getPaths } from "./utils.js";

const app = express();
const PORT = 3000 || process.env.PORT;
app.use(cors({ origin: "*" }));

app.use(express.json());

app.get("/", async (req, res) => {
  const { source, destination } = req.body;
  const result = await getPaths(source, destination);
  res.json(result);
});

app.listen(PORT, (error) => {
  if (error) console.log(error);
  console.log(`server is up on port: ${PORT}`);
});
