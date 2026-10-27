const express = require("express");

const router = express.Router();

const taskController = require("../controllers/task.controller");

const validate = require("../middleware/validation.middleware");

const {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
} = require("../middleware/task.validation");

// IMPORTANT:
// Replace this import with the actual auth middleware
// you already use in your authentication project.
const authenticate = require("../middleware/auth.middleware");

router.post(
  "/",
  authenticate,
  createTaskValidation,
  validate,
  taskController.createTask
);

router.get(
  "/",
  authenticate,
  taskController.getTasks
);

router.get(
  "/:id",
  authenticate,
  taskIdValidation,
  validate,
  taskController.getTaskById
);

router.patch(
  "/:id",
  authenticate,
  updateTaskValidation,
  validate,
  taskController.updateTask
);

router.delete(
  "/:id",
  authenticate,
  taskIdValidation,
  validate,
  taskController.deleteTask
);

module.exports = router;