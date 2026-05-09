import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Tooltip,
  Pagination,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import  { inventoryApi} from "@/api/inventoryApi";
import { getAllSKUs, getSKUDetail } from "@/api/sku";
import { InventoryLog } from "@/types/inventory";

interface SKUWithInventory {
  id: number;
  code: string;
  name: string;
  specs: string;
  price: number;
  inventory?: {
    stock: number;
    lockedStock: number;
    availableStock: number;
  };
}

const InventoryManagement: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [skus, setSkus] = useState<SKUWithInventory[]>([]);
  const [filteredSkus, setFilteredSkus] = useState<SKUWithInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(20);

  // 调整库存弹窗
  const [adjustDialog, setAdjustDialog] = useState<{
    open: boolean;
    skuId?: number;
    skuCode?: string;
    skuName?: string;
  }>({ open: false });
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustRemark, setAdjustRemark] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  // 日志弹窗
  const [logsDialog, setLogsDialog] = useState<{
    open: boolean;
    skuId?: number;
    skuCode?: string;
  }>({ open: false });
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterSkus();
  }, [searchKeyword, skus]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 获取所有SKU
      const skuList = await getAllSKUs();

      // 批量获取库存
      const skuIds = skuList.map((s: any) => s.id);
      if (skuIds.length > 0) {
        const inventoryRes = await inventoryApi.batchGet(skuIds);
        const inventoryMap = inventoryRes.data;

        const merged = skuList.map((sku: any) => ({
          ...sku,
          inventory: inventoryMap[sku.id]
            ? {
                stock: inventoryMap[sku.id].stock,
                lockedStock: inventoryMap[sku.id].lockedStock,
                availableStock: inventoryMap[sku.id].availableStock,
              }
            : { stock: 0, lockedStock: 0, availableStock: 0 },
        }));
        setSkus(merged);
        setFilteredSkus(merged);
      } else {
        setSkus([]);
        setFilteredSkus([]);
      }
    } catch (error) {
      console.error("加载数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSkus = () => {
    if (!searchKeyword.trim()) {
      setFilteredSkus(skus);
      setPage(1);
      return;
    }

    const keyword = searchKeyword.toLowerCase();
    const filtered = skus.filter(
      (sku) =>
        sku.code.toLowerCase().includes(keyword) ||
        sku.name.toLowerCase().includes(keyword),
    );
    setFilteredSkus(filtered);
    setPage(1);
  };

  const handleAdjustStock = async () => {
    if (!adjustDialog.skuId || adjustQuantity === 0) return;

    setAdjusting(true);
    try {
      await inventoryApi.adjustStock(
        adjustDialog.skuId,
        adjustQuantity,
        adjustRemark,
      );
      setAdjustDialog({ open: false });
      setAdjustQuantity(0);
      setAdjustRemark("");
      loadData();
    } catch (error) {
      console.error("调整库存失败:", error);
      alert(t("inventory.adjustFailed"));
    } finally {
      setAdjusting(false);
    }
  };

  const handleViewLogs = async (skuId: number) => {
    setLogsDialog({ open: true, skuId });
    setLogsLoading(true);
    setLogsPage(1);
    try {
      const res = await inventoryApi.getLogs(skuId, 1, 20);
      setLogs(res.data?.items);
      setLogsTotal(res.data.total);
    } catch (error) {
      console.error("加载日志失败:", error);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleLoadMoreLogs = async () => {
    if (!logsDialog.skuId) return;
    const nextPage = logsPage + 1;
    try {
      const res = await inventoryApi.getLogs(logsDialog.skuId, nextPage, 20);
      setLogs([...logs, ...res.data.items]);
      setLogsPage(nextPage);
    } catch (error) {
      console.error("加载更多日志失败:", error);
    }
  };

  const formatSpecs = (specsStr: string) => {
    try {
      const specs = JSON.parse(specsStr);
      return Object.entries(specs)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    } catch {
      return specsStr;
    }
  };

  const getStockColor = (available: number) => {
    if (available <= 0) return theme.palette.error.main;
    if (available <= 10) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const paginatedSkus = filteredSkus.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <Box sx={{ height: "100%", p: 3 }}>
      {/* 头部 */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {t("inventory.management")}
        </Typography>
        <Button variant="outlined" onClick={loadData} disabled={loading}>
          {t("common.refresh")}
        </Button>
      </Box>

      {/* 搜索栏 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          placeholder={t("inventory.searchPlaceholder")}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>

      {/* 库存列表 */}
      <Paper sx={{ overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: "calc(100vh - 280px)" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                    <TableCell sx={{ fontWeight: 600 }}>{t("inventory.skuCode")}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t("inventory.skuName")}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t("inventory.specs")}</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                      {t("inventory.price")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                      {t("inventory.totalStock")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                      {t("inventory.lockedStock")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                      {t("inventory.availableStock")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                      {t("inventory.status")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                      {t("inventory.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSkus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary">{t("common.no-data")}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSkus.map((sku) => {
                      const available = sku.inventory?.availableStock ?? 0;
                      return (
                        <TableRow key={sku.id} hover>
                          <TableCell>{sku.code}</TableCell>
                          <TableCell>{sku.name}</TableCell>
                          <TableCell>{formatSpecs(sku.specs)}</TableCell>
                          <TableCell align="right">
                            ¥{sku.price?.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Typography sx={{ fontWeight: 500 }}>
                              {sku.inventory?.stock ?? 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {sku.inventory?.lockedStock &&
                            sku.inventory?.lockedStock > 0 ? (
                              <Typography
                                sx={{ color: "warning.main", fontWeight: 500 }}
                              >
                                {sku.inventory.lockedStock}
                              </Typography>
                            ) : (
                              0
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: getStockColor(available),
                              }}
                            >
                              {available}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={
                                available <= 0
                                  ? t("inventory.status.outOfStock")
                                  : available <= 10
                                    ? t("inventory.status.low")
                                    : t("inventory.status.sufficient")
                              }
                              size="small"
                              color={
                                available <= 0
                                  ? "error"
                                  : available <= 10
                                    ? "warning"
                                    : "success"
                              }
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                justifyContent: "center",
                              }}
                            >
                              <Tooltip title={t("inventory.adjustStock")}>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setAdjustDialog({
                                      open: true,
                                      skuId: sku.id,
                                      skuCode: sku.code,
                                      skuName: sku.name,
                                    })
                                  }
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t("inventory.viewLogs")}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewLogs(sku.id)}
                                >
                                  <HistoryIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 分页 */}
            {filteredSkus.length > rowsPerPage && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <Pagination
                  count={Math.ceil(filteredSkus.length / rowsPerPage)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* 调整库存弹窗 */}
      <Dialog
        open={adjustDialog.open}
        onClose={() => setAdjustDialog({ open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box>
            <Typography variant="h6">{t("inventory.adjustStock")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {adjustDialog.skuCode} - {adjustDialog.skuName}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="number"
              label={t("inventory.adjustQuantity")}
              value={adjustQuantity}
              onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
              margin="normal"
              helperText={
                <Typography variant="caption" color="text.secondary">
                  {t("inventory.adjustHint")}
                </Typography>
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {adjustQuantity > 0 ? (
                        <AddIcon fontSize="small" />
                      ) : adjustQuantity < 0 ? (
                        <RemoveIcon fontSize="small" />
                      ) : null}
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label={t("inventory.remark")}
              value={adjustRemark}
              onChange={(e) => setAdjustRemark(e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
            p: 2,
            pt: 0,
          }}
        >
          <Button onClick={() => setAdjustDialog({ open: false })}>{t("common.cancel")}</Button>
          <Button
            variant="contained"
            onClick={handleAdjustStock}
            disabled={adjustQuantity === 0 || adjusting}
          >
            {adjusting ? <CircularProgress size={20} /> : t("inventory.confirmAdjust")}
          </Button>
        </Box>
      </Dialog>

      {/* 库存日志弹窗 */}
      <Dialog
        open={logsDialog.open}
        onClose={() => setLogsDialog({ open: false })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{t("inventory.stockLogs")} - {logsDialog.skuCode}</DialogTitle>
        <DialogContent>
          {logsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                    <TableCell>{t("inventory.log.time")}</TableCell>
                    <TableCell>{t("inventory.log.type")}</TableCell>
                    <TableCell align="right">{t("inventory.log.change")}</TableCell>
                    <TableCell align="right">{t("inventory.log.before")}</TableCell>
                    <TableCell align="right">{t("inventory.log.after")}</TableCell>
                    <TableCell>{t("inventory.log.remark")}</TableCell>
                    <TableCell>{t("inventory.log.operator")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => {
                    const typeMap: Record<
                      string,
                      { label: string; color: any }
                    > = {
                      in: { label: t("inventory.log.type.in"), color: "success" },
                      out: { label: t("inventory.log.type.out"), color: "error" },
                      lock: { label: t("inventory.log.type.lock"), color: "warning" },
                      unlock: { label: t("inventory.log.type.unlock"), color: "info" },
                      adjust: {
                        label: t("inventory.log.type.adjust"),
                        color: log.changeValue >= 0 ? "success" : "error",
                      },
                    };
                    const type = typeMap[log.type] || {
                      label: log.type,
                      color: "default",
                    };

                    return (
                      <TableRow key={log.id} hover>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={type.label}
                            size="small"
                            color={type.color}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{fontWeight:500}}
                            color={
                              log.changeValue >= 0
                                ? "success.main"
                                : "error.main"
                            }
                              
                          >
                            {log.changeValue >= 0
                              ? `+${log.changeValue}`
                              : log.changeValue}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{log.beforeStock}</TableCell>
                        <TableCell align="right">{log.afterStock}</TableCell>
                        <TableCell>{log.remark || "-"}</TableCell>
                        <TableCell>{log.createdBy || t("inventory.log.system")}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* 加载更多 */}
          {logs.length < logsTotal && !logsLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button onClick={handleLoadMoreLogs}>
                {t("inventory.loadMore")} ({logs.length}/{logsTotal})
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InventoryManagement;
