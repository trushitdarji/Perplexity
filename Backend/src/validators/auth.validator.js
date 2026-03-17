import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

export const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens",
    )
    .custom(async (value) => {
      // Check if username already exists
      const User = (await import("../models/user.model.js")).default;
      const existingUser = await User.findOne({
        username: value.toLowerCase(),
      });
      if (existingUser) {
        throw new Error("Username already in use");
      }
    }),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .custom(async (value) => {
      // Check if email already exists
      const User = (await import("../models/user.model.js")).default;
      const existingUser = await User.findOne({ email: value.toLowerCase() });
      if (existingUser) {
        throw new Error("Email already registered");
      }
    }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  //   body('confirmPassword')
  //     .custom((value, { req }) => value === req.body.password)
  //     .withMessage('Passwords do not match'),

  handleValidationErrors,
];


export const validateLogin =[
  body('email')
    .trim()
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("please provide a valid email"),

    body("password")
    .notEmpty().withMessage("password is erquired"),

    handleValidationErrors
]
