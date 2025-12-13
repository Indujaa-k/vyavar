import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../actions/userActions";
import { IconButton } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const FavoriteButton = ({ productId }) => {
  const dispatch = useDispatch();
  const { favoriteItems } = useSelector((state) => state.favorites);

  const isFavorite = favoriteItems?.some((item) => item._id === productId);

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(productId));
  };

  return (
    <IconButton
      icon={
        isFavorite ? (
          <FaHeart color="red" size={26} />
        ) : (
          <FaRegHeart size={26} />
        )
      }
      onClick={handleFavoriteToggle}
      aria-label="Toggle Favorite"
      variant="ghost"
    />
  );
};

export default FavoriteButton;
