import { useState } from "react";
import "./InternationalPurchase.css";

const EMPTY_FORM = {
  firstName: "",
  email: "",
  phone: "",
  dobMM: "",
  dobDD: "",
  dobYYYY: "",
  gender: "",
};

const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const days = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export default function InternationalPurchase() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", dob: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.phone.trim()) errs.phone = "Phone number is required.";
    if (!form.dobMM || !form.dobDD || !form.dobYYYY)
      errs.dob = "Please complete your birthdate.";
    if (!form.gender) errs.gender = "Please select your gender.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/enquiry/international", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setServerError(err.message || "Failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="intl-page">
      {/* Background mesh */}
      <div className="intl-mesh" />
      <div className="intl-glow intl-glow--top" />
      <div className="intl-glow intl-glow--bottom" />

      <div className="intl-container">
        {/* Top hero strip */}
        <div className="intl-hero">
          <div className="intl-hero__globe">🌐</div>
          <div className="intl-hero__text">
            <span className="intl-hero__eyebrow">Worldwide Shipping</span>
            <h1 className="intl-hero__title">International Purchase</h1>
            <p className="intl-hero__desc">
              We ship across the globe. Share a few details below and our
              international team will get in touch with pricing, shipping
              estimates, and customs guidance specific to your country.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="intl-card">
          {submitted ? (
            <div className="intl-success">
              <div className="intl-success__orbit">
                <span className="intl-success__icon">✓</span>
              </div>
              <h2 className="intl-success__title">Enquiry Submitted!</h2>
              <p className="intl-success__msg">
                Thank you! Our international team will reach out to you shortly
                with all the information you need to complete your purchase.
              </p>
              <button
                className="intl-btn intl-btn--ghost"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form className="intl-form" onSubmit={handleSubmit} noValidate>
              <div className="intl-form__header">
                <h2 className="intl-form__title">Your Details</h2>
                <p className="intl-form__note">
                  All fields are required for international orders.
                </p>
              </div>

              {/* Two-column grid for name + email */}
              <div className="intl-grid-2">
                {/* First Name */}
                <div className="intl-field">
                  <label className="intl-label">
                    First Name <span className="intl-req">*</span>
                  </label>
                  <input
                    className={`intl-input ${errors.firstName ? "intl-input--err" : ""}`}
                    type="text"
                    name="firstName"
                    placeholder="e.g. Sarah"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <p className="intl-err">{errors.firstName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="intl-field">
                  <label className="intl-label">
                    Email <span className="intl-req">*</span>
                  </label>
                  <input
                    className={`intl-input ${errors.email ? "intl-input--err" : ""}`}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="intl-err">{errors.email}</p>}
                </div>
              </div>

              {/* Phone */}
              <div className="intl-field">
                <label className="intl-label">
                  Phone <span className="intl-req">*</span>
                </label>
                <input
                  className={`intl-input ${errors.phone ? "intl-input--err" : ""}`}
                  type="tel"
                  name="phone"
                  placeholder="+1 555 000 0000"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="intl-err">{errors.phone}</p>}
              </div>

              {/* Birthdate */}
              <div className="intl-field">
                <label className="intl-label">
                  Birthdate <span className="intl-req">*</span>
                </label>
                <div className="intl-date-row">
                  <div className="intl-date-slot">
                    <span className="intl-date-slot__label">Month</span>
                    <select
                      className={`intl-select ${errors.dob ? "intl-input--err" : ""}`}
                      name="dobMM"
                      value={form.dobMM}
                      onChange={handleChange}
                    >
                      <option value="">MM</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="intl-date-slot">
                    <span className="intl-date-slot__label">Day</span>
                    <select
                      className={`intl-select ${errors.dob ? "intl-input--err" : ""}`}
                      name="dobDD"
                      value={form.dobDD}
                      onChange={handleChange}
                    >
                      <option value="">DD</option>
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="intl-date-slot intl-date-slot--wide">
                    <span className="intl-date-slot__label">Year</span>
                    <select
                      className={`intl-select ${errors.dob ? "intl-input--err" : ""}`}
                      name="dobYYYY"
                      value={form.dobYYYY}
                      onChange={handleChange}
                    >
                      <option value="">YYYY</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.dob && <p className="intl-err">{errors.dob}</p>}
              </div>

              {/* Gender */}
              <div className="intl-field">
                <label className="intl-label">
                  Gender <span className="intl-req">*</span>
                </label>
                <div className="intl-gender-row">
                  {["Male", "Female", "Others"].map((g) => (
                    <label
                      key={g}
                      className={`intl-gender-card ${form.gender === g ? "intl-gender-card--active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange}
                        className="intl-gender-input"
                      />
                      <span className="intl-gender-icon">
                        {g === "Male" ? "♂" : g === "Female" ? "♀" : "⚧"}
                      </span>
                      <span className="intl-gender-text">{g}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="intl-err">{errors.gender}</p>}
              </div>

              {serverError && (
                <p className="intl-err intl-err--server">{serverError}</p>
              )}
              <button
                type="submit"
                className="intl-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Submit International Enquiry →"}
              </button>
            </form>
          )}
        </div>

        {/* Bottom trust bar */}
        <div className="intl-trust">
          <div className="intl-trust__item">
            <span className="intl-trust__icon">🔒</span>
            <span>Secure & Private</span>
          </div>
          <div className="intl-trust__divider" />
          <div className="intl-trust__item">
            <span className="intl-trust__icon">⚡</span>
            <span>Fast Response</span>
          </div>
          <div className="intl-trust__divider" />
          <div className="intl-trust__item">
            <span className="intl-trust__icon">🌍</span>
            <span>Ships Worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
}
