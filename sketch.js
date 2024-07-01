let player;
let stars = [];
let rainbowStars = [];
let score = 0;
let timer;
let gameLevel = 'easy';
let timeLimit = 20;
let gameState = 'nameEntry';
let playerName = '';
let maxNameLength = 4;
let leaderboard = {};
let minecraftFont;
let song;
let song2;
let fondo1, fondo2, fondo3, fondo4;
let volume = 0.5;
let volumeStep = 0.0;
let songPlaying = false;
let gameOverSongPlayed = false;
let creditsState = 'hidden';
let yo
function preload() {
  minecraftFont = loadFont('style/minecraft.ttf');
  song = loadSound('style/song.mp3', loaded);
  fondo1 = loadImage('style/fondo1.jpg');
  fondo2 = loadImage('style/fondo2.jpg');
  fondo3 = loadImage('style/fondo3.jpg');
  fondo4 = loadImage('style/fondo4.jpg');
  song2 = loadSound('style/game.mp3');
   yo = loadImage('style/yo.jpg');
}

function setup() {
  createCanvas(800, 600);
  player = new Player();
  setLevel(gameLevel);
}

function draw() {
  background(0);
  
  if (gameState === 'nameEntry') {
    image(fondo1, 0, 0, width, height);
    displayNameEntryScreen();
    playSong();
  } else if (gameState === 'start') {
    image(fondo1, 0, 0, width, height);
    displayStartScreen();
    playSong();
  }   if (gameState === 'credits') {
    displayCreditsScreen();
  } else if (gameState === 'playing') {
    image(fondo2, 0, 0, width, height);
    player.update();
    player.show();
    
    if (!songPlaying) {
      playSong();
    }
    
    if (frameCount % 30 === 0) {
      stars.push(new Star(gameLevel));
      if (gameLevel === 'easy' && random(1) < 0.05) { // Agregar estrella arcoíris en el nivel fácil
        rainbowStars.push(new RainbowStar());
      } else if (gameLevel === 'medium' && random(1) < 0.03) { 
        rainbowStars.push(new RainbowStar());
      } else if (gameLevel === 'hard' && random(1) < 0.02) { 
        rainbowStars.push(new RainbowStar());
      }
    }
    
    for (let i = stars.length - 1; i >= 0; i--) {
      stars[i].update();
      stars[i].show();
      
      if (stars[i].hits(player)) {
        score += stars[i].points;
        stars.splice(i, 1);
      } else if (stars[i].offScreen()) {
        stars.splice(i, 1);
      }
    }
    
     for (let i = rainbowStars.length - 1; i >= 0; i--) {
    rainbowStars[i].update();
    rainbowStars[i].show();
    
    if (rainbowStars[i].hits(player)) {
      player.speed *= 2;
      setTimeout(() => {
        player.speed /= 2; 
      }, rainbowStars[i].effectDuration);
      rainbowStars.splice(i, 1);
    } else if (rainbowStars[i].offScreen()) {
      rainbowStars.splice(i, 1);
    }
  }
  
  displayScore();
  displayTimer();
  
  if (score < -1 || millis() > timer + timeLimit * 1000) {
    gameState = 'gameover';
    saveScore();
    stopSong(); 
    playsong2();
    }
  } else if (gameState === 'leaderboard') {
    image(fondo1, 0, 0, width, height);
    displayLeaderboardScreen();
  }
}

function loaded() {
  song.setVolume(volume);
}

function playSong() {
  if (!song.isPlaying()) {
    songPlaying = true;
    song.loop();
  }
}

function stopSong() {
  if (song.isPlaying()) {
    songPlaying = false;
    song.stop();
  }
}

function playGameOverSong() {
  if (!song2.isPlaying()) {
    song2.play();
  }
}

function setLevel(level) {
  if (level === 'easy') {
    timeLimit = 20;
  } else if (level === 'medium') {
    timeLimit = 15;
  } else if (level === 'hard') {
    timeLimit = 10;
  }
}

function displayNameEntryScreen() {
  textAlign(CENTER);
  fill(255);
  textSize(24);
  textFont(minecraftFont); 
  text('Ingresa tu nombre (4 letras):', width / 2, height / 2 - 20);
  textSize(32);
  text(playerName, width / 2, height / 2 + 20);
}

function displayStartScreen() {
  textAlign(CENTER);
  fill(255);
  textSize(24);
  textFont(minecraftFont); 
  push();
  textSize(35);
  text('Bienvenidxs a "Seres de Luz"', width / 2, height / 2 - 200);
  pop();

  text('(1) Easy', width / 2, height / 2); 
  text('(2) Medium', width / 2, height / 2 + 60); 
  text('(3) Hard', width / 2, height / 2 + 120);
  
  push();
   textSize(20);
  text('Presiona S para ingresar otro nombre', width / 2, height / 2 + 250);
   text('Preciona P para ver los registros de puntaje', width / 2, height / 2 + 280);
text('Preciona 0 para ver las instrucciones', width / 2, height / 2 + 220);
  pop();
}

function displayGameOverScreen() {
  textAlign(CENTER);
  fill(255);
  textSize(24);
  textFont(minecraftFont); 
  text('Puntos recolectados: ' + score, width / 2, height / 2 + 80);
  push();
  textSize(36);
  text('¡Game Over!', width / 2, height / 2 - 200);
  pop()
  push();
  textAlign(CENTER);
  textSize(24);
  text('Presiona Enter para regresar', width / 2, height - 40);
  pop();
}

function displayLeaderboardScreen() {
  background(0);
  textAlign(LEFT);
  fill(255);
  textSize(24);
  textFont(minecraftFont); 
  image(fondo3, 0, 0, width, height); 

  text('Clasificacion:', 50, 50);
  textSize(16);
  let y = 80;
  let count = 0;
  for (let name in leaderboard) {
    if (count >= 6) break; 
    text(name + ':', 50, y);
    y += 20;
    for (let level in leaderboard[name]) {
      text('  ' + level + ': ' + leaderboard[name][level] + ' puntos', 50, y);
      y += 20;
    }
    y += 20;
    count++;
  }
  textAlign(CENTER);
  textSize(24);
  text('Presiona Enter para regresar', width / 2, height - 10);
}

function displayScore() {
  fill(255);
  textSize(16);
  textFont(minecraftFont);
  text('Puntos: ' + score, 100, 20);
}

function displayTimer() {
  let timeLeft = max(0, timeLimit - int((millis() - timer) / 1000));
  fill(255);
  textSize(16);
  textFont(minecraftFont);
  text('Tiempo: ' + timeLeft, width - 100, 20);
}

function keyPressed() {
  if (gameState === 'nameEntry') {
    if (keyCode >= 65 && keyCode <= 90 && playerName.length < maxNameLength) { 
      playerName += key;
    } else if (keyCode === BACKSPACE && playerName.length > 0) {
      playerName = playerName.slice(0, -1);
    } else if (keyCode === ENTER && playerName.length === maxNameLength) {
      if (!leaderboard[playerName]) {
        leaderboard[playerName] = { easy: 0, medium: 0, hard: 0 };
        if (Object.keys(leaderboard).length > 6) {
          deleteOldestPlayer();
        }
      }
      gameState = 'start';
    }
  } else if (gameState === 'start') {
    if (key === '1') {
      gameLevel = 'easy';
      startGame();
    } else if (key === '2') {
      gameLevel = 'medium';
      startGame();
    } else if (key === '3')
 {
      gameLevel = 'hard';
      startGame();
    } else if (key === 's' || key === 'S') {
      gameState = 'nameEntry';
      playerName = '';
    }
  } else if (gameState === 'gameover') {
     playsong2();
    if (keyCode === ENTER) {
      gameState = 'start';
    } else if (key === '+' && volume < 0.5) {
      
      volume = min(volume + volumeStep, 0.5); 
      song.setVolume(volume);
      if (!song.isPlaying() && volume > 0) {
        song.play();
      }
    } else if (key === '-' && volume > 0) {
     
      volume = max(volume - volumeStep, 0); 
      song.setVolume(volume);
      if (volume === 0) {
        song.stop();
      }
    }
  }

  if (gameState !== 'nameEntry' && (key === 'p' || key === 'P')) {
    gameState = 'leaderboard';
  } else if (gameState === 'leaderboard' && keyCode === ENTER) {
    gameState = 'start';
  }
} 
function startGame() {
  setLevel(gameLevel);
  score = 0;
  stars = [];
  rainbowStars = []; 
  timer = millis();
  gameState = 'playing';

  if (gameLevel === 'medium') {
    for (let i = 0; i < 3; i++) {
      stars.push(new Star(gameLevel)); 
    }
    Star.prototype.speed = random(3, 6); 
  } else if (gameLevel === 'hard') {
    for (let i = 0; i < 5; i++) {
      stars.push(new Star(gameLevel)); 
    }
    Star.prototype.speed = random(4, 7); 
  }
}

function saveScore() {
  if (score > leaderboard[playerName][gameLevel]) {
    leaderboard[playerName][gameLevel] = score;
  }
}

function deleteOldestPlayer() {
  let oldestPlayer = Object.keys(leaderboard)[0];
  delete leaderboard[oldestPlayer];
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 20;
    this.size = 30; 
    this.speed = 5; 
    this.lightSize = 100; 
    this.maxLightSize = 150;
    this.minLightSize = this.size + 10;
    this.lightChangeSpeed = 1; 
    this.isLightGrowing = true; 
    this.wingSize = 50; 
    this.rainbowEffectActive = false; 
    this.rainbowEffectDuration = 5000; 
  }
  
  update() {
    if (this.rainbowEffectActive) {
     
      this.speed = 10; 
      setTimeout(() => {
        this.speed = 5; 
        this.rainbowEffectActive = false; 
      }, this.rainbowEffectDuration);
    }
    
    if (keyIsDown(65) && this.x > 0) { 
      this.x -= this.speed; 
    }
    if (keyIsDown(68) && this.x < width) { 
      this.x += this.speed; 
    }
    
    if (this.isLightGrowing) {
      this.lightSize += this.lightChangeSpeed;
      if (this.lightSize >= this.maxLightSize) {
        this.isLightGrowing = false;
      }
    } else {
      this.lightSize -= this.lightChangeSpeed;
      if (this.lightSize <= this.minLightSize) {
        this.isLightGrowing = true;
      }
    }
  }
  
  show() {
    // Dibujar las alas
    fill(255);
    noStroke();
    // Ala izquierda
    beginShape();
    vertex(this.x - this.size / 2 - 15, this.y - this.size / 6);
    bezierVertex(
      this.x - this.size / 2 - 50, this.y - this.wingSize / 2,
      this.x - this.size / 2 - 50, this.y - this.wingSize,
      this.x - this.size / 2 - 15, this.y - this.size / 3
    );
    bezierVertex(
      this.x - this.size / 2 - 10, this.y - this.wingSize / 2,
      this.x - this.size / 2 - 10, this.y - this.size / 6,
      this.x - this.size / 2 - 15, this.y - this.size / 6
    );
    endShape(CLOSE);
    // Ala derecha
    beginShape();
    vertex(this.x + this.size / 2 + 15, this.y - this.size / 6);
    bezierVertex(
      this.x + this.size / 2 + 50, this.y - this.wingSize / 2,
      this.x + this.size / 2 + 50, this.y - this.wingSize,
      this.x + this.size / 2 + 15, this.y - this.size / 3
    );
    bezierVertex(
      this.x + this.size / 2 + 10, this.y - this.wingSize / 2,
      this.x + this.size / 2 + 10, this.y - this.size / 6,
      this.x + this.size / 2 + 15, this.y - this.size / 6
    );
    endShape(CLOSE);
    
    fill(255, 255, 0, 50); 
    noStroke();
    ellipse(this.x, this.y, this.lightSize, this.lightSize); 
    fill(255, 204, 0); 
    noStroke();
    ellipse(this.x, this.y, this.size, this.size); 
  }
  
  activateRainbowEffect() {
    this.rainbowEffectActive = true;
  }
}

class RainbowStar {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 20; 
    this.speed = random(2, 5);
    this.effectDuration = 5000;
    this.timer;
    this.effectActive = false; 
  }
  
  update() {
    this.y += this.speed;
  }
  
  show() {

    fill(random(255), random(255), random(255));
    noStroke();
    this.drawStar(this.x, this.y, this.size / 2, this.size, 5); 
    if (this.effectActive) {
      let timePassed = millis() - this.timer;
      let timeLeft = max(0, this.effectDuration - timePassed);
      

      textAlign(CENTER);
      fill(255);
      textSize(12);
      text('Tiempo restante: ' + floor(timeLeft / 1000) + 's', this.x, this.y + 35);
    }
  }
  
  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    if (d < this.size / 2 + player.size / 2) {
      this.effectActive = true; 
      this.timer = millis(); 
      return true;
    }
    return false;
  }
  
  offScreen() {
    return this.y > height;
  }
  
  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}


class Star {
  constructor(level) {
    this.x = random(width);
    this.y = 0;
    this.size = 20; 
    this.speed = random(2, 5);
    this.color = this.randomColor(level);
    this.points = this.setPoints();
  }
  
  randomColor(level) {
    let r = random(100);
    if (level === 'easy') {
      if (r < 65) return 'white';
      if (r < 85) return 'yellow';
      if (r < 95) return 'red';
      return 'blue';
    }
    else if
 (level === 'medium') {
      if (r < 75) return 'white';
      if (r < 90) return 'yellow';
      if (r < 97) return 'red';
      return 'blue';
    } else {
      if (r < 80) return 'white';
      if (r < 95) return 'yellow';
      if (r < 98) return 'red'; 
      return 'blue';
    }
  }

  setPoints() {
    if (this.color === 'white') return 1;
    if (this.color === 'yellow') return 2;
    if (this.color === 'blue') return 5;
    if (this.color === 'red') return -5; 
  }
  
  update() {
    this.y += this.speed;
  }
  
  show() {
    if (this.color === 'red') {
      fill(255, 0, 0); 
    } else {
      fill(this.color === 'white' ? 255 : this.color === 'yellow' ? color(255, 204, 0) : color(0, 0, 255));
    }
    noStroke();
    this.drawStar(this.x, this.y, this.size / 2, this.size, 5);
  }
  
  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
  
  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return (d < this.size / 2 + player.size / 2);
  }
  
  offScreen() {
    return this.y > height;
  }
}


function keyPressed() {
  if (gameState === 'nameEntry') {
    if (keyCode >= 65 && keyCode <= 90 && playerName.length < maxNameLength) {
      playerName += key;
    } else if (keyCode === BACKSPACE && playerName.length > 0) {
      playerName = playerName.slice(0, -1);
    } else if (keyCode === ENTER && playerName.length === maxNameLength) {
      if (!leaderboard[playerName]) {
        leaderboard[playerName] = { easy: 0, medium: 0, hard: 0 };
        if (Object.keys(leaderboard).length > 6) {
          deleteOldestPlayer();
        }
      }
      gameState = 'start';
    }
  } else if (gameState === 'start') {
    if (key === '1') {
      gameLevel = 'easy';
      startGame();
    } else if (key === '2') {
      gameLevel = 'medium';
      startGame();
    } else if (key === '3') {
      gameLevel = 'hard';
      startGame();
    } else if (key === 's' || key === 'S') {
      gameState = 'nameEntry';
      playerName = '';
    }
  } else if (gameState === 'gameover') {
    if (keyCode === ENTER) {
      gameState = 'start';
    } else if (key === '+' && volume < 0.5) {
      volume = min(volume + volumeStep, 0.5); 
      song.setVolume(volume);
      if (!song.isPlaying() && volume > 0) {
        song.play();
      }
    } else if (key === '-' && volume > 0) {

      volume = max(volume - volumeStep, 0); 
      song.setVolume(volume);
      if (volume === 0) {
        song.stop();
      }
    }
  }

   if (gameState !== 'nameEntry' && gameState !== 'gameover' && (key === 'p' || key === 'P')) {
    gameState = 'leaderboard';
  } else if (gameState === 'leaderboard' && keyCode === ENTER) {
    gameState = 'start';
  } else if (gameState === 'start' && key === '0') {
    gameState = 'instructions';
  } else if (gameState === 'instructions' && keyCode === ENTER) {
    gameState = 'start';
  }  else  if (key === '5') {
    if (gameState !== 'nameEntry') { 
      gameState = 'credits';
    }
   }
  
    if (creditsState === 'hidden') {
      creditsState = 'visible';
    } else if  (gameState == 'credits' && keyCode === ENTER){
      gameState = 'start';
}
}

function startGame() {
  setLevel(gameLevel);
  score = 0;
  stars = [];
  rainbowStars = []; 
  timer = millis();
  gameState = 'playing';

  if (gameLevel === 'medium') {
    for (let i = 0; i < 3; i++) {
      stars.push(new Star(gameLevel)); 
    }
    Star.prototype.speed = random(3, 6); 
  } else if (gameLevel === 'hard') {
    for (let i = 0; i < 5; i++) {
      stars.push(new Star(gameLevel)); 
    }
    Star.prototype.speed = random(4, 7); 
  }
}

function saveScore() {
  if (score > leaderboard[playerName][gameLevel]) {
    leaderboard[playerName][gameLevel] = score;
  }
}

function deleteOldestPlayer() {
  let oldestPlayer = Object.keys(leaderboard)[0];
  delete leaderboard[oldestPlayer];
}

function playSong() {
  if (!song.isPlaying()) {
    songPlaying = true;
    song.loop();
  }
}

function stopSong() {
  if (song.isPlaying()) {
    songPlaying = false;
    song.stop();
  }
}

function playGameOverSong() {
  if (!song2.isPlaying()) {
    song2.play();
  }
}


function draw() {
  background(0);
  
  if (gameState === 'nameEntry') {
    image(fondo1, 0, 0, width, height);
    displayNameEntryScreen();
    playSong();
  } else if (gameState === 'start') {
    image(fondo1, 0, 0, width, height);
    displayStartScreen();
    playSong();
  } else if (gameState === 'playing') {
    if (gameLevel === 'easy' && frameCount % 240 === 0) { 
      rainbowStars.push(new RainbowStar());
    }

    image(fondo2, 0, 0, width, height);
    player.update();
    player.show();
    
    if (!songPlaying) {
      playSong(); 
    }
    
    if (frameCount % 30 === 0) {
      stars.push(new Star(gameLevel));
    }
    
    for (let i = stars.length - 1; i >= 0; i--) {
      stars[i].update();
      stars[i].show();
      
      if (stars[i].hits(player)) {
        score += stars[i].points;
        stars.splice(i, 1);
      } else if (stars[i].offScreen()) {
        stars.splice(i, 1);
      }
    }

 
    for (let i = rainbowStars.length - 1; i >= 0; i--) {
      rainbowStars[i].update();
      rainbowStars[i].show();
      
      if (rainbowStars[i].hits(player)) {
        player.speed *= 2;
        setTimeout(() => {
          player.speed /= 2; 
        }, rainbowStars[i].effectDuration);
        rainbowStars.splice(i, 1);
      } else if (rainbowStars[i].offScreen()) {
        rainbowStars.splice(i, 1);
      }
    }
    
    displayScore();
    displayTimer();
    
    if (score < -1 || millis() > timer + timeLimit * 1000) {
      gameState = 'gameover';
      saveScore();
      stopSong(); 
      playGameOverSong(); 
    }
  } else if (gameState === 'gameover') {
    image(fondo1, 0, 0, width, height);
    displayGameOverScreen();
    if (!gameOverSongPlayed) {  
      playGameOverSong();
      gameOverSongPlayed = true;
    }
  } else if (gameState === 'leaderboard') {
    image(fondo1, 0, 0, width, height);
    displayLeaderboardScreen();
  } else   if (gameState === 'instructions') {
    displayInstructions();
  }else if (creditsState === 'visible') { 
    displayCredits();
  }
}

function displayInstructions() { 
  background(0); 
  image(fondo4, 0, 0, width, height);
  textAlign(LEFT); 
  fill(255);
  textSize(24);
  textFont(minecraftFont); 
  const drawStar = (x, y, color) => {
    fill(color);
    noStroke();
    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += TWO_PI / 5) {
      let sx = x + cos(angle) * 10;
      let sy = y + sin(angle) * 10;
      vertex(sx, sy);
      let innerAngle = angle + TWO_PI / 10;
      let ix = x + cos(innerAngle) * 5;
      let iy = y + sin(innerAngle) * 5;
      vertex(ix, iy);
    }
    endShape(CLOSE);
  };


  let startY = height / 2 - 200;
  push();
  textSize(25);
  text('Que es Seres de Luz?', width / 2 - 150, startY - 30);
  pop();
  
  push();
  textSize(16);
   
  text('Es un juego donde tu eres el protagonista', width / 25 + 160, startY + 10);
  text('y tienes un trabajo muy importante..Recolectar Estrellas!', width / 25 + 110, startY + 40);
  pop();

  
  push();
    textSize(16);

  drawStar(width / 2 - 350, startY + 120, color(255));
  fill(255);
  text('Las estrellas blancas suman 1 punto', width / 2 - 320, startY + 125);
  

  drawStar(width / 2 - 350, startY + 150, color(255, 255, 0));
  fill(255);
  text('Las estrellas amarillas suman 2 puntos', width / 2 - 320, startY + 155);
  

  drawStar(width / 2 - 350, startY + 180, color(0, 0, 255));
  fill(255);
  text('Las estrellas azules suman 5 puntos', width / 2 - 320, startY + 185);
  
  
  drawStar(width / 2 - 350, startY + 210, color(255, 0, 0));
  fill(255);
  text('Las estrellas rojas restan 5 puntos', width / 2 - 320, startY + 215);
  

  drawStar(width / 2 - 350, startY + 240, color(random(255), random(255), random(255)));
  fill(255);
  text('Las estrellas arcoiris te daran mas velocidad por 3 segundos', width / 2 - 320, startY + 245);
   pop();

  push();
  textAlign(CENTER);
  textSize(20);
  text('Como se juega?', width / 2 + 10, startY + 290);
  
  pop();

push();
   textAlign(CENTER);
  textSize(16);
  text('Utiliza las teclas A y D para moverte a izquierda y derecha.', width / 2, startY + 320);
  text('Recolecta estrellas para sumar puntos antes de que se acabe el tiempo.', width / 2, startY + 350);
  
   text('Preciona P para ver los registros de puntaje', width / 2, height / 2 + 250);
pop();
  

/*
push();
   textAlign(CENTER);
  textSize(16);
  text('Objetivos:', width / 2 + 10, startY + 300);
  text('1. Recolecta la mayor cantidad de estrellas blancas, amarillas y azules.', width / 2, height / 2 + 110);
  text('2. Evita las estrellas rojas que restan puntos.', width / 2, height / 2 + 140);
  text('3. Consigue la puntuacion mas alta!', width / 2, height / 2 + 170);
   pop();
   */
  push();
  textAlign(CENTER);
  textSize(16);
  text('Presiona Enter para volver al inicio.', width / 2, height / 2 + 280);
pop();

}

function displayCredits() {
  background(0);
  image(fondo4, 0, 0, width, height);

  textAlign(CENTER);
  fill(255);
  textSize(24);
  textFont(minecraftFont);
  text('Creditos:', width / 2, 50);

push();
  textSize(20);
  text('nombre autor:', width / 8, height / 2 - 100);
  text('Romina Alejandra Gonzalez', width / 2, height / 2 - 100);
  text('informacion:',  width / 9, height / 2 - 50);
  text('Estudiante de Artes Multimediales', width / 2, height / 2 - 50);
  text('en la Universidad Nacional de las Artes (UNA)', width / 2, height / 2 - 20);
  text('Edad:',  width / 16, height  / 2 + 15);
  text('21', width / 5, height / 2 + 15);
  
  image(yo, 450, 340);
  yo.resize(0, 250);
  
  pop();

}