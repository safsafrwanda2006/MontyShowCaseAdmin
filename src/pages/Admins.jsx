import React, { useEffect, useState } from "react";
import "./Admins.css";
import { jwtDecode } from "jwt-decode";
import { backendURL } from "../App.jsx";
import axios from "axios";

function admins({ setCurrentPage }) {
  const [admins, setAdmins] = useState([]);
  const [role, setRole] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    admin_name: "",
    email: "",
    password: "",
    admin_role: "",
  });

  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      setRole(decoded.role);
    }
  }, []);

  const fetchAdmins = async () => {
    try {
      const result = await axios.get(`${backendURL}/admin/list`);
      setAdmins(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const addAdmin = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const result = await axios.post(`${backendURL}/admin/register`, form);
      console.log(result.data);
      fetchAdmins();
      setForm({
        admin_name: "",
        email: "",
        password: "",
        admin_role: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm("المشرف سيتم حذفه نهائيا هل أنت متأكد؟")) {
      return;
    }
    try {
      const result = await axios.delete(`${backendURL}/admin/delete/${id}`);
      console.log(result.data);
      fetchAdmins();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-container">
      <button onClick={() => setCurrentPage("products")} className="back-btn">
        <img src="/icons/left.png" alt="" />
      </button>
      <h2 className="admin-title">إدارة المشرفين</h2>

      <ul>
        {admins.map((admin) => (
          <li key={admin.admin_id}>
            <div className="name">
              {admin.admin_name}
              {"  "}
              {admin.admin_role === "full" ? (
                <span className="role">مشرف عام</span>
              ) : (
                <span className="role">مشرف جزئي</span>
              )}
            </div>
            <div className="email">{admin.email}</div>
            {role === "full" ?(
                <button onClick={() => deleteAdmin(admin.admin_id)}>
                  حذف المشرف
                </button>
              ):
              <button 
              className="disabled"
              disabled >حذف المشرف</button>
            }
          </li>
        ))}
      </ul>

      {role === "full" ? (
        <div className="yes">
          <h2>إضافة مشرف</h2>

          <form onSubmit={addAdmin}>
            <div className="form-row">
              <label htmlFor="fullname">الاسم الكامل</label>

              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="أدخل الاسم الكامل"
                value={form.fullname}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullname: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="email">البريد الإلكتروني</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="أدخل البريد الإلكتروني"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="password">كلمة المرور</label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="أدخل كلمة المرور"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="role">دور المشرف</label>
              <select
                onChange={(e) =>
                  setForm({
                    ...form,
                    admin_role: e.target.value,
                  })
                }
                name="role"
                id="role"
              >
                <option value="">اختر دور المشرف</option>
                <option value="coadmin">مشرف مساعد</option>
                <option value="full">مشرف كامل</option>
              </select>
            </div>

            <button type="submit">إضافة مشرف</button>
          </form>
        </div>
      ) : (
        <div className="no"></div>
      )}
    </div>
  );
}

export default admins;
