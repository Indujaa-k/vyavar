import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const forgotPasswordState = useSelector((state) => state.forgotPassword);
  const { loading, error, success, message } = forgotPasswordState;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };
  useEffect(() => {
    if (success) {
      navigate(`/resetPassword`);
    }
  }, [success, email, navigate]);
  return (
    <div className="registerSc">
      <div className="containera">
        <div className="login-content">
          <form onSubmit={handleSubmit}>
            <h1>Forgot Password</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{message}</p>}
            <div className="form-row">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="inputa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input type="submit" className="btna" value="Send OTP" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
