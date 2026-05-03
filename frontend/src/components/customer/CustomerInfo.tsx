import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";

import { updateCustomerBaseInfo } from "@/api/customer";

const SOURCE_OPTIONS = ["公众号A", "抖音广告", "转介绍"];
const ENTRY_OPTIONS = ["销售A微信1", "销售A微信2", "客服号"];

const STATUS_COLORS: Record<string, any> = {
  new: "default",
  interested: "info",
  negotiating: "warning",
  won: "success",
  lost: "error",
};

export default function CustomerInfo({ customer, onUpdated }: any) {
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const original = {
    name: customer.name,
    phone: customer.phone,
    wechat: customer.wechat || "",
    source: customer.source || "",
    entry: customer.entry || "",
    status: customer.status,
  };

  const [form, setForm] = useState(original);

  const isChanged = JSON.stringify(form) !== JSON.stringify(original);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    setForm(original);
    setEditing(false);
  };

  const handleSave = async () => {
    await updateCustomerBaseInfo(customer.id, form);
    setEditing(false);
    setOpen(true);
    onUpdated?.();
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Customer Info</Typography>

            {!editing ? (
              <Button size="small" onClick={() => setEditing(true)}>
                Edit
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSave}
                  disabled={!isChanged}
                >
                  Save
                </Button>
              </Stack>
            )}
          </Box>

          {/* Name */}
          {editing ? (
            <TextField
              label="Name"
              size="small"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          ) : (
            <Typography>Name: {form.name}</Typography>
          )}

          {/* Phone */}
          {editing ? (
            <TextField
              label="Phone"
              size="small"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          ) : (
            <Typography>Phone: {form.phone}</Typography>
          )}

          {/* WeChat */}
          {editing ? (
            <TextField
              label="WeChat"
              size="small"
              value={form.wechat}
              onChange={(e) => handleChange("wechat", e.target.value)}
            />
          ) : (
            <Typography>WeChat: {form.wechat || "-"}</Typography>
          )}

          {/* Source */}
          {editing ? (
            <Select
              size="small"
              value={form.source}
              onChange={(e) => handleChange("source", e.target.value)}
            >
              {SOURCE_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography>Source: {form.source || "-"}</Typography>
          )}

          {/* Entry */}
          {editing ? (
            <Select
              size="small"
              value={form.entry}
              onChange={(e) => handleChange("entry", e.target.value)}
            >
              {ENTRY_OPTIONS.map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography>Entry: {form.entry || "-"}</Typography>
          )}

          {/* Status */}
          {editing ? (
            <Select
              size="small"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="interested">Interested</MenuItem>
              <MenuItem value="negotiating">Negotiating</MenuItem>
              <MenuItem value="won">Won</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
            </Select>
          ) : (
            <Chip
              label={form.status}
              size="small"
              color={STATUS_COLORS[form.status]}
              sx={{
                alignSelf: "flex-start",
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            />
          )}
        </Stack>

        {/* Snackbar */}
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
        >
          <Alert severity="success" variant="filled">
            Saved successfully
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}