document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = [...document.querySelectorAll('.grid div')];
    const score = document.querySelector('#score');
    const btnStart = document.querySelector('#start');
    const width = 10;
    let nextRandom = 0;
    let counterId;
    let totalPoints = 0;

     const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

const allTetris = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let currentPosition = 4;
let currentRotation = 0;

let random = Math.floor(Math.random()* allTetris.length);
let current = allTetris[random][currentRotation];

//counterId = setInterval(movDown, 1000);
// Start Button
btnStart.addEventListener('click', () => {
   if(counterId) {
      clearInterval(counterId);
      counterId = null;
   } else {
    draw();
    nextRandom = Math.floor(Math.random() * allTetris.length);
    counterId = setInterval(movDown, 1000);
    shapeDraw();
   }
});

function control(e) {

    if(e.keyCode === 37) {
        moveLeft();
    } else if( e.keyCode === 13) {
        rotate();
    } else if(e.keyCode === 40) {
        movDown();
    } else if(e.keyCode === 39) {
         moveRight();
    }
}

document.addEventListener('keyup', control);

function movDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('active');
    })
}

function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('active');
    })
}

function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
       current.forEach(index => squares[currentPosition + index].classList.add('taken'));
       
       random = nextRandom;
       nextRandom = Math.floor(Math.random() * allTetris.length);
       current = allTetris[random][currentRotation];
       currentPosition = 4;
       draw();
       shapeDraw();
       addScore();
       gameOver();
    }
}

function moveLeft() {
    undraw();
    const moveToleft = current.some(index => (currentPosition + index) % width === 0);
    if(!moveToleft) currentPosition -= 1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
         currentPosition += 1;
    }
    draw();
}

function moveRight() {
    undraw();
    const moveToRightt = current.some(index => (currentPosition + index) % width === width - 1);
    if(!moveToRightt) currentPosition += 1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
         currentPosition -= 1;
    }
    draw();
}

function rotate() {
    undraw();
    currentRotation++;
    if(currentRotation === current.length) {
       currentRotation = 0;
    }
    current = allTetris[random][currentRotation];
    draw();
}

const squaresChild = document.querySelectorAll('.grid_child div');
const nextWidth = 4;
let nextIndex = 0;

const nextTetris = [
    [1, nextWidth+1, nextWidth*2+1, 2],
    [0,nextWidth,nextWidth+1,nextWidth*2+1],
    [1,nextWidth,nextWidth+1,nextWidth+2],
    [0,1,nextWidth,nextWidth+1],
    [1,nextWidth+1,nextWidth*2+1,nextWidth*3+1]
];

function shapeDraw() {
    squaresChild.forEach(square => square.classList.remove('active'));
    nextTetris[nextRandom].forEach(index => squaresChild[nextIndex + index].classList.add('active'));
}

//Add Score 
function addScore() {
    for(let i = 0; i < 199; i += width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

      if(row.every(index => squares[index].classList.contains('taken'))) {
        totalPoints += 10;
        score.innerHTML = totalPoints;
        row.forEach(index => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('active');
      })
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
   }
 }
}

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
       score.innerHTML = "Game Over";
       clearInterval(counterId);
    }
}


})