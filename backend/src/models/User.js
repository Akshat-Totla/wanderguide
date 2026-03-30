import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user',
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
  }
],
  passwordChangedAt: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Update passwordChangedAt
userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidate, hashed) {
  return await bcrypt.compare(candidate, hashed);
};

// Check if password changed after JWT issued
userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtIssuedAt < changedAt;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;