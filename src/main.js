import { Sprite, init, GameLoop } from "../node_modules/kontra/kontra.mjs";


let { canvas } = init();

let sprite = Sprite({
    x: 100,
    y: 100,
    // dx: 2, // Moves each frame

    color: '#DDD',

    // custom properties
    radius: 20,

    render: function () {
        this.context.fillStyle = this.color;

        this.context.beginPath();
        this.context.arc(0, 0, this.radius, 0, 2 * Math.PI);
        this.context.fill();
    }
});

let loop = GameLoop({  // create the main game loop
    update: function () { // update the game state
        sprite.update();
    },
    render: function () { // render the game state
        sprite.render();
    }
});

loop.start();    // start the game

