var count = document.getElementById('count');
var startBtn = document.getElementById('start');
var resetBtn = document.getElementById('reset');
var endScreen = document.getElementById('endScreen');
var endScreenMessage = document.getElementById('endScreenMessage');
var parts = document.getElementsByClassName('part');



var gameStarted = false;
var correctCount = 0;

var opening = "ironman.mp3" // set variables to sound.//
var success = "applause.wav";
var failure = "aww.wav";
var soundAdd = ['a_sharp.mp3',
    'c_sharp.wav',
    'd_sharp.wav',
    'f_sharp.wav'
];


var gameOn = false;


//Store Iron Man's sequence of actions in this array.//
var ironManSequence = [];
var userSequence = [];

function getRand() {
    return Math.floor(Math.random() * (4)) + 1;
}

function newMove() {
    var par = getRand();
    ironManSequence.push(par - 1);
}

var audio = new Audio();

function playAudio(index) {
    audio.src = (soundAdd[index]);
    audio.play();
}

function wonGame() {
    audio.src = success;
    audio.play();
}

function lostGame() {
    audio.src = failure;
    audio.play();
}

function darkenPar(index) {
    parts[index].className += ' played';
    setTimeout(function() {
        parts[index].classList.remove('played');
    }, 500);
}

function ironManSays(i) {
    setTimeout(function() {
        var parIndex = ironManSequence[i];
        playAudio(parIndex);
        darkenPar(parIndex);
        userSequence = []; //clears userSeq so user has to click all parts again
    }, i * 800);
}

function compareSequences() { // comparing userSeq to ironManSequence.//
    // console.log('compared');
    for (var i = 0; i < userSequence.length; i += 1) {
        if (userSequence[i] !== ironManSequence[i]) {
            console.log("Wrong!")
            reset(); //Why does this not set correctCount to 0??
            return retry();

        }
    }
}

function updateCount(inc) {
    console.log("updated");
    correctCount += inc;
    count.innerHTML = correctCount;
}

function reset() { // resets the score at the end of the game.//
    gameStarted = false;
    ironManSequence = [];
    userSequence = [];
    correctCount = 0;
    count.innerHTML = correctCount;
}

function retry() { // this function uses the try again to let the user start another sequence.//
    lostGame(); // calling the funtion to play the lost sound.//
    userSequence = [];
    endScreenMessage.innerHTML = 'Try again';
    endScreen.classList.remove('hidden');
    setTimeout(function() {
        endScreen.classList.add('hidden');
        for (var i = 0; i < ironManSequence.length; i += 1) {
            ironManSays(i);
        }
    }, 1200);
}

function makePartsClickable(par, index) {
    par.addEventListener('click', function() {
        if (userSequence.length < ironManSequence.length) {
            userSequence.push(index);
            playAudio(index);
            darkenPar(index);

            // //compare partial sequence to ironMan sequence//
            var compare = compareSequences();
            if (compare === false) {
                //  console.log('Gameover');
                endScreenMessage.innerHTML = 'You lose';
                endScreen.classList.remove('hidden');
                setTimeout(function() {
                    endScreen.classList.add('hidden');
                });
            }

            if ((userSequence.length === ironManSequence.length) && ironManSequence != 0) {
                updateCount(1); // the score increases when the answer is correct.// And sets it to 0 when it's not correct.
                setTimeout(ironManTurn, 1500);
            }

            if (correctCount === 8) {
                wonGame() // calling the function of the winning sound.//
                endScreen.classList.remove('hidden');
                endScreenMessage.innerHTML = 'Nice Job!';
                reset(); // calling the reset function at the end of the game.
                gameStarted = false;
                setTimeout(function() {
                    endScreen.classList.add('hidden');
                    gameStarted = true;
                    ironManTurn();
                }, 5000);
            }
        }
    });
}


for (var i = 0; i < 4; i += 1) {
    makePartsClickable(parts[i], i);
}

function ironManTurn() {
    if (gameStarted === true) {
        newMove(); //todo only add new move after verrifying that userSequence matches ironManSequence
        for (var i = 0; i < ironManSequence.length; i += 1) {
            ironManSays(i);
        }
    }
}

startBtn.addEventListener('click', function() { //starts the game//
    if (gameStarted === false) {
        gameStarted = true;
        setTimeout(ironManTurn, 1000);

    }
});

resetBtn.addEventListener('click', function() {
    reset();
});
