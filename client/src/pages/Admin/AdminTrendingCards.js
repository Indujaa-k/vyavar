import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./AdminTrendingCards.css";

const API = process.env.REACT_APP_API_URL;

const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return userInfo?.token;
};

const AdminTrendingCards = () => {
  const [cards, setCards] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("Men");
  const [order, setOrder] = useState(0);
  const [categoryMap, setCategoryMap] = useState({});
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [existingMedia, setExistingMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const pendingEdit = useRef(null); // holds category/subcategory while categories load
  const formRef = useRef(null);
  const authHeader = { Authorization: `Bearer ${getToken()}` };

  const loadCards = async () => {
    try {
      const { data } = await axios.get(`${API}/api/trending-cards`);
      setCards(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/api/products/categories?gender=${gender}`)
      .then((res) => {
        setCategoryMap(res.data);
        if (pendingEdit.current) {
          setCategory(pendingEdit.current.category);
          setSubcategory(pendingEdit.current.subcategory);
          pendingEdit.current = null;
        } else {
          setCategory("");
          setSubcategory("");
        }
      })
      .catch((err) => console.error(err));
  }, [gender]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const resetForm = () => {
    setFile(null);
    setPreview("");
    setTitle("");
    setCategory("");
    setSubcategory("");
    setOrder(0);
    setEditingId(null);
    setExistingMedia(null);
    formRef.current?.reset();
  };

  const startEdit = (c) => {
    const query = new URLSearchParams((c.link || "").split("?")[1] || "");
    const cat = query.get("category") || "";
    const sub = query.get("subcategory") || "";

    setEditingId(c._id);
    setExistingMedia({ url: c.mediaUrl, type: c.mediaType });
    setTitle(c.title);
    setOrder(c.order);
    setFile(null);
    setPreview("");
    setMessage("");

    if (c.gender === gender) {
      setCategory(cat);
      setSubcategory(sub);
    } else {
      pendingEdit.current = { category: cat, subcategory: sub };
      setGender(c.gender);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // file is required only when creating
    if ((!editingId && !file) || !title || !category) {
      setMessage("Please choose a file, title and category");
      return;
    }

    const link =
      `/products?gender=${gender}&category=${encodeURIComponent(category)}` +
      (subcategory ? `&subcategory=${encodeURIComponent(subcategory)}` : "");

    const formData = new FormData();
    if (file) formData.append("media", file);
    formData.append("title", title);
    formData.append("link", link);
    formData.append("gender", gender);
    formData.append("order", order);

    try {
      setLoading(true);
      setMessage("");
      const config = {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
      };

      if (editingId) {
        await axios.put(`${API}/api/trending-cards/${editingId}`, formData, config);
        setMessage("✅ Card updated");
      } else {
        await axios.post(`${API}/api/trending-cards`, formData, config);
        setMessage("✅ Card uploaded");
      }

      resetForm();
      loadCards();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card?")) return;
    try {
      await axios.delete(`${API}/api/trending-cards/${id}`, { headers: authHeader });
      if (editingId === id) resetForm();
      loadCards();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    }
  };

  const isVideo = file?.type?.startsWith("video");

  return (
    <div className="atc-page">
      <h2>Trending / Embroidery Cards</h2>

      <form className="atc-form" onSubmit={handleSubmit} ref={formRef}>
        <h3>{editingId ? "Edit Card" : "Add New Card"}</h3>

        <label>
          Image or Video {editingId && "(leave empty to keep current)"}
        </label>
        <input
          type="file"
          accept="image/*,video/mp4,video/webm"
          onChange={handleFile}
        />

        {preview ? (
          isVideo ? (
            <video src={preview} controls className="atc-preview" />
          ) : (
            <img src={preview} alt="preview" className="atc-preview" />
          )
        ) : (
          existingMedia &&
          (existingMedia.type === "video" ? (
            <video src={`${API}/${existingMedia.url}`} controls className="atc-preview" />
          ) : (
            <img src={`${API}/${existingMedia.url}`} alt="current" className="atc-preview" />
          ))
        )}

        <label>Title</label>
        <input
          type="text"
          placeholder="The Man"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
        </select>

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory("");
          }}
        >
          <option value="">Select category</option>
          {Object.keys(categoryMap).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Subcategory</label>
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          disabled={!category}
        >
          <option value="">All {category || ""}</option>
          {(categoryMap[category] || []).map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        <label>Order (1 shows first)</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update Card" : "Upload Card"}
        </button>
        {editingId && (
          <button type="button" className="atc-cancel" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
        {message && <p className="atc-message">{message}</p>}
      </form>

      <h3>Existing Cards</h3>
      <div className="atc-list">
        {cards.map((c) => (
          <div className="atc-item" key={c._id}>
            {c.mediaType === "video" ? (
              <video src={`${API}/${c.mediaUrl}`} muted />
            ) : (
              <img src={`${API}/${c.mediaUrl}`} alt={c.title} />
            )}
            <div className="atc-info">
              <strong>{c.title}</strong>
              <small>{c.link}</small>
              <small>
                {c.gender} · order {c.order}
              </small>
            </div>
            <button className="atc-edit" onClick={() => startEdit(c)}>
              Edit
            </button>
            <button onClick={() => handleDelete(c._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTrendingCards;