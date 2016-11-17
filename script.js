var count = document.getElementById('count');
var startBtn = document.getElementById('start');
var resetBtn = document.getElementById('reset');
var endScreen = document.getElementById('endScreen');
var endScreenMessage = document.getElementById('endScreenMessage');
var parts = document.getElementsByClassName('part');



var gameStarted = false;
var correctCount = 0;

var success = "applause.wav";
var failure = "aww.wav";
var soundAdd = ['a_sharp.mp3',
    'c_sharp.wav',
    'd_sharp.wav',
    'f_sharp.wav'
];


var gameOn = false;

//Store Simon's sequence of actions in this array
var simonSequence = [];
var userSequence = [];

function getRand() {
    return Math.floor(Math.random() * (4)) + 1;
}

function newMove() {
    var par = getRand();
    simonSequence.push(par - 1);
}

var audio = new Audio();

function playAudio(index) {
  console.log("this ran");
    audio.src = (soundAdd[index]);
    audio.play();
}

function darkenPar(index) {
  console.log("Hey from darkenPar")
  $("parts").addClass('played');
    parts[index].className += ' played';
    setTimeout(function() {
        parts[index].classList.remove('played');
    }, 500);
}

function simonSays(i) {
    setTimeout(function() {
        var parIndex = simonSequence[i];
        playAudio(parIndex);
        darkenPar(parIndex);
        userSequence = []; //clears userSeq so user has to click all parts again
    }, i * 800);
}

function compareSequences() {
    console.log('compared');
    for (var i = 0; i < userSequence.length; i += 1) {
        if (simonSequence[i] !== userSequence[i]) {
            return false;
        }
    }
    return true;
}

function updateCount(inc) {
    correctCount += inc;
    count.innerHTML = correctCount;
}

function reset() {
    simonSequence = [];
    userSequence = [];
    gameStarted = false;
    correctCount = 0;
    count.innerHTML = 0;
}

function retry() {
    userSequence = [];
    endScreenMessage.innerHTML = 'Try Again';
    endScreen.classList.remove('hidden');
    setTimeout(function() {
        endScreen.classList.add('hidden');
        for (var i = 0; i < simonSequence.length; i += 1) {
            simonSays(i);
        }
    }, 1200);
}

function makePartsClickable(par, index) {
    par.addEventListener('click', function() {
                if (userSequence.length < simonSequence.length) {
                    userSequence.push(index);
                    playAudio(index);
                    darkenPar(index);
                    //compare partial sequence to simonsequence
                }
            });
        }
        //compare sequences  //todo make function
    var compare = compareSequences();
    if (compare === false) {
        endScreenMessage.innerHTML = 'Lose';
        endScreen.classList.remove('hidden');
        setTimeout(function() {
            endScreen.classList.add('hidden');
        })
    } else {
        retry();

    }
    if (userSequence.length === simonSequence.length) {
            updateCount(1);
            setTimeout(simonTurn, 1500);
        }

    if (correctCount === 10) {
        endScreen.classList.remove('hidden');
        endScreenMessage.innerHTML = 'Nice Job!';
        gameStarted = false;
        setTimeout(function() {
            endScreen.classList.add('hidden');
            gameStarted = true;
            simonTurn();
        }, 5000);
    }


    for (var i = 0; i < 4; i += 1) {
        makePartsClickable(parts[i], i);
    }

    function simonTurn() {
        if (gameStarted === true) {
            newMove(); //todo only add new move after verrifying that userSequence matches simonSequence
            for (var i = 0; i < simonSequence.length; i += 1) {
                simonSays(i);
            }
        }
    }

    startBtn.addEventListener('click', function() {
        if (gameStarted === false) {
            gameStarted = true;
            setTimeout(simonTurn, 1000);
        }
    });

    resetBtn.addEventListener('click', function() {
        reset();
    });
