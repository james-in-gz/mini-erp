import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
} from "@mui/material";

import { useState } from "react";

import PaymentDialog from "./PaymentDialog";

import PaymentStatusChip from "./PaymentStatusChip";

import PaymentRecordTable
from "./PaymentRecordTable";

import { createPayment }
from "@/api/payment";

interface Props {
  order: any;

  onRefresh: () => Promise<void>;
}

export default function PaymentCard({
  order,
  onRefresh,
}: Props) {

  const [open, setOpen] =
    useState(false);

  const handleCreatePayment =
    async (data: any) => {

      await createPayment(
        order.id,
        data
      );

      await onRefresh();
    };

  return (
    <Card sx={{ borderRadius: 3 }}>

      <CardContent>

        <Stack sx={{mb:2,justifyContent:"space-between",direction:"row"}}   >

          <Typography variant="h6">
            收款信息
          </Typography>

          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >
            新增收款
          </Button>

        </Stack>

        <Stack spacing={1} sx={{ mb: 3 }}>

          <Typography>
            订单金额：
            ￥{order.totalAmount}
          </Typography>

          <Typography>
            已付款：
            ￥{order.paidAmount}
          </Typography>

          <Stack sx={{direction:"row",alignItems:"center"}}
           
            spacing={1}
            
          >
            <Typography>
              付款状态：
            </Typography>

            <PaymentStatusChip
              status={
                order.paymentStatus
              }
            />
          </Stack>

        </Stack>

        <PaymentRecordTable
          records={
            order.paymentRecords || []
          }
        />

      </CardContent>

      <PaymentDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreatePayment}
      />

    </Card>
  );
}