import { useEffect, useState } from "react";
import { Card, CardContent, TextField, Button, MenuItem, Stack } from "@mui/material";
import request from "@/api/request";

export default function StockInPage() {
  const [skus, setSkus] = useState<any[]>([]);
  const [form, setForm] = useState({ sku_id: "", qty: 0 });

  useEffect(() => {
    request.get("/skus").then(res => setSkus(res.data));
  }, []);

  const handleSubmit = async () => {
    await request.post("/inventory/in", form);
    alert("入库成功");
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <TextField
            select
            label="SKU"
            value={form.sku_id}
            onChange={(e) =>
              setForm({ ...form, sku_id: e.target.value })
            }
          >
            {skus.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="数量"
            type="number"
            onChange={(e) =>
              setForm({ ...form, qty: Number(e.target.value) })
            }
          />

          <Button variant="contained" onClick={handleSubmit}>
            入库
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}