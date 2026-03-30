import User from '../models/User.js';

// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'wishlist',
      'title coverImage location country price duration difficulty rating'
    );
    res.status(200).json({ status: 'success', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /api/wishlist/:tourId
export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(req.params.tourId)) {
      return res.status(400).json({ status: 'fail', message: 'Tour already in wishlist' });
    }

    user.wishlist.push(req.params.tourId);
    await user.save();

    res.status(200).json({ status: 'success', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE /api/wishlist/:tourId
export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.tourId
    );
    await user.save();

    res.status(200).json({ status: 'success', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};