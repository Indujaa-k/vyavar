import { useState } from "react";
import "./BulkPurchase.css";

const timeSlots = ["Mon-Sat (9:00 AM – 6:30 PM)", "Sunday (9:00 AM – 6:30 PM)"];

const EMPTY_FORM = {
  firstName: "",
  email: "",
  phone: "",
  preferredTime: "",
  gender: "",
  dobMM: "",
  dobDD: "",
  dobYYYY: "",
  companyName: "",
  message: "",
};

const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const days = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export default function BulkPurchase() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.phone.trim()) errs.phone = "Phone number is required.";
    if (!form.preferredTime)
      errs.preferredTime = "Please select a preferred call time.";
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
      const res = await fetch("/api/enquiry/bulk", {
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
    <div className="bulk-page">
      {/* Background decorations */}
      <div className="bulk-deco bulk-deco--circle1" />
      <div className="bulk-deco bulk-deco--circle2" />
      <div className="bulk-deco bulk-deco--line" />

      <div className="bulk-container">
        {/* Left panel */}
        <div className="bulk-panel">
          <div className="bulk-panel__badge">📦 Bulk Orders</div>
          <h1 className="bulk-panel__title">
            Buy More,
            <br />
            Save More.
          </h1>
          <p className="bulk-panel__desc">
            Looking to order in large quantities for your business, team, or
            event? We offer exclusive pricing and dedicated support for bulk
            buyers. Share your details and we'll call you at your convenience.
          </p>
          <ul className="bulk-panel__perks">
            <li className="bulk-perk">
              <span className="bulk-perk__icon">✓</span>
              Exclusive wholesale pricing
            </li>
            <li className="bulk-perk">
              <span className="bulk-perk__icon">✓</span>
              Dedicated account manager
            </li>
            <li className="bulk-perk">
              <span className="bulk-perk__icon">✓</span>
              Priority dispatch & delivery
            </li>
            <li className="bulk-perk">
              <span className="bulk-perk__icon">✓</span>
              Custom branding options
            </li>
          </ul>
        </div>

        {/* Right form */}
        <div className="bulk-form-wrap">
          {submitted ? (
            <div className="bulk-success">
              <div className="bulk-success__ring">
                <span className="bulk-success__check">✓</span>
              </div>
              <h2 className="bulk-success__title">We've Got Your Enquiry!</h2>
              <p className="bulk-success__msg">
                Our bulk sales team will call you during your preferred time
                slot. Keep an eye on your inbox too!
              </p>
              <button
                className="bulk-btn bulk-btn--outline"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form className="bulk-form" onSubmit={handleSubmit} noValidate>
              <div className="bulk-form__header">
                <h2 className="bulk-form__title">
                  Bulk/Corporate Order Enquiery
                </h2>
                <p className="bulk-form__sub">
                  Fields marked <span className="bulk-req">*</span> are
                  required.
                </p>
              </div>

              {/* First Name */}
              <div className="bulk-field">
                <label className="bulk-label">
                  First Name <span className="bulk-req">*</span>
                </label>
                <input
                  className={`bulk-input ${errors.firstName ? "bulk-input--err" : ""}`}
                  type="text"
                  name="firstName"
                  placeholder="e.g. Arjun"
                  value={form.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="bulk-err-msg">{errors.firstName}</p>
                )}
              </div>

              {/* Email */}
              <div className="bulk-field">
                <label className="bulk-label">
                  Email <span className="bulk-req">*</span>
                </label>
                <input
                  className={`bulk-input ${errors.email ? "bulk-input--err" : ""}`}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="bulk-err-msg">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="bulk-field">
                <label className="bulk-label">
                  Phone <span className="bulk-req">*</span>
                </label>
                <input
                  className={`bulk-input ${errors.phone ? "bulk-input--err" : ""}`}
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="bulk-err-msg">{errors.phone}</p>}
              </div>

              {/* Preferred Call Time */}
              <div className="bulk-field">
                <label className="bulk-label">
                  Phone Call Preferred Time <span className="bulk-req">*</span>
                </label>
                <select
                  className={`bulk-select ${errors.preferredTime ? "bulk-input--err" : ""}`}
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={handleChange}
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.preferredTime && (
                  <p className="bulk-err-msg">{errors.preferredTime}</p>
                )}
              </div>

              {/* Gender (Optional) */}
              <div className="bulk-field">
                <label className="bulk-label">
                  Gender <span className="bulk-opt">(Optional)</span>
                </label>
                <div className="bulk-radio-row">
                  {["Male", "Female", "Others"].map((g) => (
                    <label key={g} className="bulk-radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange}
                        className="bulk-radio-input"
                      />
                      <span className="bulk-radio-dot" />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              {/* Birthday (Optional) */}
              <div className="bulk-field">
                <label className="bulk-label">
                  Birthday <span className="bulk-opt">(Optional)</span>
                </label>
                <div className="bulk-date-row">
                  <select
                    className="bulk-select bulk-select--sm"
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
                  <select
                    className="bulk-select bulk-select--sm"
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
                  <select
                    className="bulk-select bulk-select--md"
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

              {/* Company Name (Optional) */}
              <div className="bulk-field">
                <label className="bulk-label">
                  Company Name <span className="bulk-opt">(Optional)</span>
                </label>
                <input
                  className="bulk-input"
                  type="text"
                  name="companyName"
                  placeholder="Your company or organisation"
                  value={form.companyName}
                  onChange={handleChange}
                />
              </div>

              {/* Message (Optional) */}
              <div className="bulk-field">
                <label className="bulk-label">
                  Message <span className="bulk-opt">(Optional)</span>
                </label>
                <textarea
                  className="bulk-textarea"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your requirements…"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              {serverError && (
                <p className="bulk-err-msg bulk-err-msg--server">
                  {serverError}
                </p>
              )}
              <button
                type="submit"
                className="bulk-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Submit Enquiry →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
