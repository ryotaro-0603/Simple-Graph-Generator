// chart.ts - クライアントサイドで実行されるチャート関連の関数

export function initChart() {
  let myChart: any = null;

  function generateChart() {
    const chartType = (document.getElementById('chartType') as HTMLSelectElement).value;
    const chartTitle = (document.getElementById('chartTitle') as HTMLInputElement).value;
    const labelsInput = (document.getElementById('labels') as HTMLTextAreaElement).value;
    const dataInput = (document.getElementById('data') as HTMLTextAreaElement).value;
    const colorScheme = (document.getElementById('colorScheme') as HTMLSelectElement).value;

    const labels = labelsInput.split(',').map(s => s.trim()).filter(s => s);
    const data = dataInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

    if (labels.length === 0 || data.length === 0) {
      alert('ラベルと数値を入力してください');
      return;
    }

    if (myChart) {
      myChart.destroy();
    }

    const colors = generateColors(data.length, colorScheme);
    const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');

    const config = {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: chartTitle,
          data: data,
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

    // @ts-ignore - Chart.js is loaded via CDN
    myChart = new Chart(ctx, config);
  }

  function generateColors(count: number, scheme: string = 'default') {
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
  }

  function downloadImage(format: 'png' | 'jpg') {
    if (!myChart) {
      alert('まずグラフを生成してください');
      return;
    }

    const scale = parseFloat((document.getElementById('imageSize') as HTMLSelectElement).value);
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
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
  }

  function downloadPNG() {
    downloadImage('png');
  }

  function downloadJPG() {
    downloadImage('jpg');
  }

  // イベントリスナー
  document.getElementById('generateBtn')?.addEventListener('click', generateChart);
  document.getElementById('downloadPNG')?.addEventListener('click', downloadPNG);
  document.getElementById('downloadJPG')?.addEventListener('click', downloadJPG);
  document.getElementById('colorScheme')?.addEventListener('change', generateChart);

  // 初回読み込み時にグラフを生成
  window.addEventListener('load', generateChart);
}
