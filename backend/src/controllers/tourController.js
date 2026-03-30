import Tour from '../models/Tour.js';

// GET /api/tours
export const getAllTours = async (req, res) => {
  try {
    const {
      search, difficulty, minPrice, maxPrice,
      country, sort, page = 1, limit = 9,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    if (difficulty) filter.difficulty = difficulty;
    if (country) filter.country = { $regex: country, $options: 'i' };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating': { rating: -1 },
      'newest': { createdAt: -1 },
    };

    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Tour.countDocuments(filter);

    const tours = await Tour.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      status: 'success',
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      results: tours.length,
      tours,
    });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


// GET /api/tours/featured
export const getFeaturedTours = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true }).limit(6);

    res.status(200).json({ status: 'success', tours });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


// GET /api/tours/:id
export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate('createdBy', 'name photo')
      .lean();

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    // ✅ Sort itinerary if exists
    if (tour.itinerary) {
      tour.itinerary.sort((a, b) => a.day - b.day);
    }

    res.status(200).json({
      status: 'success',
      tour,
    });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


/// POST /api/tours
export const createTour = async (req, res) => {
  try {
    if (req.body.itinerary) {
      req.body.itinerary = req.body.itinerary.map((day, index) => ({
        day: day.day || index + 1,
        title: day.title?.trim(),
        description: day.description?.trim(),
        activities: Array.isArray(day.activities) ? day.activities : [],
        accommodation: day.accommodation || '',
        meals: {
          breakfast: day.meals?.breakfast || false,
          lunch: day.meals?.lunch || false,
          dinner: day.meals?.dinner || false,
        },
      }));
      req.body.itinerary.sort((a, b) => a.day - b.day);
    }

    const tour = await Tour.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({ status: 'success', tour });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/tours/:id
export const updateTour = async (req, res) => {
  try {
    if (req.body.itinerary) {
      req.body.itinerary = req.body.itinerary.map((day, index) => ({
        day: day.day || index + 1,
        title: day.title?.trim(),
        description: day.description?.trim(),
        activities: Array.isArray(day.activities) ? day.activities : [],
        accommodation: day.accommodation || '',
        meals: {
          breakfast: day.meals?.breakfast || false,
          lunch: day.meals?.lunch || false,
          dinner: day.meals?.dinner || false,
        },
      }));
      req.body.itinerary.sort((a, b) => a.day - b.day);
    }

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tour) return res.status(404).json({ status: 'fail', message: 'Tour not found' });

    res.status(200).json({ status: 'success', tour });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


// DELETE /api/tours/:id
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
// POST /api/tours/:id/itinerary
export const addItineraryDay = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ status: 'fail', message: 'Tour not found' });

    tour.itinerary.push(req.body);
    tour.itinerary.sort((a, b) => a.day - b.day);
    await tour.save();

    res.status(201).json({ status: 'success', itinerary: tour.itinerary });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PUT /api/tours/:id/itinerary
export const updateItinerary = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ status: 'fail', message: 'Tour not found' });

    tour.itinerary = req.body.itinerary.sort((a, b) => a.day - b.day);
    await tour.save();

    res.status(200).json({ status: 'success', itinerary: tour.itinerary });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};