let myChart = null;

function generateChart() {
  const chartType = document.getElementById('chartType').value;
  const chartTitle = document.getElementById('chartTitle').value;
  const labelsInput = document.getElementById('labels').value;
  const dataInput = document.getElementById('data').value;

  const labels = labelsInput.split(',').map(s => s.trim()).filter(s => s);
  const data = dataInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

  if (labels.length === 0 || data.length === 0) {
    alert('ラベルと数値を入力してください');
    return;
  }

  if (myChart) {
    myChart.destroy();
  }

  const colors = generateColors(data.length);
  const ctx = document.getElementById('myChart').getContext('2d');

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

  myChart = new Chart(ctx, config);
}

function generateColors(count) {
  const background = [];
  const border = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360 / count) % 360;
    background.push(`hsla(${hue}, 70%, 60%, 0.7)`);
    border.push(`hsla(${hue}, 70%, 50%, 1)`);
  }
  return { background, border };
}

function downloadImage(format) {
  if (!myChart) {
    alert('まずグラフを生成してください');
    return;
  }

  const scale = parseFloat(document.getElementById('imageSize').value);
  const canvas = document.getElementById('myChart');
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = originalWidth * scale;
  tempCanvas.height = originalHeight * scale;
  const tempCtx = tempCanvas.getContext('2d');

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
document.getElementById('generateBtn').addEventListener('click', generateChart);
document.getElementById('downloadPNG').addEventListener('click', downloadPNG);
document.getElementById('downloadJPG').addEventListener('click', downloadJPG);

// 初回読み込み時にグラフを生成
window.addEventListener('load', generateChart);
