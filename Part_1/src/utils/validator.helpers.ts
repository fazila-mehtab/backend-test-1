import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../types";

export const DEFAULT_VALIDATION_ERR_MSG =
  "One or more validation errors occurred";

export const DEFAULT_VALIDATION_ERROR_HANDLER = (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty())
    throw new ApiError(
      DEFAULT_VALIDATION_ERR_MSG,
      400,
      validationErrors.array({ onlyFirstError: true })
    );

  next();
};

export const VALIDATION_ERR_MSGS = {
  bodyMustBeWellFormedJSON: "must be well-formed JSON",
  isRequired: "value is required",
  fileIsRequired: "No file attachment found",
  fileCannotExceedOne: "Only one file can be submitted",
  fileMustBeImage: "Invalid file type. Only JP Gand JPEG files are allowed",
  fileExtensionIsRequired: "File extension is required",
  fileMustHaveValidExtension:
    "Invalid file extension. Only jpg and jpeg extensions are allowed",

  mustBeBetween: (min: number, max: number) =>
    `must be between ${min} and ${max}`,
  mustBeGreaterThan: (min: number) => `must be greater than ${min}`,
  mustBeType: (t: string) => `must be of type "${t}"`,
};
