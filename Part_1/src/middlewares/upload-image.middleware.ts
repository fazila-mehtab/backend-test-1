import { Request, Response, NextFunction } from "express";
const multer = require("multer");
const path = require("path");

const limit = 1024 * 1024;
function validation(body: any, file: any, callback: any) {
  const filetypes = /jpg|jpeg/;
  const ext = filetypes.test(path.extname(file.originalname).toLowerCase());
  const type = filetypes.test(file.mimetype);

  if (ext && type) {
    return callback(null, true);
  } else {
    callback("Invalid file type. Only JP Gand JPEG files are allowed", false);
  }
}
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, process.cwd() + "/images/");
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req: any, file: any, cb: any) {
    validation(req.body, file, cb);
  },
});
const uploadFileds = upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "additional_images", maxCount: 5 },
]);

export const uploads = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.files);
  uploadFileds(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.send(err);
    } else if (err) {
      console.log(err);
      return res.send(err);
    }
    next();
  });
};
