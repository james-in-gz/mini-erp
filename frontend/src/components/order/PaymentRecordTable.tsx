import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

interface PaymentRecord {
  id: number;

  amount: number;

  method: string;

  remark: string;

  createdAt: string;
}

interface Props {
  records: PaymentRecord[];
}

export default function PaymentRecordTable({
  records,
}: Props) {

  return (
    <Table size="small">

      <TableHead>
        <TableRow>
          <TableCell>
            时间
          </TableCell>

          <TableCell>
            收款方式
          </TableCell>

          <TableCell>
            金额
          </TableCell>

          <TableCell>
            备注
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>

        {records.map((item) => (

          <TableRow key={item.id}>

            <TableCell>
              {item.createdAt}
            </TableCell>

            <TableCell>
              {item.method}
            </TableCell>

            <TableCell>
              ￥{item.amount}
            </TableCell>

            <TableCell>
              {item.remark}
            </TableCell>

          </TableRow>
        ))}

      </TableBody>
    </Table>
  );
}