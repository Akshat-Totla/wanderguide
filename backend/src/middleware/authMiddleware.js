import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Not authenticated' });
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ status: 'fail', message: 'Password changed, please log in again' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ status: 'fail', message: 'Invalid or expired token' });
  }
};

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ status: 'fail', message: 'Access denied' });
  }
  next();
};