"use strict";
var $, canvas, width, height, ctx, x0$, useNoise, x1$, useImage, x2$, change, rendering, x3$, cancel, btn, worker;
$ = function(it){
  return document.getElementById(it);
};
canvas = $('canvas');
width = canvas.width, height = canvas.height;
ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, width, height);
x0$ = useNoise = $('noise');
x0$.addEventListener('change', function(){
  ctx.fillRect(0, 0, width, height);
  genNoise();
});
if (x0$.checked) {
  genNoise();
}
x1$ = useImage = $('image');
x1$.addEventListener('change', function(){
  if ($('file').files[0]) {
    change.call($('file'));
  } else {
    $('file').click();
  }
});
x2$ = $('file');
x2$.addEventListener('change', change = function(){
  var that, img;
  if (that = this.files[0]) {
    useImage.checked = true;
    img = new Image;
    img.src = URL.createObjectURL(that);
    return img.onload = function(){
      ctx.clearRect(0, 0, width, height);
      return ctx.drawImage(img, 0, 0, width, height);
    };
  }
});
change.call(x2$);
$('clear-image').onclick = function(){
  $('file').value = '';
};
function genNoise(){
  var image, i, to$;
  image = ctx.getImageData(0, 0, width, height);
  for (i = 3, to$ = image.data.length; i < to$; i += 4) {
    image.data[i] = Math.random() * 255 | 0;
  }
  return ctx.putImageData(image, 0, 0);
}
rendering = false;
x3$ = cancel = $('cancel');
x3$.onclick = function(){
  if (rendering) {
    return finish();
  }
};
btn = $('render');
function finish(){
  progress.hidden = true;
  btn.disabled = false;
  useNoise.disabled = false;
  useImage.disabled = false;
  $('file').disabled = false;
  btn.textContent = 'Render';
  cancel.hidden = true;
  worker.terminate();
  return rendering = false;
}
btn.addEventListener('click', function(){
  var texture, image, fieldX, fieldY, i, to$, j, to1$, x, y, progress, x4$, distance;
  rendering = true;
  btn.textContent = 'Rendering...';
  btn.disabled = true;
  cancel.hidden = false;
  useNoise.disabled = true;
  useImage.disabled = true;
  $('file').disabled = true;
  texture = ctx.getImageData(0, 0, width, height);
  image = ctx.getImageData(0, 0, width, height);
  fieldX = new Float32Array(width * height);
  fieldY = new Float32Array(width * height);
  for (i = 0, to$ = height; i < to$; ++i) {
    for (j = 0, to1$ = width; j < to1$; ++j) {
      x = j * 2 / width - 1;
      y = i * 2 / height - 1;
      fieldX[i * height + j] = Math.sin(5 * x + y);
      fieldY[i * height + j] = Math.cos(2 * x + 6 * y);
    }
  }
  progress = document.getElementById('progress');
  x4$ = worker = new Worker('render-worker.js');
  x4$.onmessage = function(e){
    if (e.data.type === 'log') {
      console.log(e.data.message);
    } else if (e.data.type === 'progress') {
      progress.value = e.data.value;
    } else {
      ctx.putImageData(e.data.image, 0, 0);
      finish();
    }
  };
  distance = parseInt($('distance').value, 10) || 10;
  x4$.postMessage({
    image: image,
    texture: texture,
    fieldX: fieldX,
    fieldY: fieldY,
    distance: distance
  });
  progress.hidden = false;
});