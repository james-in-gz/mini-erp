import { useEffect, useState } from "react";
import { Card, CardContent, TextField, Button, MenuItem, Stack } from "@mui/material";
import request from "@/api/request";
import { useNavigate } from "react-router-dom";

export default function StockOutPage() {
  const [skus, setSkus] = useState<any[]>([]);
  const [form, setForm] = useState({ sku_id: "", qty: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    request.get("/skus").then(res => setSkus(res.data));
  }, []);

  const handleSubmit = async () => {
    var res = await request.post("/inventory/out", form);
    if(res.data.code === 0){
      alert("出库成功");
      navigate("/inventory");
    }else{
      alert("出库失败: " + res.data.message);
    }
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
            出库
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}