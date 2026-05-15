import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Products.css";
import { backendURL } from "../App.jsx";

function Products({ setCurrentPage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  
  // الـ state الخاص ببيانات الحقول النصية للتعديل
  const [form, setForm] = useState({
    name: "",
    price: "",
    type: "",
    instouck: "",
    classification: "",
    description: "",
  });

  // الـ state الخاص بالصورة المرفوعة ومعاينتها أثناء التعديل
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // جلب المنتجات من الخلفية
  const fetchProducts = async () => {
    try {
      const result = await axios.get(`${backendURL}/products`);
      setProducts(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // حذف المنتج
  const deleteProduct = async (id) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) return;
    try {
      await axios.delete(`${backendURL}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // عند الضغط على "تعديل": يتم ملء الفورم بالبيانات الحالية للمنتج
  const handleEditClick = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      price: item.price || "",
      type: item.type || "",
      instouck: item.instouck || "",
      classification: item.classification || "",
      description: item.description || "",
    });
    setEditPreview(item.image || ""); // عرض الصورة الحالية كمعاينة مبدئية
    setEditImage(null); // إعادة تعيين ملف الصورة الجديد
  };

  // التعامل مع تغيير الحقول النصية والقوائم
  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // التعامل مع تغيير واختيار الصورة الجديدة
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      setEditImage(imageFile);
      setEditPreview(URL.createObjectURL(imageFile)); // تحديث المعاينة فوراً
    }
  };

  // إرسال التحديثات باستخدام FormData لمنع خطأ 400
  const editProduct = async (id) => {
    setSubmitLoading(true);
    const data = new FormData();

    data.append("name", form.name);
    data.append("price", form.price);
    data.append("type", form.type);
    data.append("instouck", form.instouck);
    data.append("classification", form.classification);
    data.append("description", form.description);

    // نرسل الصورة فقط إذا قام المسؤول باختيار صورة جديدة
    if (editImage) {
      data.append("image", editImage);
    }

    try {
      const result = await axios.put(`${backendURL}/products/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("تم التحديث بنجاح:", result.data);
      setEditId(null); // إغلاق وضع التعديل
      fetchProducts(); // تحديث القائمة
    } catch (error) {
      console.log("خطأ في التحديث:", error.response?.data || error.message);
      alert("حدث خطأ أثناء تحديث المنتج، يرجى التحقق من البيانات.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="products-container">
      <div className="products">
        {loading ? (
          <div className="loading">
            {[1, 2, 3].map((n) => (
              <div key={n} className="loadingcard">
                <div className="shimmer-img"></div>
                <div className="title-desc-loading"><h2></h2><h3></h3></div>
                <div className="price-type-loading"><h2></h2><h2></h2></div>
                <div className="action-btns-loading"><button></button><button></button></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          products.map((items) => (
            <div key={items.id} className={`product-card ${editId === items.id ? "editing" : ""}`}>
              
              {/* قسم الصورة والمعاينة */}
              <div className="image-section">
                <img
                  className="product-image"
                  loading="lazy"
                  src={editId === items.id ? editPreview : items.image}
                  alt={items.name}
                />
                {editId === items.id && (
                  <label htmlFor={`edit-upload-${items.id}`} className="upload-image-btn">
                    <img src="/icons/photo.png" alt="رفع" />
                    <span>تغيير الصورة</span>
                    <input
                      type="file"
                      id={`edit-upload-${items.id}`}
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              {/* قسم تفاصيل المنتج / حقول التعديل */}
              <div className="details-section">
                {editId === items.id ? (
                  <div className="edit-grid">
                    <div className="input-group">
                      <label>اسم المنتج</label>
                      <input type="text" name="name" value={form.name} onChange={handleInputChange} required />
                    </div>
                    
                    <div className="input-group">
                      <label>تصنيف المنتج</label>
                      <select name="classification" value={form.classification} onChange={handleInputChange} required>
                        <option value="">اختر التصنيف</option>
                        <option value="pants">بناطيل</option>
                        <option value="shirt">قمصان</option>
                        <option value="shoes">أحذية</option>
                        <option value="tshirt">تي شيرت</option>
                        <option value="fulldress">قيار كامل</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>السعر</label>
                      <input type="number" name="price" value={form.price} onChange={handleInputChange} required />
                    </div>

                    <div className="input-group">
                      <label>نوع المنتج</label>
                      <select name="type" value={form.type} onChange={handleInputChange} required>
                        <option value="">اختر النوع</option>
                        <option value="normal">عادي</option>
                        <option value="featured">مميز</option>
                        <option value="new">جديد</option>
                        <option value="onepiece">قطعة واحدة</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>الكمية المتوفرة</label>
                      <input type="number" name="instouck" value={form.instouck} onChange={handleInputChange} required />
                    </div>

                    <div className="input-group full-width">
                      <label>وصف المنتج</label>
                      <textarea name="description" rows="2" value={form.description} onChange={handleInputChange} required></textarea>
                    </div>
                  </div>
                ) : (
                  <div className="view-details">
                    <div className="header-details">
                      <h1 className="product-title">{items.name}</h1>
                      <span className="badge-classification">
                        {items.classification === "pants" && "بناطيل"}
                        {items.classification === "shirt" && "قمصان"}
                        {items.classification === "shoes" && "أحذية"}
                        {items.classification === "tshirt" && "تي شيرت"}
                        {items.classification === "fulldress" && "قيار كامل"}
                        {items.classification === "other" && "أخرى"}
                        {!items.classification && "غير مصنف"}
                      </span>
                    </div>
                    
                    <p className="product-description">{items.description || "لا يوجد وصف لهذا المنتج."}</p>
                    
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">السعر:</span>
                        <span className="info-value price">{items.price} ج.س</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">النوع:</span>
                        <span className="info-value">
                          {items.type === "normal" && "عادي"}
                          {items.type === "featured" && "مميز"}
                          {items.type === "new" && "جديد"}
                          {items.type === "onepiece" && "قطعة واحدة"}
                          {!items.type && "N/A"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">المخزون:</span>
                        <span className={`info-value stock ${Number(items.instouck) > 0 ? "in-stock" : "out-of-stock"}`}>
                          {items.instouck || 0} قطعة
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* أزرار التحكم والعمليات */}
              <div className="actions-section">
                {editId === items.id ? (
                  <>
                    <button onClick={() => editProduct(items.id)} className="btn-save" disabled={submitLoading}>
                      {submitLoading ? "جاري الحفظ..." : "حفظ"}
                    </button>
                    <button onClick={() => setEditId(null)} className="btn-cancel" disabled={submitLoading}>
                      إلغاء
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(items)} className="btn-edit">
                      تعديل / تحديث
                    </button>
                    <button onClick={() => deleteProduct(items.id)} className="btn-delete">
                      حذف
                    </button>
                  </>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="no-products">
            لا توجد منتجات مضافة حتى الآن.
            <button className="link-btn" onClick={() => setCurrentPage("addproduct")}>
              أضف منتج الآن
            </button>
          </div>
        )}
      </div>

      <div className="floating-add-container">
        <button onClick={() => setCurrentPage("addproduct")} className="floating-add-btn">
          <h2>إضافة منتج</h2>
          <img src="/icons/add-product.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Products;