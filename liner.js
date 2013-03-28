"use strict";
var canvas, width, height, ctx, texture, i, to$, data, bytes, field, j, x, y, avg, k, ref$, dx, dy;
canvas = document.getElementById('canvas');
width = canvas.width, height = canvas.height;
ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, width, height);
texture = new Uint8Array(width * height);
for (i = 0, to$ = texture.length; i < to$; ++i) {
  texture[i] = Math.random() * 255;
}
data = ctx.getImageData(0, 0, width, height), bytes = data.data;
field = function(x, y){
  return [Math.sin(15 * x + y), Math.cos(4 * x + 11 * y)];
};
for (i = 0; i < width; ++i) {
  for (j = 0; j < height; ++j) {
    x = j / height;
    y = i / width;
    avg = 0;
    for (k = 0; k < 10; ++k) {
      avg += texture[y * height * height + x * width | 0];
      ref$ = field(x, y), dx = ref$[0], dy = ref$[1];
      x += dx / (1 + Math.abs(dx));
      y += dy / (1 + Math.abs(dy));
      if (!((-1 <= x && x < 1) && (-1 <= y && y < 1))) {
        break;
      }
    }
    bytes[(i * height + j) * 4 + 3] = avg / k;
  }
}
ctx.putImageData(data, 0, 0);