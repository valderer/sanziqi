// script.js
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let currentPlayer = 'X';

function checkWinner() {
    // 行、列、对角线检查
    const winPatterns = [
        // 行
        [ [0, 0], [0, 1], [0, 2] ],
        [ [1, 0], [1, 1], [1, 2] ],
        [ [2, 0], [2, 1], [2, 2] ],
        // 列
        [ [0, 0], [1, 0], [2, 0] ],
        [ [0, 1], [1, 1], [2, 1] ],
        [ [0, 2], [1, 2], [2, 2] ],
        // 对角线
        [ [0, 0], [1, 1], [2, 2] ],
        [ [0, 2], [1, 1], [2, 0] ]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
            return board[a[0]][a[1]];
        }
    }
    
    return board.flat().includes('') ? null : 'Draw';
}

function handleClick(event) {
    const cell = event.target;
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));

    if (board[row][col] || checkWinner() || currentPlayer === 'O') return;

    board[row][col] = currentPlayer;
    cell.textContent = currentPlayer;
    
    const winner = checkWinner();
    if (winner) {
        setTimeout(() => {
            alert(winner === 'Draw' ? '平局！' : `${winner} 胜利！`);
        }, 100);
        return;
    }

    currentPlayer = 'O';
    setTimeout(aiMove, 300);
}

function aiMove() {
    const bestMove = findBestMove();
    if (bestMove) {
        const [row, col] = bestMove;
        board[row][col] = 'O';
        document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`).textContent = 'O';
        
        const winner = checkWinner();
        if (winner) {
            setTimeout(() => {
                alert(winner === 'Draw' ? '平局！' : `${winner} 胜利！`);
            }, 100);
            return;
        }

        currentPlayer = 'X';
    }
}

function findBestMove() {
    const availableMoves = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (!board[row][col]) {
                availableMoves.push([row, col]);
            }
        }
    }

    let bestMove = null;
    let bestValue = -Infinity;

    for (const move of availableMoves) {
        const [row, col] = move;
        board[row][col] = 'O';
        const moveValue = minimax(board, 0, false);
        board[row][col] = '';
        
        if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = move;
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const result = checkWinner();
    if (result === 'O') return 10;
    if (result === 'X') return -10;
    if (result === 'Draw') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!board[row][col]) {
                    board[row][col] = 'O';
                    const score = minimax(board, depth + 1, false);
                    board[row][col] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!board[row][col]) {
                    board[row][col] = 'X';
                    const score = minimax(board, depth + 1, true);
                    board[row][col] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function resetGame() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
