import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../actions/userActions";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resetState = useSelector((state) => state.resetPassword);
  const { loading, error, success, message } = resetState;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const otpParam = params.get("otp");

    if (emailParam) setEmail(emailParam);
    if (otpParam) setOtp(otpParam);
  }, [location]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(resetPassword(email, otp, newPassword));
  };

  useEffect(() => {
    if (success) {
      // Optionally redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [success, navigate]);

  return (
    <div className="registerSc">
      <div className="containera">
        <div className="login-content">
          <form onSubmit={submitHandler}>
            <h1>Reset Password</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{message}</p>}

            <div className="form-row">
              <label>Email:</label>
              <input
                type="email"
                className="inputa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <label>OTP:</label>
              <input
                type="text"
                className="inputa"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <label>New Password:</label>
              <input
                type="password"
                className="inputa"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <input type="submit" className="btna" value="Reset Password" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
