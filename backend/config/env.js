const requiredEnvVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "ACCESS_TOKEN_EXPIRES_IN",
  "REFRESH_TOKEN_EXPIRES_IN",
];

const validateEnv = () => {
  const missingVariables = requiredEnvVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(", ")}`
    );
  }
};

module.exports = validateEnv;