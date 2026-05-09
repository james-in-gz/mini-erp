import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import { getOrders } from "@/api/order";
import { Order } from "@/types/order";
import PaymentStatusChip from "@/components/order/PaymentStatusChip";

const statusColor: any = {
  pending: "default",
  partial_shipped: "warning",
  shipped: "info",
  completed: "success",
  cancelled: "error",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const nav = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const filteredOrders = useMemo(() => {
    const normalized = searchText.trim().toLowerCase();
    return orders.filter((o) => {
      const customerName = o.customer?.name?.toLowerCase() || "";
      const orderNo = (o.orderNo || String(o.id)).toLowerCase();
      const matchesText =
        !normalized ||
        customerName.includes(normalized) ||
        orderNo.includes(normalized);
      const matchesStatus = !statusFilter || o.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [orders, searchText, statusFilter]);

  const pagedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchText, statusFilter]);
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5">{t("order.orders")}</Typography>

        <Button variant="contained" onClick={() => nav("/orders/create")}>
          + {t("order.create")}
        </Button>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 2,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          size="small"
          label={t("common.search")}
          placeholder={t("order.searchPlaceholder")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
          sx={{
            width: { xs: "100%", sm: 260 },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          size="small"
          label={t("order.status")}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          fullWidth
          sx={{
            width: { xs: "100%", sm: 180 },
          }}
        >
          <MenuItem value="">{t("common.all", "All")}</MenuItem>

          {Object.keys(statusColor).map((status) => (
            <MenuItem key={status} value={status}>
              {t(`order.${status}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* ✅ 用 CSS Grid 替代 MUI Grid */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
        }}
      >
        {pagedOrders.map((o) => {
          const products = o.items || [];
          const productSummary = products.length
            ? `${products
              .slice(0, 2)
              .map(
                (item) =>
                  `${item.skuName || item.sku || "Product"} x${item.quantity}`,
              )
              .join(
                ", ",
              )}${products.length > 2 ? ` +${products.length - 2}...` : ""}`
            : "N/A";

          return (
            <Card key={o.id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

                  {/* ========== 1. HEADER ========== */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {o.customer?.name || o.defaultName || "N/A"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {t("order.orderNo")}: {o.orderNo || o.id}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 0.5,
                      }}
                    >
                      <Chip
                        size="small"
                        label={t(`order.${o.status}`)}
                        color={statusColor[o.status] || "default"}
                      />

                      <PaymentStatusChip status={o.paymentStatus} />
                    </Box>
                  </Box>

                  {/* ========== 2. FINANCE ========== */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(0,0,0,0.03)",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 3 }}>
                      <Typography variant="body2">
                        💰 {t("order.amount")}: ¥{o.totalAmount}
                      </Typography>

                      <Typography variant="body2">
                        📦 商品数: {o.items?.length || 0}
                      </Typography>
                    </Box>
                  </Box>

                  {/* ========== 3. PRODUCTS ========== */}
                  <Typography variant="body2" color="text.secondary">
                    {t("order.products")}:{" "}
                    {o.items?.length
                      ? o.items
                        .slice(0, 2)
                        .map(
                          (item) =>
                            `${item.skuName || item.sku} ×${item.quantity}`
                        )
                        .join(", ")
                      : "N/A"}
                    {o.items?.length > 2 && ` +${o.items.length - 2}`}
                  </Typography>

                  {/* ========== 4. ACTIONS ========== */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="small" onClick={() => nav(`/orders/${o.id}`)}>
                      {t("order.detail")}
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => nav(`/orders/${o.id}/ship`)}
                    >
                      {t("order.ship")}
                    </Button>
                  </Box>

                </Box>
              </CardContent>
            </Card>
          );
        })}

        <Stack
          spacing={2}
          sx={{
            mt: 3,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            select
            size="small"
            label={t("common.page_size")}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            sx={{ width: 140 }}
          >
            {[5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size} / {t("common.page")}
              </MenuItem>
            ))}
          </TextField>
          <Pagination
            count={Math.ceil(filteredOrders.length / pageSize)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      </Box>
    </Box>
  );
}
