const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Registration request received:', { name, email, password }); // Log the raw password

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email); // Log if the user already exists
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user (password will be hashed by the pre-save middleware)
    const user = new User({ name, email, password });
    await user.save();

    console.log('User registered successfully:', user); // Log the registered user
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error); // Log any unexpected errors
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email, password }); // Log the raw password

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email); // Log if the user is not found
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Stored hashed password:', user.password); // Log the stored hashed password

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch); // Log the comparison result

    if (!isMatch) {
      console.log('Invalid credentials for user:', email); // Log invalid credentials
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('Token generated for user:', email, token); // Log the generated token
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error); // Log any unexpected errors
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };