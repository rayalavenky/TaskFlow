const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: req.user,
  });
};

module.exports = {
  getProfile,
};