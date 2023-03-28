import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../types";
import fs from "fs";

import { generateToken, verifyToken } from "../middlewares/token.middleware";
import { blogSchema } from "../validators/blog.validator.schema";

interface IBlog {
  reference: string;
  title: string;
  description: string;
  main_image: string;
  additional_images?: string[];
  date_time?: Date;
}

export const addBlog = async (
  req: Request,
  res: Response<ApiResponse<IBlog>>,
  next: NextFunction
) => {
  try {
    let data = fs.readFileSync(process.cwd() + "/blogs.json", "utf-8");
    let parseData = JSON.parse(data);
    const files = req.files! as {
      main_image: Express.Multer.File[];
      additional_images: Express.Multer.File[];
    };
    const { title, description, date_time } = req.body;

    const blogTemp = {
      title: title,
      description: description,
      main_image: files.main_image[0].filename,
      additional_images: files.additional_images.map((item) => item.filename),
      date_time: Number(date_time),
    };
    const result = await blogSchema.validateAsync(blogTemp);

    const blog = {
      reference: "0000" + (Object.keys(parseData).length + 1),
      ...blogTemp,
    };
    parseData.push(blog);
    fs.writeFile(
      process.cwd() + "/blogs.json",
      JSON.stringify(parseData, null, 2),
      (error: any) => {
        if (error) res.status(500).json(new ApiResponse<any>(true, error));
        res.status(200).json(new ApiResponse<any>(false, blog));
      }
    );
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const getBlog = async (
  req: Request,
  res: Response<ApiResponse<IBlog[]>>
) => {
  try {
    req.body;
    let data = fs.readFileSync(process.cwd() + "/blogs.json", "utf-8");
    let parseData = JSON.parse(data);
    res.status(200).json(new ApiResponse<any>(false, parseData));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse<any>(true, error));
  }
};

export const genToken = async (
  req: Request,
  res: Response<ApiResponse<IBlog[]>>
) => {
  try {
    console.log(req.body);

    const token = generateToken(req.body.path);
    res.status(200).json(new ApiResponse<any>(false, token));
  } catch (error: any) {
    console.log(error);
    res.status(500).json(new ApiResponse<any>(true, error.message));
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const { token, path } = req.query;
    const verifyPath = verifyToken(token);

    if (verifyPath !== path) throw Error("Invalid token");

    fs.readFile(process.cwd() + "/images/" + verifyPath, (err: any) => {
      if (err) {
        console.log(err);
        return res.status(404).send("Image not found");
      } else {
        res.sendFile(process.cwd() + "/images/" + verifyPath);
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
