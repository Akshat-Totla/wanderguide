import jwt from 'jsonwebtoken';

export const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });

export const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

// ✅ FIXED FUNCTION
export const sendTokens = (res, user, statusCode) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // ✅ ACCESS TOKEN COOKIE
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,           // ⭐ FORCE TRUE (Render uses HTTPS)
    sameSite: 'None',       // ⭐ FIXED (IMPORTANT)
    maxAge: 15 * 60 * 1000,
  });

  // ✅ REFRESH TOKEN COOKIE
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,           // ⭐ FORCE TRUE
    sameSite: 'None',       // ⭐ MOST IMPORTANT FIX
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // ❌ removed path (safer)
  });

  // remove sensitive fields
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  res.status(statusCode).json({
    status: 'success',
    user: userObj,
  });
};
