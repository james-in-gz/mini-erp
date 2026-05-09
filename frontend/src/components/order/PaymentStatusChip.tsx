import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  status: string;
}

export default function PaymentStatusChip({ status }: Props) {
  const { t } = useTranslation();
  const map: Record<string, any> = {
    unpaid: {
      label: t("payment.status.unpaid"),
      color: "default",
    },

    partial: {
      label: t("payment.status.partial"),
      color: "warning",
    },

    paid: {
      label: t("payment.status.paid"),
      color: "success",
    },

    refunded: {
      label: t("payment.status.refunded"),
      color: "error",
    },
  };

  const item = map[status] || map.unpaid;

  return <Chip label={item.label} color={item.color} size="small" />;
}
