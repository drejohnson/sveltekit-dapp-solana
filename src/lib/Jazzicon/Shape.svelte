<script lang="ts">
	import type MersenneTwister from 'mersenne-twister';
	import type { Colors } from './colors';

	export let generator: MersenneTwister;
	export let total: number;
	export let index: number;
	export let colors: Colors;

	const diameter = 100;
	const width = diameter;
	const height = diameter;
	const firstRot = generator.random();
	const angle = Math.PI * 2 * firstRot;
	const velocity = (diameter / total) * generator.random() + (index * diameter) / total;

	const tx = Math.cos(angle) * velocity;
	const ty = Math.sin(angle) * velocity;

	const translate = 'translate(' + tx.toFixed(3) + ' ' + ty.toFixed(3) + ')';

	const secondRot = generator.random();
	const rot = firstRot * 360 + secondRot * 180;
	const center = diameter / 2;
	const rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')';
	const transform = translate + ' ' + rotate;
	const fill = colors.next();
</script>

<rect {width} {height} x="0" y="0" {transform} fill={fill.hex()} />
