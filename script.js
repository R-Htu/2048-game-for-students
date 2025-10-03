// Filename: script.js

const gridItems = [...document.querySelectorAll(".grid-item")];
console.log(gridItems);

const score_val = document.querySelector(".score-value");
const result = document.querySelector(".result");
let score = 0;
let moves = 0;
let moveFactor = 4;
let options = [2, 4, 8, 2, 4, 8, 2, 2, 4, 4, 2, 8, 2, 2, 4, 4, 2];
let matrix = [];
let prevMatrix;

let colors = [
  "#caf0f8", "#90e0ef", "#00b4d8", "#0077b6",
  "#03045e", "#023047", "#fca311", "#14213d",
  "#e63946", "#ffc300", "#6a040f", "#000000"
];

// Create the starting game grid
let row = [];
for (let index = 1; index <= gridItems.length; index++) {
  let item = gridItems[index - 1];
  item.firstElementChild.innerText = "";
  row.push(item);
  if (index % 4 === 0) {
    matrix.push(row);
    row = [];
  }
}

// Assign any two random grid blocks the value of 2
const rowIdx = Math.floor(Math.random() * 4);
const colIdx = Math.floor(Math.random() * 4);
let rowIdx2 = Math.floor(Math.random() * 4);
let colIdx2 = Math.floor(Math.random() * 4);
if (rowIdx === rowIdx2 && colIdx === colIdx2) {
  rowIdx2 = Math.floor(Math.random() * 4);
  colIdx2 = Math.floor(Math.random() * 4);
}
matrix[rowIdx][colIdx].firstElementChild.textContent = 2;
matrix[rowIdx2][colIdx2].firstElementChild.textContent = 2;

let availIndexes = updateAvailIndexes();
updateColors();

// Keyboard controls
document.addEventListener("keydown", moveBlocks);

// Touch controls for phones/tablets
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});
document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    dx > 0 ? moveBlocks({ key: "ArrowRight" }) : moveBlocks({ key: "ArrowLeft" });
  } else {
    dy > 0 ? moveBlocks({ key: "ArrowDown" }) : moveBlocks({ key: "ArrowUp" });
  }
}

const arrayColumn = (arr, n) => arr.map((x) => x[n]);

function moveBlocks(e) {
  if (!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) return;

  moves++;
  let matrixVals = getCurrentMatrixValues();
  prevMatrix = matrixVals;

  const col1 = arrayColumn(matrix,0);
  const col2 = arrayColumn(matrix,1);
  const col3 = arrayColumn(matrix,2);
  const col4 = arrayColumn(matrix,3);
  const [row1,row2,row3,row4] = matrix;

  if (e.key === "ArrowLeft") { moveLeft(row1); moveLeft(row2); moveLeft(row3); moveLeft(row4); }
  if (e.key === "ArrowRight"){ moveRight(row1); moveRight(row2); moveRight(row3); moveRight(row4);}
  if (e.key === "ArrowUp")   { moveLeft(col1); moveLeft(col2); moveLeft(col3); moveLeft(col4);}
  if (e.key === "ArrowDown") { moveRight(col1); moveRight(col2); moveRight(col3); moveRight(col4);}

  matrixVals = getCurrentMatrixValues();
  availIndexes = updateAvailIndexes();
  updateColors();

  if (availIndexes.length === 0 && checkMatrixEquality(prevMatrix,matrixVals)) gameOver("lose");
  if (moves % moveFactor === 0) generateNewBlock();
}

function getCurrentMatrixValues() {
  let grid = [...document.querySelectorAll(".grid-item")];
  let mat = [];
  let r = [];
  for(let i=1;i<=grid.length;i++){
    r.push(grid[i-1].firstElementChild.innerText);
    if(i%4===0){ mat.push(r); r=[]; }
  }
  return mat;
}

function shiftLeft(arr) {
  for(let i=0;i<4;i++)
    for(let j=1;j<4;j++){
      let curr=arr[j].firstElementChild;
      let prev=arr[j-1].firstElementChild;
      if(prev.innerText=="") { prev.innerText=curr.innerText; curr.innerText=""; }
    }
}

function shiftRight(arr){
  for(let i=0;i<4;i++)
    for(let j=2;j>=0;j--){
      let curr=arr[j].firstElementChild;
      let next=arr[j+1].firstElementChild;
      if(next.innerText==""){ next.innerText=curr.innerText; curr.innerText=""; }
    }
}

function moveLeft(row){
  shiftLeft(row);
  for(let i=1;i<4;i++){
    let curr=row[i].firstElementChild;
    let prev=row[i-1].firstElementChild;
    if(curr.innerText==prev.innerText && curr.innerText!==""){
      prev.innerText=parseInt(prev.innerText)+parseInt(curr.innerText);
      curr.innerText="";
      score+=2;
      score_val.innerText=score;
      if(prev.innerText==2048) gameOver("Win");
    }
  }
  shiftLeft(row);
}

function moveRight(row){
  shiftRight(row);
  for(let i=2;i>=0;i--){
    let curr=row[i].firstElementChild;
    let next=row[i+1].firstElementChild;
    if(curr.innerText==next.innerText && curr.innerText!==""){
      next.innerText=parseInt(curr.innerText)+parseInt(next.innerText);
      curr.innerText="";
      score+=2;
      score_val.innerText=score;
      if(next.innerText==2048) gameOver("Win");
    }
  }
  shiftRight(row);
}

function updateColors(){
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      let elem=matrix[i][j].firstElementChild;
      let val=elem.innerText;
      if(val=="") { elem.parentElement.style.backgroundColor=colors[0]; elem.style.color="black"; }
      else if(val=="2"){ elem.parentElement.style.backgroundColor=colors[1]; elem.style.color="black"; }
      else if(val=="4"){ elem.parentElement.style.backgroundColor=colors[2]; elem.style.color="black"; }
      else if(val=="8"){ elem.parentElement.style.backgroundColor=colors[3]; elem.style.color="black"; }
      else if(val=="16"){ elem.parentElement.style.backgroundColor=colors[4]; elem.style.color="white"; }
      else if(val=="32"){ elem.parentElement.style.backgroundColor=colors[5]; elem.style.color="white"; }
      else if(val=="64"){ elem.parentElement.style.backgroundColor=colors[6]; elem.style.color="white"; }
      else if(val=="128"){ elem.parentElement.style.backgroundColor=colors[7]; elem.style.color="white"; }
      else if(val=="256"){ elem.parentElement.style.backgroundColor=colors[8]; elem.style.color="white"; }
      else if(val=="512"){ elem.parentElement.style.backgroundColor=colors[9]; elem.style.color="white"; }
      else if(val=="1024"){ elem.parentElement.style.backgroundColor=colors[10]; elem.style.color="white"; }
      else if(val=="2048"){ elem.parentElement.style.backgroundColor=colors[11]; elem.style.color="white"; }
    }
  }
}

function updateAvailIndexes(){
  let mat=getCurrentMatrixValues();
  let grid=[];
  for(let i=0;i<4;i++)
    for(let j=0;j<4;j++)
      if(mat[i][j]=="") grid.push([i,j]);
  return grid;
}

function generateNewBlock(){
  if(availIndexes.length==0) return;
  let coords=availIndexes[Math.floor(Math.random()*availIndexes.length)];
  let val=options[Math.floor(Math.random()*options.length)];
  matrix[coords[0]][coords[1]].firstElementChild.innerText=val;
  updateColors();
}

function checkMatrixEquality(mat1,mat2){
  for(let i=0;i<4;i++)
    for(let j=0;j<4;j++)
      if(mat1[i][j]!=mat2[i][j]) return false;
  return true;
}

function gameOver(status){
  if(status=="Win"){ result.innerText="You Won!!!"; result.style.color="rgb(78, 236, 144)"; }
  else { result.innerText="You Lose!!!"; result.style.color="rgb(252, 51, 51)"; }
}
