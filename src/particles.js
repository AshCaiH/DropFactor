import { GameObject, Pool, Sprite, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { Machine } from "./Machine.js";



export class Particles extends SpriteClass {
	constructor(options) {
		super(options);
		for (let i=0; i<20; i++) {
			this.addChild(new Particle());
		}
	}

	update() {
		super.update();
		this.children = this.children.filter(child => child.ttl > 0);
	}
}

class Particle extends SpriteClass {
	constructor(options) {
		super({
			height: 10,
			width: 10,
			color: "#ABC",
			dx: Math.random() * 4 - 2,
			dy: Math.random() * -4,
			ttl:40 + Math.floor(Math.random() * 20),
			rotation: Math.random(),
			update: function() {
				this.advance();
				this.dx *= 0.995;
				this.dy += 0.3;
				this.height -= 0.2;
				this.width -= 0.2;
				this.ttl--;
				console.log(this.ttl);
			}
		});
		
	};
};