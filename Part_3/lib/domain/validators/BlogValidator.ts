import Joi from "joi";

export default Joi.object({
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .min(5)
    .max(50)
    .required(),
  description: Joi.string().max(500).required(),
  main_image: Joi.string().required(),
  additional_images: Joi.array().items(Joi.string()).max(5),
  date_time: Joi.date().timestamp("unix").min(Date.now()).required(),
}).unknown();
