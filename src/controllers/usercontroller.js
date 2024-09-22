const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET_KEY = "VAIBHAVI08051997";
const nodemailer = require("nodemailer");

// user signup
const signUp = async (req, res) => {
  try {
    const avatar = req.file ? req.file.filename : null;
    const {
      firstname,
      lastname,
      address,
      phone,
      gender,
      dob,
      email,
      password,
      confirmpassword,
      userType,
    } = req.body;

    // email checking
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      res.status(400).json({
        status: "fail",
        error: error.message,
        message: "Email already exists",
      });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    const hashComfirmPassword = await bcrypt.hash(confirmpassword, 10);

    if (password !== confirmpassword) {
      res.status(400).json({
        status: "fail",
        error: error.message,
        message: "Passwords do not match",
      });
    }

    // create new user
    const newUser = new User({
      firstname,
      lastname,
      address,
      phone,
      gender,
      dob,
      email,
      password: hashPassword,
      confirmpassword: hashComfirmPassword,
      avatar,
      userType,
    });
    const user = await newUser.save();
    res.status(200).json({
      data: user,
      message: "Registered Successfully",
      status: "success",
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        status: "fail",
        error: error.message,
        message: "All fields are mandatory!",
      });
    }
    // check email and user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
        error: error.message,
      });
    }
    // compaper password with hashpassword
    const compaperPassword =
      user && (await bcrypt.compare(password, user.password));

    if (compaperPassword) {
      // generate token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        ACCESS_TOKEN_SECRET_KEY,
        {
          expiresIn: "3h",
        }
      );
      res.status(200).json({
        status: "success",
        message: "Login Successfully",
        data: user,
        token: token,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "invalid Password",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    // add pagination
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 5);
    const skip = (page - 1) * limit;
    // add search
    const search = req.query.search || "";
    const regex = new RegExp(search, "i");
    const searchquery =
      search !== ""
        ? {
            $or: [
              { firstname: { $regex: regex } },
              { lastname: { $regex: regex } },
              { gender: { $regex: regex } },
            ],
          }
        : {};
    //  add filter
    const filter = req.query.gender || "";
    const genderRegex = new RegExp(filter, "i");
    const genderQuery =
      filter !== "" ? { gender: { $regex: genderRegex } } : {};

    // add sorting
    const sortBy = req.query.sortBy || "firstname"; // Default sorting by movie name
    const sortDirection = req.query.sortDirection || "desc"; // Default sorting direction is ascending

    const sortOptions = {};
    sortOptions[sortBy] = sortDirection === "asc" ? 1 : -1;

    const query = {
      $and: [
        searchquery, // Search query
        genderQuery, // gender filter
        { user_id: req.user.id },
      ],
    };
    // Fetch user based on the constructed query, sort, skip, and limit
    const user = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Count total movies for pagination
    const totalsearchuser = await User.countDocuments(query);
    const totaluser = await User.countDocuments();

    res.status(200).json({
      totaluser,
      data: user,
      page,
      totalPages: Math.ceil(totaluser / limit),
      totalsearchuser,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// update users
const updateUsers = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      address,
      phone,
      gender,
      dob,
      email,
      password,
      confirmpassword,
      userType,
    } = req.body;

    const _id = req.params.id;
    console.log("req", req.body);
    let avatar = null;
    if (req.file) {
      avatar = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      { _id, user_id: req.user.id },
      {
        firstname,
        lastname,
        address,
        phone,
        gender,
        dob,
        email,
        password,
        confirmpassword,
        userType,
        avatar,
      },
      { new: true }
    );
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
      message: "user not update",
    });
  }
};

// delete users
const deleteUsers = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(400).json({ status: "fail", error: error.message });
    }
    res.status(200).json({
      status: "success",
      message: "Delete user successfull...",
      user,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

const getOneUser = async (req, res) => {
  try {
    const _id = req.user.id;
    const user = await User.findById({ _id });
    if (!user) {
      return res.status(400).json({ status: "fail", error: error.message });
    } else {
      res.status(200).json({
        data: user,
      });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // check email and user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
        error: error.message,
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "55b75cdccd6785",
        pass: "1595b88cde4bd5",
      },
    });
    const mailOptions = {
      from: "vaibhavisikligar97@gmail.com",
      to: email,
      subject: "Password Reset link",
      html: `Reset your password by clicking this link: <a href='http://localhost:3000/reset-password/${user._id}/${token}'>Link</a>`,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to send email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          status: "success",
          message: "Your email sent successfully,please check your mail box",
        });
      }
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const _id = req.params.id;
    const token = req.params.token;
    const { password, confirmpassword } = req.body;

    console.log(req.body);

    jwt.verify(token, ACCESS_TOKEN_SECRET_KEY, async (error, decode) => {
      if (error) {
        console.log(error); // Log the error for debugging purposes
        return res
          .status(403)
          .json({ success: false, message: "Failed to authenticate token" });
      } else {
        const hashpass = await bcrypt.hash(password, 10);
        const hashcpass = await bcrypt.hash(confirmpassword, 10);

        if (password !== confirmpassword) {
          return res.status(400).json({
            status: "fail",
            error: "Passwords do not match",
            message: "Passwords do not match",
          });
        }

        console.log("decode", decode);
        const user = await User.findByIdAndUpdate(
          { _id, user_id: decode.id },
          { password: hashpass, confirmpassword: hashcpass },
          { new: true }
        );

        if (!user) {
          return res.status(400).json({
            status: "fail",
            message: "user not found!",
          });
        }

        res.status(201).json({
          status: "success",
          data: user,
          message: "user password reset successfully.......",
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "fail",
      error: error.message,
      message: "user password not reset",
    });
  }
};

module.exports = {
  signUp,
  login,
  getAllUsers,
  updateUsers,
  deleteUsers,
  getOneUser,
  forgotPassword,
  resetPassword,
  ACCESS_TOKEN_SECRET_KEY,
};
