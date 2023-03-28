import express from "express";

import { addBlog, genToken, getBlog, getImage } from "../controllers";
import { compressImage } from "../middlewares/compress.middleware";
import { generateToken } from "../middlewares/token.middleware";
import { uploads } from "../middlewares/upload-image.middleware";

export const blogRouter = express.Router();

blogRouter.post("/blog", uploads, compressImage, addBlog);
blogRouter.get("/blogs", getBlog);
blogRouter.post("/token", genToken);
blogRouter.get("/image", getImage);
