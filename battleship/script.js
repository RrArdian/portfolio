const inputAdmin = document.forms[0];
const position = inputAdmin.elements['position'];
const type = inputAdmin.elements['type'];
const turn = inputAdmin.elements['turn'];
const pBoard = document.getElementById('board');
const cBoard = document.getElementById('cheatBoard');
const shot = document.getElementById('inputShot');
const btnSendOne = document.getElementById('sendDataOne');
const btnSendTwo = document.getElementById('sendDataTwo');
const btnStartPlay = document.getElementById('btnStartPlay');
const btnSalvo = document.getElementById('btnSalvo');
const btnShotOne = document.getElementById('btnShotOne');
const btnShotTwo = document.getElementById('btnShotTwo');

let alphabet = ['A','B','C','D','E','F','G','H','I','J'];
let dataset = [];
let step = 0;
let useSalvo = false;
let activePlayer = 1;
let isStartPlaying = 0;

initialize();
renderBoard();

function initialize() {
    for (let i=0; i<2; i++) {
        const board = drawBoard();
        dataset.push({
            player: i+1,
            point: 0,
            board
        });
    }
}

function drawBoard() {
    let board = [];
    for(let x=1;x < 11; x++) {
        for(let y=1; y < 11; y++) {
            board.push({x,y,col:y,row:alphabet[x-1],type:'free',symbol:'',isMissed: false,isUsed: false,isShot: false});
        }
    }
    return board;
}

function printBoard(board, cheat = false) {
    let showBoard = '';
    let head = '';
    
    for (let i = 1;i<11;i++) {
        head += `<td>${i}</td>`;
    }
    let header = `<thead><tr><td>#</td>${head}</tr></thead>`;
    
    board.forEach((q,i) => {
        let status = '?';
        let addSymbol = q.type.split('');
        q.symbol = addSymbol[0].toUpperCase();
        
        if (cheat) {
            status = q.type == 'free' ? '?' : q.symbol;
        }
        
        if (q.isUsed) {
            if (q.isMissed && q.isUsed) status = 'O';
            else status = 'X';
        }
        
        if (q.col == 1) showBoard += `<tr><td class="tdStyle">${q.row}</td>`;
        showBoard += `<td class="tdStyle" id=${q.row},${q.col}>${status}</td>`;
        if (q.col == 10) showBoard += `</tr>`;
    });
    const elements = header + showBoard;
    return elements;
}

function renderBoard() {
    let playerBoard = [];
    let cheatBoard = [];
    if (isStartPlaying) {
        if (activePlayer === 1) {
            playerBoard = dataset[1].board;
            cheatBoard = dataset[0].board;
        } else {
            playerBoard = dataset[0].board;
            cheatBoard = dataset[1].board;
        }
        pBoard.innerHTML = printBoard(playerBoard);
        cBoard.innerHTML = printBoard(cheatBoard,true);
    } else {
        const board = (activePlayer === 1) ? dataset[0].board : dataset[1].board;
        pBoard.innerHTML = printBoard(board);
        cBoard.innerHTML = printBoard(board,true);
    }
}

// START PLAYING
function startPlay() {
    btnSalvo.disabled = false;
    btnShotOne.disabled = false;
    isStartPlaying = 1;
    activePlayer = 1;
}

function setSalvo() {
    useSalvo = true;
    btnSalvo.disabled = true;
    alert(`Salvo Active! Player ${activePlayer} has 5 chance`);
}

function playing(player) {
    shot.value = '';
    if (useSalvo && step < 6) {
        if (player === 1) {
            btnShotOne.disabled = true;
            btnShotTwo.disabled = false;
        } else {
            btnShotOne.disabled = false;
            btnShotTwo.disabled = true;
        }
        step++;
    } else {
        if (player === 1) {
            activePlayer = 2;
            btnShotOne.disabled = true;
            btnShotTwo.disabled = false;
        } else {
            activePlayer = 1;
            btnShotOne.disabled = false;
            btnShotTwo.disabled = true;
        }
        step = 0;
        useSalvo = false;
        btnSalvo.disabled = false;
    }
}

function submitData(player) {
    activePlayer = player;
    let lengthType;
    const posInput = position.value;
    const typeInput = type.value;
    const turnInput = turn.value;
    
    const row = posInput.substring(0,1);
    const col = posInput.substring(1);
    
    if (typeInput == 'carrier') lengthType = 5;
    if (typeInput == 'battleship') lengthType = 4;
    if (typeInput == 'destroyer') lengthType = 3;
    if (typeInput == 'submarine') lengthType = 3;
    if (typeInput == 'patrol') lengthType = 2;
    
    let isValid = validationInput(row.toUpperCase(),col,lengthType,turnInput,typeInput);
    if (isValid) saveData(row.toUpperCase(),col,lengthType,turnInput,typeInput);
    renderBoard();
    
    // Check Done Input
    if (checkDoneInput()) {
        btnStartPlay.disabled = false;
        btnSendOne.disabled = true;
        btnSendTwo.disabled = true;
    }
}

function saveData(row,col,max,turn,type) {
    const board = (activePlayer === 1) ? dataset[0].board : dataset[1].board;
    if (turn == 'right') {
        let init = Number(col);
        max = Number(max) + init;
        for (let i = col; i < max; i++) {
            board.filter((q) => {
                if (q.row == row && q.col == i) q.type = type;
            });
        }
    } else {
        let init = alphabet.indexOf(row) + 1;
        max = Number(max) + init;
        for (let i = init; i < max; i++) {
            board.filter((q) => {
                if (q.x == i && q.col == col) q.type = type;
            });
        }
    }
}

function validationInput(row,col,max,turn,type) {
    const board = (activePlayer === 1) ? dataset[0].board : dataset[1].board;
    let overlapBoard = [];
    
    let isExist = board.filter(q => q.type === type);
    if (isExist.length === max) {
        alert('Ship type is exist!');
        return false;
    }
    
    if (turn == 'right') {
        let init = Number(col);
        max = Number(max) + init;
        if (max > 10) if (max > 10) {
            alert('Out of border!');
            return false;
        }
        
        for (let i = col; i < max; i++) {
            board.filter(q => {
                if (q.row == row && q.col == i && q.type != 'free') {
                    overlapBoard.push(q);
                }
            });
        }
    } else  {
        let init = alphabet.indexOf(row) + 1;
        max = Number(max) + init;
        if (max > 10) {
            alert('Out of border!');
            return false;
        }
        
        for (let i = init; i < max; i++) {
            board.filter((q) => {
                if (q.x == i && q.col == col && q.type != 'free') {
                    overlapBoard.push(q);
                }
            });
        }
    }
    
    if (overlapBoard.length > 0) {
        alert('Error! Overlap');
        return false;
    }
    
    return true;
}

function play() {
    const board = (activePlayer === 1) ? dataset[1].board : dataset[0].board;
    const shotInput = shot.value;
    const row = shotInput.substring(0,1).toUpperCase();
    const col = shotInput.substring(1);
    
    board.filter((q) => {
        if (q.row == row && q.col == col) {
            if (q.type == 'free') {
                q.isMissed = true;
            } else {
                if (q.isShot) {
                    q.isMissed = false;
                } else {
                    q.isMissed = false;
                    updatePoint(q.type, 1);
                }
            }
            q.isUsed = true;
        }
    });
    // PRINT CURRENT BOARD
    pBoard.innerHTML = printBoard(board);
    
    checkPoint();
    playing(activePlayer);
    window.setTimeout(() => {
        renderBoard();
    }, 2000);    
}

function updatePoint(type, point) {
    const data = (activePlayer === 1) ? dataset[1] : dataset[0];
    data.board.map((q) => {
        if (q.type === type) {
            q.isShot = true;
        }
    });
    data.point += point;
}

function checkPoint() {
    const data = (activePlayer === 1) ? dataset[1] : dataset[0];
    if (data.point > 4) {
        alert(`Player ${activePlayer} WIN!`)
    }
}

function checkDoneInput() {
    let isfull = [];
    dataset.map(q => {
        q.board.filter((f) => {
            if (f.type != 'free') {
                isfull.push(f);
            }
        })
    })
    if (isfull.length > 33) {
        return true;
    }
    return false;
}