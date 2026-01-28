import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getIncomeByPincode } from "../../actions/orderActions";
import { ZoomControl } from "react-leaflet";
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
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const AutoZoomIndia = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = locations.map((loc) => [loc.lat, loc.lon]);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 10,
      });
    }
  }, [locations, map]);

  return null;
};

const IncomeByPincode = () => {
  const dispatch = useDispatch();

  const {
    loading,
    incomeByPincode = [],
    error,
  } = useSelector((state) => state.incomeByPincode);

  const [locations, setLocations] = useState([]);

  // Fix Leaflet icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  useEffect(() => {
    dispatch(getIncomeByPincode());
  }, [dispatch]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (incomeByPincode.length > 0) {
        const updatedLocations = await Promise.all(
          incomeByPincode.map(async (item) => {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?postalcode=${item.pinCode}&country=India&format=json`,
              );

              const data = await response.json();

              if (data.length > 0) {
                return {
                  pinCode: item.pinCode,
                  income: item.income,
                  lat: parseFloat(data[0].lat),
                  lon: parseFloat(data[0].lon),
                };
              }
            } catch (err) {
              console.error(`Pincode ${item.pinCode} error`, err);
            }
            return null;
          }),
        );

        setLocations(updatedLocations.filter(Boolean));
      }
    };

    fetchCoordinates();
  }, [incomeByPincode]);

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );

  if (error)
    return (
      <Center>
        <Text color="red.500">{error}</Text>
      </Center>
    );

  return (
    <Flex direction="column" align="center" mt={0} px={4}>
      <h1 className="titlepanel">Income by Pincode</h1>

      <Box
        mt={6}
        w="100%"
        maxW="900px"
        h={["300px", "400px", "500px"]}
        borderRadius="md"
        boxShadow="md"
      >
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[22.9734, 78.6569]}
          zoom={5}
          minZoom={4}
          zoomControl={false}
          maxBounds={[
            [6.4627, 68.1097],
            [35.5133, 97.3956],
          ]}
          maxBoundsViscosity={1}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {locations.map((loc, i) => (
            <Marker key={i} position={[loc.lat, loc.lon]}>
              <Popup>
                <b>Pincode: {loc.pinCode}</b>
                <br />
                Income: ₹{loc.income}
              </Popup>
            </Marker>
          ))}

          <AutoZoomIndia locations={locations} />

          {/* 👇 Zoom buttons at bottom-right */}
          <ZoomControl position="bottomright" />
        </MapContainer>
      </Box>

      <Box mt={8} w="100%" maxW="1200px">
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {incomeByPincode.map((item, i) => (
            <Card key={i}>
              <CardBody>
                <Text fontWeight="bold">Pincode: {item.pinCode}</Text>
                <Text>Income: ₹{item.income}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default IncomeByPincode;
