import User from '../models/User.js';
import { sendTokens, verifyRefreshToken, signAccessToken } from '../utils/jwt.js';
import { validationResult } from 'express-validator';

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ status: 'fail', errors: errors.array() });
    return true;
  }
  return false;
};

export const signup = async (req, res) => {
  try {
    if (checkValidation(req, res)) return;

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ status: 'fail', message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });

    // ✅ send tokens
    sendTokens(res, user, 201);

  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    if (checkValidation(req, res)) return;

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    // ✅ send tokens
    sendTokens(res, user, 200);

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ status: 'success', message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    console.log("Refresh Cookies:", req.cookies); // 🔍 DEBUG

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'No refresh token' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'User not found' });
    }

    const newAccessToken = signAccessToken(user._id);

    // ✅ FIXED COOKIE
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,          // REQUIRED for HTTPS (Render)
      sameSite: 'None',      // ⭐ FIXED (was 'strict')
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ status: 'success' });

  } catch (err) {
    console.error('Refresh error:', err.message);
    res.status(401).json({ status: 'fail', message: 'Invalid or expired refresh token' });
  }
};

export const getMe = (req, res) => {
  try {
    res.status(200).json({ status: 'success', user: req.user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
