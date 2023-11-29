import { Router } from "express";
import { streamYoutubeVideo } from "@controllers";

const youtubeRouter = Router();

youtubeRouter.get("/videos/:id", streamYoutubeVideo);

export default youtubeRouter;
