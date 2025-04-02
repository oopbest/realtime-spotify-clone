import { User } from "../models/user.model.js";

const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body; // clerk user data

    // check if user already exists
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      // create new user
      const newUser = new User({
        fullName: `${firstName || ""} ${lastName || ""}`,
        imageUrl,
        clerkId: id,
      });
      await newUser.save();
    }

    res.status(200).json({ message: true });
  } catch (error) {
    console.log("Error in auth callback:", error);
    next(error);
  }
};

export default authCallback;
