import { init, GameLoop, Sprite, Text, GameObject, randInt } from "../node_modules/kontra/kontra.mjs";

let { canvas } = init();

let objects = [];

let gridSize = {width: 7, height: 7};
let coinBuffer = 12;
let coinRadius = 30;

let palette = [ "#ffa600", "#ff764a", "#ef5675", "#bc5090", "#7a5195", "#374c80", "#003f5c" ]

let dropping = false;
let gameOver = false;

let grid = Array.from({ length:7 }, (item, i) => Array.from({ length:7 }, (item, i) => null))

console.log(grid);

function makeCoin(gridX,gridY) {
    dropping = true;

    let value = randInt(1,7)
    let isBuried = randInt(1,8) === 8

    gridY = -1;

    // How many coins are already in column?
    let coinsInColumn = grid[gridX].filter(item => item !== null).length;
    gridY = gridSize.height - coinsInColumn - 1;
    console.log(gridY);

    let text = Text({
        opacity: isBuried ? 0: 1,
        text: value,
        color: value >= 5 ? "#CDE" : "#311",
        font: 'bold 24px Arial',
        width: coinRadius * 2,
        textAlign: "center",
        anchor: {x: 0, y: -0.8},
    });

    let background = Sprite({
        color: isBuried ? "#ABC": palette[value-1],
        render: function() {
            this.context.fillStyle = this.color;
            this.context.lineWidth = 2;
            this.context.strokeStyle = "#BCD";
            this.context.stroke();
            this.context.beginPath();
            this.context.arc(coinRadius, coinRadius, coinRadius, 0, 2 * Math.PI);
            this.context.fill();
        }
    })

    const children = [background, text]

    let coin = GameObject({
        gridPos: {x: gridX, y: gridY},
        x: gridX * (coinRadius * 2 + coinBuffer),
        y: -1 * (coinRadius * 2 + coinBuffer),
        dy: 24,
        bg: background,
        text: text,
        children,
        update: function() {
            if (this.y >= this.gridPos.y * (coinRadius * 2 + coinBuffer)) {
                this.y = this.gridPos.y * (coinRadius * 2 + coinBuffer);
                dropping = false;
                this.dy = 0;
            } else {
                this.y += this.dy;
            }
        }
    })

    grid[gridX][gridY] = coin;

    return coin;
}

// objects.push(makeCoin(0,0));

for (let x = 0; x < gridSize.width; x++) {
for (let y = 0; y < gridSize.height; y++) {
    // while (!dropping) {
        objects.push(makeCoin(x,y));
    // }
}}

// if (!dropping) {
//     objects.push(makeCoin(randInt(0,gridSize.width),0));
// }

let camera = GameObject({
    x: 700 / 2 - (coinRadius + coinBuffer) * (gridSize.width - 1) + coinBuffer,
    y: coinRadius + coinBuffer * 2,
    children: objects,
})


let loop = GameLoop({
    update: () => camera.update(),
    render: () => camera.render()
});

loop.start();
