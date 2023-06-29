let main = document.querySelector(".main");

if(localStorage.getItem("level")) {
    let level = Number(localStorage.getItem("level"));
    if (level != 1){
        let startButtonRestart = document.createElement("button");
        startButtonRestart.className = "start-button restart";
        startButtonRestart.innerHTML = "Start from Level " + level;
        main.appendChild(startButtonRestart);
        startButtonRestart.addEventListener("click", () => {
            window.location.href = 'game.html';
        })
    }
}else {
    localStorage.setItem("level", 1);
}

let startButtonNew = document.querySelector(".new");
startButtonNew.addEventListener("click", () => {
    localStorage.setItem("level", 1);
    window.location.href = 'game.html';
})

if(localStorage.getItem("hiscore")) {
    let hiscore = document.createElement("p");
    hiscore.className = "hiscore";
    hiscore.innerHTML = "HI-SCORE: " + localStorage.getItem("hiscore");
    main.appendChild(hiscore);
}
