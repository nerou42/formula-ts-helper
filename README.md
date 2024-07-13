# labyrint-game-logic

## example

const playerRed = new Player((constGameState) => Promise<move>);
const playerGreen = new Player((constGameState) => Promise<move>);
const playerYellow = new Player((constGameState) => Promise<move>);

const randomBoard = Game.generateRandomBoard();

const game = new Game({ playerGreen, playerRed, playerYellow, board: randomBoard });

game.addEventListener('gameended', (winner) => {})
game.addEventListener('playermoved', (move) => {})
game.addEventListener('treasurefound', (player, treasure) => {})

game.start()
#   f o r m u l a - t s - h e l p e r  
 # formula-ts-helper
# formula-ts-helper
