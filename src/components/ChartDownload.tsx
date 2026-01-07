import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select } from './ui/select';

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
    <div className="mt-12 pt-12 border-t-2 border-gray-200">
      <h3 className="text-gray-800 mb-6 text-xl font-semibold">ダウンロード</h3>
      <div className="flex gap-3 items-center mb-6">
        <Label htmlFor="imageSize" className="font-semibold min-w-[100px] text-gray-700">
          画像サイズ:
        </Label>
        <Select
          id="imageSize"
          value={imageSize}
          onChange={(e) => setImageSize(e.target.value)}
        >
          <option value="1">1x (800x400)</option>
          <option value="2">2x (1600x800)</option>
          <option value="3">3x (2400x1200)</option>
          <option value="4">4x (3200x1600)</option>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={() => downloadImage('png')}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          PNG形式でダウンロード
        </Button>
        <Button
          onClick={() => downloadImage('jpg')}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          JPG形式でダウンロード
        </Button>
      </div>
    </div>
  );
}