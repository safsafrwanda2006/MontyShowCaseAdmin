import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Products.css";
import { backendURL } from "../App.jsx";
import { singleBackendURL } from "../App.jsx";

function Products({ setCurrentPage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const fetchProduts = async () => {
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
    fetchProduts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) return;
    try {
      const result = await axios.delete(`${backendURL}/products/${id}`);
      console.log(result.data);
      fetchProduts();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="products-container">
      <div className="products">
        {loading ? (
          <div className="loading">
            <div className="loadingcard">
              <img src="/icons/product.png" alt="" />
              <div className="title-desc-loading">
                <h2></h2>
                <h3></h3>
              </div>
              <div className="price-type-loading">
                <h2></h2>
                <h2></h2>
              </div>
              <div className="action-btns-loading">
                <button></button>
                <button></button>
              </div>
            </div>
            <div className="loadingcard">
              <img src="/icons/product.png" alt="" />
              <div className="title-desc-loading">
                <h2></h2>
                <h3></h3>
              </div>
              <div className="price-type-loading">
                <h2></h2>
                <h2></h2>
              </div>
              <div className="action-btns-loading">
                <button></button>
                <button></button>
              </div>
            </div>
            <div className="loadingcard">
              <img src="/icons/product.png" alt="" />
              <div className="title-desc-loading">
                <h2></h2>
                <h3></h3>
              </div>
              <div className="price-type-loading">
                <h2></h2>
                <h2></h2>
              </div>
              <div className="action-btns-loading">
                <button></button>
                <button></button>
              </div>
            </div>
          </div>
        ) : products.length > 0 ? (
          products.map((items) => (
            <div
            key={items.id}
             className="product-card">
              {editId === items.id ? (
                <div className="editImage">
                  <img
                    className="product-image"
                    loading="lazy"
                    decoding="async"
                    src={items.image}
                    alt=""
                  />
                  <button className="upload-image">
                    <img src="/icons/photo.png" alt="" />
                  </button>
                </div>
              ) : (
                <img
                  className="product-image"
                  loading="lazy"
                  decoding="async"
                  src={items.image}
                  alt=""
                />
              )}

              {editId == items.id ? (
                <div className="name-desc-block-edit">
                  <input value={items.name} type="text" />
                  <textarea
                    value={items.description}
                    name="description"
                    id="description"
                  ></textarea>
                </div>
              ) : (
                <div className="name-desc-block">
                  <h1>{items.name}</h1>
                  <h3>{items.description}</h3>
                </div>
              )}
              {editId === items.id ? (
                <div className="price-type-block-edit">
                  <input value={items.price} type="number" name="" id="" />
                  <select name="" id="">
                    <option value={items.type}>{items.type}</option>
                    <option value="">second</option>
                    <option value="">third</option>
                  </select>
                </div>
              ) : (
                <div className="price-type-block">
                  <h3>{items.price} : السعر</h3>
                  <h3> {items.type} : النوع</h3>
                </div>
              )}
              {editId === items.id ? (
                <div className="actions-block">
                  <button className="edit">حفظ</button>
                  <button onClick={() => setEditId(null)} className="delete">
                    إلغاء
                  </button>
                </div>
              ) : (
                <div className="actions-block">
                  <button onClick={() => setEditId(items.id)} className="edit">
                    تعديل / تحديث
                  </button>
                  <button
                    onClick={() => deleteProduct(items.id)}
                    className="delete"
                  >
                    حذف
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-products">
            <button
              className="link-btn"
              onClick={() => setCurrentPage("addproduct")}
            >
              أضف منتج الآن
            </button>{" "}
            لا توجد منتجات مضافة حتى الآن.
          </div>
        )}
      </div>
      <div className="to-add-product-button">
        <button
          onClick={() => setCurrentPage("addproduct")}
          className="to-add-product-button"
        >
          {" "}
          <h2>إضافة منتج</h2>
          <img src="/icons/add-product.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Products;
