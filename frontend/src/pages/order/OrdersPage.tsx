import { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

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
  const nav = useNavigate();
  const { t } = useTranslation();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 防抖搜索
  const [debouncedSearch] = useDebounce(searchText, 500);

  // =========================
  // 获取订单
  // =========================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await getOrders({
        page,
        pageSize,
        search: debouncedSearch,
        status: statusFilter,
      });

      /**
       * 后端返回格式:
       * {
       *   data: [],
       *   total: 100,
       *   page: 1,
       *   pageSize: 10
       * }
       */

      setOrders(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 自动请求
  // =========================
  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, debouncedSearch, statusFilter]);

  // =========================
  // 搜索 / 筛选时回第一页
  // =========================
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  return (
    <Box>
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5">
          {t("order.orders")}
        </Typography>

        <Button
          variant="contained"
          onClick={() => nav("/orders/create")}
        >
          + {t("order.create")}
        </Button>
      </Box>

      {/* ========================= */}
      {/* FILTER */}
      {/* ========================= */}
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
          <MenuItem value="">
            {t("common.all", "All")}
          </MenuItem>

          {Object.keys(statusColor).map((status) => (
            <MenuItem key={status} value={status}>
              {t(`order.${status}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* ========================= */}
      {/* LOADING */}
      {/* ========================= */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* ========================= */}
      {/* EMPTY */}
      {/* ========================= */}
      {!loading && orders.length === 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography color="text.secondary">
              {t("common.no_data", "No Data")}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* ========================= */}
      {/* ORDER LIST */}
      {/* ========================= */}
      {!loading && orders.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gap: 2,
          }}
        >
          {orders.map((o) => {
            return (
              <Card
                key={o.id}
                sx={{ borderRadius: 3 }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    {/* ========================= */}
                    {/* HEADER */}
                    {/* ========================= */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          {o.customer?.name ||
                            o.defaultName ||
                            "N/A"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {t("order.orderNo")}:{" "}
                          {o.orderNo || o.id}
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
                          color={
                            statusColor[o.status] || "default"
                          }
                        />

                        <PaymentStatusChip
                          status={o.paymentStatus}
                        />
                      </Box>
                    </Box>

                    {/* ========================= */}
                    {/* FINANCE */}
                    {/* ========================= */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor:
                          "rgba(0,0,0,0.03)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 3,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="body2">
                          {t("order.amount")}: ¥
                          {o.totalAmount}
                        </Typography>

                        <Typography variant="body2">
                          已付款: ¥{o.paidAmount}
                        </Typography>

                        <Typography variant="body2">
                          未付款: ¥
                          {o.paidAmount
                            ? o.totalAmount -
                              o.paidAmount
                            : o.totalAmount}
                        </Typography>
                      </Box>
                    </Box>

                    {/* ========================= */}
                    {/* PRODUCTS */}
                    {/* ========================= */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
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

                      {o.items?.length > 2 &&
                        ` +${o.items.length - 2}`}
                    </Typography>

                    {/* ========================= */}
                    {/* ACTIONS */}
                    {/* ========================= */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() =>
                          nav(`/orders/${o.id}`)
                        }
                      >
                        {t("order.detail")}
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          nav(`/orders/${o.id}/ship`)
                        }
                      >
                        {t("order.ship")}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}

          {/* ========================= */}
          {/* PAGINATION */}
          {/* ========================= */}
          <Stack
            spacing={2}
            sx={{
              mt: 3,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
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
              count={Math.ceil(total / pageSize)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Stack>
        </Box>
      )}
    </Box>
  );
}