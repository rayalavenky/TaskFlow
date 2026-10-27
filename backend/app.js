const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const userRoutes = require("./routes/user.routes");

const errorHandler = require("./middleware/error.middleware");
const notFound = require("./middleware/notFound.middleware");
const app = express();
const helmet = require("helmet");

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({
    limit: "10kb",
}));

app.use(cookieParser());

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Welcome to the Auth API"
    })
})

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);

// Error middleware must come AFTER routes
app.use(errorHandler);

module.exports = app;