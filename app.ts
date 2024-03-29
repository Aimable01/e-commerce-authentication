import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello world");
});

app.listen(3000, () => console.log("App running on port 3000."));
