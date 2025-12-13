import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { withdrawRequest } from "../actions/transactionActions";
import { useDispatch, useSelector } from "react-redux";

const WithdrawModal = ({ show, handleClose, orderId, currentBalance }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.deliveryWithdraw);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) > currentBalance) {
      setError("Amount exceeds your current balance");
      return;
    }
    dispatch(withdrawRequest(parseFloat(amount), orderId));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Request Withdrawal</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount to withdraw"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
            />
          </Form.Group>
          <div className="mt-2">
            <strong>Available Balance:</strong> ${currentBalance.toFixed(2)}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit Request"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default WithdrawModal;
