import { init, GameLoop, Sprite, Text } from "../node_modules/kontra/kontra.mjs";

let { canvas } = init();

let sprites = [];

let coins = [];

let gridSize = {width: 7, height: 7};
let coinBuffer = 2;
let coinRadius = 20;


class Coin {
    constructor(properties) {        
        this.props = Object.assign({
            x: properties.x,
            y: properties.y,
            color: '#ABC'}, properties);

        console.log(this.props.x);

        this.coinSprite = Sprite(Object.assign(
            this.props, {
            render: function() {
                this.context.fillStyle = "#ABC";
                this.context.beginPath();
                this.context.arc(
                    this.x * (coinRadius * 2 + coinBuffer) + coinRadius, 
                    this.y * (coinRadius * 2 + coinBuffer) + coinRadius, 
                    coinRadius, 0, 2 * Math.PI);
                this.context.fill();
        }}))

        this.text = Text({
            text: "1",
            color: "white",
            font: 'bold 24px Arial',
            x: this.props.x * (coinRadius * 2 + coinBuffer) + coinRadius / 2,
            y: this.props.y * (coinRadius * 2 + coinBuffer) + coinRadius / 2,
            anchor: {x: 0, y: 0},
            strokeColor: "black",
            lineWidth: 3,
        });
    }

    update = () => {
        this.coinSprite.update();
    }

    render = () => {
        this.coinSprite.render();
        this.text.render();
    }
}

for (let x = 0; x < gridSize.width; x++) {
for (let y = 0; y < gridSize.height; y++) {
    let sprite = new Coin({
        x: x ,
        y: y 
    });    

    sprites.push(sprite);
}
}


let loop = GameLoop({  // create the main game loop
    update: function () { // update the game state
        // sprites.forEach((sprite) => sprite.update());
    },
    render: function () { // render the game state
        sprites.forEach((sprite) => sprite.render());
    }
});

loop.start();    // start the game

