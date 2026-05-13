import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { getWaybillLabel } from "@/api/shipment";

export default function PrintLabelButton({ waybillNo }: { waybillNo: string }) {
  const [loading, setLoading] = useState(false);

   const handlePrint = async () => {
    try {
      setLoading(true);

      const res = await getWaybillLabel(waybillNo);

      const data = res.data?.data;

      if (!data?.success) {
        alert(data?.errorMsg || "打印失败");
        return;
      }


      // =========================
      // 这里是关键：交给你打印系统
      // =========================

      // 情况1：PDF base64
      const pdfBase64 = data.labelData?.[0]?.data;

      if (pdfBase64) {
        printPDF(pdfBase64);
      }

      // 情况2：URL
      const url = data.labelData?.[0]?.url;

      if (url) {
        window.open(url, "_blank");
      }
    } catch (e: any) {
      alert(e?.message || "打印失败");
    } finally {
      setLoading(false);
    }
  };

  function printPDF(base64: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  }
  return (
    <Button variant="contained" onClick={handlePrint} disabled={loading}>
      {loading ? <CircularProgress size={18} /> : "打印面单"}
    </Button>
  );
}
