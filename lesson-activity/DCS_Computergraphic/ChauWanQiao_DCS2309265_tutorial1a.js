function setup() {
    createCanvas(2000, 800);
    background(219,255,223);
  
    fill(163, 232, 252);
    rect(104, 200, 300, 100);
  
    fill(255, 194, 222);
    rect(210, 150, 100, 50);
  
    fill(0);
    ellipse(153, 308, 50, 50);
    ellipse(347, 298, 50, 50);

    fill(255, 255, 0);
    arc(404, 250, 30, 30, PI * 0.5, PI * 1.5);

    fill(255, 255, 0);
    arc(106, 250, 30, 30, PI * 1.5, PI * 0.5);

    fill(66);
    triangle(340, 350, 380, 310, 420, 350);

    fill(120);
    triangle(400, 410, 440, 370, 480, 410);

    stroke(0);
    line(0, 280, width, 280);
    line(0, 410, width, 410);

    fill(140,80,66);
    beginShape();
    vertex(110,380);
    vertex(200,400);
    vertex(270,350);
    vertex(20,350);
    vertex(80,260);
    endShape(CLOSE);
}