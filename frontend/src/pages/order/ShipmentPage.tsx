// components/shipment/ShipmentMethodSelector.tsx
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Alert,
} from '@mui/material';
import {
  EditNote as ManualIcon,
  LocalShipping as ExpressIcon,
} from '@mui/icons-material';
import  ManualShipmentForm  from '@/components/shipment/ManualShipmentForm';
import  ExpressShipmentForm from '@/components/shipment/ExpressShipmentForm';
import { useParams } from 'react-router-dom';



export default function ShipmentPage() {
  const { id } = useParams();
  const [method, setMethod] = useState<'manual' | 'express'>('manual');
  
  const orderId = Number(id);
  return (
    <Box>
      {/* 方式选择 */}
      <ToggleButtonGroup
        value={method}
        exclusive
        onChange={(_, value) => value && setMethod(value)}
        sx={{ mb: 3, width: '100%' }}
      >
        <ToggleButton value="manual" sx={{ flex: 1, py: 2 }}>
          <ManualIcon sx={{ mr: 1 }} />
          <Typography>
            手动创建发货单
          </Typography>
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
            （已有快递单号）
          </Typography>
        </ToggleButton>
        <ToggleButton value="express" sx={{ flex: 1, py: 2 }}>
          <ExpressIcon sx={{ mr: 1 }} />
          <Typography>
            在线寄件
          </Typography>
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
            （通过快递接口下单）
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>

      {/* 提示信息 */}
      <Alert severity="info" sx={{ mb: 3 }}>
        {method === 'manual' 
          ? '适用于已有快递单号的场景，直接录入物流信息即可。'
          : '适用于需要在线下单寄件的场景，系统将自动调用快递接口创建运单。'}
      </Alert>

      {/* 对应的表单 */}
      {method === 'manual' ? (
        <ManualShipmentForm orderId={orderId} />
      ) : (
        <ExpressShipmentForm orderId={orderId}  />
      )}
    </Box>
  );
}