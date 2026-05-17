import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';

// 1. 定义 Props 类型接口
interface PrintLabelButtonProps {
  waybillNo: string;
}
export default function ShipmentActions({ waybillNo }: PrintLabelButtonProps) {
  const [open, setOpen] = useState(false);

  // 拼接后端代理接口的 URL
  const pdfUrl = `/api/shipments/label/pdf/${waybillNo}`;

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  // 当 iframe 加载完 PDF 后触发打印
  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    e.currentTarget.contentWindow?.print();
  };

  return (
    <>
      <Button 
        variant="outlined" 
        size="small" 
        startIcon={<PrintIcon />}
        onClick={handleOpen}
      >
        打印面单
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          面单预览
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* 核心：使用 iframe 嵌入后端的 PDF 流接口 */}
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
            onLoad={handleIframeLoad}
            title="面单预览"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
