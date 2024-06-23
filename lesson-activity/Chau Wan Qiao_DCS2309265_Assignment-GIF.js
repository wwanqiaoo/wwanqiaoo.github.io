let angle = 0;
let ringX = 150;
let ringY = 150;
let ringRadius = 200;
let ringThickness = 50;
let smallRectMoveSpeed = 1;
let offsetX = 100;
let rotationAngle = 20;
let textX = 200;


let ring;
let movingRectangles;
let movingCircles;
let movingTunnel;
let pinkCurve;
let innerBlueCurve;
let ellipsesAlongCurve;
let crescendoImg;
let imgOpacity = 0;
let opacitySpeed = 3;

function setup() {
    createCanvas(1280, 720);
    noStroke();
    
    textSize(22);
    textFont('fantasy');
    ring = new Ring(200, 200, ringRadius, ringThickness);
    movingRectangles = new MovingRectangles();
    movingCircles = new MovingCircles(905, 100);
    movingTunnel = new MovingTunnel(1280, 100);
    pinkCurve = new PinkCurve(50, height / 2);
    innerBlueCurve = new InnerBlueCurve(50, height / 2);
    ellipsesAlongCurve = new EllipsesAlongCurve(50, height / 2); // Initialize ellipsesAlongCurve
}

function draw() {
    background(30, 30, 90);
    
    translate(-100, -120);
    
    fill(147,194,220);
    text("Crescendo International College", 650, 280);

    if(imgOpacity < 255){
        imgOpacity += opacitySpeed;
    }
    tint(255,imgOpacity);
    image(crescendoImg, 720, 120, 130, 130); // 绘制图片在最上面
    
    ring.draw();
    movingRectangles.draw();
    movingCircles.draw();
    movingTunnel.draw();
    pinkCurve.draw();
    innerBlueCurve.draw();
    ellipsesAlongCurve.draw(); // Draw the ellipses along the curve
    
    angle += 0.02;
}
function preload() {
    crescendoImg = loadImage('crescendologo.jpg');
}

class PinkCurve {
    constructor(startX, startY) {
        this.angle = TWO_PI; // 起始角度改为 TWO_PI
        this.speed = -0.04; // 速度设为负值，逆时针绘制
        this.radiusX = 190; // 调整X轴半径以使曲线达到画布中间
        this.radiusY = 230; // 调整Y轴半径以使曲线达到画布中间
        this.startX = startX; // 起点X坐标
        this.startY = startY; // 起点Y坐标
        this.completed = false;
    }

    update() {
        if (!this.completed) {
            this.angle += this.speed;
            if (this.angle <= PI) { // 绘制从 TWO_PI 到 PI 的半个圆弧
                this.angle = PI; // 保持在完整形态
                this.completed = true;
            }
        }
    }

    draw() {
        this.update();
        noFill();
        stroke(251, 132, 172); // 粉色
        strokeWeight(60); // 增加粗度
        beginShape();
        for (let t = TWO_PI; t >= this.angle; t -= 0.01) { // 角度范围从 TWO_PI 到 PI
            let x = this.startX + 320 + this.radiusX * cos(t); // 调整起点和X轴半径
            let y = this.startY + 470 + this.radiusY * sin(t); // 调整起点和Y轴半径
            vertex(x, y);
        }
        endShape();
    }
}

class InnerBlueCurve {
    constructor(startX, startY) {
        this.angle = TWO_PI; // 起始角度改为 TWO_PI
        this.speed = -0.04; // 速度设为负值，逆时针绘制
        this.radiusX = 100; // 调整X轴半径为外部曲线的一半
        this.radiusY = 155; // 调整Y轴半径为外部曲线的一半
        this.startX = startX; // 起点X坐标
        this.startY = startY; // 起点Y坐标
        this.completed = false;
    }

    update() {
        if (!this.completed && pinkCurve.completed) { // Check if pinkCurve is completed
            this.angle += this.speed;
            if (this.angle <= PI) { // 绘制从 TWO_PI 到 PI 的半个圆弧
                this.angle = PI; // 保持在完整形态
                this.completed = true;
            }
        }
    }

    draw() {
        this.update();
        if (pinkCurve.completed) { // Only draw if pinkCurve is completed
            noFill();
            stroke(3, 124, 188); // 蓝色
            strokeWeight(40); // 减少粗度
            beginShape();
            for (let t = TWO_PI; t >= this.angle; t -= 0.01) { // 角度范围从 TWO_PI 到 PI
                let x = this.startX + 320 + this.radiusX * cos(t); // 调整起点和X轴半径
                let y = this.startY + 470 + this.radiusY * sin(t); // 调整起点和Y轴半径
                vertex(x, y);
            }
            endShape();
        }
    }
}

class EllipsesAlongCurve {
    constructor(startX, startY, numEllipses = 15) {
        this.numEllipses = numEllipses;
        this.ellipses = [];
        this.radiusX = 190;
        this.radiusY = 230;
        this.startX = startX;
        this.startY = startY;
        this.angleOffset = TWO_PI / this.numEllipses;
        this.initEllipses();
        this.completed = false;
    }

    initEllipses() {
        for (let i = 0; i < this.numEllipses; i++) {
            let angle = TWO_PI - i * this.angleOffset; // Ensure ellipses are spaced along the curve
            this.ellipses.push({
                angle: angle,
                speed: -0.04,
                x: this.startX + 320 + this.radiusX * cos(angle),
                y: this.startY + 470 + this.radiusY * sin(angle),
                visible: false  // Start as invisible
            });
        }
    }

     update() {
        if (pinkCurve.completed) {
            this.startReleasing = true; // 粉色弯曲线条完成时开始释放椭圆
        }

        if (this.startReleasing) {
            let allEllipsesCompleted = true;
            for (let i = 0; i < this.ellipses.length; i++) {
                let ellipse = this.ellipses[i];
                if (frameCount % 10 === 0 && i < frameCount / 10) {  // 每10帧一个一个地显示椭圆
                    ellipse.visible = true;
                }
                if (ellipse.visible) {
                    ellipse.angle += ellipse.speed;
                    if (ellipse.angle <= PI) {
                        ellipse.angle = PI;
                    } else {
                        allEllipsesCompleted = false;
                    }
                    ellipse.x = this.startX + 320 + this.radiusX * cos(ellipse.angle);
                    ellipse.y = this.startY + 470 + this.radiusY * sin(ellipse.angle);
                }
            }
            if (allEllipsesCompleted) {
                this.completed = true;
                this.startReleasing = false; // 停止更新
            }
        }
    }

    draw() {
        this.update();
        fill(255); // White color for the ellipses
        noStroke();
        for (let e of this.ellipses) {
            if (e.visible) {
                ellipse(e.x, e.y, 20, 20); // Correctly call the ellipse() function
            }
        }
    }
}


class Ring {
    constructor(x, y, ringRadius, ringThickness) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.ringRadius = ringRadius * (4 / 3);  // 放大 1/3
        this.ringThickness = ringThickness * (4 / 3);  // 放大 1/3
    }

    draw() {
        this.angle += 0.02;

        push();
        translate(this.x, this.y);
        rotate(this.angle);

        // 橙色扇形
        fill(220, 182, 155);
        arc(0, 0, this.ringRadius * 2, this.ringRadius * 2, 0, TWO_PI / 3, PIE);

        // 粉色扇形
        fill(251, 132, 172);
        arc(0, 0, this.ringRadius * 2, this.ringRadius * 2, TWO_PI / 3, 2 * TWO_PI / 3, PIE);

        // 蓝色扇形
        fill(30, 119, 183);
        arc(0, 0, this.ringRadius * 2, this.ringRadius * 2, 2 * TWO_PI / 3, TWO_PI, PIE);

        let ballRadius = this.ringThickness / 2;

        // 将ellipse的y坐标设置为环的中间位置
        let ellipseY = -(this.ringThickness / 2);

        // 粉色圆形
        fill(251, 132, 172);
        ellipse(this.ringRadius - this.ringThickness - 90, ellipseY +215, ballRadius * 3, ballRadius * 3);

        // 蓝色圆形
        fill(30, 119, 183);
        ellipse(-this.ringRadius + this.ringThickness - 11, ellipseY, ballRadius * 3, ballRadius * 3);

        //橙色圆
        let radius1 = ballRadius + 1;
        fill(220, 182, 155);
        ellipse(-this.ringRadius + this.ringThickness + 95, ellipseY - 152, radius1 * 3, radius1 * 3); // 增加 radius1
        // 蓝色半圆形
        fill(30, 119, 183);
        let adjustedBallRadius = ballRadius + 2.5; // 将直径增加 5，所以半径增加 2.5
        arc(-106, this.ringRadius - this.ringThickness - 15, adjustedBallRadius * 3, adjustedBallRadius * 3, PI - PI / 12 + radians(134), TWO_PI - PI / 12 + radians(134));
        
        //橙色圆
        let radius2 = ballRadius + 1;
        fill(220, 182, 155);
        ellipse(70, -this.ringRadius + this.ringThickness - 3, radius2 * 3, radius2 * 3); // 增加 radius2

        // 粉色半圆形
        fill(251, 132, 172); // 粉色
        arc(213, -this.ringRadius + this.ringThickness + 200, (ballRadius + 2) * 3, (ballRadius + 2) * 3, -PI, 0); // 使用 arc 函数绘制半圆形
        
        // 中间的深蓝色圆
        fill(30, 30, 90);
        ellipse(0, 0, this.ringRadius * 1.2, this.ringRadius * 1.2);

        pop();
    }
}





class MovingRectangles {
    constructor() {
        this.smallRectY = height;
        this.isPink = true;
        this.offsetX = 300;
    }
  
    draw() {
        let originalWidth = 30;
        let originalHeight = 40;
        let smallRectWidth = originalWidth + 20;
        let smallRectHeight = originalHeight + 30;
        let spacing = 80;
        
        for (let i = 0; i < 100; i++) {
            if (this.isPink) {
                fill(255, 102, 153);
                rect(600 + this.offsetX, this.smallRectY + i * spacing, smallRectWidth, smallRectHeight);
                fill(30, 30, 90);
                rect(630 + this.offsetX + 30, this.smallRectY + i * spacing, smallRectWidth, smallRectHeight);
            } else {
                fill(30, 30, 90);
                rect(600 + this.offsetX, this.smallRectY + i * spacing, smallRectWidth, smallRectHeight);
                fill(255, 102, 153);
                rect(630 + this.offsetX + 30, this.smallRectY + i * spacing, smallRectWidth, smallRectHeight);
            }
            this.isPink = !this.isPink;
        }
      
        this.smallRectY -= smallRectMoveSpeed;
      
        if (this.smallRectY < -smallRectHeight * spacing) {
            this.smallRectY = height;
        }
    }
}

class MovingCircles {
    constructor() {
        this.x = 1015; // 起始X坐标
        this.y = 0; // 起始Y坐标
        this.squareSize = 265; // 正方形的大小
        this.colors = [
            [30, 119, 183], // 蓝色
            [251, 132, 172], // 粉色
            [221, 180, 161] // 橙色
        ];
        this.deepBlueColor = [30, 30, 90]; // 深蓝色背景通道颜色
        this.spacing = 0; // 正方形之间的间距
        this.speed = 4; // 动画速度
        this.offsetY = 0; // Y轴偏移量
        this.totalSquares = 9; // 总共需要绘制的正方形数量
        this.arcs = []; // 存储半圆形的位置和颜色
    }

    draw() {
        // 清空之前的半圆形记录
        this.arcs = [];

        // 计算每个正方形和间距的总高度
        let totalHeight = this.totalSquares * (this.squareSize + this.spacing);

        // 循环绘制正方形背景
        for (let i = 0; i < this.totalSquares; i++) {
            let color = this.colors[i % this.colors.length];
            let squareY = (this.y + i * (this.squareSize + this.spacing) + this.offsetY) % totalHeight;

            // 绘制深蓝色背景通道
            fill(...this.deepBlueColor);
            rect(this.x, squareY, this.squareSize, this.squareSize);

            // 绘制正方形背景
            fill(...color);
            rect(this.x, squareY, this.squareSize, this.squareSize);

            // 存储半圆形的位置和颜色
            let upperColor, lowerColor;

            if (color[0] == 30 && color[1] == 119 && color[2] == 183) { // 蓝色背景
                upperColor = [251, 132, 172]; // 粉色上半圆
                lowerColor = [221, 180, 161]; // 橙色下半圆
            } else if (color[0] == 251 && color[1] == 132 && color[2] == 172) { // 粉色背景
                upperColor = [221, 180, 161]; // 橙色上半圆
                lowerColor = [30, 119, 183]; // 蓝色下半圆
            } else if (color[0] == 221 && color[1] == 180 && color[2] == 161) { // 橙色背景
                upperColor = [30, 119, 183]; // 蓝色上半圆
                lowerColor = [251, 132, 172]; // 粉色下半圆
            }

            // 添加半圆形信息到数组
            this.arcs.push({
                x: this.x + this.squareSize / 2,
                y: squareY,
                color: upperColor,
                start: PI,
                end: 0
            });
            this.arcs.push({
                x: this.x + this.squareSize / 2,
                y: squareY + this.squareSize,
                color: lowerColor,
                start: 0,
                end: PI
            });
        }

        // 绘制所有的半圆形，确保它们在最上层
        for (let arcInfo of this.arcs) {
            fill(...arcInfo.color);
            arc(arcInfo.x, arcInfo.y, this.squareSize, this.squareSize, arcInfo.start, arcInfo.end, CHORD);
        }

        // 增加Y轴偏移，实现向下动画
        this.offsetY += this.speed;
    }
}



class MovingTunnel {
    constructor(offsetX, tunnelWidth) {
        this.rectY = 0;
        this.offsetX = offsetX;
        this.tunnelWidth = tunnelWidth;
        this.rectHeight = 220; // 调整长方形背景的高度
        this.circleDiameter = 100;
        this.spacing = 30; // 每个长方形背景之间的间距
        this.moveSpeed = 6; // 加快移动速度
        this.colors = [
            [30, 30, 90],  // 深蓝色
            [251, 132, 172],  // 粉色
        ];
        this.orange = [221, 180, 161];  // 橙色
        this.lightTan = [227, 168, 124];  // 浅棕色
        this.blue = [30, 30, 90]; // 深蓝色
        this.colorIndex = 0;
        this.yOffset = -50; // 调整深蓝色椭圆的位置
    }

    draw() {
        // 绘制橙色通道背景
        fill(...this.orange);
        rect(this.offsetX, 0, this.tunnelWidth, height);

        let numberOfRects = Math.ceil(height / (this.rectHeight + this.spacing)) + 1;

        for (let i = 0; i < numberOfRects; i++) {
            let rectYPos = this.rectY + i * (this.rectHeight + this.spacing);
            let colorIndex = (this.colorIndex + i) % this.colors.length;

            fill(...this.colors[colorIndex]);
            rect(this.offsetX, rectYPos, this.tunnelWidth, this.rectHeight);

            if (colorIndex === 0) {
                // 深蓝色背景，绘制橙色和粉色圆圈
                fill(...this.orange);
                this.drawEllipse(this.offsetX + this.tunnelWidth / 2, rectYPos + this.circleDiameter / 2, this.circleDiameter, this.circleDiameter);
                fill(251, 132, 172);  // 粉色
                this.drawEllipse(this.offsetX + this.tunnelWidth / 2, rectYPos + this.rectHeight - this.circleDiameter / 2, this.circleDiameter, this.circleDiameter);
            } else {
                // 粉色背景，绘制蓝色和浅棕色圆圈
                fill(...this.blue);  // 深蓝色
                this.drawEllipse(this.offsetX + this.tunnelWidth / 2, rectYPos + this.rectHeight / 2 + this.yOffset, this.circleDiameter, this.circleDiameter);
            }
        }

        this.rectY += this.moveSpeed;

        if (this.rectY > this.rectHeight + this.spacing) {
            this.rectY -= this.rectHeight + this.spacing;
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        }
    }

    drawEllipse(x, y, w, h) {
        ellipse(x, y, w, h);
    }
}






