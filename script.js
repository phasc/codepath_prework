// global variables
var cluePauseTime = 500; //how long to pause in between clues
var nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var clueHoldTime = 500; //how long to hold each clue's light/sound
var gameLen = 8
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var i;
var lives = 2;

function startGame(){
  //initialize game variables
  pattern = [];
  for (i = 0; i < gameLen; i++){
    pattern[i] = Math.round(Math.random() * (5)) + 1;
  }
  lives = 2;
  progress = 0;
  gamePlaying = true;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn){
  cluePauseTime = 500 - progress*70
  nextClueWaitTime = 1000 - progress*120
  clueHoldTime = 500 - progress*50
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  if (btn != pattern[guessCounter]){
    if (lives){
      lives --;
      alert("Wrong, try again");
      playClueSequence();
    }
    else{
      loseGame();
    }    
  }
  else{
    if (guessCounter != progress){
      guessCounter++;
    }
  else{
    if (progress != pattern.length - 1){
      progress++;
      playClueSequence();
    }
    else{
      winGame();
    }
  }
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You Lost.");
}
function winGame(){
  stopGame();
  alert("Game Over. You Won.");
} 

// Sound Synthesis Functions
const freqMap = {
  1: 220,
  2: 261.63,
  3: 293.66,
  4: 311.13,
  5: 349.23,
  6: 392
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
