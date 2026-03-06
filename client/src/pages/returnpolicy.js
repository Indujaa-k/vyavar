import React from "react";
import "./ReturnPolicy.css";

const returnPolicy = {
  instructions:
    "If you need to return a product, please follow the steps below.",
  email: "viyavarfashions@gmail.com",
  methodsToRequestReturn: [
    {
      type: "email",
      description:
        "Send an email explaining the reason for return to our support team.",
      requiredDetails: [
        "Order ID",
        "Product Name",
        "Reason for Return",
        "Attach images showing the issue (if any)",
      ],
      acceptableReasons: ["Manufacturing defect", "Size mismatch"],
    },
    {
      type: "call",
      description:
        "You can call our customer service to enquire about the return process.",
      contactNumber: "+91-6383532399",
    },
  ],
  notes: [
    "All return requests must be accompanied by images showing the issue.",
    "Returns will be accepted only for manufacturing defects or size mismatch.",
    "Ensure you provide accurate details in your return request to avoid delays.",
  ],
  processingTime:
    "Once your request is received, we will process it within 7-10 business days.",
};

const ReturnPolicy = () => {
  return (
    <div className="policy-wrapper">
      <h1 className="policy-title">Return Policy</h1>

      <section className="policy-section">
        <p className="policy-text">{returnPolicy.instructions}</p>
        <p className="policy-text">
          📧 Email:{" "}
          <a href={`mailto:${returnPolicy.email}`}>{returnPolicy.email}</a>
        </p>
      </section>

      {returnPolicy.methodsToRequestReturn.map((method, idx) => (
        <section key={idx} className="policy-section">
          <h2 className="policy-subtitle">
            Method: {method.type.toUpperCase()}
          </h2>
          <p className="policy-text">{method.description}</p>

          {method.requiredDetails && (
            <>
              <h3 className="policy-subsubtitle">Required Details:</h3>
              <ul className="policy-list">
                {method.requiredDetails.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {method.acceptableReasons && (
            <p className="policy-text">
              Acceptable Reasons: {method.acceptableReasons.join(", ")}
            </p>
          )}

          {method.contactNumber && (
            <p className="policy-text">📞 Contact: {method.contactNumber}</p>
          )}
        </section>
      ))}

      <section className="policy-section">
        <h2 className="policy-subtitle">Notes</h2>
        <ul className="policy-list">
          {returnPolicy.notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="policy-section">
        <p className="policy-text">
          <strong>Processing Time:</strong> {returnPolicy.processingTime}
        </p>
      </section>
    </div>
  );
};

export default ReturnPolicy;
