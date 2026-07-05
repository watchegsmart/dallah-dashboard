// src/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (username === "Admin" && password === "Admin12345#") {
      const randomToken = Math.random().toString(36).slice(2);
      localStorage.setItem("token", randomToken);
      navigate("/", { replace: true });
    } else {
      setErrorMsg("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "100px" }} dir="rtl">
      <h3 className="mb-4 text-center">تسجيل دخول المسؤول</h3>
      <form onSubmit={handleSubmit}>
        {errorMsg && (
          <div className="alert alert-danger text-right" role="alert">{errorMsg}</div>
        )}
        <div className="mb-3 text-right">
          <label>اسم المستخدم</label>
          <input type="text" className="form-control" value={username}
            onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-4 text-right">
          <label>كلمة المرور</label>
          <input type="password" className="form-control" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">تسجيل الدخول</button>
      </form>
    </div>
  );
}
