/* 
1. Deposit money
2. Determine number of lines to bet on
3. collect a bet amount
4. spin the slot machine
5. check if the user won
6. give the user winning amount
7. play again
 */
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};
const deposit = () => {
  /// this is a new function way
  while (true) {
    const depositAmt = prompt("Enter a deposit amount: $");
    const numberdepositAmt = parseFloat(depositAmt);

    if (isNaN(numberdepositAmt) || numberdepositAmt <= 0) {
      console.log("Invalid Deposit Amount, TRY AGAIN!");
    } else {
      return numberdepositAmt;
    }
  }
};

const GetNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3)");
    const numberoflines = parseInt(lines);

    if (isNaN(numberoflines) || numberoflines <= 0 || numberoflines > 3) {
      console.log("\nInvalid Lines, TRY AGAIN with (1-3) !");
    } else {
      return numberoflines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the Bet per line: ");
    const numberBet = parseInt(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid BET, Try Again !");
    } else {
      return numberBet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (let [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = []; // reels = [[], [], []];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols]; // ... means copy the symbols to another array
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length); // 0 to length -1
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allsame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allsame = false;
        break;
      }
    }
    if (allsame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

const game = () => {
  let balance = deposit();
  while (true) {
    console.log("you have a balance of $" + balance);
    const numberoflines = GetNumberOfLines(); // cannot change the variable
    const bet = getBet(balance, numberoflines);
    balance -= bet * numberoflines;
    const reel = spin();
    const transpose_reel = transpose(reel);
    printRows(transpose_reel);
    const winnings = getWinnings(transpose_reel, bet, numberoflines);
    console.log("You won, $" + winnings.toString());
    balance += winnings;

    if (balance <= 0) {
      console.log("you ran out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again? (Y/N)");

    if (playAgain != "y") break;
  }
};

game();
