import { SpriteClass, Sprite } from "../node_modules/kontra/kontra.mjs";

const defaultParticle = {
	x: 0,
	y: 0,
	color: "#ABC",
	height:10,
	width:10,
	count: 20,
	ttl: 60,
	rotation: Math.random(),
	gravity: 0,
	decel: 0.97,
	shrink: 0.3,
	randomise: function() {randomise(this)},
	update: function() {
		this.advance();
		this.dx *= this.decel;
		this.dy = this.gravity == 0 ? this.dy * this.decel : this.dy + this.gravity;
		this.height -= this.shrink;
		this.width -= this.shrink;
		if (this.height <= 0) this.ttl = 0;
		else this.ttl--;
	}
}

export const presets = {
	crumbling: Object.assign({}, defaultParticle, {
		gravity: 0.4,
		count: 40,
		decel: 0.98,
		ttl: 100,
		shrink: 0.2,
		randomise: function() {
			randomise(this);
			this.x = Math.random() * 40 - 20;
			this.y = Math.random() * 40 - 20;
			this.dx = Math.random() * 7 - 3.5;
			this.dy = Math.random() * - 5;
		},
	})
}

function randomise(target) {
	target.dx = Math.random() * 6 - 3;
	target.dy = Math.random() * 6 - 3;
	target.rotation = Math.random();
}

export class Particles extends SpriteClass {
	constructor(options, particleOptions) {
		super(options);
		let preset = options.preset ?? defaultParticle;
		Object.assign(preset, particleOptions);
		for (let i=0; i<defaultParticle.count; i++) {
			preset.randomise();
			this.addChild(Sprite(preset));
		}
	}

	update() {
		super.update();
		this.children = this.children.filter(child => child.ttl > 0);
	}
}