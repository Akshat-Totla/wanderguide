import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import toast from 'react-hot-toast';

export default function WishlistButton({ tourId, className = '' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.wishlist);

  const isSaved = items.includes(tourId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Sign in to save tours');
      navigate('/login');
      return;
    }

    if (isSaved) {
      await dispatch(removeFromWishlist(tourId));
      toast.success('Removed from wishlist');
    } else {
      await dispatch(addToWishlist(tourId));
      toast.success('Saved to wishlist');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
        isSaved
          ? 'bg-red-500 text-white'
          : 'bg-white/80 hover:bg-white text-slate-400 hover:text-red-500'
      } ${className}`}
      title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isSaved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}