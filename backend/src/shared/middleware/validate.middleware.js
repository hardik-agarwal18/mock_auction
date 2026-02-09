import AppError from "../errors/AppError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(", ");

    return next(new AppError(message, 400));
  }

  req.body = result.data;
  next();
};
