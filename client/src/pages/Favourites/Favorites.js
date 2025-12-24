import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../actions/userActions";
import { IconButton,useToast } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FavoriteButton = ({ productId,onClick  }) => {
  const dispatch = useDispatch();
   const toast = useToast();
  const navigate = useNavigate();

  // 🔹 Logged-in user
  const { userInfo } = useSelector((state) => state.userLogin);

  // 🔹 Wishlist items
  const { favoriteItems } = useSelector((state) => state.favorites);

  const isFavorite = favoriteItems?.some((item) => item._id === productId);

  const handleFavoriteToggle = () => {
     if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to Wishlist.",
        status: "warning",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
      navigate("/login");
      return;
    }

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
