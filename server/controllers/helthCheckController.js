// Health Check Route

export const healthCheck = async (req, res) => {
  res.status(200).send("Server is healthy 🚀");
};
