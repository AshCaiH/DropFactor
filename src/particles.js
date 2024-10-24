import { SpriteClass } from "../node_modules/kontra/kontra.mjs";

const defaultParticle = {
	x: 0,
	y: 0,
	color: "#ABC",
	height:10,
	width:10,
	count: 20,
	ttl: 50,
	rotation: Math.random(),
	gravity: 0,
	decel: 0.995,
	shrink: 0.2,
	randomise: function() {
		this.dx = Math.random() * 3 - 1.5;
		this.dy = Math.random() * 3 - 1.5;
		this.rotation = Math.random();
	},
	update: function() {
		this.advance();
		this.dx *= this.decel;
		this.dy = this.gravity == 0 ? this.dy * this.decel : this.dy + this.gravity;
		this.height -= this.shrink;
		this.width -= this.shrink;
		this.ttl--;
	}
}

export const presets = {
	crumbling: Object.assign({
		gravity: 0.3,
		count: 40,
	}, defaultParticle) 
}

export class Particles extends SpriteClass {
	constructor(options, particleOptions) {
		super(options);
		console.log(particleOptions ? particleOptions.preset : null);
		for (let i=0; i<defaultParticle.count; i++) {
			defaultParticle.randomise();
			this.addChild(new Particle(defaultParticle));
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