import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ChartDownloadProps {
  chartRef: React.MutableRefObject<any>;
}

export function ChartDownload({ chartRef }: ChartDownloadProps) {
  const [imageSize, setImageSize] = useState('2');

  const downloadImage = (format: 'png' | 'jpg') => {
    if (!chartRef.current) {
      alert('まずグラフを生成してください');
      return;
    }

    const scale = parseFloat(imageSize);
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    
    if (!canvas) {
      alert('キャンバスが見つかりません');
      return;
    }

    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = originalWidth * scale;
    tempCanvas.height = originalHeight * scale;
    const tempCtx = tempCanvas.getContext('2d')!;

    // 白い背景を追加
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.scale(scale, scale);
    tempCtx.drawImage(canvas, 0, 0);

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpg' ? 0.95 : undefined;
    const url = tempCanvas.toDataURL(mimeType, quality);

    const link = document.createElement('a');
    link.download = `chart.${format}`;
    link.href = url;
    link.click();
  };

  return (
    <div className="download-section">
      <h3>ダウンロード</h3>
      <div className="size-selector">
        <Label htmlFor="imageSize">画像サイズ:</Label>
        <Select value={imageSize} onValueChange={setImageSize}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1x (800x400)</SelectItem>
            <SelectItem value="2">2x (1600x800)</SelectItem>
            <SelectItem value="3">3x (2400x1200)</SelectItem>
            <SelectItem value="4">4x (3200x1600)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="download-buttons">
        <Button 
          onClick={() => downloadImage('png')} 
          className="download-btn"
        >
          PNG形式でダウンロード
        </Button>
        <Button 
          onClick={() => downloadImage('jpg')} 
          className="download-btn"
        >
          JPG形式でダウンロード
        </Button>
      </div>
    </div>
  );
}