<script lang="ts">
	import MersenneTwister from 'mersenne-twister';
	import { Colors } from './colors';
	import Paper from './Paper.svelte';
	import Shape from './Shape.svelte';

	const DEFAULT_SHAPE_COUNT = 3;

	export let address: string;

	function times(n: number): number[] {
		return Array.from({ length: n }, (_, i) => i);
	}

	const seed = parseInt(address.toLowerCase().slice(2, 10), 16);
	const generator = new MersenneTwister(seed);
	const colors = new Colors(generator);
	const paperColor = colors.next();
</script>

<Paper color={paperColor} {...$$restProps}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="100%"
		height="100%"
		viewBox="0 0 100 100"
	>
		{#each times(DEFAULT_SHAPE_COUNT) as i (`shape-${i}`)}
			<Shape {generator} total={DEFAULT_SHAPE_COUNT} index={i} {colors} />
		{/each}
	</svg>
</Paper>
