import { SpriteClass, Sprite, Pool } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";

const defaultParticle = {
	color: "#ABC",
	height:6,
	width:6,
	count: 18,
	ttl: 60,
	rotation: Math.PI * 2 * Math.random(),
	gravity: 0,
	decel: 0.97,
	shrink: 0.3,
	vector: {x:0, y:0},
	border: 0,
	anchor: {x: 0.5, y: 0.5},
	randomise: function(count) {randomise(this, count)},
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
		count: 15,
		decel: 0.98,
		ttl: 100,
		height: 8,
		width: 8,
		shrink: 0.12,
		randomise: function(count) {
			randomise(this, count, true);
			this.dx = this.dy = 0;
		},
	},
	crumbling: {
		...defaultParticle,
		count: 15,
		decel: 0.98,
		ttl: 100,
		shrink: 0.2,
		randomise: function(count) {
			randomise(this, count, true);
			this.dx = this.dy = 0;
		},
	},
	restarting: {
		...defaultParticle,
		count: 12,
		width: 9,
		height: 9,
		shrink: 0.3,
	},
}

function randomise(target, count, randomSpread = false) {
	let angle = ((count + (randomSpread ? Math.random() * 0.08 - 0.04 : 1)) * 360) * Math.PI / 180;
	target.vector.x = Math.sin(angle);
	target.vector.y = Math.cos(angle);
	target.x = target.pos.x + target.vector.x * settings.coinRadius + global.camera.x;
	target.y = target.pos.y + target.vector.y * settings.coinRadius + global.camera.y;
	
	target.dx = target.vector.x * Math.random() * 2;
	target.dy = target.vector.y * Math.random() * 2;
	target.rotation = Math.random();
}

export class Particles extends SpriteClass {
	constructor() {
		super();
		this.pool = Pool({create: Sprite});
		global.particles = this;
	}

	addEffect(particlePreset, options) {
		let preset = {...presets[particlePreset] ?? defaultParticle, ...options}

		for (let i = 0; i < preset.count; i++) {
			preset.randomise(i / preset.count);
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