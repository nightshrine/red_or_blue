clearSound = document.querySelector("#clearSound");
tickSound = document.querySelector("#tickSound");
gameoverSound = document.querySelector("#gameoverSound");
mainSound = document.querySelector("#mainSound");


// Blockをclassとして記述
class Block {
    constructor(htmlElement, gameDisplayWidth, gameDisplayHeight, size, speedRange, minSpeed) {
        this.rx = Math.random() * (gameDisplayWidth - size);
        this.ry = Math.random() * (gameDisplayHeight - size);
        this.vrx = Math.trunc(Math.random() * speedRange + minSpeed) * (Math.random() > 0.5 ? 1 : -1);
        this.vry = Math.trunc(Math.random() * speedRange + minSpeed) * (Math.random() > 0.5 ? 1 : -1);
        
        this.htmlElement = htmlElement
		this.htmlElement.style.left = this.rx + "px";
		this.htmlElement.style.top = this.ry + "px";

        this.gameDisplayWidth = gameDisplayWidth;
        this.gameDisplayHeight = gameDisplayHeight;
        this.size = size;
        this.speedRange = speedRange;
        this.minSpeed = minSpeed;
    }

	move() {
		this.rx += this.vrx;
        this.ry += this.vry;
        
        if (this.rx + this.vrx <= 0 || this.rx + this.vrx >= this.gameDisplayWidth - this.size) {
            this.vrx *= -1;
        }
        if (this.ry + this.vry <= 0 || this.ry + this.vry >= this.gameDisplayHeight - this.size) {
            this.vry *= -1;
        }
        
        this.htmlElement.style.left = this.rx + "px";
        this.htmlElement.style.top = this.ry + "px";
	}
}


const startGame = () => {
    popup.style.display = "none";
    mainSound.play();
    
    // 時間制限
    let time = Math.max(5, 11 - Math.trunc(Math.sqrt(level)));
    let redNum= 6 + level * 2 + Math.trunc(Math.random() * 2);
    let blueNum= Math.random() > 0.5 ? redNum + 1 : redNum - 1;
    const RED = 0;
    const BLUE = 1;
    const ANS = redNum > blueNum ? RED : BLUE;
    
    let gameDisplay = document.querySelector(".game-display");
    
    // redBlockを生成する。
    const makeRedBlock = (n) => {
        for(let i=0; i<n; i++) {
            let redBlockDiv = document.createElement("div");
            redBlockDiv.className = "red-block block";
            gameDisplay.appendChild(redBlockDiv);
        }
    }
    // blueBlockを生成する。
    const makeBlueBlock = (n) => {
        for(let i=0; i<n; i++) {
            let blueBlockDiv = document.createElement("div");
            blueBlockDiv.className = "blue-block block";
            gameDisplay.appendChild(blueBlockDiv);
        }
    }
    
    // blockの数を決める。
    makeRedBlock(redNum)
    makeBlueBlock(blueNum)
    
    let block = document.querySelectorAll(".block"); 
    const gameDisplayWidth = gameDisplay.clientWidth;
    const gameDisplayHeight = gameDisplay.clientHeight;
    const size = block[0].clientWidth;
    const speedRange = Math.trunc(Math.sqrt(Math.max(redNum, blueNum)))
    const minSpeed = 3 + Math.trunc(Math.sqrt(level))
    // let rx = [];
    // let ry = [];
    // let vrx = [];
    // let vry = [];
    
    let blockList = [];
    // 正方形の初期位置と方向を設定
    for (let i = 0; i < block.length; i++) {
        blockList.push(new Block(
            block[i],
            gameDisplayWidth,
            gameDisplayHeight,
            size,
            speedRange,
            minSpeed
        ));
    }
    
    // アニメーションの実行
    function animate() {
        for (const block of blockList) {
            block.move();
        }

        requestAnimationFrame(animate);
    }
    
    animate();
    
    let timeDisplay = document.querySelector(".time-display");
    timeDisplay.innerText = time;
    
    // 赤と青のどちらを選んだか。Defaultは赤
    let select = RED;
    let redButton = document.querySelector(".red-button");
    redButton.style.backgroundColor = "rgba(255, 60, 60, 0.7)"
    let blueButton = document.querySelector(".blue-button");
    
    redButton.addEventListener('click', () => {
        select = RED;
        redButton.style.backgroundColor = "rgba(255, 60, 60, 0.7)"
        blueButton.style.backgroundColor = ""
    });
    blueButton.addEventListener('click', () => {
        select = BLUE;
        redButton.style.backgroundColor = ""
        blueButton.style.backgroundColor = "rgba(60, 60, 255, 0.7)"
    });
    
    const timeInterval = setInterval(() => {
        time -= 1;
        timeDisplay.innerText = time;
        if(time == 5) {
            tickSound.volume = 0.0;
            tickSound.play();
        } else if (time < 5 && 0 < time) {
            tickSound.volume += 0.24;
        } else if (time == 0) {
            tickSound.volume = 0.0;
            mainSound.volume = 0.0;
            judge();
            clearInterval(timeInterval);
        }
    },1000)
    
    const judge = () => {
        redButton = undefined;
        blueButton = undefined;
        if(ANS == RED) {
            let blueBlock = document.querySelectorAll(".blue-block")
            for(let i=0; i<blueBlock.length; i++) {
                blueBlock[i].style.display = "none";
            }
        }
        else {
            let redBlock = document.querySelectorAll(".red-block")
            for(let i=0; i<redBlock.length; i++) {
                redBlock[i].style.display = "none";
            }
        }
        
        if(select == ANS) {
            let clearDisplay = document.querySelector(".clear")
            clearDisplay.style.display = "block";
            clearSound.play();
            setInterval(() => {
                localStorage.setItem("level", level+1);
                let hiscore = 1;
                if(localStorage.getItem("hiscore")) {
                    hiscore = localStorage.getItem("hiscore");
                }
                hiscore = Math.max(hiscore, level+1);
                localStorage.setItem("hiscore", hiscore);
                window.location.reload();
            }, 3000)
        } else {
            let gameoverDisplay = document.querySelector(".gameover")
            gameoverDisplay.style.display = "block";
            localStorage.removeItem("level");
            gameoverSound.play();
            setInterval(() => {
                window.location.href = 'index.html';
            }, 3000)
        }
    }
}
    
    
    
// レベル
let level = Number(localStorage.getItem("level"));

//音楽を再生させるために一旦ユーザーから反応をもらう。
let popup = document.querySelector(".popup");
popup.style.display = "block";
let go = document.querySelector(".go");
let nowLevel = document.querySelector(".now-level");
nowLevel.innerHTML = "LEVEL: " + level;
go.addEventListener("click", startGame);
