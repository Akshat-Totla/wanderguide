import User from '../models/User.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalTours, totalBookings, revenueData] = await Promise.all([
      User.countDocuments(),
      Tour.countDocuments(),
      Booking.countDocuments({ status: { $ne: 'cancelled' } }),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    // Bookings per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      status: 'success',
      stats: {
        totalUsers,
        totalTours,
        totalBookings,
        totalRevenue: revenueData[0]?.total || 0,
        monthlyBookings,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'guide', 'admin'].includes(role)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    res.status(200).json({ status: 'success', user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};