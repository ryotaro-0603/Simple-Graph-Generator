import { useState, useEffect, useRef } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

declare global {
  interface Window {
    Chart: any;
    chartInstance?: any;
  }
}

interface DataEntry {
  id: string;
  label: string;
  value: string;
}

export function ChartForm() {
  const [chartType, setChartType] = useState('bar');
  const [colorScheme, setColorScheme] = useState('default');
  const [chartTitle, setChartTitle] = useState('データ可視化');
  const [yAxisMin, setYAxisMin] = useState('');
  const [yAxisMax, setYAxisMax] = useState('');
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([
    { id: '1', label: '1月', value: '12' },
    { id: '2', label: '2月', value: '19' },
    { id: '3', label: '3月', value: '3' },
    { id: '4', label: '4月', value: '5' },
    { id: '5', label: '5月', value: '2' },
    { id: '6', label: '6月', value: '3' },
  ]);
  const chartRef = useRef<any>(null);

  const generateColors = (count: number, scheme: string = 'default') => {
    const background: string[] = [];
    const border: string[] = [];

    const colorSchemes: Record<
      string,
      { base: number[]; sat: number; light: number }
    > = {
      default: {
        base: Array.from(
          { length: count },
          (_, i) => ((i * 360) / count) % 360,
        ),
        sat: 70,
        light: 60,
      },
      blue: { base: [200, 210, 220, 230, 240, 190, 250], sat: 70, light: 60 },
      green: { base: [120, 130, 140, 110, 150, 100, 160], sat: 60, light: 55 },
      warm: { base: [0, 15, 30, 45, 350, 340, 20], sat: 75, light: 65 },
      cool: { base: [180, 200, 220, 240, 260, 190, 210], sat: 65, light: 60 },
      pastel: {
        base: Array.from(
          { length: count },
          (_, i) => ((i * 360) / count) % 360,
        ),
        sat: 50,
        light: 75,
      },
      vivid: {
        base: Array.from(
          { length: count },
          (_, i) => ((i * 360) / count) % 360,
        ),
        sat: 90,
        light: 55,
      },
      monochrome: {
        base: Array.from({ length: count }, () => 0),
        sat: 0,
        light: 50,
      },
    };

    const selectedScheme = colorSchemes[scheme] || colorSchemes.default;

    for (let i = 0; i < count; i++) {
      let hue: number;

      if (scheme === 'monochrome') {
        const lightness = 30 + (i * 50) / count;
        background.push(`hsla(0, 0%, ${lightness}%, 0.7)`);
        border.push(`hsla(0, 0%, ${lightness - 10}%, 1)`);
      } else {
        hue = selectedScheme.base[i % selectedScheme.base.length];
        background.push(
          `hsla(${hue}, ${selectedScheme.sat}%, ${selectedScheme.light}%, 0.7)`,
        );
        border.push(
          `hsla(${hue}, ${selectedScheme.sat}%, ${selectedScheme.light - 10}%, 1)`,
        );
      }
    }

    return { background, border };
  };

  const addEntry = () => {
    const newId = Date.now().toString();
    setDataEntries([...dataEntries, { id: newId, label: '', value: '' }]);
  };

  const removeEntry = (id: string) => {
    if (dataEntries.length > 1) {
      setDataEntries(dataEntries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (id: string, field: 'label' | 'value', value: string) => {
    setDataEntries(
      dataEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const generateChart = () => {
    // 空白のラベルには "(空白)" を、無効な数値には 0 を設定
    const labelsArray = dataEntries.map((e, index) => {
      const label = e.label.trim();
      return label || `項目${index + 1}`;
    });

    const dataArray = dataEntries.map((e) => {
      const value = parseFloat(e.value.trim());
      return isNaN(value) ? 0 : value;
    });

    if (dataEntries.length === 0) {
      alert('最低1つのデータを入力してください');
      return;
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const colors = generateColors(dataArray.length, colorScheme);
    const ctx = (
      document.getElementById('myChart') as HTMLCanvasElement
    )?.getContext('2d');

    if (!ctx || !window.Chart) {
      alert('Chart.jsが読み込まれていません');
      return;
    }

    const config = {
      type: chartType,
      data: {
        labels: labelsArray,
        datasets: [
          {
            label: chartTitle,
            data: dataArray,
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: ['pie', 'doughnut'].includes(chartType),
          },
          title: {
            display: true,
            text: chartTitle,
            font: { size: 14, weight: 'normal' },
            align: 'start',
            padding: { bottom: 20 },
          },
        },
        scales: ['bar', 'line'].includes(chartType)
          ? {
              y: {
                min: yAxisMin ? parseFloat(yAxisMin) : undefined,
                max: yAxisMax ? parseFloat(yAxisMax) : undefined,
              },
            }
          : undefined,
      },
    };

    chartRef.current = new window.Chart(ctx, config);
    window.chartInstance = chartRef.current;
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
    <div className="space-y-6">
      <div className="space-y-6 bg-white rounded-xl p-12 md:p-6 border border-neutral-200">
        <div className="flex justify-between items-center">
          <Label
            htmlFor="chartType"
            className="text-sm font-semibold text-gray-700"
          >
            グラフ種類
          </Label>
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

        <div className="flex justify-between items-center">
          <Label
            htmlFor="colorScheme"
            className="text-sm font-semibold text-gray-700"
          >
            カラースキーム
          </Label>
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
      </div>

      <div className="space-y-6 bg-white rounded-xl p-12 md:p-6 border border-neutral-200">
        <div className="grid gap-2">
          <Label
            htmlFor="chartTitle"
            className="text-sm font-semibold text-gray-700"
          >
            タイトル
          </Label>
          <Input
            type="text"
            placeholder="グラフのタイトル"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
            className="h-11"
          />
        </div>

        {['bar', 'line'].includes(chartType) && (
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label
                htmlFor="yAxisMin"
                className="text-sm font-semibold text-gray-700"
              >
                Y軸最小値
              </Label>
              <Input
                type="number"
                placeholder="自動"
                value={yAxisMin}
                onChange={(e) => setYAxisMin(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="yAxisMax"
                className="text-sm font-semibold text-gray-700"
              >
                Y軸最大値
              </Label>
              <Input
                type="number"
                placeholder="自動"
                value={yAxisMax}
                onChange={(e) => setYAxisMax(e.target.value)}
                className="h-11"
              />
            </div>
          </div>
        )}

        <div className="grid gap-3">
          <div className="flex items-center justify-between mb-1">
            <Label className="text-sm font-semibold text-gray-700">
              データ入力
            </Label>
            <Button onClick={addEntry} variant="outline">
              項目を追加
            </Button>
          </div>

          <div className="space-y-3">
            {dataEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex gap-2 items-center p-3 rounded-lg bg-neutral-100 border border-gray-200 hover:border-neutral-300 transition-all"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-800 text-white font-semibold text-xs">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    placeholder="ラベル"
                    value={entry.label}
                    onChange={(e) =>
                      updateEntry(entry.id, 'label', e.target.value)
                    }
                    className="h-10"
                  />
                  <Input
                    type="text"
                    placeholder="数値"
                    value={entry.value}
                    onChange={(e) =>
                      updateEntry(entry.id, 'value', e.target.value)
                    }
                    className="h-10"
                  />
                </div>
                <Button
                  onClick={() => removeEntry(entry.id)}
                  variant="ghost"
                  size="sm"
                  disabled={dataEntries.length === 1}
                  className="size-8 p-0 hover:bg-neutral-300 cursor-pointer"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={generateChart}>グラフを生成</Button>
      </div>
    </div>
  );
}
