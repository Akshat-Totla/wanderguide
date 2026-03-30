import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a tour'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user'],
  },
  bookingDate: {
    type: Date,
    required: [true, 'Please select a tour date'],
  },
  guests: {
    type: Number,
    required: [true, 'Please specify number of guests'],
    min: [1, 'At least 1 guest required'],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters'],
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;