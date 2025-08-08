const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require("../models/userModel")
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Perbaiki typo pada existingUser
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ username, email, password: hashedPassword })
        await newUser.save()

        res.status(201).json({ message: "User created successfully" }) // Status 201 untuk create
    } catch (error) {
        console.error(error) // Untuk melihat error yang lebih detail di server
        res.status(500).json({ message: "Server error" }) // Status 500 untuk error server
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const userEmail = await User.findOne({ email })
        if (!userEmail) {
            return res.status(400).json({ msg: "Email does not exist" })
        }

        const isMatch = await bcrypt.compare(password, userEmail.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" })
        }

        const isAdmin = userEmail.role === "admin"

        const token = jwt.sign({ 
          userId: userEmail._id,
          username: userEmail.username,
          role: userEmail.role,
          isAdmin
         }, process.env.JWT_SECRET, { expiresIn: '1h' })
       
        res.status(200).json({ message: isAdmin?"berhasil login sebagai admin": "User logged in successfully", token, isAdmin })



        
    } catch (error) {
        console.error(error) // Untuk melihat error yang lebih detail di server
        res.status(500).json({ message: "Server error" }) // Status 500 untuk error server
    }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Email does not exist" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  console.log("Generated token:", token);

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  try {
    await user.save();
    console.log("Token & expiry saved to user");
  } catch (err) {
    console.error("Gagal menyimpan token ke DB:", err.message);
    return res.status(500).json({ message: "Gagal menyimpan token" });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_DEVELOPER,
      pass: process.env.PASS_EMAIL
    }
  });

  await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset',
    html: `<a href="http://localhost:5173/reset-password/${token}">Reset Password</a>`

  });

  res.json({ message: 'Email sent' });
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log('Token DITERIMA:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('User TIDAK DITEMUKAN atau token beda / kadaluarsa');
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken  = null;
    user.resetPasswordExpires   = null;
    await user.save();

    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Error verify token:', err.message);
    return res.status(400).json({ message: 'Token error' });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({_id: req.params.id})
    return res.json({ message: 'User deleted' });

  } catch (error) {
    res.status(500).json({ message: " Error deleting user" });
  }
}





module.exports = { signUp, loginUser, forgotPassword, resetPassword, deleteUser}
