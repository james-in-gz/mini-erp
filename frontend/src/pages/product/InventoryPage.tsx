import { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";
import request from "@/api/request";

export default function InventoryPage() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    request.get("/inventory").then(res => setList(res.data));
  }, []);

  return (
    <Card>
      <CardContent>
        {list.map((i) => (
          <div key={i.id}>
            SKU: {i.sku?.name} | 库存: {i.stock}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}