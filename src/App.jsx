import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import Admins from "./pages/Admins.jsx";
import Products from "./pages/Products.jsx";
import AddProduct from './pages/Addproduct.jsx';
export const backendURL = import.meta.env.VITE_BACKEND_URL;
export const singleBackendURL = import.meta.env.VITE_SINGLE_BACKEND_URL;

// export const backendURL = "http://localhost:5001/api"
function App() {
  const [currentPage, setCurrentPage] = useState("products");
  const [sidmenu, setSidmenu] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    // localStorage.removeItem("token")
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(`${backendURL}/admin/login`, form);

      const userToken = result.data.token;

      setToken(userToken);

      localStorage.setItem("token", userToken);

      const decoded = jwtDecode(userToken);
      if (result.data.message === "Invalid email or password") {
        setLoginError(true);
        return;
      }

      setRole(decoded.role);
    } catch (error) {
      setLoginError(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSidmenu(false);
      }}
      className="container"
    >
      <div className="header">
        <div className="logo">
          <h2>
            <span className="monty">Monty</span> ShowCase{" "}
          </h2>
        </div>
        <h2 className="title">Admin Dashboard</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSidmenu((prev) => !prev);
          }}
          className="menu-btn"
        >
          <img src="/icons/menu.png" alt="" />
        </button>
      </div>
      {sidmenu && (
        <div onClick={(e) => e.stopPropagation()} className="navpar">
          <button onClick={() => setCurrentPage("products")}>المنتجات</button>
          <button onClick={() => setCurrentPage("addproduct")}>
            إضافة منتج{" "}
          </button>
          <button onClick={() => setCurrentPage("admins")}>
            إدارة المشرفين
          </button>
          <button onClick={logout}>تسجيل الخروج</button>
        </div>
      )}
      {token ? (
        <div className="container">
          {currentPage === "products" ? (
            <Products setCurrentPage={setCurrentPage} />
          ) : currentPage === "admins" ? (
            <Admins setCurrentPage={setCurrentPage} />
          ) : currentPage === "addproduct" ? (
            <AddProduct setCurrentPage={setCurrentPage} />
          ) : (
            <div className="noPage"></div>
          )}
        </div>
      ) : (
        <div className="Login-container">
          <h1>قم بتسجيل الدخول أولاً</h1>

          <form onSubmit={login}>
            {loginError && (
              <p className="error">
                خطأ في تسجيل الدخول، يرجى التحقق من البريد الإلكتروني وكلمة
                المرور
              </p>
            )}
            <div className="form-row">
              <label htmlFor="email">البريد الإلكتروني</label>

              <input
                type="email"
                id="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={form.email}
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="password">كلمة المرور</label>

              <input
                type="password"
                id="password"
                placeholder="أدخل كلمة المرور"
                value={form.password}
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>
            {loading ? (
              <button disabled type="submit">
                جارٍ تسجيل الدخول...
              </button>
            ) : (
              <button type="submit">تسجيل الدخول</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
