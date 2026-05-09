import { Chip } from "@mui/material";

interface Props {
  status: string;
}

export default function PaymentStatusChip({ status }: Props) {
  const map: Record<string, any> = {
    unpaid: {
      label: "未付款",
      color: "default",
    },

    partial: {
      label: "部分付款",
      color: "warning",
    },

    paid: {
      label: "已付款",
      color: "success",
    },

    refunded: {
      label: "已退款",
      color: "error",
    },
  };

  const item = map[status] || map.unpaid;

  return (
    <Chip
      label={item.label}
      color={item.color}
      size="small"
    />
  );
}