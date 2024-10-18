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

function makeCoin(x,y) {
    let value = randInt(1,7)
    let isBuried = randInt(1,8) === 8

    y = -1;

    // How many coins are already in column?
    let coinsInColumn = grid[x].filter(item => item !== null).length;
    y = gridSize.height - coinsInColumn - 1;
    console.log(y);

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
        position: {x: x, y: y},
        x: x * (coinRadius * 2 + coinBuffer),
        y: y * (coinRadius * 2 + coinBuffer),
        bg: background,
        text: text,
        children,
        update: () => {

        }
    })

    grid[x][y] = coin;

    return coin;
}

for (let x = 0; x < gridSize.width; x++) {
for (let y = 0; y < gridSize.height; y++) {
    objects.push(makeCoin(x,y));
}}

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
