"use strict";
function binterp(texture, x, y, width, height){
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
function lic(image, texture, fieldX, fieldY, distance){
  var width, height, bytes, p, m, i, j, x, y, tex, k, dx, dy, l, to$, results$ = [];
  width = image.width, height = image.height;
  bytes = image.data;
  p = 0;
  m = height * width;
  for (i = 0; i < height; ++i) {
    for (j = 0; j < width; ++j) {
      x = j * 2 / width - 1;
      y = i * 2 / height - 1;
      tex = 0;
      for (k = 1; k < distance; ++k) {
        tex += binterp(texture, x, y, width, height);
        dx = binterp(fieldX, x, y, width, height);
        dy = binterp(fieldY, x, y, width, height);
        x += dx / (1 + Math.abs(dx)) / width;
        y += dy / (1 + Math.abs(dy)) / height;
        if (!((-1 <= x && x <= 1) && (-1 <= y && y <= 1))) {
          break;
        }
      }
      x = j * 2 / width - 1;
      y = i * 2 / height - 1;
      for (l = k, to$ = k + distance; l < to$; ++l) {
        tex += binterp(texture, x, y, width, height);
        dx = binterp(fieldX, x, y, width, height);
        dy = binterp(fieldY, x, y, width, height);
        x -= dx / (1 + Math.abs(dx)) / width;
        y -= dy / (1 + Math.abs(dy)) / height;
        if (!((-1 <= x && x <= 1) && (-1 <= y && y <= 1))) {
          break;
        }
      }
      bytes[(i * height + j) * 4 + 3] = tex / l;
    }
    p += width;
    results$.push(progress(p / m));
  }
  return results$;
}
function progress(it){
  return postMessage({
    type: 'progress',
    value: it
  });
}
function log(it){
  return postMessage({
    type: 'log',
    message: it
  });
}
this.onmessage = function(arg$){
  var data, image, texture, fieldX, fieldY, distance;
  data = arg$.data, image = data.image, texture = data.texture, fieldX = data.fieldX, fieldY = data.fieldY, distance = data.distance;
  lic(image, texture, fieldX, fieldY, distance);
  postMessage({
    image: image
  });
};