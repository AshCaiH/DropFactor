import { SpriteClass, Sprite, Pool } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";

const defaultParticle = {
	color: "#ABC",
	pos: {x: 0, y: 0},
	height:6,
	width:6,
	count: 30,
	ttl: 60,
	rotation: Math.PI * 2 * Math.random(),
	gravity: 0,
	decel: 0.97,
	shrink: 0.3,
	vector: {x:0, y:0},
	border: 0,
	anchor: {x: 0.5, y: 0.5},
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
	popping: {
		...defaultParticle,
		height:14,
		width:14,
		gravity: 0.5,
		shrink: 0.4,
		ttl: 100,
	},
	breaking: {
		...defaultParticle,
		// gravity: 0.01,
		count: 20,
		decel: 0.98,
		ttl: 100,
		height: 8,
		width: 8,
		shrink: 0.12,
		randomise: function() {
			randomise(this);
			this.dx = this.dy = 0;
		},
	},
	crumbling: {
		...defaultParticle,
		count: 20,
		decel: 0.98,
		ttl: 100,
		shrink: 0.1,
		randomise: function() {
			randomise(this);
			this.dx = this.dy = 0;
		},
	}
}

function randomise(target) {
	let angle = (Math.random() * 360) * Math.PI / 180;
	let distance = Math.random();
	target.vector.x = Math.sin(angle);
	target.vector.y = Math.cos(angle);
	target.x = target.pos.x + target.vector.x * settings.coinRadius;
	target.y = target.pos.y + target.vector.y * settings.coinRadius;
	
	target.dx = target.vector.x * Math.random();
	target.dy = target.vector.y * Math.random();
	// target.rotation = Math.PI * 2 * Math.random();
}

export class Particles extends SpriteClass {
	constructor() {
		super();
		this.pool = Pool({create: Sprite});
		global.particles = this;
	}

	addEffect(particlePreset, options) {
		let preset = {...presets[particlePreset] ?? defaultParticle, ...options}

		console.log(preset);

		for (let i = 0; i < preset.count; i++) {
			preset.randomise();
			this.pool.get(preset);
		}
	}

	update() {
		this.pool.update();
	}

	render() {
		this.pool.render();
	}
}