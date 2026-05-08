import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Radio,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";

import { getAddresses } from "@/api/address";

interface Props {
  open: boolean;
  customerId: number;
  onClose: () => void;
  onConfirm: (address: any) => void;
}

export default function OrderAddressSelectDialog({
  open,
  customerId,
  onClose,
  onConfirm,
}: Props) {
  const [list, setList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (open && customerId) {
      getAddresses(customerId).then((res) => {
        setList(res);

        const def = res.find((x: any) => x.is_default);

        if (def) {
          setSelected(def);
        }
      });
    }
  }, [open, customerId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t("common.select_address")}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {list.map((a) => (
            <Card
              key={a.id}
              variant={selected?.id === a.id ? "outlined" : undefined}
            >
              <CardActionArea onClick={() => setSelected(a)}>
                <CardContent>
                  <Stack
                    sx={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography>
                        {a.name} / {a.phone}
                      </Typography>

                      <Typography variant="body2">
                        {a.province} {a.city} {a.district}{" "}
                        {a.address}
                      </Typography>
                    </Stack>

                    <Radio checked={selected?.id === a.id} />
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {t("common.cancel")}
        </Button>

        <Button
          variant="contained"
          disabled={!selected}
          onClick={() => {
            onConfirm(selected);
          }}
        >
          {t("common.confirm_button")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}