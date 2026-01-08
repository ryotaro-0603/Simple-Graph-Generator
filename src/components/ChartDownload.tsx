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

declare global {
  interface Window {
    chartInstance?: any;
    Chart: any;
  }
}

export function ChartDownload() {
  const [imageSize, setImageSize] = useState('2');

  const downloadImage = (format: 'png' | 'jpg') => {
    if (!window.chartInstance) {
      alert('まずグラフを生成してください');
      return;
    }

    const scale = parseFloat(imageSize);
    const originalChart = window.chartInstance;

    // 高解像度用の一時キャンバスを作成
    const tempCanvas = document.createElement('canvas');
    const rect = document.getElementById('myChart')?.getBoundingClientRect();
    if (!rect) return;

    tempCanvas.width = rect.width * scale;
    tempCanvas.height = rect.height * scale;

    // 背景を白に設定するプラグイン
    const backgroundPlugin = {
      id: 'customBackground',
      beforeDraw: (chart: any) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      },
    };

    // 高解像度チャートを生成
    const tempChart = new window.Chart(tempCanvas, {
      type: originalChart.config.type,
      data: {
        labels: originalChart.data.labels,
        datasets: originalChart.data.datasets.map((dataset: any) => ({
          label: dataset.label,
          data: [...dataset.data],
          backgroundColor: [...dataset.backgroundColor],
          borderColor: [...dataset.borderColor],
          borderWidth: dataset.borderWidth,
        })),
      },
      options: {
        responsive: originalChart.config.options.responsive,
        maintainAspectRatio: originalChart.config.options.maintainAspectRatio,
        devicePixelRatio: scale,
        animation: false,
        plugins: originalChart.config.options.plugins,
        scales: originalChart.config.options.scales,
      },
      plugins: [backgroundPlugin],
    });

    // 描画完了後にダウンロード
    setTimeout(() => {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'jpg' ? 1.0 : undefined;
      const url = tempCanvas.toDataURL(mimeType, quality);

      const link = document.createElement('a');
      link.download = `chart.${format}`;
      link.href = url;
      link.click();

      tempChart.destroy();
    }, 200);
  };

  return (
    <div>
      <h3 className="text-neutral-700 mb-6 text-xl font-semibold">Download</h3>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Label htmlFor="imageSize" className="font-semibold text-gray-700">
            画像サイズ:
          </Label>
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
        <div className="flex gap-4">
          <Button onClick={() => downloadImage('png')}>
            PNG形式でダウンロード
          </Button>
          <Button onClick={() => downloadImage('jpg')}>
            JPG形式でダウンロード
          </Button>
        </div>
      </div>
    </div>
  );
}
