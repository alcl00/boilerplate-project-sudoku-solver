class SudokuSolver {

  sudokuBoard = [
    [0,0,0,0,0,0,0,0,0], 
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
  ];

  validate(puzzleString) {

    let validCharacters = /^[1-9||.]+$/
    
    if(puzzleString.length !== 81) {
      throw 'Expected puzzle to be 81 characters long';
    }

    if(!validCharacters.test(puzzleString)) {
      throw 'Invalid characters in puzzle';
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if(typeof row === "string")
      row = this.characterToNumber(row);

    if(!this.validInput(row, column, value)) {
      console.log("Invalid input")
      return false;
    }

    let rowToSearch = this.sudokuBoard[row-1];
    for(let c = 0; c < 9; c++) {
      if(rowToSearch[c] === value) {
        return false;
      }
    }
    
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {

    if(typeof row === "string")
      row = this.characterToNumber(row);

    if(!this.validInput(row, column, value)) {
      return false;
    }
    for(let r = 1; r <= 9; r++) {
      if(this.sudokuBoard[r-1][column-1] === value) {
        return false;
      }
    }

    return true;

  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if(typeof row === "string")
      row = this.characterToNumber(row);
    
    if(!this.validInput(row, column, value)) {
      console.log("input invalid")
      return false;
    }

    let r = Math.floor((row-1) / 3) * 3 + 1;
    let c = Math.floor((column-1)/3) * 3 + 1;
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        if(this.sudokuBoard[r + i][c + j] === value) {
          return false;
        }
      }
    }

    return true;

  }

  solve(puzzleString) {
    this.populateBoard(puzzleString)
    // console.log(puzzleString);
    // console.log(this.sudokuBoard);
    let solvable = this.canSolve(puzzleString)
    if(solvable) {
      return this.boardToPuzzleString();
    }
    else {
      throw 'Puzzle cannot be solved'
    }

  }

  findUnassigned() {
    for(let i = 1; i <= 9; i++) {
      for(let j = 1; j <= 9; j++) {
        if(this.sudokuBoard[i-1][j-1] === 0) {
          return {row: i,col: j};
        }
      }
    }
    return {row: -1, col: -1};
  }

  canSolve(puzzleString) {

    let {row, col} = this.findUnassigned();
    if(row === -1 && col === -1) {
      return true;
    }

    for(let num = 1; num <= 9; num++) {
      
      let safe = this.checkColPlacement(puzzleString, row, col, num) 
      && this.checkRowPlacement(puzzleString, row, col, num)
      && this.checkRegionPlacement(puzzleString, row, col, num);
      if(safe) {
        this.sudokuBoard[row-1][col-1] = num;

        if(this.canSolve(puzzleString)) {
          return true;
        }
      }
      this.sudokuBoard[row-1][col-1] = 0;
    }
    return false;
  }

  boardToPuzzleString() {
    let solutionString = '';
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        solutionString += this.sudokuBoard[i][j];
      }
    }
    return solutionString;
  }

  populateBoard(puzzleString) {

    let currentStringPosition = 0;
    
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        let currentValue = puzzleString.substring(currentStringPosition, currentStringPosition+1)
        //console.log(currentValue)
        //console.log(currentValue == '')
        
        if(puzzleString.substring(currentStringPosition, currentStringPosition+1) !== '.') {
          this.sudokuBoard[i][j] = parseInt(currentValue);
          
        }
        else {
          this.sudokuBoard[i][j] = 0;
        }
        currentStringPosition++;
      }
    }

    return this.sudokuBoard;
  }

  characterToNumber(input) {
    let output; 
    switch(input) {

      case 'A':
        output = 1;
        break;
      case 'B':
        output = 2;
        break;
      case 'C':
        output = 3;
        break;
      case 'D':
        output = 4;
        break;
      case 'E':
        output = 5;
        break;
      case 'F':
        output = 6;
        break;
      case 'G':
        output = 7;
        break;
      case 'H':
        output = 8;
        break;
      case 'I':
        output = 9;
        break;
      default:
        output = -1;
        break;
    }

    return output;
  }

  validInput(row, column, value) {
    if(row === -1 || (column < 1 && column > 9) || (value < 1 && value > 9)) {
      return false;
    }
    return true;
  }
}

module.exports = SudokuSolver;

