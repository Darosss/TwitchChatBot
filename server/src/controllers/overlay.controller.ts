import Express, { Request, Response } from "express";

const overlay = (req: Request, res: Response) => {
  res
    .status(200)
    .send({ message: "This url is overlay with every action working live" });
};

export default overlay;
