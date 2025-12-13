import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CreateOrder } from "../../actions/orderActions";
import { fetchCart } from "../../actions/cartActions";
import { createShipment } from "../../actions/deliveryActions";
import { getUserDetails } from "../../actions/userActions";

const Placeorder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const cart = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.orderCreate);
  const userProfile = useSelector((state) => state.userDetails);
  const { user, loading: userLoading } = userProfile;
  const recipientAddress = user?.address;

  const { order, success, error } = orderCreate;
  const taxPercentage = 5;
  const {
    doorNo,
    street,
    city,
    state,
    pin,
    country,
    phoneNumber,
    nearestLandmark,
  } = cart.shippingAddress;
  const shippingCost = cart.shippingCost;
  const shippingRates = cart.shippingRates;
  console.log("Shipping Rates", shippingRates);
  console.log("recipientAddress", recipientAddress);
  const itemsPrice = cart.cartItems.reduce((acc, item) => {
    if (item.product && item.product.price) {
      return acc + item.qty * item.product.price;
    }
    return acc;
  }, 0);
  const taxPrice = (itemsPrice * taxPercentage) / 100;
  const totalPrice = itemsPrice + shippingCost + taxPrice;

  const PlaceorderHandler = async () => {
    try {
      // Prepare shipment details
      const shipmentDetails = {
        recipientName: userInfo.name,
        street: recipientAddress.street,
        nearestLandmark: recipientAddress.nearestLandmark,
        city: recipientAddress.city,
        postalCode: recipientAddress.pin,
        countryCode: recipientAddress.country || "IN",
        phoneNumber: recipientAddress?.phoneNumber,
        productId: cart.cartItems[0].product._id,
        totalPrice,
      };
      console.log("🚀 Sending Shipment Details:", shipmentDetails);
      // Create shipment with FedEx
      const shipmentResponse = await dispatch(createShipment(shipmentDetails));
      console.log("📦 Shipment Response:", shipmentResponse);
      const shipmentData = shipmentResponse.data;

      const orderData = {
        user: userInfo._id,
        orderItems: cart.cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.brandname,
          price: item.product.price,
          qty: item.qty,
        })),
        shippingAddress: recipientAddress,
        shippingRates,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice: shippingCost,
        taxPrice: taxPercentage,
        totalPrice,
        shipmentDetails: [shipmentData],
      };

      console.log("Final Order Payload:", orderData);
      dispatch(CreateOrder(orderData));
    } catch (error) {
      console.error("❌ Error creating order:", error);
    }
  };
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (success) {
      console.log(order._id);
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order]);
  return (
    <button className="placeorder-btn" onClick={PlaceorderHandler}>
      🛍️ Place Order
    </button>
  );
};
export default Placeorder;
