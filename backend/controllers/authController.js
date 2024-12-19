// @ts-nocheck
import User from "../models/userModels.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";


const signup = async (req, res) => {
  const {name,email,password } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(404).json({message: "All fields are required"});
    }

    const userAlreadyExists = await User.findOne({ email });
    console.log("userAlreadyExists", userAlreadyExists);
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24hours
    });
    await user.save(); // save user to database

    //jwt
    generateTokenAndSetCookies(res, user._id);
    //   await sendVerificationEmail(user.email,verificationToken)

    res.status(201).json({
      success: true,
      message: "user created successfully",
      user: {
        //  _id: user._id,
        //  email: user.email,
        //  name:user.name,
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in signup ", error);

    return res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    generateTokenAndSetCookies(res, user._id);

    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login", error);

    res.status(200).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};





const getUsers = async ( req, res ) =>
{
 
try {
  const user =  await User?.find().select("-password");
  
  return res.status(200).json(user)
} catch (error) {
      console.log("Error in getUsers ", error);
    res.status(400).json({ success: false, message: error.message });
}
  

}

export {
  signup,
  login,
  logout,

  getUsers
};
