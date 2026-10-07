import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./AdminShowcase.css";

const API = process.env.REACT_APP_API_URL;

const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return userInfo?.token;
};

const AdminShowcase = () => {
  const [showcases, setShowcases] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [existingBanner, setExistingBanner] = useState("");
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("Men");
  const [order, setOrder] = useState(1);
  const [categoryMap, setCategoryMap] = useState({});
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const pendingEdit = useRef(null);
  const formRef = useRef(null);
  const authHeader = { Authorization: `Bearer ${getToken()}` };

  const loadShowcases = async () => {
    try {
      const { data } = await axios.get(`${API}/api/showcases`);
      setShowcases(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadShowcases();
  }, []);

  // New showcase goes to the bottom by default
  useEffect(() => {
    if (!editingId) setOrder(showcases.length + 1);
  }, [showcases.length, editingId]);

  // categories for the chosen gender
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

  // products for the chosen filter
  useEffect(() => {
    if (!category) {
      setProducts([]);
      return;
    }
    let url = `${API}/api/products?gender=${gender}&category=${encodeURIComponent(
      category
    )}`;
    if (subcategory) url += `&subcategory=${encodeURIComponent(subcategory)}`;

    axios
      .get(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [gender, category, subcategory]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const toggleProduct = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllShown = () => {
    const ids = products.map((p) => p._id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const clearSelection = () => setSelectedIds([]);

  const resetForm = () => {
    setFile(null);
    setPreview("");
    setExistingBanner("");
    setTitle("");
    setCategory("");
    setSubcategory("");
    setSelectedIds([]);
    setEditingId(null);
    formRef.current?.reset();
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setExistingBanner(s.bannerUrl);
    setTitle(s.title || "");
    setOrder(s.order || 0);
    setSelectedIds((s.products || []).map((p) => p._id));
    setFile(null);
    setPreview("");
    setMessage("");

    if (s.gender === gender) {
      setCategory(s.category || "");
      setSubcategory(s.subcategory || "");
    } else {
      pendingEdit.current = {
        category: s.category || "",
        subcategory: s.subcategory || "",
      };
      setGender(s.gender);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((!editingId && !file) || !category) {
      setMessage("Please choose a banner image and a category");
      return;
    }
    if (selectedIds.length === 0) {
      setMessage("Please tick at least one product");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("banner", file);
    formData.append("title", title);
    formData.append("gender", gender);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("order", order);
    formData.append("products", JSON.stringify(selectedIds));

    try {
      setLoading(true);
      setMessage("");
      const config = {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
      };

      if (editingId) {
        await axios.put(`${API}/api/showcases/${editingId}`, formData, config);
        setMessage("✅ Showcase updated");
      } else {
        await axios.post(`${API}/api/showcases`, formData, config);
        setMessage("✅ Showcase created");
      }

      resetForm();
      loadShowcases();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this showcase?")) return;
    try {
      await axios.delete(`${API}/api/showcases/${id}`, { headers: authHeader });
      if (editingId === id) resetForm();
      loadShowcases();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    }
  };

  // Move a showcase up (-1) or down (+1) and save the new order
  const moveShowcase = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= showcases.length) return;

    const list = [...showcases];
    [list[index], list[target]] = [list[target], list[index]];

    try {
      await Promise.all(
        list.map((s, i) => {
          const fd = new FormData();
          fd.append("order", i + 1);
          return axios.put(`${API}/api/showcases/${s._id}`, fd, {
            headers: { ...authHeader, "Content-Type": "multipart/form-data" },
          });
        })
      );
      loadShowcases();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="asc-page">
      <h2>Category Banner + Products</h2>

      <form className="asc-form" onSubmit={handleSubmit} ref={formRef}>
        <h3>{editingId ? "Edit Showcase" : "Add New Showcase"}</h3>

        <label>
          Long Banner Image {editingId && "(leave empty to keep current)"}
        </label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {(preview || existingBanner) && (
          <img
            className="asc-banner-preview"
            src={preview || `${API}/${existingBanner}`}
            alt="banner"
          />
        )}

        <label>Title (optional)</label>
        <input
          type="text"
          placeholder="Tshirts"
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

        <div className="asc-products-head">
          <label>
            Select products to show under the banner ({selectedIds.length}{" "}
            selected)
          </label>
          <div>
            <button
              type="button"
              onClick={selectAllShown}
              disabled={!products.length}
            >
              Select all shown
            </button>
            <button type="button" onClick={clearSelection}>
              Clear
            </button>
          </div>
        </div>

        {!category && (
          <p className="asc-hint">Choose a category to load products.</p>
        )}
        {category && products.length === 0 && (
          <p className="asc-hint">No products found for this category.</p>
        )}

        <div className="asc-products">
          {products.map((p) => (
            <label
              key={p._id}
              className={`asc-product ${
                selectedIds.includes(p._id) ? "checked" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(p._id)}
                onChange={() => toggleProduct(p._id)}
              />
              <img src={`${API}/${p.images?.[0]}`} alt={p.brandname} />
              <div>
                <strong>{p.brandname}</strong>
                <small>{p.productdetails?.color}</small>
                <small>Rs. {p.price}</small>
              </div>
            </label>
          ))}
        </div>

        <button type="submit" className="asc-save" disabled={loading}>
          {loading
            ? "Saving..."
            : editingId
            ? "Update Showcase"
            : "Create Showcase"}
        </button>
        {editingId && (
          <button type="button" className="asc-cancel" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
        {message && <p className="asc-message">{message}</p>}
      </form>

      <h3>Existing Showcases</h3>
      <div className="asc-list">
        {showcases.map((s, index) => (
          <div className="asc-item" key={s._id}>
            <img src={`${API}/${s.bannerUrl}`} alt={s.title} />
            <div className="asc-info">
              <strong>{s.title || "(no title)"}</strong>
              <small>
                {s.gender} · {s.category}
                {s.subcategory ? ` · ${s.subcategory}` : ""}
              </small>
              <small>
                {s.products?.length || 0} products · position {index + 1}
              </small>
            </div>
            <button
              type="button"
              className="asc-move"
              onClick={() => moveShowcase(index, -1)}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              type="button"
              className="asc-move"
              onClick={() => moveShowcase(index, 1)}
              disabled={index === showcases.length - 1}
            >
              ↓
            </button>
            <button className="asc-edit" onClick={() => startEdit(s)}>
              Edit
            </button>
            <button className="asc-delete" onClick={() => handleDelete(s._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminShowcase;