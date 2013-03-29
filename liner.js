"use strict";
var canvas, width, height, ctx, texture, i, to$, image, fieldX, fieldY, j, x, y, progress, x0$, worker;
canvas = document.getElementById('canvas');
width = canvas.width, height = canvas.height;
ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, width, height);
texture = ctx.createImageData(width, height);
for (i = 3, to$ = texture.data.length; i < to$; i += 4) {
  texture.data[i] = Math.random() * 255 | 0;
}
image = ctx.getImageData(0, 0, width, height);
fieldX = new Float32Array(width * height);
fieldY = new Float32Array(width * height);
for (i = 0; i < height; ++i) {
  for (j = 0; j < width; ++j) {
    x = j * 2 / width - 1;
    y = i * 2 / height - 1;
    fieldX[i * height + j] = Math.sin(5 * x + y);
    fieldY[i * height + j] = Math.cos(2 * x + 6 * y);
  }
}
progress = document.getElementById('progress');
x0$ = worker = new Worker('render-worker.js');
x0$.onmessage = function(e){
  if (e.data.type === 'log') {
    console.log(e.data.message);
  } else if (e.data.type === 'progress') {
    progress.value = e.data.value;
  } else {
    ctx.putImageData(e.data.image, 0, 0);
    progress.hidden = true;
  }
};
x0$.postMessage({
  image: image,
  texture: texture,
  fieldX: fieldX,
  fieldY: fieldY,
  distance: 20
});
progress.hidden = false;