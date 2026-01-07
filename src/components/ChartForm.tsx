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
import { ChartDownload } from './ChartDownload';

declare global {
  interface Window {
    Chart: any;
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
    const labelsArray = dataEntries.map((e) => e.label.trim()).filter((s) => s);
    const dataArray = dataEntries
      .map((e) => parseFloat(e.value.trim()))
      .filter((n) => !isNaN(n));

    if (labelsArray.length === 0 || dataArray.length === 0) {
      alert('ラベルと数値を入力してください');
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
            font: { size: 18 },
          },
        },
      },
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
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="grid gap-2">
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

          <div className="grid gap-2">
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
                <SelectItem value="default">
                  デフォルト（レインボー）
                </SelectItem>
                <SelectItem value="blue">ブルー系</SelectItem>
                <SelectItem value="green">グリーン系</SelectItem>
                <SelectItem value="warm">暖色系</SelectItem>
                <SelectItem value="cool">寒色系</SelectItem>
                <SelectItem value="pastel">パステル</SelectItem>
                <SelectItem value="vivid">ビビッド</SelectItem>
                <SelectItem value="monochrome">モノクローム</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

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
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between mb-1">
            <Label className="text-sm font-semibold text-gray-700">
              データ入力
            </Label>
            <Button
              onClick={addEntry}
              variant="outline"
              size="sm"
              className="h-9 px-4 font-medium hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors"
            >
              ✨ 項目を追加
            </Button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {dataEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex gap-2 items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white font-semibold text-sm shadow-sm">
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
                  className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  🗑️
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={generateChart}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
        >
          🚀 グラフを生成
        </Button>
      </div>

      <ChartDownload chartRef={chartRef} />
    </>
  );
}
