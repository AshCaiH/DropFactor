import { init, GameLoop, SpriteClass } from "../node_modules/kontra/kontra.mjs";

let { canvas } = init();

let sprites = [];

let gridSize = {width: 7, height: 7};
let coinBuffer = 2;
let coinRadius = 30;

class Coin extends SpriteClass {
    constructor(properties) {
        properties = Object.assign({
            color: '#DDD'
        }, properties);
        super(properties);
    }

    draw() {
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.x + coinRadius, this.y + coinRadius, coinRadius, 0, 2 * Math.PI);
        this.context.fill();
        // super.draw();
    }
}

for (let x = 0; x < gridSize.width; x++) {
for (let y = 0; y < gridSize.height; y++) {
    let sprite = new Coin({
        x: x * (coinRadius + coinBuffer),
        y: y * (coinRadius + coinBuffer),
        color: "#ABC"
    });    

    sprites.push(sprite);
}
}

console.log(sprites[0]);

let loop = GameLoop({  // create the main game loop
    update: function () { // update the game state
        sprites.forEach((sprite) => sprite.update());
    },
    render: function () { // render the game state
        sprites.forEach((sprite) => sprite.render());
    }
});

loop.start();    // start the game

