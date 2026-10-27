const Task = require("../models/task.model");
const AppError = require("../utils/AppError");

const createTask = async (taskData, userId) => {
  return Task.create({
    title: taskData.title,
    description: taskData.description,
    status: taskData.status,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    owner: userId,
  });
};

const getTasks = async (userId) => {
  return Task.find({ owner: userId }).sort({
    createdAt: -1,
  });
};

const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    owner: userId,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

const updateTask = async (taskId, userId, updates) => {
  const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
  ];

  const updateData = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      owner: userId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({
    _id: taskId,
    owner: userId,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};