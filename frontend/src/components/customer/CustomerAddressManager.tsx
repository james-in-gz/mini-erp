import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
} from "@mui/material";

import {
  getAddresses,
  createAddress,
  setDefaultAddress,
} from "@/api/address";
import AreaSelector from "../AreaSelector";

export default function CustomerAddressManager({ customerId }: any) {
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    address: "",
  });

  const load = () => {
    getAddresses(customerId).then(setList);
  };

  useEffect(() => {
    load();
  }, [customerId]);

  const handleCreate = async () => {
    await createAddress(customerId, form);
    setOpen(false);
    setForm({ name: "", phone: "", province: "", city: "", district: "", address: "" });
    load();
  };

  const handleDefault = async (id: number) => {
    await setDefaultAddress(id);
    load();
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack sx={{ direction: "row", justifyContent: "space-between" }}>
            <Typography variant="h6">Addresses</Typography>
            <Button onClick={() => setOpen(true)}>+ Add</Button>
          </Stack>

          {list.map((a) => (
            <Stack sx={{ direction: "row", justifyContent: "space-between", alignItems: "center" }}
              key={a.id}
            >
              <Stack>
                <Typography>
                  {a.name} / {a.phone}
                </Typography>
                <Typography variant="body2">
                  {a.province} {a.city} {a.district} {a.address}
                </Typography>
              </Stack>

              <Radio
                checked={a.isDefault}
                onChange={() => handleDefault(a.id)}
              />
            </Stack>
          ))}
        </Stack>
      </CardContent>

      {/* 新建弹窗 */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Address</DialogTitle>

        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>

            {/* 收件人 */}
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              fullWidth
            />

            {/* 手机 */}
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              fullWidth
            />

            <AreaSelector
              value={{
                province: form.province,
                city: form.city,
                district: form.district,
              }}
              onChange={(val: any) =>
                setForm({
                  ...form,
                  ...val,
                })
              }
            />

            {/* 详细地址 */}
            <TextField
              label="Detail Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              fullWidth
              multiline
            />

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
