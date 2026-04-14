// ====== 全域變數宣告 ======
let shapes = [];
let song;
let amplitude;

// 指定的低飽和色碼：[粉綠, 極淺粉, 淺藍, 米杏]
let palette = ['#e9edc9', '#fce4ec', '#accbe1', '#eddcd2'];

let points = [
  [-3, 5], [5, 6], [3, 0], [5, -4], [-2, -5], [-4, -1]
];

function preload() {
  // 請確保檔案路徑與名稱正確
  song = loadSound('midnight-quirk-255361.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255);
  amplitude = new p5.Amplitude();
  
  // 循環播放音樂
  song.loop();

  let totalShapes = 10;

  for (let i = 0; i < totalShapes; i++) {
    let mappedPoints = points.map(pt => {
      let randomX = random(10, 30);
      let randomY = random(10, 30);
      return { x: pt[0] * randomX, y: pt[1] * randomY };
    });

    let colorHex = palette[i % palette.length];

    shapes.push({
      x: random(0, windowWidth),
      y: random(0, windowHeight),
      dx: random(-1.5, 1.5), // 稍微放慢速度，符合極簡風格
      dy: random(-1.5, 1.5),
      color: color(colorHex),
      points: mappedPoints
    });
  }
}

function draw() {
  // 背景改為極淺灰色 (接近白色)
  background(248, 249, 250); 
  
  let level = amplitude.getLevel();
  // 映射音量到縮放倍率 (0.7 到 2.2 倍，讓縮放更穩定)
  let sizeFactor = map(level, 0, 1, 0.7, 2.2);

  for (let shape of shapes) {
    // 1. 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 2. 邊緣反彈
    if (shape.x < 0 || shape.x > windowWidth) shape.dx *= -1;
    if (shape.y < 0 || shape.y > windowHeight) shape.dy *= -1;

    // 3. 設定外觀
    // 移除透明度，讓低飽和色在亮色背景下依然紮實，或者維持 255 (完全不透明)
    fill(shape.color);
    stroke(shape.color); 
    strokeWeight(1.2);

    // 4. 繪製
    push();
    translate(shape.x, shape.y);
    scale(sizeFactor);

    beginShape();
    for (let pt of shape.points) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();
  }
}