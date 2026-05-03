import { Card, CardContent, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Customer } from "@/types/customer";

type Props = { item: Customer };

export default function CustomerCard({ item }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id.toString(),
      data: { type: "customer", item },
    });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    opacity: isDragging ? 0.75 : 1,
    cursor: "grab",
  };

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      sx={{ bgcolor: "#fff", minWidth: 230 }}
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardContent>
        <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {item.phone}
        </Typography>
      </CardContent>
    </Card>
  );
}
