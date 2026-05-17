import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import request from '@/api/request'; // 使用你封装好的 axios 实例

// 1. 定义 Props 类型接口
interface PrintLabelButtonProps {
  waybillNo: string;
}

export default function ShipmentActions({ waybillNo }: PrintLabelButtonProps) {
  const [open, setOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // 清理 Blob URL 的函数
  const cleanupBlobUrl = () => {
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl('');
    }
  };

  // 关闭弹窗时清理资源
  const handleClose = () => {
    setOpen(false);
    cleanupBlobUrl();
  };

  // 打开弹窗并获取 PDF
  const handleOpen = async () => {
    setOpen(true);
    setIsLoading(true);
    
    try {
      // 使用你封装好的 axios 实例（会自动携带 Token）
      // 注意：需要设置 responseType: 'blob'
      const response = await request.get(`/shipments/label/pdf/${waybillNo}`, {
        responseType: 'blob',
      });
      
      // 创建 Blob URL
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (error) {
      console.error('获取面单失败:', error);
      // 这里可以添加错误提示
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

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
          {isLoading ? (
            <div style={{ 
              height: '600px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              加载中...
            </div>
          ) : pdfBlobUrl ? (
            <iframe
              src={pdfBlobUrl}
              width="100%"
              height="600px"
              style={{ border: 'none' }}
              onLoad={handleIframeLoad}
              title="面单预览"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}