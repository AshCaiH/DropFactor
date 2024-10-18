import { Sprite, Text, GameObject, randInt } from "../node_modules/kontra/kontra.mjs";

export default class Coin {
    function makeCoin(gridX,gridY) {
        dropping = true;
    
        let value = randInt(1,7)
        let isBuried = randInt(1,8) === 8
    
        gridY = -1;
    
        // How many coins are already in column?
        let coinsInColumn = grid[gridX].filter(item => item !== null).length;
        gridY = gridSize.height - coinsInColumn - 1;
        console.log(gridY);
    
        if (gridY === -1) gameOver = true;
    
        let text = Text({
            opacity: isBuried ? 0: 1,
            text: value,
            color: value >= 5 ? "#CDE" : "#311",
            font: 'bold 24px Arial',
            width: coinRadius * 2,
            textAlign: "center",
            anchor: {x: 0, y: -0.8},
        });
    
        let bgColour = Sprite({
            color: isBuried ? "#ABC": palette[value-1],
            render: function() {
                this.context.fillStyle = this.color;
                this.context.beginPath();
                this.context.arc(coinRadius, coinRadius, coinRadius, 0, 2 * Math.PI);
                this.context.fill();
                this.context.closePath();
            }
        })
    
        let stroke = Sprite({
            render: function() {
                this.context.lineWidth = 2;
                this.context.strokeStyle = "#BCD";
                this.context.stroke();
                this.context.beginPath();
                this.context.arc(coinRadius, coinRadius, coinRadius, 0, 2 * Math.PI);
                this.context.closePath();
            }
        })
    
        let coin = GameObject({
            gridPos: {x: gridX, y: gridY},
            x: gridX * (coinRadius * 2 + coinBuffer),
            y: -1 * (coinRadius * 2 + coinBuffer),
            dy: 48,
            bg: bgColour,
            text: text,
            dropping: true,
            update: function(dt) {
                this.advance()
                if (this.dropping && this.y >= this.gridPos.y * (coinRadius * 2 + coinBuffer)) {
                    this.y = this.gridPos.y * (coinRadius * 2 + coinBuffer);
                    dropping = false;
                    this.dropping = false;
                    this.dy = 0;
                }
            }
        })
    
        coin.addChild(bgColour, stroke, text);
    
        grid[gridX][gridY] = coin;
    
        return coin;
    }
}