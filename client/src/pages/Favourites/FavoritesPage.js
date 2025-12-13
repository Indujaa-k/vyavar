import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites, toggleFavorite } from "../../actions/userActions";
import {
  Box,
  Text,
  Spinner,
  SimpleGrid,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Trust from "../../components/Trustdetails/Trust";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const FavoritesPage = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();
  const { favoriteItems, loading, error } = useSelector(
    (state) => state.favorites
  );

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleFavoriteToggle = (productId) => {
    dispatch(toggleFavorite(productId));
  };

  if (!userInfo) {
    return (
      <Box textAlign="center" mt={20} p={6} minH={"30vh"}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          You are not logged in.
        </Text>
        <Text>Please log in to view your favorites. ❤️</Text>
      </Box>
    );
  }

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="50vh"
      >
        <Spinner size="xl" color="red.500" />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
      </Box>
    );

  return (
    <>
      <Box mt={20} p={6} bg="white" color="black">
        <Text fontSize="2xl" fontWeight="bold" mb={5} textAlign="center">
          Your Favorites ❤️
        </Text>

        {favoriteItems.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {favoriteItems.map((product) => {
              const isFavorite = favoriteItems.some(
                (item) => item._id === product._id
              );

              return (
                <Box
                  key={product._id}
                  borderRadius="xl"
                  overflow="hidden"
                  color="black"
                  width="270px"
                  height="490px"
                  position="relative"
                >
                  {/* Favorite Button */}
                  <Box position="absolute" top={2} right={2} zIndex={1}>
                    <IconButton
                      icon={
                        isFavorite ? (
                          <FaHeart color="red" size={26} />
                        ) : (
                          <FaRegHeart size={26} />
                        )
                      }
                      onClick={() => handleFavoriteToggle(product._id)}
                      aria-label="Toggle Favorite"
                      variant="ghost"
                    />
                  </Box>

                  {/* Product Image */}
                  <Link to={`/product/${product._id}`}>
                    <Box height="380px" width="100%" overflow="hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.description}
                        objectFit="cover"
                        width="100%"
                        height="100%"
                        borderRadius="xl"
                      />
                    </Box>
                  </Link>

                  {/* Product Details */}
                  <Box p={4} bg="white" color="black">
                    <Link to={`/product/${product._id}`}>
                      <Text fontWeight="500" fontSize="lg" mb={2}>
                        {product.brandname}
                      </Text>
                      <Text fontSize="md" color="gray.600" mb={2}>
                        {product.description}
                      </Text>
                    </Link>

                    {/* Price Section */}
                    <Box display="flex" alignItems="center" mt={2}>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <Text
                          as="span"
                          fontSize="sm"
                          color="gray.500"
                          textDecoration="line-through"
                          mr={2}
                        >
                          Rs. {product.oldPrice}
                        </Text>
                      )}
                      <Text
                        as="span"
                        fontSize="lg"
                        fontWeight="500"
                        color="black"
                      >
                        Rs. {product.price}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" mt={10}>
            <Text fontSize="lg" color="gray.400">
              No favorites added yet. 💔
            </Text>
          </Box>
        )}
      </Box>

      <Trust />
    </>
  );
};

export default FavoritesPage;
