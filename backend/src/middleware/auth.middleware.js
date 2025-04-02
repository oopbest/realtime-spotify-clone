import { clerkClient } from "@clerk/express";

export const protectRoute = (req, res, next) => {
  if (!req.auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you are not logged in" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized - you are not an admin" });
    }
    next();
  } catch (error) {
    console.log("Error in requireAdmin middleware:", error);
    next(error);
  }
};
