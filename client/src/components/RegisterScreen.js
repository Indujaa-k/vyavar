import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, register } from "../actions/userActions";
import { Helmet } from "react-helmet";
import { useToast } from "@chakra-ui/react";
import Trust from "../components/Trustdetails/Trust";
import "./Registerscreen.css";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading: otpLoading, success: otpSentSuccess } = useSelector(
    (state) => state.sendOtp
  );

  const {
    loading: verifyLoading,
    success: otpVerifySuccess,
    error: otpVerifyError,
  } = useSelector((state) => state.verifyOtp);

  const { error, userInfo } = useSelector((state) => state.userRegister);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  // ---------- Handle Send OTP ----------
  const handleSendOtp = () => {
    if (!email) {
      toast({
        title: "Enter your email first!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    dispatch(sendOtp(email));
  };

  // ---------- When OTP sent successfully ----------
  useEffect(() => {
    if (otpSentSuccess) {
      setOtpSent(true);
      toast({
        title: "OTP Sent!",
        description: "Check your email for the OTP.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [otpSentSuccess, toast]);

  // ---------- Handle Verify OTP ----------
  const handleVerifyOtp = () => {
    if (!otp) {
      toast({
        title: "Enter OTP first!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // ✅ Call only once
    dispatch(verifyOtp(email, otp))
      .then(() => {
        setOtpVerified(true);
        toast({
          title: "OTP Verified Successfully!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Invalid OTP",
          description: otpVerifyError || "Please try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  // ---------- Handle Registration ----------
  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!otpVerified) {
      toast({
        title: "OTP not verified",
        description: "Please verify OTP before registration.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    dispatch(register(name, email, password));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="registerSc">
        <Helmet>
          <title>Register</title>
        </Helmet>

        <div className="containera">
          <div className="login-content">
            <form onSubmit={handleRegister}>
              <h1>Create Account</h1>
              {error && <h4 style={{ color: "red" }}>{error}</h4>}
              {otpVerifyError && (
                <h4 style={{ color: "red" }}>{otpVerifyError}</h4>
              )}
              <div className="form-row">
                <label>Name:</label>
                <input
                  type="text"
                  value={name}
                  className="inputa"
                  placeholder="Enter name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  className="inputa"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent} // prevent editing after OTP sent
                />
              </div>
              <div className="form-row">
                <label>Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="inputa"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label>Confirm Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  className="inputa"
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "50px",
                    top: "45%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              <button
                className="btna2"
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || otpSent}
              >
                {otpLoading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
              </button>
              {otpSent && (
                <div
                  style={{
                    marginLeft: "50px",
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    height: "50px",
                  }}
                >
                  <input
                    type="text"
                    value={otp}
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={otpVerified}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyLoading || otpVerified}
                  >
                    {otpVerified
                      ? "Verified ✅"
                      : verifyLoading
                      ? "Verifying..."
                      : "Verify"}
                  </button>
                </div>
              )}
              <input
                type="submit"
                className="btna2"
                value="Sign up"
                disabled={!otpVerified}
              />
              <br />
              Have an Account?{" "}
              <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                Login
              </Link>
            </form>
          </div>
        </div>
      </div>
      <Trust />
    </>
  );
};

export default RegisterScreen;
