import jwt from "jsonwebtoken";
import User from "../model/userModel.js";


const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get the token from headers
    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer token"

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user based on the decoded ID and attach it to req.user
    req.user = await User.findById(decoded.id).select("-password");

    // 5. Call next() to continue to the actual route
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export default authMiddleware;
