import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import request from "@/api/request";

export default function ShipmentPage({ order }: any) {
  const [form, setForm] = useState({
    tracking_number: "",
    carrier: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_addr: "",
  });

  const [items, setItems] = useState(
    order.items.map((i: any) => ({
      order_item_id: i.id,
      quantity: 0,
      name: i.product.name,
    }))
  );

  const handleSubmit = async () => {
    await request.post(`/orders/${order.id}/shipments`, {
      ...form,
      items: items.filter((i: any) => i.quantity > 0),
    });

    alert("发货成功");
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label="Tracking Number"
            value={form.tracking_number}
            onChange={(e) =>
              setForm({ ...form, tracking_number: e.target.value })
            }
          />

          <TextField
            label="Carrier"
            value={form.carrier}
            onChange={(e) =>
              setForm({ ...form, carrier: e.target.value })
            }
          />

          <TextField
            label="Receiver Name"
            value={form.receiver_name}
            onChange={(e) =>
              setForm({ ...form, receiver_name: e.target.value })
            }
          />

          <TextField
            label="Phone"
            value={form.receiver_phone}
            onChange={(e) =>
              setForm({ ...form, receiver_phone: e.target.value })
            }
          />

          <TextField
            label="Address"
            value={form.receiver_addr}
            onChange={(e) =>
              setForm({ ...form, receiver_addr: e.target.value })
            }
          />

          {/* 商品发货 */}
          {items.map((i: any) => (
            <TextField
              key={i.order_item_id}
              label={i.name}
              type="number"
              onChange={(e) => {
                const val = Number(e.target.value);
                setItems((prev: any) =>
                  prev.map((p: any) =>
                    p.order_item_id === i.order_item_id
                      ? { ...p, quantity: val }
                      : p
                  )
                );
              }}
            />
          ))}

          <Button variant="contained" onClick={handleSubmit}>
            发货
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}