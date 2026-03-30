import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ status: 'success', user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check email not taken by another user
    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ status: 'fail', message: 'Email already in use' });
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', user: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ status: 'fail', message: 'Please provide current and new password' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ status: 'fail', message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: 'fail', message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/users/upload-photo
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { photo: req.file.path },
      { new: true }
    );

    res.status(200).json({ status: 'success', user: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE /api/users/delete-account
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res.status(200).json({ status: 'success', message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};