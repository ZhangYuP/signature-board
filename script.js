const rangeInput = document.getElementById('size');
rangeInput.ontouchmove = function(e) {
  e.stopPropagation();
};
document.body.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, {
  passive: false,
});

let drawHistory = [];
let index = -1;

const canvas = document.getElementById('signature-board');
resizeCanvas();
window.addEventListener('resize', onResize);
function onResize() {
  resizeCanvas();
}
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let ctx;
let color = '#000000';
let size = 5;
let url;
let isDrawing = false;
if (!canvas.getContext) {
  alert('浏览器不支持');
} else {
  ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round'
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  saveHistory();
  canvas.addEventListener('mousedown', drawStart);
  canvas.addEventListener('mouseup', drawEnd);
  canvas.addEventListener('mouseout', drawEnd);
  canvas.addEventListener('touchstart', drawStart);
  canvas.addEventListener('touchend', drawEnd);
  canvas.addEventListener('touchcancel', drawEnd);
}

function drawStart(e) {
  console.log('start', e);
  isDrawing = true;
  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('touchmove', drawing);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.beginPath();
  ctx.moveTo(e.offsetX || e.touches[0].clientX - canvas.offsetLeft, e.offsetY || e.touches[0].clientY - canvas.offsetTop);
}

function drawing(e) {
  console.log('ing', e);
  if (isDrawing) {
    ctx.lineTo(e.offsetX || e.touches[0].clientX - canvas.offsetLeft, e.offsetY || e.touches[0].clientY - canvas.offsetTop);
    ctx.stroke();
  }
}

function drawEnd(e) {
  console.log('end', e);
  canvas.removeEventListener('mousemove', drawing);
  canvas.removeEventListener('touchmove', drawing);
  if (isDrawing) {
    saveHistory();
  }
  isDrawing = false;
}

async function saveHistory() {
  console.log(index,drawHistory)
  const url = await downloadCanvas();
  if (index < drawHistory.length - 1) {
    drawHistory.splice(index + 1);
  }
  drawHistory.push(url);
  if (drawHistory.length > 10) {
    drawHistory.shift();
  }
  index = drawHistory.length - 1;
  
  console.log(11,index,drawHistory)
  disabled(undo, index === 0);
  disabled(redo, index === drawHistory.length - 1); 
  disabled(download, index === 0);
}
// 撤销
const undo = document.getElementById('undo');
disabled(undo, true);
undo.onclick = function(e) {
  console.log(1111, index)
  e.stopPropagation();
  const img = new Image();
  img.src = drawHistory[--index];
  img.onload = function(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  disabled(undo, index === 0);
  disabled(redo, index === drawHistory.length - 1);
}
// 重做
const redo = document.getElementById('redo');
disabled(redo, true);
redo.onclick = function() {
  const img = new Image();
  img.src = drawHistory[++index];
  img.onload = function(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  disabled(undo, index === 0);
  disabled(redo, index === drawHistory.length - 1);
}

const clear = document.getElementById('clear');
clear.onclick = function() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHistory = [];
  index = -1;
  saveHistory();
};
// 保存图片
function downloadCanvas(type = 'images/png', quality = 1) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => {
        url = URL.createObjectURL(blob);
        resolve(url);
      }, type, quality);
    } catch (e) {
      reject(e);
    }
  });
}
// 下载图片
const download = document.getElementById('download');
disabled(download, true);
download.onclick = async function() {
  const url = await downloadCanvas();
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

function disabled(el, bool) {
  if (bool) {
    el.setAttribute('disabled', '');
  } else {
    el.removeAttribute('disabled');
  }
}