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
import { useTranslation } from "react-i18next";

const SOURCE_OPTIONS = ["公众号", "抖音广告", "转介绍","其他"];
const ENTRY_OPTIONS = ["一号店", "二号店", "三号店","四号店","五号店"];

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
  const {t} = useTranslation();

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
            <Typography variant="h6">{t("customer.name")}</Typography>

            {!editing ? (
              <Button size="small" onClick={() => setEditing(true)}>
                {t("common.edit")}
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={handleCancel}>
                  {t("common.cancel")}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSave}
                  disabled={!isChanged}
                >
                  {t("common.save")}
                </Button>
              </Stack>
            )}
          </Box>

          {/* Name */}
          {editing ? (
            <TextField
              label={t("customer.name")}
              size="small"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          ) : (
            <Typography>{t("customer.name")}: {form.name}</Typography>
          )}

          {/* Phone */}
          {editing ? (
            <TextField
              label={t("customer.phone")}
              size="small"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          ) : (
            <Typography>{t("customer.phone")}: {form.phone}</Typography>
          )}

          {/* WeChat */}
          {editing ? (
            <TextField
              label={t("customer.wechat")}
              size="small"
              value={form.wechat}
              onChange={(e) => handleChange("wechat", e.target.value)}
            />
          ) : (
            <Typography>{t("customer.wechat")}: {form.wechat || "-"}</Typography>
          )}

          {/* Source */}
          {editing ? (
            <Select
              size="small"
              label={t("customer.source")}
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
            <Typography>{t("customer.source")}: {form.source || "-"}</Typography>
          )}

          {/* Entry */}
          {editing ? (
            <Select
              size="small"
              label={t("customer.entry")}
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
            <Typography>{t("customer.entry")}: {form.entry || "-"}</Typography>
          )}

          {/* Status */}
          {editing ? (
            <Select
              size="small"
              label={t("customer.status")}
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="new">{t("status.new")}</MenuItem>
              <MenuItem value="interested">{t("status.interested")}</MenuItem>
              <MenuItem value="negotiating">{t("status.negotiating")}</MenuItem>
              <MenuItem value="won">{t("status.won")}</MenuItem>
              <MenuItem value="lost">{t("status.lost")}</MenuItem>
            </Select>
          ) : (
            <Chip
              label={t(`status.${form.status}`)}
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
            {t("common.save-success")}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}