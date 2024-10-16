import { init, GameLoop, Sprite, Text, GameObject, randInt } from "../node_modules/kontra/kontra.mjs";

let { canvas } = init();

let sprites = [];

let coins = [];

let gridSize = {width: 7, height: 7};
let coinBuffer = 4;
let coinRadius = 20;

let palette = ["#003f5c","#374c80","#7a5195","#bc5090","#ef5675","#ff764a","#ffa600"]


function makeCoin(x,y) {
    let value = randInt(1,7)
    let isBuried = randInt(1,10) == 10

    let text = Text({
        opacity: isBuried ? 0: 1,
        text: value,
        color: value <= 3 ? "#CDE" : "#311",
        font: 'bold 24px Arial',
        height: coinRadius * 2,
        width: coinRadius * 2,
        textAlign: "center",
        anchor: {x: 0, y: -0.35},
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

    background

    let coin = GameObject({
        x: x * (coinRadius * 2 + coinBuffer) + 2,
        y: y * (coinRadius * 2 + coinBuffer) + 2,
        bg: background,
        text: text,
        children
    })

    sprites.push(coin);
}

for (let x = 0; x < gridSize.width; x++) {
for (let y = 0; y < gridSize.height; y++) {
    makeCoin(x,y);
}}


let loop = GameLoop({  // create the main game loop
    update: function () { // update the game state
        sprites.forEach((sprite) => sprite.update());
    },
    render: function () { // render the game state
        sprites.forEach((sprite) => sprite.render());
    }
});

loop.start();    // start the game

