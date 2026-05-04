import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomerCard from "./CustomerCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Customer } from "@/types/customer";

type ColumnProps = {
  status: string;
  items?: Customer[];
};

const STATUS_KEY_MAP: Record<string, string> = {
  new: "status.new",
  interested: "status.interested",
  negotiating: "status.negotiating",
  won: "status.won",
  lost: "status.lost",
};

export default function Column({ status, items = [] }: ColumnProps) {
  const { t } = useTranslation();
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const statusLabel = t(STATUS_KEY_MAP[status] || status);

  return (
    <Box
      ref={setNodeRef}
      sx={{ minWidth: 250, bgcolor: "#f5f5f5", p: 1, borderRadius: 2 }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        {statusLabel} ({items.length})
      </Typography>

      <SortableContext
        items={items.map((item) => item.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <Stack sx={{ spacing: 1 }}>
          {items.map((item) => (
            <CustomerCard key={item.id} item={item} />
          ))}
        </Stack>
      </SortableContext>
    </Box>
  );
}
