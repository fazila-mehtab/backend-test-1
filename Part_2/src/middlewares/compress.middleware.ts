import path from "path";
import sharp from "sharp";
import fs from "fs";
import { NextFunction, Request, Response } from "express";

export const compressImage = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = !req.files?.additional_images
      ? req.files.main_image.concat([])
      : req.files.main_image.concat(req.files.additional_images);
    if (!files) return;
    const rows = files.map(async (file: Express.Multer.File) => {
      const updatedFile = await compress(file);

      if (!updatedFile.error) {
        fs.unlinkSync(file.path);
        file.filename = updatedFile.file;
      }
      return file;
    });
    Promise.all(rows).then(() => {
      req.files = {
        main_image: files.filter(
          (item: Express.Multer.File) => item.fieldname == "main_image"
        ),
        additional_images: files.filter(
          (item: Express.Multer.File) => item.fieldname == "additional_images"
        ),
      };
      next();
    });
  } catch (error) {
    next(error);
  }
};

const compress = async (file: Express.Multer.File) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  try {
    await sharp(file.path)
      .metadata()
      .then(({ width }: any) =>
        sharp(file.path)
          .resize(Math.round(width * 0.75))
          .toFile(
            process.cwd() +
              "/images/" +
              uniqueSuffix +
              path.extname(uniqueSuffix + path.extname(file.originalname))
          )
      );
  } catch (error) {
    console.log(error);
    return { error: true, msg: error, file: "" };
  }
  return {
    error: false,
    file:
      uniqueSuffix +
      path.extname(uniqueSuffix + path.extname(file.originalname)),
  };
};
