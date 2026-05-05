import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import request from "@/api/request";

export default function ShipmentPage() {
  const { id } = useParams(); // ⭐ 从路由拿 orderId
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState({
    trackingNumber: "",
    carrier: "",
    receiverName: "",
    receiverPhone: "",
    receiverProvince: "",
    receiverCity: "",
    receiverDistrict: "",
    receiverAddress: "",
  });

  // 🔥 加载订单
  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    const res = await request.get(`/orders/${id}`);
    setOrder(res.data);

    // ⭐ 初始化发货商品
    setItems(
      res.data.items.map((i: any) => ({
        order_item_id: i.id,
        quantity: 0,
        name: i.product?.name,
      }))
    );

    // ⭐ 自动填收货地址（推荐）
    setForm((prev) => ({
      ...prev,
      receiverName: res.data.address?.name || "",
      receiverPhone: res.data.address?.phone || "",
      receiverProvince: res.data.address?.province || "",
      receiverCity: res.data.address?.city || "",
      receiverDistrict: res.data.address?.district || "",
      receiverAddress: res.data.address?.address || "",
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      trackingNumber: form.trackingNumber,
      carrier: form.carrier,
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      receiverProvince: form.receiverProvince,
      receiverCity: form.receiverCity,
      receiverDistrict: form.receiverDistrict,
      receiverAddress: form.receiverAddress,
      items: items.filter((i) => i.quantity > 0),
    };

    if (payload.items.length === 0) {
      alert(t("order.fillShipQuantity"));
      return;
    }

    await request.post(`/orders/${id}/shipments`, payload);

    alert(t("order.shipSuccess"));

    navigate(`/orders/${id}`); // ⭐ 回到订单详情页
  };

  if (!order) return <div>Loading...</div>;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">
            {t("order.ship")} #{order.id}
          </Typography>

          {/* 物流 */}
          <TextField
            label={t("order.trackingNumber")}
            value={form.trackingNumber}
            onChange={(e) =>
              setForm({ ...form, trackingNumber: e.target.value })
            }
          />

          <TextField
            label={t("order.carrier")}
            value={form.carrier}
            onChange={(e) =>
              setForm({ ...form, carrier: e.target.value })
            }
          />

          {/* 收件人 */}
          <TextField
            label={t("order.receiverName")}
            value={form.receiverName}
            onChange={(e) =>
              setForm({ ...form, receiverName: e.target.value })
            }
          />

          <TextField
            label={t("order.phone")}
            value={form.receiverPhone}
            onChange={(e) =>
              setForm({ ...form, receiverPhone: e.target.value })
            }
          />

          {/* 收货地址 */}
          <TextField
            label={t("order.province")}
            value={form.receiverProvince}
            onChange={(e) =>
              setForm({ ...form, receiverProvince: e.target.value })
            }
          />

          <TextField
            label={t("order.city")}
            value={form.receiverCity}
            onChange={(e) =>
              setForm({ ...form, receiverCity: e.target.value })
            }
          />

          <TextField
            label={t("order.district")}
            value={form.receiverDistrict}
            onChange={(e) =>
              setForm({ ...form, receiverDistrict: e.target.value })
            }
          />

          <TextField
            label={t("order.address")}
            value={form.receiverAddress}
            onChange={(e) =>
              setForm({ ...form, receiverAddress: e.target.value })
            }
          />

          {/* 商品发货 */}
          <Typography>{t("order.shipProducts")}</Typography>

          {items.map((i) => (
            <TextField
              key={i.order_item_id}
              label={i.name}
              type="number"
              value={i.quantity}
              onChange={(e) => {
                const val = Number(e.target.value);

                setItems((prev) =>
                  prev.map((p) =>
                    p.order_item_id === i.order_item_id
                      ? { ...p, quantity: val }
                      : p
                  )
                );
              }}
            />
          ))}

          <Button variant="contained" onClick={handleSubmit}>
            {t("order.ship")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
