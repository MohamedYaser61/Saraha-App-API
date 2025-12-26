import CryptoJS from "crypto-js";
import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({}).select("+Phone");
    console.log("Found users:", users.length);

    // Decrypt phone numbers for all users
    const usersWithDecryptedPhones = users.map((user) => {
      const userObj = user.toObject();
      console.log("User phone (encrypted):", userObj.Phone);

      if (userObj.Phone && userObj.Phone.trim() !== "") {
        try {
          const bytes = CryptoJS.AES.decrypt(
            userObj.Phone,
            process.env.phonePrivateKey
          );
          const decryptedPhone = bytes.toString(CryptoJS.enc.Utf8);
          console.log("Decrypted phone:", decryptedPhone);

          // If decryption results in empty string, it means the original was empty/invalid
          if (decryptedPhone && decryptedPhone.trim() !== "") {
            userObj.Phone = decryptedPhone;
          } else {
            userObj.Phone = "";
          }
        } catch (decryptError) {
          console.error(
            "Phone decryption error for user:",
            userObj._id,
            decryptError
          );
          userObj.Phone = "";
        }
      } else {
        console.log("Phone is empty or undefined for user:", userObj._id);
        userObj.Phone = "";
      }
      return userObj;
    });

    // return res.status(200).json({
    //   message: "List of users",
    //   count: users.length,
    //   users: usersWithDecryptedPhones,
    // });
    return res.status(200).json({
      message: "List of users",
      count: users.length,
      users: usersWithDecryptedPhones,
    });
  
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.status = 500;
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { user } = req;

    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    // Create a plain object copy to avoid mutating the Mongoose document
    const userObj = user.toObject();

    console.log("User phone (encrypted):", userObj.Phone);
    console.log("Phone privateKey exists:", !!process.env.phonePrivateKey);

    // Decrypt phone number if it exists and is not empty
    if (userObj.Phone && userObj.Phone.trim() !== "") {
      try {
        const bytes = CryptoJS.AES.decrypt(
          userObj.Phone,
          process.env.phonePrivateKey
        );
        const decryptedPhone = bytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted phone:", decryptedPhone);

        // If decryption results in empty string, it means the original was empty/invalid
        if (decryptedPhone && decryptedPhone.trim() !== "") {
          userObj.Phone = decryptedPhone;
        } else {
          userObj.Phone = "";
        }
      } catch (decryptError) {
        console.error("Phone decryption error:", decryptError);
        userObj.Phone = "";
      }
    } else {
      console.log("Phone field is empty or undefined");
      userObj.Phone = "";
    }
    // return res.status(200).json({
    //   message: "User retrieved successfully",
    //   user: userObj,
    // });
    return res.status(200).json({
      message: "User retrieved successfully",
      user: userObj,
    });
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.status = 500;
    return next(err);
  }
}

// Update Profile
const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, userName } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const updateUser = await userModel.findOneAndUpdate(
      { _id: user._id },
      { email, userName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updateUser,
    });
  } catch (error) {
    const err = new Error("Internal Server Error: " + error.message);
    err.status = 500;
    return next(err);
  }
};

// Change password feature
const changePassword = async (req, res, next) => {
  try {
  const {email, currentPassword, newPassword} =  req.body;
  const user = await userModel.findOne({email});

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  // Match current password
  const matchPassword = await bcrypt.compare(currentPassword, user.password);
  if (!matchPassword) {
    const err = new Error("Current password is incorrect");
    err.status = 400;
    return next(err);
  }
  // Hash new password
  const hachedPassword = bcrypt.hashSync(newPassword, parseInt(process.env.saltRounds));
  // Overwrite old password
  user.password = hachedPassword;
  await user.save();
  return res.status(200).json({
    message: "Password changed successfully", user: user
  });
} catch (error) {
  return next(error)
};
}

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error("No file uploaded");
      err.status = 400;
      return next(err);
    }
    return res.status(200).json({
      message: "File uploaded successfully",
      filePath: req.file.path,
    });
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.status = 500;
    return next(err);
  }
};
export { getAllUsers, getUser, updateProfile, changePassword, uploadFile };