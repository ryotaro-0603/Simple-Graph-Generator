import { useState, useEffect, useRef } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ChartDownload } from './ChartDownload';

declare global {
  interface Window {
    Chart: any;
  }
}

export function ChartForm() {
  const [chartType, setChartType] = useState('bar');
  const [colorScheme, setColorScheme] = useState('default');
  const [chartTitle, setChartTitle] = useState('データ可視化');
  const [labels, setLabels] = useState('1月,2月,3月,4月,5月,6月');
  const [data, setData] = useState('12,19,3,5,2,3');
  const chartRef = useRef<any>(null);

  const generateColors = (count: number, scheme: string = 'default') => {
    const background: string[] = [];
    const border: string[] = [];

    const colorSchemes: Record<string, { base: number[], sat: number, light: number }> = {
      default: { base: Array.from({ length: count }, (_, i) => (i * 360 / count) % 360), sat: 70, light: 60 },
      blue: { base: [200, 210, 220, 230, 240, 190, 250], sat: 70, light: 60 },
      green: { base: [120, 130, 140, 110, 150, 100, 160], sat: 60, light: 55 },
      warm: { base: [0, 15, 30, 45, 350, 340, 20], sat: 75, light: 65 },
      cool: { base: [180, 200, 220, 240, 260, 190, 210], sat: 65, light: 60 },
      pastel: { base: Array.from({ length: count }, (_, i) => (i * 360 / count) % 360), sat: 50, light: 75 },
      vivid: { base: Array.from({ length: count }, (_, i) => (i * 360 / count) % 360), sat: 90, light: 55 },
      monochrome: { base: Array.from({ length: count }, () => 0), sat: 0, light: 50 }
    };

    const selectedScheme = colorSchemes[scheme] || colorSchemes.default;

    for (let i = 0; i < count; i++) {
      let hue: number;

      if (scheme === 'monochrome') {
        const lightness = 30 + (i * 50 / count);
        background.push(`hsla(0, 0%, ${lightness}%, 0.7)`);
        border.push(`hsla(0, 0%, ${lightness - 10}%, 1)`);
      } else {
        hue = selectedScheme.base[i % selectedScheme.base.length];
        background.push(`hsla(${hue}, ${selectedScheme.sat}%, ${selectedScheme.light}%, 0.7)`);
        border.push(`hsla(${hue}, ${selectedScheme.sat}%, ${selectedScheme.light - 10}%, 1)`);
      }
    }

    return { background, border };
  };

  const generateChart = () => {
    const labelsArray = labels.split(',').map(s => s.trim()).filter(s => s);
    const dataArray = data.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

    if (labelsArray.length === 0 || dataArray.length === 0) {
      alert('ラベルと数値を入力してください');
      return;
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const colors = generateColors(dataArray.length, colorScheme);
    const ctx = (document.getElementById('myChart') as HTMLCanvasElement)?.getContext('2d');

    if (!ctx || !window.Chart) {
      alert('Chart.jsが読み込まれていません');
      return;
    }

    const config = {
      type: chartType,
      data: {
        labels: labelsArray,
        datasets: [{
          label: chartTitle,
          data: dataArray,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: ['pie', 'doughnut'].includes(chartType)
          },
          title: {
            display: true,
            text: chartTitle,
            font: { size: 18 }
          }
        }
      }
    };

    chartRef.current = new window.Chart(ctx, config);
  };

  useEffect(() => {
    generateChart();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      generateChart();
    }
  }, [colorScheme]);

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="chartType">グラフ種類</Label>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger>
              <SelectValue placeholder="グラフ種類を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">棒グラフ</SelectItem>
              <SelectItem value="line">折れ線グラフ</SelectItem>
              <SelectItem value="pie">円グラフ</SelectItem>
              <SelectItem value="doughnut">ドーナツグラフ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="colorScheme">カラースキーム</Label>
          <Select value={colorScheme} onValueChange={setColorScheme}>
            <SelectTrigger>
              <SelectValue placeholder="カラースキームを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">デフォルト（レインボー）</SelectItem>
              <SelectItem value="blue">ブルー系</SelectItem>
              <SelectItem value="green">グリーン系</SelectItem>
              <SelectItem value="warm">暖色系</SelectItem>
              <SelectItem value="cool">寒色系</SelectItem>
              <SelectItem value="pastel">パステル</SelectItem>
              <SelectItem value="vivid">ビビッド</SelectItem>
              <SelectItem value="monochrome">モノクローム</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="chartTitle">タイトル</Label>
          <Input
            type="text"
            placeholder="グラフのタイトル"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="labels">ラベル</Label>
          <Textarea
            placeholder="カンマ区切り (例: A,B,C)"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="data">数値</Label>
          <Textarea
            placeholder="カンマ区切り (例: 10,20,30)"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="font-mono"
          />
        </div>

        <Button onClick={generateChart} className="w-full">
          グラフを生成
        </Button>
      </div>
      
      <ChartDownload chartRef={chartRef} />
    </>
  );
}
