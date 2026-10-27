const { body, param } = require("express-validator");

const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ max: 150 })
    .withMessage("Task title cannot exceed 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "completed"])
    .withMessage("Invalid task status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid task priority"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid due date"),
];

const updateTaskValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task ID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Task title cannot be empty")
    .isLength({ max: 150 })
    .withMessage("Task title cannot exceed 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "completed"])
    .withMessage("Invalid task status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid task priority"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid due date"),
];

const taskIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task ID"),
];

module.exports = {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
};