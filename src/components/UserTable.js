// src/components/UserTable.js
import React from "react";

export default function UserTable({ users, highlightIp, cardIp, onShowCard, onShowInfo }) {

  const isOnline = (u) => u.currentPage && u.currentPage !== "offline";

  const sortedEntries = [...Object.entries(users)].sort(([, a], [, b]) => {
    return (b.lastActivityAt || 0) - (a.lastActivityAt || 0);
  });

  const handleDelete = async (ip) => {
    if (!window.confirm(`هل أنت متأكد من حذف جميع بيانات ${ip}؟`)) return;
    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL || "";
      const res = await fetch(`${serverUrl}/api/users/${encodeURIComponent(ip)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <table className="table table-striped table-bordered">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>الاسم</th>
          <th>بيانات جديدة</th>
          <th>البطاقة</th>
          <th>الصفحة الحالية</th>
          <th>الحالة</th>
          <th>التفاصيل</th>
          <th>حذف</th>
        </tr>
      </thead>
      <tbody>
        {sortedEntries.map(([ip, u], i) => {
          const isHighlighted = ip === highlightIp || ip === cardIp;
          const rowStyle = {
            border: isHighlighted ? "2px solid #28a745" : undefined,
            background: u.flag ? "yellow" : undefined,
            boxShadow: u.hasPayment ? "inset 4px 0 #28a745" : undefined,
          };
          const nameCellStyle = u.hasPayment
            ? { background: "#d4edda", color: "#155724", fontWeight: 700 }
            : undefined;

          const displayName = u.userName || u.FullName || "—";

          return (
            <tr key={ip} style={rowStyle}>
              <td>{i + 1}</td>
              <td style={nameCellStyle}>
                {displayName}
                {u.hasPayment && <span className="badge bg-success text-white ms-2">تم الدفع</span>}
              </td>
              <td>
                <span className={`font-weight-bold ${u.hasNewData ? "text-success" : "text-danger"}`}>
                  {u.hasNewData ? "نعم" : "لا"}
                </span>
              </td>
              <td>
                <button className="btn btn-success btn-sm" onClick={() => onShowCard(ip)}>البطاقة</button>
              </td>
              <td>{(u.currentPage || "أوفلاين").replace(".html", "")}</td>
              <td>
                <span className={`font-weight-bold ${isOnline(u) ? "text-success" : "text-danger"}`}>
                  {isOnline(u) ? "متصل" : "غير متصل"}
                </span>
              </td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => onShowInfo(ip)}>التفاصيل</button>
              </td>
              <td>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(ip)}>حذف</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
