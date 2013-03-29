"use strict";
var $, canvas, width, height, ctx, x0$, useNoise, x1$, useImage, x2$, change, rendering, x3$, cancel, btn, progress, worker;
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
progress = $('progress');
function finish(){
  progress.hidden = true;
  btn.disabled = false;
  useNoise.disabled = false;
  useImage.disabled = false;
  $('file').disabled = false;
  btn.textContent = 'Render';
  cancel.hidden = true;
  if (typeof worker != 'undefined' && worker !== null) {
    worker.terminate();
  }
  return rendering = false;
}
finish();
btn.addEventListener('click', function(){
  var texture, image, launchWorker, fieldX, fieldY, i, to$, j, to1$, x, y, to2$, to3$, fx, fy, xloaded, yloaded, f;
  rendering = true;
  btn.textContent = 'Rendering...';
  btn.disabled = true;
  cancel.hidden = false;
  useNoise.disabled = true;
  useImage.disabled = true;
  $('file').disabled = true;
  progress.hidden = false;
  progress.value = '';
  texture = ctx.getImageData(0, 0, width, height);
  image = ctx.getImageData(0, 0, width, height);
  launchWorker = function(){
    var x4$, distance;
    console.log('launching worker');
    x4$ = worker = new Worker('render-worker.js');
    x4$.onmessage = function(e){
      if (e.data.type === 'log') {
        console.log(e.data.message);
      } else if (e.data.type === 'progress') {
        progress.value = e.data.value;
      } else {
        ctx.clearRect(0, 0, width, height);
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
    return x4$;
  };
  fieldX = new Float32Array(width * height);
  fieldY = new Float32Array(width * height);
  if ($('sine').checked) {
    for (i = 0, to$ = height; i < to$; ++i) {
      for (j = 0, to1$ = width; j < to1$; ++j) {
        x = j * 2 / width - 1;
        y = i * 2 / height - 1;
        fieldX[i * height + j] = Math.sin(5 * x + y);
        fieldY[i * height + j] = Math.cos(2 * x + 6 * y);
      }
    }
    launchWorker();
  } else if ($('circle').checked) {
    for (i = 0, to2$ = height; i < to2$; ++i) {
      for (j = 0, to3$ = width; j < to3$; ++j) {
        x = j * 2 / width - 1;
        y = i * 2 / height - 1;
        fieldX[i * height + j] = -y;
        fieldY[i * height + j] = x;
      }
    }
    launchWorker();
  } else {
    fx = $('field-x').files[0];
    fy = $('field-y').files[0];
    xloaded = yloaded = false;
    if (!(fx && fy)) {
      alert('please select the ocean data files first!');
      return finish();
    }
    f = new FileReader;
    f.onload = function(){
      var oceanX, i, to$, j, to1$, y, x, to2$, to3$;
      console.log('read ocean x');
      oceanX = new Float32Array(this.result);
      for (i = 0, to$ = height; i < to$; ++i) {
        for (j = 0, to1$ = width; j < to1$; ++j) {
          y = height - i;
          x = j;
          fieldX[i * height + j] = oceanX[x + y * 1440];
        }
      }
      oceanX = null;
      xloaded = true;
      if (yloaded) {
        for (i = 0, to2$ = height; i < to2$; ++i) {
          for (j = 0, to3$ = width; j < to3$; ++j) {
            if (fieldX[i * height + j] === 0 && fieldY[i * height + j] === 0) {
              texture.data[(i * height + j) * 4 + 3] = 0;
            }
          }
        }
        return launchWorker();
      }
    };
    f.readAsArrayBuffer(fx);
    f = new FileReader;
    f.onload = function(){
      var oceanY, i, to$, j, to1$, y, x, to2$, to3$;
      console.log('read ocean y');
      oceanY = new Float32Array(this.result);
      for (i = 0, to$ = height; i < to$; ++i) {
        for (j = 0, to1$ = width; j < to1$; ++j) {
          y = height - i;
          x = j;
          fieldY[i * height + j] = oceanY[x + y * 1440];
        }
      }
      oceanY = null;
      yloaded = true;
      if (xloaded) {
        for (i = 0, to2$ = height; i < to2$; ++i) {
          for (j = 0, to3$ = width; j < to3$; ++j) {
            if (fieldX[i * height + j] === 0 && fieldY[i * height + j] === 0) {
              texture.data[(i * height + j) * 4 + 3] = 0;
            }
          }
        }
        return launchWorker();
      }
    };
    f.readAsArrayBuffer(fy);
  }
});