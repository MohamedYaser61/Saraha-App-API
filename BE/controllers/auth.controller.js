import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import sendEmail, { subjectEmail } from "../utils/sendingEmail.js";
import { sendEmail_template } from "../utils/sendEmail_template.js";

const register = async (req, res, next) => {
  try {
    const { userName, email, password, confirmPassword, Phone } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const err = new Error("Email is already exist , try new one");
      err.status = 400;
      return next(err);
    }

    if (password !== confirmPassword) {
      const err = new Error("Password must match");
      err.status = 400;
      return next(err);
    }
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.saltRounds)
    );
    
    // Only encrypt phone if it's provided and not empty
    let encryptedPhone = undefined;
    if (Phone && Phone.trim() !== "") {
      encryptedPhone = CryptoJS.AES.encrypt(
        Phone,
        process.env.phonePrivateKey
      ).toString();
    }
    
    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      ...(encryptedPhone && { Phone: encryptedPhone }),
    });

    // Send welcome email with verification link
    const token = jwt.sign({ email }, process.env.Email_Key);
    const verificationLink = `https://saraha-app-v-1.eu-4.evennode.com/auth/activate_account/token=${token}`;
    await sendEmail({
      to: email,
      subject: subjectEmail.register,
      html: sendEmail_template(verificationLink),
    });

    // return res.status(201).json({ message: "user created successfully", user });
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error.name === "ValidationError") {
      const err = new Error(error.message);
      err.status = 400;
      return next(err);
    }
    const err = new Error("Internal Server Error");
    err.status = 500;
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    // compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid Credentials");
      err.status = 400;
      return next(err);
    }

    //genrate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // // Create a user object with decrypted phone
    // const userObj = user.toObject();
    // if (userObj.Phone) {
    //   try {
    //     const decryptedBytes = CryptoJS.AES.decrypt(
    //       userObj.Phone,
    //       process.env.phonePrivateKey
    //     );
    //     const decryptedPhone = decryptedBytes.toString(CryptoJS.enc.Utf8);
    //     userObj.Phone = decryptedPhone || userObj.Phone;
    //   } catch (decryptError) {
    //     console.error("Phone decryption error:", decryptError);
    //     // Keep the encrypted value if decryption fails
    //   }
    // }

    // return res
    //   .status(200)
    //   .json({ message: "Login successful", token, user });
    return res.json({ message: "Login successful", token, user, status: 200 });
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.status = 500;
    return next(err);
  }
};

const activate_account = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.Email_Key);
    const email = decoded.email;
    const user = await userModel.findOne({ email });
    user.ConfirmEmail = true;
    await user.save();
    return res.status(200).json({ message: "Account activated successfully" });
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.status = 500;
    return next(err);
  }
};

export { register, login, activate_account };
