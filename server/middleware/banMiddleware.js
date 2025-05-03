export const checkBannedStatus = (req, res, next) => {
  if (req.user && req.user.isBanned) {
    return res.status(403).json({
      success: false,
      message: "Your account has been banned. Contact support for assistance."
    });
  }
  next();
};