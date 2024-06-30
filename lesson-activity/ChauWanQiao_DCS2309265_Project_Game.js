let playButton;
let bgImage;
let audioElement;//startgame
let audioElement2; // gameover
let audioElement3;//knifeshot
let audioElement4;//success
let gameStarted = false;

let knifeImg;
let currentAngle = 0;
let rectheight;
let knife_moving = false;
let knifes_remaining = 10;
let hit = false;
let level = 0;
let flag = 0;
let hit_knifes = [];
let gameover = 0;
let currentAngleSpeed;

// clickable area
let clickableArea = {
  x: 250, 
  y: 50, 
  width: 1280 * 0.6, 
  height: 720 - 100 
};

// Knife launch position
let launchX = 630;
let launchY = 600;

function preload() {
  bgImage = loadImage('knifehitbg.jpg');
  audioElement = createAudio('playbuttonsound.mp3'); 
  audioElement.hide(); 
  audioElement2 = createAudio('failedeffect.mp3'); 
  audioElement2.hide(); 
  audioElement3 = createAudio('knifeshot.mp3');
  audioElement3.hide();
  audioElement4 = createAudio('successsound.mp3');

  knifeImg = loadImage('knife.png');
}

function setup() {
  createCanvas(1280, 720); 
  playButton = new PlayButton();
  rectheight = launchY;
}

function draw() {
  if (!gameStarted) {
    // Show title screen
    background(bgImage); // Use the background image

    // Title
    textSize(120);
    fill(255, 177, 10); // orange 
    textAlign(CENTER);
    textFont('Broadway'); 
    text('Dart Hits', width / 2, height / 2 - 150);

    stroke(0); // black 
    strokeWeight(10); 
    fill(255, 165, 0); // orange 
    text('Dart Hits', width / 2, height / 2 - 150);

    playButton.display();
  } else {
    // Show game screen
    gameover = 0;
    background(255); 
    // Draw clickable area 
    fill(227,250,245);
    rect(clickableArea.x, clickableArea.y, clickableArea.width, clickableArea.height);

    if (level == 1 && flag == 0) {
      setupLevel2();
      flag++;
    }

    if (level == 2 && flag == 1) {
      setupLevel3();
      flag++;
    }


    // Draw the reference knife at the launch position
    image(knifeImg, launchX - 20, launchY - 40, 40, 80);

    if (knifes_remaining > 0) {
      if (rectheight < 200 || hit) {
        rectheight = launchY;
        knife_moving = false;
        hit = false;
      }
      document.getElementById("Knifes_rem").innerHTML = "Knifes Remaining: " + knifes_remaining;
      document.getElementById("level").innerHTML = "Level : " + (level + 1);
      drawKnives();
      drawRotatingArc();

      currentAngle += radians(1);

      if (knife_moving) {
        rectheight -= 25;
      }

      let current_arc = {
        centerX: width / 2,
        centerY: 200,
        radius: 100,
        current_angle: currentAngle,
        direction: false,
        lineWidth: 33
      };
      let current_rec = {
        x: launchX,
        y: rectheight,
        width: 40,
        height: 80
      };
      let result = checkCollision(current_arc, current_rec);
      if (result) {
        knifes_remaining--;
        document.getElementById("Knifes_rem").innerHTML = "Knifes Remaining: " + knifes_remaining;
      }
    } else {
      if (gameover == 0) {
        alert("YOU COMPLETED A LEVEL!");
      }
      if (level == 3) {
        alert("The End.");
        audioElement4.play();
        window.location.reload();
      }
      level++;
      currentAngle += currentAngleSpeed;
    }
    
    // Show game info after game starts
    document.getElementById("gameInfo").style.visibility = "visible";
  }
}

function setupLevel2() {
  hit_knifes = []; // Clear knife array
  currentAngle = 0;
  knifes_remaining = 8;

  currentAngleSpeed = radians(5.5);
}

function setupLevel3() {
  hit_knifes = []; // Clear knife array
  currentAngle = 0;
  knifes_remaining = 22;
}

function drawKnives() {
  for (let i = 0; i < hit_knifes.length; i++) {
    push();
    translate(width / 2, 200);
    rotate(hit_knifes[i].angle);
    image(knifeImg, hit_knifes[i].x - width / 2, hit_knifes[i].y - 200, 40, 80);
    pop();
    hit_knifes[i].angle += radians(1); // Update knife rotation angle
  }
  if (knife_moving) {
    push();
    translate(launchX, rectheight);
    image(knifeImg, -20, -40, 40, 80);
    pop();
  }
}

function drawRotatingArc() {
  push();
  translate(width / 2, 200);
  noStroke();
  fill(128, 0, 128); // Purple color
  ellipse(0, 0, 220, 220);

  fill(255); // White color
  ellipse(0, 0, 180, 180);

  fill(128, 0, 128); 
  ellipse(0, 0, 140, 140);

  fill(255); 
  ellipse(0, 0, 100, 100);

  fill(128, 0, 128); 
  ellipse(0, 0, 60, 60);
  pop();
}

function change_status() {
  if (!knife_moving && knifes_remaining > 0) {
    knife_moving = 1;
  }
}

function checkCollision(curarc, currec) {
  if (currec.y - curarc.centerY <= curarc.radius) {
    hit = 10;
    let collisionDetected = checkRectCollision(curarc);
    if (!collisionDetected) {
      hit_knifes.push({
        x: currec.x,
        y: currec.y,
        width: curarc.width,
        r: curarc.radians,
        angle: 0,
        cangle: curarc.current_angle
      });
      return true;
    } else {
      return false;
    }
  }
  return false;
}

function checkRectCollision(curarc) {
  for (let i = 0; i < hit_knifes.length; i++) {
    let angleDiff = abs(curarc.current_angle - hit_knifes[i].cangle);
    if (angleDiff >= TWO_PI) {
      angleDiff = angleDiff % TWO_PI;
    }
    console.log(`Current angle: ${curarc.current_angle}, Knife ${i + 1} angle: ${hit_knifes[i].cangle}, Angle difference: ${angleDiff} radians`);
    if (angleDiff < radians(10)) {
      audioElement2.play(); 
      alert("GAME OVER!");
      gameover = 1;
      window.location.reload();
      return true;
    }
  }
  return false;
}

function mousePressed() {
  if (!gameStarted) {
    if (playButton.isHovered()) {
      audioElement.play();
      gameStarted = true;
    }
  } else {
    if (
      mouseX > clickableArea.x &&
      mouseX < clickableArea.x + clickableArea.width &&
      mouseY > clickableArea.y &&
      mouseY < clickableArea.y + clickableArea.height
    ) {
      change_status();
      audioElement3.play();
    }
  }
}

function windowResized() {
  resizeCanvas(1280 * 0.7, 720);
}

class PlayButton {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 150; // Increased size
  }

  display() {
    // Shadow
    noStroke();
    fill(150, 0, 0); // Dark red shadow
    ellipse(this.x + 5, this.y + 5, this.size);

    // Main button
    stroke(0); // black 
    strokeWeight(8); 
    fill(255, 0, 0); // Red color for the button
    ellipse(this.x, this.y, this.size);

    // Highlight
    noStroke();
    fill(255, 100, 100); // Light red highlight
    ellipse(this.x - 5, this.y - 5, this.size * 0.8);

    // Play triangle
    stroke(0);
    strokeWeight(8);
    fill(255); // White color for the triangle
    triangle(this.x - 22.5, this.y - 37.5, this.x - 22.5, this.y + 37.5, this.x + 37.5, this.y);
  }

  isHovered() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }
}
