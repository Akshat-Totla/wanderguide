import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { tourId, bookingDate, guests, specialRequests } = req.body;

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ status: 'fail', message: 'Tour not found' });
    }

    // Check availability — count existing bookings on same date
    const existingBookings = await Booking.find({
      tour: tourId,
      bookingDate: new Date(bookingDate),
      status: { $ne: 'cancelled' },
    });

    const bookedGuests = existingBookings.reduce((sum, b) => sum + b.guests, 0);
    if (bookedGuests + guests > tour.maxGroupSize) {
      return res.status(400).json({
        status: 'fail',
        message: `Only ${tour.maxGroupSize - bookedGuests} spots left on this date`,
      });
    }

    // Prevent same user booking same tour same date
    const duplicate = await Booking.findOne({
      tour: tourId,
      user: req.user._id,
      bookingDate: new Date(bookingDate),
      status: { $ne: 'cancelled' },
    });
    if (duplicate) {
      return res.status(400).json({
        status: 'fail',
        message: 'You already have a booking for this tour on this date',
      });
    }

    const totalPrice = tour.price * guests;

    const booking = await Booking.create({
      tour: tourId,
      user: req.user._id,
      bookingDate: new Date(bookingDate),
      guests,
      totalPrice,
      specialRequests,
    });

    await booking.populate('tour', 'title coverImage location country duration');
    await booking.populate('user', 'name email');

    res.status(201).json({ status: 'success', booking });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('tour', 'title coverImage location country duration price difficulty')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', bookings });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/bookings/:id
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('tour', 'title coverImage location country duration price')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ status: 'fail', message: 'Booking not found' });
    }

    // Only owner or admin can view
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    res.status(200).json({ status: 'success', booking });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ status: 'fail', message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ status: 'fail', message: 'Booking already cancelled' });
    }

    // Only allow cancel if tour date is in the future
    if (new Date(booking.bookingDate) < new Date()) {
      return res.status(400).json({ status: 'fail', message: 'Cannot cancel past bookings' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ status: 'success', booking });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/bookings/admin/all  (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tour', 'title price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', bookings });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};