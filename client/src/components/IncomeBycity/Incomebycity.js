import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncomeByCity } from "../../actions/orderActions";
import {
  Box,
  Flex,
  Spinner,
  Text,
  SimpleGrid,
  Card,
  Center,
  CardBody,
} from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Ensure Leaflet styles are loaded
import L from "leaflet";

const IncomeByCity = () => {
  const dispatch = useDispatch();
  const {
    loading,
    totalIncome,
    incomeByCity = [],
    error,
  } = useSelector((state) => state.income);

  const [locations, setLocations] = useState([]);

  // Set default Leaflet icons to avoid 404 error
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  useEffect(() => {
    dispatch(getIncomeByCity());
  }, [dispatch]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (Array.isArray(incomeByCity) && incomeByCity.length > 0) {
        try {
          const updatedLocations = await Promise.all(
            incomeByCity.map(async (item) => {
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
                    item.city
                  )}&format=json`
                );
                const data = await response.json();
                if (data.length > 0) {
                  return {
                    city: item.city,
                    income: item.income,
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                  };
                }
              } catch (error) {
                console.error(
                  `Error fetching location for ${item.city}:`,
                  error
                );
              }
              return null;
            })
          );
          setLocations(updatedLocations.filter((loc) => loc !== null));
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        }
      }
    };
    fetchCoordinates();
  }, [incomeByCity]);

  if (loading)
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );

  if (error)
    return (
      <Center>
        <Text color="red.500">Error: {error}</Text>
      </Center>
    );

  return (
    <Flex direction="column" align="center" justify="center" mt={10} px={4}>
      {/* Total Income Box */}
      <h1 className="titlepanel">Income Statistics</h1>

      {/* Map Section */}
      <Box
        mt={6}
        w="100%"
        maxW="900px"
        height={["300px", "400px", "500px"]}
        overflow="hidden"
        borderRadius="md"
        boxShadow="md"
      >
        <MapContainer
          center={
            locations.length > 0
              ? [locations[0].lat, locations[0].lon]
              : [20, 0]
          }
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lon]}>
              <Popup>
                <b>{loc.city}</b>
                <br /> Income: {loc.income}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
      <Text mt={10} fontSize="2xl" fontWeight="bold" mb={2}>
        Total Income: {totalIncome || "$0k"}
      </Text>
      {/* Cards Section for each City */}
      <Box mt={8} w="100%" maxW="1200px" px={4}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {incomeByCity.map((item, index) => (
            <Card key={index} boxShadow="lg" borderRadius="md">
              <CardBody>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {item.city}
                </Text>
                <Text fontSize="md" color="gray.600">
                  Income: {item.income}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default IncomeByCity;
