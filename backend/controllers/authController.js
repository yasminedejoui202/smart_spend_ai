const User = require('../models/User')

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    const user = await User.create({ name, email, password })

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message })
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email, password })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    return res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
}