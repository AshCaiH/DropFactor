import { SpriteClass } from "../node_modules/kontra/kontra.mjs";

export class Particles extends SpriteClass {
	constructor(options) {
		super(options);
		let count = options.count ? options.count : 20;
		let mode = options.mode ? options.mode : "pop";
		for (let i=0; i<count; i++) {
			this.addChild(new Particle({
				height: 10,
				width: 10,
				dx: mode == "pop" ? Math.random() * 3 - 1.5 : Math.random() * 4 - 2,
				dy: mode == "pop" ? Math.random() * 3 - 1.5 : Math.random() * -4,
				color: options.color ? options.color : "#ABC",
				ttl:50 + Math.floor(Math.random() * 20),
				rotation: Math.random(),
				update: function() {
					this.advance();
					this.dx *= 0.995;
					this.dy = mode == "pop" ? this.dy * 0.995 : this.dy + 0.3;
					this.height -= 0.2;
					this.width -= 0.2;
					this.ttl--;
				}
			}));
		}
	}

	update() {
		super.update();
		this.children = this.children.filter(child => child.ttl > 0);
	}
}

class Particle extends SpriteClass {
	constructor(options) {
		super(options);
		console.log("colour:", this.color);
	};
};