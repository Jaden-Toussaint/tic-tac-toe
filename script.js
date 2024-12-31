const cells = document.querySelectorAll(".cell");
const titleHeader = document.querySelector("#titleHeader");
const xPlayerDisplay = document.querySelector("#xPlayerDisplay");
const oPlayerDisplay = document.querySelector("#oPlayerDisplay");
const restartBtn = document.querySelector("#restartBtn");

//initalize variables for game
let player = "X";
let isPauseGame = false;
let isGameStart = false;

//Array to track state of each cell
const inputCells = ['', '', '', 
                    '', '', '',
                    '', '', ''];

//Array of win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
    [0, 4, 8], [2, 4, 6] // Diagonal
];

//Add click event listeners to each cell
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => tapCell(cell, index))
});

function tapCell(cell, index) {
    //Ensure cell is empty and game is not paused
    if(cell.textContent == "" && !isPauseGame){
        isGameStart = true;
        updateCell(cell, index);

        //random pick if there are no results
        if(!checkWinner()){
            changePlayer();
            randomPick();
        }
    }
}

function updateCell(cell, index){
    cell.textContent = player;
    inputCells[index] = player;
    cell.style.color = (player == "X") ? "#1892ea" : "#a737ff"
}

function changePlayer() {
    player = (player == "X") ? "O" : "X";
}

function randomPick() {
    //Pause game to allow computer to pick
    isPauseGame = true;

    setTimeout(() => {
        let randomIndex
        do {
            //Pick random index
            randomIndex = Math.floor(Math.random() * inputCells.length)
        } while(
            //Ensure chosen cell is empty
            inputCells[randomIndex] != ''
        )
        
        //Update the cell with computer move
        updateCell(cells[randomIndex], randomIndex, player)
        //Check if computer won
        if(!checkWinner()) {
            changePlayer()
            //switch back to human player
            isPauseGame = false;
            return
        }
        player = (player == 'X') ? 'O' : 'X'
    }, 1000) //Delay computers move by 1 second
}

function checkWinner() {
    for (const [a, b, c] of winConditions){
        //check each winning condition
        if(inputCells[a] == player && inputCells[b] == player && inputCells[c] == player){
            declareWinner([a, b, c]);
            return true;
        }
    }

    //Check for a draw
    if(inputCells.every(cell => cell != '')){
        declareDraw()
        return true
    }
}

function declareWinner(winningIndices){
    titleHeader.textContent = `${player} win`;
    isPauseGame = true;

    //highlight winning cells
    winningIndices.forEach((index) => 
        cells[index].style.background = "#2a2343"
    )
    restartBtn.style.visibility = "visible";
}

function declareDraw() {
    titleHeader.textContent = "Draw";
    isPauseGame = true;
    restartBtn.style.visibility = "visible"
}

function choosePlayer(selectedPlayer) {
    // Ensure the game has not started
    if(!isGameStart){
        //overide selected player value
        player = selectedPlayer;
        if(player == 'X'){
            //Highlight X display
            xPlayerDisplay.classList.add('player-active');
            oPlayerDisplay.classList.remove('player-active');
        } else {
            //Highlight O display
            oPlayerDisplay.classList.add('player-active');
            xPlayerDisplay.classList.remove('player-active');
        }
    }
}

restartBtn.addEventListener("click", () => {
    restartBtn.style.visibility = "hidden";
    inputCells.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.background = '';
    })
    isPauseGame = false;
    isGameStart = false;
    titleHeader.textContent = "Choose"
})

