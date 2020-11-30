let defaultImageLoadInterval = 3000;
let imageReloadIntervalChange = 0.75;
let currentImageLoadInterval;
let hits = 0;
let gameInterval;
let timeInterval;
let gameStarted = false;
let imageJumps = 0;
let duration = 0;

window.addEventListener("load", function () {
    setActiveOnNavBar(04);
    setDefaultImages();
    document.getElementById("gameBoard").addEventListener("click", function (evt) {
        if (gameStarted) {
            if (evt.target.src && evt.target.src.includes('click.jpg')) {
                hits++;
                document.getElementById("score").innerHTML = "Score: " + hits;
                clearInterval(gameInterval);
                //currentImageLoadInterval -= imageReloadIntervalChange;
                currentImageLoadInterval = Math.floor(currentImageLoadInterval * imageReloadIntervalChange);
                console.log(" interval : " + currentImageLoadInterval);
                loadGame();
            } else {
                endGame();
            }
        }
    }, false);

    document.getElementById("startButton").addEventListener("click", function () {
        gameStarted = true;
        document.getElementById("timer").style.visibility = "visible";
        document.getElementById("score").style.visibility = "visible";
        currentImageLoadInterval = defaultImageLoadInterval;
        document.getElementById("score").innerHTML = "Score: " + hits;
        startGameTimer();
        loadGame();
    }, false);

}, false);

function setDefaultImages() {
    for (let i = 1; i < 10; i++) {
        document.getElementById("grid-" + i).src = 'images/empty.jpg';
    }
}

function setClickMeImage() {
    let randomNumber = getRandomNumber();
    document.getElementById("grid-" + randomNumber).src = 'images/click.jpg';
    imageJumps++;
}

function getRandomNumber() {
    let min = 1;
    let max = 10;
    let number = Math.floor(Math.random() * (max - min) + min);
    return number;
}

function loadGame() {
    setDefaultImages();
    setClickMeImage();

    gameInterval = setInterval(function () {
        if (imageJumps < 3) {
            setDefaultImages();
            setClickMeImage();    
        } else {
            endGame();
        }
    }, currentImageLoadInterval)
}

function startGameTimer() {
    let gameStartTime = new Date().getTime();
    let currentTime = new Date().getTime();
    duration = (currentTime - gameStartTime) / 1000;
    document.getElementById("timer").innerHTML = "Active play time: " + duration  + "secs";
    timeInterval = setInterval(function () {
        let currentTime = new Date().getTime();
        duration = ((currentTime - gameStartTime) / 1000).toFixed(0);
        document.getElementById("timer").innerHTML = "Active play time: " + duration + "secs";
    }, 1000);
}

function endGame() {
    let score = (duration * 5) + (hits * 6);
    hits = 0;
    document.getElementById("score").style.visibility = "hidden";
    document.getElementById("timer").style.visibility = "hidden";
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    currentImageLoadInterval = defaultImageLoadInterval;
    setDefaultImages();
    gameStarted = false;
    imageJumps = 0;
    window.alert("Game over!" + " Your Score is " + score);
}