import { init, GameLoop, Sprite, Text } from "../node_modules/kontra/kontra.mjs";

let { canvas } = init();

let sprites = [];

let coins = [];

let gridSize = {width: 7, height: 7};
let coinBuffer = 2;
let coinRadius = 20;


function makeCoin(x,y) {
    let text = Text({
        text: "1",
        color: "#333",
        font: 'bold 24px Arial',
        height: coinRadius * 2,
        width: coinRadius * 2,
        textAlign: "center",
        anchor: {x: 0, y: -0.35},
    });

    let background = Sprite({
        render: function() {
            this.context.fillStyle = "#ABC";
            this.context.beginPath();
            this.context.arc(this.x + coinRadius, this.y + coinRadius, coinRadius, 0, 2 * Math.PI);
            this.context.fill();
        }
    })

    const children = [background, text]

    let sprite = Sprite({
        x: x * (coinRadius * 2 + coinBuffer),
        y: y * (coinRadius * 2 + coinBuffer),
        children
    })

    sprites.push(sprite);
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

