import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation, Link, NavLink } from "react-router-dom";
import {
  Button,
  Input,
  InputGroup,
  useDisclosure,
  InputLeftElement,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { RiShoppingCart2Line } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { logout } from "../actions/userActions";
import Logo from "../assets/viyavar.png";
import Categorylist from "./Categorylist/Categorylist";
import "./Nav.css";
import { getUserDetails } from "../actions/userActions";
import { getActiveOfferBanner } from "../actions/bannerActions";
import { checkHasCombo } from "../actions/productActions";

import {
  IconButton,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";

const Nav = () => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [incart, setincart] = useState(0);
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men";
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const userProfile = useSelector((state) => state.userDetails);
  const { user } = userProfile;
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const menuBtnRef = useRef();
  const [isCategoryExpanded, setCategoryExpanded] = useState(false);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?keyword=${searchKeyword.trim()}&gender=${gender}`);
      setShowSearch(false);
    }
    setSearchKeyword("");
  };

  const onSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    const count = cartItems.length ? cartItems.length : 0;
    setincart(count);
    return () => setincart(0);
  }, [cart]);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    onClose();
  };

  useEffect(() => {
    if (userInfo) dispatch(getUserDetails("profile"));
  }, [dispatch, userInfo]);

  useEffect(() => {
    dispatch(getActiveOfferBanner());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkHasCombo());
  }, [dispatch]);

  const { banner } = useSelector((state) => state.activeOfferBanner || {});

  const hideBannerRoutes = ["/login", "/register", "/forgetpassword"];
  const shouldHideBanner = hideBannerRoutes.includes(location.pathname);

  return (
    <>
      <header className={`topbar ${isScrolled ? "topbar--scrolled" : ""}`}>
        {/* ── Left cluster: Hamburger + Search (mobile) ── */}
        <div className="topbar__left-cluster">
          <IconButton
            icon={<GiHamburgerMenu />}
            ref={menuBtnRef}
            onClick={() => setDrawerOpen(true)}
            variant="ghost"
            color="white"
            aria-label="Open menu"
            _hover={{ bg: "rgba(255,255,255,0.12)" }}
          />

          {/* Search button — sits right next to hamburger on mobile */}
          <button
            className="topbar__action-btn topbar__search-left"
            onClick={() => setShowSearch((v) => !v)}
            aria-label="Search"
          >
            <BiSearch size={22} />
          </button>
        </div>

        {/* Logo — centered */}
        <NavLink to="/" className="topbar__brand">
          <img src={Logo} alt="logo" className="topbar__brand-img" />
        </NavLink>

        {/* ── Right icons ── */}
        <div className="topbar__actions">
          {/* Search icon — desktop only (hidden on mobile, shown above instead) */}
          <button
            className="topbar__action-btn topbar__search-desktop"
            onClick={() => setShowSearch((v) => !v)}
            aria-label="Search"
          >
            <BiSearch size={22} />
          </button>

          {/* Profile icon — desktop only */}
          {userInfo ? (
            <Link
              to="/profile"
              className="topbar__action-btn topbar__profile-desktop"
              aria-label="Profile"
            >
              {user?.profilePicture ? (
                <img
                  src={
                    user.profilePicture.startsWith("http")
                      ? user.profilePicture
                      : `${process.env.REACT_APP_API_URL}${user.profilePicture}`
                  }
                  alt="Profile"
                  className="topbar__avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <CgProfile size={22} />
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="topbar__action-btn topbar__profile-desktop"
              aria-label="Sign in"
            >
              <CgProfile size={22} />
            </Link>
          )}

          <Link
            to="/Favorites"
            className="topbar__action-btn"
            aria-label="Wishlist"
          >
            <AiOutlineHeart size={22} />
          </Link>

          <Link
            to="/cart"
            className="topbar__action-btn topbar__action-btn--cart"
            aria-label="Cart"
          >
            <RiShoppingCart2Line size={22} />
            {userInfo && !userInfo.isAdmin && incart > 0 && (
              <span className="topbar__cart-badge">{incart}</span>
            )}
          </Link>
        </div>

        {/* Search overlay */}
        {showSearch && (
          <div className="search-bar">
            <form onSubmit={onSearchSubmit} className="search-bar__form">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <BiSearch color="gray" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search products, brands and more..."
                  value={searchKeyword}
                  onChange={onSearchChange}
                  ref={searchRef}
                  autoFocus
                  bg="white"
                  color="black"
                  borderRadius="full"
                />
              </InputGroup>
            </form>
            <button
              className="search-bar__close"
              onClick={() => setShowSearch(false)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Logout Dialog */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              borderRadius="12px"
              boxShadow="lg"
              bg="white"
              maxW="320px"
              p={6}
            >
              <AlertDialogHeader
                fontSize="md"
                fontWeight="bold"
                textAlign="center"
                p={4}
              >
                Logout!
              </AlertDialogHeader>
              <AlertDialogBody textAlign="center" fontSize="md" p={5}>
                Are you sure you want to log out?
              </AlertDialogBody>
              <AlertDialogFooter display="flex" justifyContent="center" p={4}>
                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  borderRadius="8px"
                  bg="gray.300"
                  color="black"
                  px={6}
                  _hover={{ bg: "gray.400" }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={logoutHandler}
                  ml={3}
                  px={6}
                  borderRadius="8px"
                  _hover={{ bg: "red.600" }}
                >
                  Logout
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Side Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          placement="left"
          onClose={() => setDrawerOpen(false)}
          finalFocusRef={menuBtnRef}
        >
          <DrawerOverlay />
          <DrawerContent bg="rgb(9, 37, 74)" color="white">
            <DrawerCloseButton color="white" />
            <DrawerBody
              display="flex"
              flexDirection="column"
              paddingTop="20px"
              paddingBottom="20px"
            >
              {userInfo && (
                <Link
                  to="/profile"
                  className="drawer__profile-link"
                  onClick={() => setDrawerOpen(false)}
                >
                  {user?.profilePicture ? (
                    <img
                      src={
                        user.profilePicture.startsWith("http")
                          ? user.profilePicture
                          : `${process.env.REACT_APP_API_URL}${user.profilePicture}`
                      }
                      alt="Profile"
                      className="drawer__profile-img"
                    />
                  ) : (
                    <CgProfile size={40} />
                  )}
                  <span className="drawer__profile-name">
                    {user?.name || userInfo.name || "Profile"}
                  </span>
                </Link>
              )}

              <ul className="drawer__nav-list">
                <li className="drawer__nav-item">
                  <NavLink
                    className="drawer__nav-link"
                    to="/"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Home
                  </NavLink>
                </li>

                <li className="drawer__nav-item drawer__cat-accordion">
                  <button
                    className={`drawer__cat-header ${isCategoryExpanded ? "drawer__cat-header--open" : ""}`}
                    onClick={() => setCategoryExpanded(!isCategoryExpanded)}
                    type="button"
                  >
                    <span className="drawer__cat-header-left">Categories</span>
                    <span
                      className={`drawer__cat-arrow ${isCategoryExpanded ? "drawer__cat-arrow--up" : ""}`}
                    >
                      ›
                    </span>
                  </button>

                  {isCategoryExpanded && (
                    <div className="drawer__cat-panel">
                      <button
                        className="drawer__cat-view-all"
                        onClick={() => {
                          navigate("/products?productMode=combo");
                          setDrawerOpen(false);
                        }}
                        type="button"
                      >
                        View All →
                      </button>
                      <div className="drawer__cat-list-wrap">
                        <Categorylist
                          isMobile
                          onItemClick={() => {
                            setCategoryExpanded(false);
                            setDrawerOpen(false);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </li>

                <li className="drawer__nav-item">
                  <NavLink
                    className="drawer__nav-link"
                    to="/Favorites"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Wishlist
                  </NavLink>
                </li>

                <li className="drawer__nav-item">
                  <NavLink
                    className="drawer__nav-link"
                    to="/cart"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Bag {incart > 0 && `(${incart})`}
                  </NavLink>
                </li>

                <li className="drawer__nav-item drawer__nav-item--divider" />

                <li className="drawer__nav-item drawer__nav-item--section-label">
                  More
                </li>

                <li className="drawer__nav-item">
                  <NavLink
                    className="drawer__nav-link"
                    to="/bulkpurchase"
                    onClick={() => setDrawerOpen(false)}
                  >
                    📦 Bulk/Corporate Orders
                  </NavLink>
                </li>

                <li className="drawer__nav-item">
                  <NavLink
                    className="drawer__nav-link"
                    to="/internationalpurchase"
                    onClick={() => setDrawerOpen(false)}
                  >
                    🌐 International Purchase
                  </NavLink>
                </li>

                {userInfo && (
                  <li
                    className="drawer__nav-item drawer__nav-item--logout"
                    onClick={onOpen}
                  >
                    Logout
                  </li>
                )}

                {!userInfo && (
                  <li className="drawer__nav-item">
                    <NavLink
                      className="drawer__nav-link"
                      to="/login"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Sign In
                    </NavLink>
                  </li>
                )}
              </ul>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </header>

      {/* Offer Banner */}
      {!shouldHideBanner && (
        <div className="promo-strip">
          <div className="promo-strip__track">
            {banner
              ? `${banner.offerText} • ${banner.offerText} • ${banner.offerText}`
              : "Stay tuned for exciting offers! • Stay tuned for exciting offers! • Stay tuned for exciting offers!"}
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
