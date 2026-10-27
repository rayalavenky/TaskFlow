const express = require("express");

const router = express.Router();

const taskController = require("../controllers/task.controller");

const validate = require("../middleware/validation.middleware");

const {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
} = require("../middleware/task.validation");

const { protect } = require("../middleware/auth.middleware");

router.post(
  "/",
  protect,
  createTaskValidation,
  validate,
  taskController.createTask
);

router.get(
  "/",
  protect,
  taskController.getTasks
);

router.get(
  "/:id",
  protect,
  taskIdValidation,
  validate,
  taskController.getTaskById
);

router.patch(
  "/:id",
  protect,
  updateTaskValidation,
  validate,
  taskController.updateTask
);

router.delete(
  "/:id",
  protect,
  taskIdValidation,
  validate,
  taskController.deleteTask
);

module.exports = router;