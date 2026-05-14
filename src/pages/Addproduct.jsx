import React, { useState } from "react";
import "./Addproduct.css";
import axios from "axios";
import { backendURL } from "../App.jsx";
// every text must be in Arabic
function AddProduct({ setCurrentPage }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    type: "",
    instouck: "",
    classification: "",
    description: "",
  });
  

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [DoneMessage, SetDoneMessage] = useState(false);

  // Handle text/select inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload
  const imageChange = (e) => {
    const imageFile = e.target.files[0];

    setImage(imageFile);
    setPreview(URL.createObjectURL(imageFile));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    data.append("name", form.name);
    data.append("price", form.price);
    data.append("type", form.type);
    data.append("instouck", form.instouck);
    data.append("classification", form.classification);
    data.append("description", form.description);

    if (image) {
      data.append("image", image);
    }

    try {
      const result = await axios.post(`${backendURL}/products/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      SetDoneMessage(true);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setForm({
        name: "",
        price: "",
        type: "",
        instouck: "",
        classification: "",
        description: "",
      });
      setImage(null);
      setPreview("");
    }
  };

  return (
    <div className="addproduct-container">
      <button onClick={() => setCurrentPage("products")} className="back-btn">
        <img src="/icons/left.png" alt="" />
      </button>
      {DoneMessage && (
        <div className="done-message">تم إضافة المنتج بنجاح!</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="img-upload">
          <label htmlFor="uploadimage">
            {preview ? (
              <img src={preview} alt="Preview" className="preview-image" />
            ) : (
              "اضغط لرفع صورة المنتج"
            )}
          </label>

          <input
            type="file"
            name="image"
            id="uploadimage"
            required
            accept="image/*"
            onChange={imageChange}
          />
        </div>

        <div className="form-components">
          <div className="input-column">
            <label htmlFor="productName">اسم المنتج</label>

            <input
              type="text"
              name="name"
              id="productName"
              required
              placeholder="أدخل اسم المنتج"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-column">
            <label htmlFor="desc">وصف المنتج</label>

            <textarea
              placeholder="أدخل وصف المنتج"
              name="description"
              id="desc"
              required
              value={form.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="input-line">
            <div className="input-column">
              <label htmlFor="price">السعر</label>

              <input
                type="number"
                name="price"
                placeholder="أدخل السعر"
                id="price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-column">
              <label htmlFor="instock">الكمية المتوفرة</label>

              <input
                type="number"
                name="instouck"
                id="instock"
                placeholder="أدخل الكمية"
                value={form.instouck}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-line">
            <div className="input-column">
              <label htmlFor="productType">نوع المنتج</label>

              <select
                name="type"
                id="productType"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">اختر النوع</option>
                <option value="normal">عادي</option>
                <option value="featured">مميز</option>
                <option value="new">جديد</option>
                <option value="onepiece">قطعة واحدة</option>
              </select>
            </div>

            <div className="input-column">
              <label htmlFor="classification">تصنيف المنتج</label>

              <select
                name="classification"
                id="classification"
                value={form.classification}
                onChange={handleChange}
                required
              >
                <option value="">اختر التصنيف</option>
                <option value="pants">بناطيل</option>
                <option value="shirt">قمصان</option>
                <option value="shoes">أحذية</option>
                <option value="tshirt">تي شيرت</option>
                <option value="fulldress">قيار كامل</option>
                <option value="other">أخرى </option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "جاري الإضافة..." : "إضافة المنتج"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
