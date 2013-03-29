(function(){
  "use strict";
  var canvas, width, height, ctx, texture, i, to$, data, bytes, j, x, y, tex, k, dx, dy;
  canvas = document.getElementById('canvas');
  width = canvas.width, height = canvas.height;
  ctx = canvas.getContext('2d');
  ctx.fillRect(0, 0, width, height);
  texture = new Uint8Array(width * height);
  for (i = 0, to$ = texture.length; i < to$; ++i) {
    texture[i] = Math.random() * 255 | 0;
  }
  function binterp(x, y){
    var x1, x2, y1, y2, a, b, ab, c, d, cd;
    x = (x + 1) * width / 2;
    y = (y + 1) * height / 2;
    x1 = Math.floor(x);
    x2 = Math.ceil(x);
    y1 = Math.floor(y);
    y2 = Math.ceil(y);
    if (x1 === x) {
      if (y1 === y) {
        return texture[y * height + x] || 0;
      } else {
        a = texture[y1 * height + x] || 0;
        b = texture[y2 * height + x] || 0;
        return ab = (y2 - y) * a + (y - y1) * b;
      }
    } else if (y1 === y) {
      a = texture[y * height + x1] || 0;
      b = texture[y * height + x2] || 0;
      return ab = (x2 - x) * a + (x - x1) * b;
    } else {
      a = texture[y1 * height + x1] || 0;
      b = texture[y1 * height + x2] || 0;
      c = texture[y2 * height + x1] || 0;
      d = texture[y2 * height + x2] || 0;
      ab = (x2 - x) * a + (x - x1) * b;
      cd = (x2 - x) * c + (x - x1) * d;
      return (y2 - y) * ab + (y - y1) * cd;
    }
  }
  data = ctx.getImageData(0, 0, width, height), bytes = data.data;
  for (i = 0; i < height; ++i) {
    for (j = 0; j < width; ++j) {
      x = j * 2 / width - 1;
      y = i * 2 / height - 1;
      tex = 0;
      for (k = 1; k < 20; ++k) {
        tex += binterp(x, y);
        dx = Math.sin(5 * x + y);
        dy = Math.cos(2 * x + 6 * y);
        x += dx / (1 + Math.abs(dx)) / width;
        y += dy / (1 + Math.abs(dy)) / height;
        if (!((-1 <= x && x <= 1) && (-1 <= y && y <= 1))) {
          break;
        }
      }
      bytes[(i * height + j) * 4 + 3] = tex / k;
    }
  }
  ctx.putImageData(data, 0, 0);
}).call(this);
