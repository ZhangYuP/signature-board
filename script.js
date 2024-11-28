const canvas = document.getElementById('signature-board');
resizeCanvas();
window.addEventListener('resize', onResize);
function onResize() {
  resizeCanvas();
}
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = canvas.width / 2;
}

let ctx;
let color = '#000000';
let size = 5;
let url;
if (!canvas.getContext) {
  alert('浏览器不支持');
} else {
  ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round'
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  canvas.addEventListener('mousedown', drawStart);
  canvas.addEventListener('mouseup', drawEnd);
  canvas.addEventListener('mouseout', drawEnd);
  canvas.addEventListener('touchstart', drawStart);
  canvas.addEventListener('touchend', drawEnd);
  canvas.addEventListener('touchcancel', drawEnd);
}

function drawStart(e) {
  console.log('start', e);
  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('touchmove', drawing);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.beginPath();
  ctx.moveTo(e.offsetX || e.touches[0].clientX - canvas.offsetLeft, e.offsetY || e.touches[0].clientY - canvas.offsetTop);
}

function drawing(e) {
  console.log('ing', e);
  ctx.lineTo(e.offsetX || e.touches[0].clientX - canvas.offsetLeft, e.offsetY || e.touches[0].clientY - canvas.offsetTop);
  ctx.stroke();
}

function drawEnd(e) {
  console.log('end', e);
  canvas.removeEventListener('mousemove', drawing);
  canvas.removeEventListener('touchmove', drawing);
}

const clear = document.getElementById('clear');
clear.onclick = function() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = document.getElementById('preview');
  img.remove();
  URL.revokeObjectURL(url);
};
// 保存图片
const save = document.getElementById('save');
save.onclick = downloadCanvas;
function downloadCanvas(type = 'images/png', quality = 1) {
  canvas.toBlob(blob => {
    url = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.id = 'preview';
    img.src = url;
    document.body.appendChild(img);
  }, type, quality);
}
// 下载图片
const download = document.getElementById('download');
download.onclick = function() {
  if (!url) return alert('请先保存')
  aTagDownload(url);
}
// a标签下载
function aTagDownload(url) {
  let a = document.createElement('a');
  a.download = 'signature';
  a.href = url;
  a.click();
  a = null;
}
// 颜色选择
const colorPicker = document.getElementById('color');
colorPicker.oninput = function(e) {
  color = e.target.value;
};
// 线宽选择
const sizePicker = document.getElementById('size');
sizePicker.oninput = function(e) {
  size = e.target.value;
};