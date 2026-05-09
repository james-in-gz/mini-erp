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
        新增收款
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>

          <TextField
            label="收款金额"
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
            label="收款方式"
            value={method}
            onChange={(e) =>
              setMethod(e.target.value)
            }
            fullWidth
          >
            <MenuItem value="cash">
              现金
            </MenuItem>

            <MenuItem value="bank">
              银行转账
            </MenuItem>

            <MenuItem value="wechat">
              微信
            </MenuItem>

            <MenuItem value="alipay">
              支付宝
            </MenuItem>
          </TextField>

          <TextField
            label="备注"
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
          取消
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          确认收款
        </Button>
      </DialogActions>
    </Dialog>
  );
}