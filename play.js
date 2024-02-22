const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// General settings
let gamePlaying = false;
const gravity = 0.3;
const speed = 3.5;
const size = [51, 36];
const jump = -8; // Adjusted jump height for better gameplay
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    coins = 100; // Initial coins value

// Pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  flight = jump;
  coins -= 10; // Decrease coins value only at the start

  // Set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // Setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
  // Make the pipe and bird moving 
  index++;

  // Background first part 
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // Background second part
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // Pipe display
  if (gamePlaying){
    pipes.map(pipe => {
      // Pipe moving
      pipe[0] -= speed;

      // Top pipe
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // Bottom pipe
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // Give 1 point & create new pipe
      if(pipe[0] <= -pipeWidth){
        bestScore++; // Increment best score
        // Remove & create new pipe
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }
    
      // If hit the pipe, end
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  // Draw bird
  if (gamePlaying) {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
    // Display best score and coins
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText(`Coins: ${coins}`, 85, 285);
    ctx.fillText('Click to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;

  // Tell the browser to perform anim
  window.requestAnimationFrame(render);
}

// Launch setup
setup();
img.onload = render;

// Start game when clicking on the game section
document.querySelector('.game-section').addEventListener('click', () => {
  if (!gamePlaying && coins > 0) {
    gamePlaying = true;
    flight = jump; // Reset bird's flight to make it jump
  } else if (coins <= 0) {
    alert("You don't have enough coins to play!");
  }
});
