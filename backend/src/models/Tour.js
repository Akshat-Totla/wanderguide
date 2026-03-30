import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tour title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration in days is required'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Group size is required'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'difficult'],
    required: [true, 'Difficulty is required'],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingsCount: {
    type: Number,
    default: 0,
  },
  images: [String],
  coverImage: {
    type: String,
    default: 'default-tour.jpg',
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  coordinates: {
  lat: { type: Number },
  lng: { type: Number },
},
  featured: {
    type: Boolean,
    default: false,
  },
  itinerary: [
  {
    day: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    activities: [String],
    accommodation: {
      type: String,
      default: '',
    },
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false },
    },
  }
],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Auto-generate slug from title
tourSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;