import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Chip,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { inventoryApi } from '@/api/inventoryApi';

interface InventoryCardProps {
  skuId: number;
  skuCode: string;
  skuName: string;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ skuId, skuCode, skuName }) => {
  const [inventory, setInventory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustRemark, setAdjustRemark] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getBySKU(skuId);
      setInventory(res.data);
    } catch (error) {
      console.error('加载库存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [skuId]);

  const handleAdjust = async () => {
    if (adjustQuantity === 0) return;
    setAdjusting(true);
    try {
      await inventoryApi.adjustStock(skuId, adjustQuantity, adjustRemark);
      setAdjustDialog(false);
      setAdjustQuantity(0);
      setAdjustRemark('');
      loadInventory();
    } catch (error) {
      console.error('调整失败:', error);
      alert('调整失败');
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const available = inventory?.availableStock ?? 0;
  const stockStatus = available <= 0 ? '缺货' : available <= 10 ? '紧张' : '充足';
  const statusColor = available <= 0 ? 'error' : available <= 10 ? 'warning' : 'success';

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              库存信息
            </Typography>
            <IconButton size="small" onClick={loadInventory}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography variant="caption" color="text.secondary">
                总库存
              </Typography>
              <Typography variant="h6">
                {inventory?.stock || 0}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant="caption" color="text.secondary">
                锁定库存
              </Typography>
              <Typography variant="h6" color="warning.main">
                {inventory?.lockedStock || 0}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant="caption" color="text.secondary">
                可用库存
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">
                  {available}
                </Typography>
                <Chip label={stockStatus} size="small" color={statusColor} />
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                setAdjustQuantity(1);
                setAdjustDialog(true);
              }}
            >
              入库
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RemoveIcon />}
              onClick={() => {
                setAdjustQuantity(-1);
                setAdjustDialog(true);
              }}
            >
              出库
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={adjustDialog} onClose={() => setAdjustDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {adjustQuantity > 0 ? '入库' : '出库'} - {skuCode}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="number"
            label="数量"
            value={Math.abs(adjustQuantity)}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setAdjustQuantity(adjustQuantity > 0 ? val : -val);
            }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="备注"
            value={adjustRemark}
            onChange={(e) => setAdjustRemark(e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setAdjustDialog(false)}>取消</Button>
            <Button variant="contained" onClick={handleAdjust} disabled={adjusting}>
              {adjusting ? <CircularProgress size={20} /> : `确认${adjustQuantity > 0 ? '入库' : '出库'}`}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryCard;