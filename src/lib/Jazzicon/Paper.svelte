<script lang="ts">
	import type Color from 'color';

	export let color: Color;
</script>

<div {...$$restProps}>
	<div
		style="border-radius: 50%; overflow: hidden; padding: 0px; margin: 0px; width: 100%; height: 100%; display: inline-block; background-color: {color.hex()};"
	>
		<slot />
	</div>
</div>
