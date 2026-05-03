import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

import { updateCustomerBaseInfo } from "@/api/customer";

const SOURCE_OPTIONS = ["公众号A", "抖音广告", "转介绍"];
const ENTRY_OPTIONS = ["销售A微信1", "销售A微信2", "客服号"];

export default function CustomerInfo({ customer, onUpdated }: any) {
  const [form, setForm] = useState({
    name: customer.name,
    phone: customer.phone,
    wechat: customer.wechat || "",
    source: customer.source || "",
    entry: customer.entry || "",
    status: customer.status,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlurSave = async () => {
    await updateCustomerBaseInfo(customer.id, form);
    onUpdated?.();
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Name */}
          <TextField
            label="Name"
            size="small"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={handleBlurSave}
          />

          {/* Phone */}
          <TextField
            label="Phone"
            size="small"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={handleBlurSave}
          />

          {/* WeChat */}
          <TextField
            label="WeChat"
            size="small"
            value={form.wechat}
            onChange={(e) => handleChange("wechat", e.target.value)}
            onBlur={handleBlurSave}
          />

          {/* Source */}
          <Select
            size="small"
            value={form.source}
            onChange={(e) => {
              handleChange("source", e.target.value);
              handleBlurSave();
            }}
          >
            {SOURCE_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>

          {/* Entry */}
          <Select
            size="small"
            value={form.entry}
            onChange={(e) => {
              handleChange("entry", e.target.value);
              handleBlurSave();
            }}
          >
            {ENTRY_OPTIONS.map((e) => (
              <MenuItem key={e} value={e}>
                {e}
              </MenuItem>
            ))}
          </Select>

          {/* Status */}
          <Select
            size="small"
            value={form.status}
            onChange={(e) => {
              handleChange("status", e.target.value);
              handleBlurSave();
            }}
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="interested">Interested</MenuItem>
            <MenuItem value="negotiating">Negotiating</MenuItem>
            <MenuItem value="won">Won</MenuItem>
            <MenuItem value="lost">Lost</MenuItem>
          </Select>
        </Stack>
      </CardContent>
    </Card>
  );
}