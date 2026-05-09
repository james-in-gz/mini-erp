import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;

  onClose: () => void;

  onSubmit: (
    data: {
      amount: number;
      method: string;
      remark: string;
    }
  ) => Promise<void>;
}

export default function PaymentDialog({
  open,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  const [amount, setAmount] = useState(0);

  const [method, setMethod] =
    useState("cash");

  const [remark, setRemark] =
    useState("");

  const handleSubmit = async () => {

    await onSubmit({
      amount,
      method,
      remark,
    });

    onClose();

    setAmount(0);

    setMethod("cash");

    setRemark("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        {t("payment.dialog.title")}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>

          <TextField
            label={t("payment.dialog.amount")}
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(
                Number(e.target.value)
              )
            }
            fullWidth
          />

          <TextField
            select
            label={t("payment.dialog.method")}
            value={method}
            onChange={(e) =>
              setMethod(e.target.value)
            }
            fullWidth
          >
            <MenuItem value="cash">
              {t("payment.method.cash")}
            </MenuItem>

            <MenuItem value="bank">
              {t("payment.method.bank")}
            </MenuItem>

            <MenuItem value="wechat">
              {t("payment.method.wechat")}
            </MenuItem>

            <MenuItem value="alipay">
              {t("payment.method.alipay")}
            </MenuItem>
          </TextField>

          <TextField
            label={t("payment.dialog.remark")}
            value={remark}
            onChange={(e) =>
              setRemark(e.target.value)
            }
            multiline
            rows={3}
            fullWidth
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {t("common.cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {t("payment.dialog.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}