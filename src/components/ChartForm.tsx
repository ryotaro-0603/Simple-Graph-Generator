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

export function ChartForm() {
  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="chartType">グラフ種類</Label>
          <Select defaultValue="bar">
            <SelectTrigger id="chartType">
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
          <Select defaultValue="default">
            <SelectTrigger id="colorScheme">
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
            id="chartTitle"
            type="text"
            placeholder="グラフのタイトル"
            defaultValue="データ可視化"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="labels">ラベル</Label>
          <Textarea
            id="labels"
            placeholder="カンマ区切り (例: A,B,C)"
            defaultValue="1月,2月,3月,4月,5月,6月"
            className="font-mono"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="data">数値</Label>
          <Textarea
            id="data"
            placeholder="カンマ区切り (例: 10,20,30)"
            defaultValue="12,19,3,5,2,3"
            className="font-mono"
          />
        </div>

        <Button id="generateBtn" className="w-full">
          グラフを生成
        </Button>
      </div>
    </>
  );
}
