const startGame = () => {
    popup.style.display = "none";
    let music = new Audio('../musics/main.mp3');
    music.play();
    let tickSound = new Audio("../musics/tick.mp3");
    tickSound.volume = 0.0;
    tickSound.play();
    
    // 時間制限
    let time = Math.max(5, 11 - Math.trunc(Math.sqrt(level)));
    let redNum= 6 + level * 2 + Math.trunc(Math.random() * 2);
    let blueNum= Math.random() > 0.5 ? redNum + 1 : redNum - 1;
    const RED = 0;
    const BLUE = 1;
    const ANS = redNum > blueNum ? RED : BLUE;
    
    let gameDisplay = document.querySelector(".game-display");
    
    // blockを生成する。
    const makeblock = (n) => {
        for(let i=0; i<n; i++) {
            let blockDiv = document.createElement("div");
            blockDiv.className = "red-block block";
            gameDisplay.appendChild(blockDiv);
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
    makeblock(redNum)
    makeBlueBlock(blueNum)
    
    let block = document.querySelectorAll(".block"); 
    const gameDisplayWidth = gameDisplay.clientWidth;
    const gameDisplayHeight = gameDisplay.clientHeight;
    const size = block[0].clientWidth;
    const speedRange = Math.trunc(Math.sqrt(Math.max(redNum, blueNum)))
    const minSpeed = 3 + Math.trunc(Math.sqrt(level))
    let rx = [];
    let ry = [];
    let vrx = [];
    let vry = [];
    
    // 正方形の初期位置と方向を設定
    for (let i = 0; i < block.length; i++) {
        rx[i] = Math.random() * (gameDisplayWidth - size);
        ry[i] = Math.random() * (gameDisplayHeight - size);
        vrx[i] = Math.trunc(Math.random() * speedRange + minSpeed);
        vry[i] = Math.trunc(Math.random() * speedRange + minSpeed);
        vrx[i] *= Math.random() > 0.5 ? 1 : -1;
        vry[i] *= Math.random() > 0.5 ? 1 : -1;
        
        block[i].style.left = rx[i] + "px";
        block[i].style.top = ry[i] + "px";
    }
    
    // アニメーションの実行
    function animate() {
        for (let i = 0; i < block.length; i++) {
            rx[i] += vrx[i];
            ry[i] += vry[i];
            
            if (rx[i] + vrx[i] <= 0 || rx[i] + vrx[i] >= gameDisplayWidth - size) {
                vrx[i] *= -1;
            }
            if (ry[i] + vry[i] <= 0 || ry[i] + vry[i] >= gameDisplayHeight - size) {
                vry[i] *= -1;
            }
            
            block[i].style.left = rx[i] + "px";
            block[i].style.top = ry[i] + "px";
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
        if(time < 5) {
            tickSound.volume += 0.2;
        }
        if(time == 0) {
            tickSound.volume = 0.0;
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
            let clearDisplay = document.createElement("p");
            clearDisplay.innerHTML = "CLEAR";
            clearDisplay.className = "clear result";
            gameDisplay.appendChild(clearDisplay);
            let clearSound = new Audio('../musics/clear.mp3');
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
            let gameoverDisplay = document.createElement("p");
            gameoverDisplay.innerHTML = "GAME OVER"
            gameoverDisplay.className = "gameover result"
            gameDisplay.appendChild(gameoverDisplay);
            localStorage.removeItem("level");
            let gameoverSound = new Audio('../musics/gameover.mp3');
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
