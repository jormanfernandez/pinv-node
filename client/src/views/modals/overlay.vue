<template>
	<div class="overlay" :style="opacity" @click.self="close">
		<div :style="style" :class="modalClass">
			<template v-if="node.closeButton">
				<button @click="close">
					<span>x</span>
				</button>
				<hr>
			</template>
			<slot name="body"></slot>
		</div>
	</div>
</template>

<style scoped>
	

	button {
		position: relative;
	    margin-left: 96%;
	    background-color: #bd0d0d;
	    padding-left: 5px;
	    padding-right: 5px;
	    border: 1px solid lightgrey;
	    color: white;
	    border-radius: 3px;
	    padding-bottom: 1px;
	    cursor: pointer;
	    transition: all 0.2s;
	}

	button:active {
		padding-left: 4px;
	    padding-right: 4px;
	    background-color: #e00c0c;
	}

	hr {
		border: 0;
	    height: 1px;
	    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
	    margin-bottom: 10px;
	}

	.overlay {
		width: 100%;
		height: 100%;
		overflow: hidden;
		top: 0;
		left: 0;
		position: absolute;
		opacity: 0;
		transition: opacity 0.15s ease;
		background-color: #0000003d;
	}

	.layout {
		background-color:  white;
		height: auto;
		max-height: 60%;
		width: auto;
		max-width: 60%;
		min-width: 30%;
		left: 50%;
		top: 50%;
		position: absolute;
		margin: auto;
		transform: translate(-50%, -50%);
		overflow: auto;
	}

	.shadow {
		-webkit-box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.75);
		-moz-box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.75);
		box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.75);
	}
</style>

<script type="text/javascript">
	export default {
		name: 'Overlay',
		props: {
			node: Object
		},
		data () {
			return {
				style: '',
				modalOpacity: 0,
				class: ['layout', 'shadow']
			}
		},
		methods: {
			close () {
				console.log('Closing modal')
				this.modalOpacity = 0
				setTimeout(() => {
					this.$root[`remove${this.node.type}`](this.node.key)
				}, 200)
			}
		},
		mounted () {
			setTimeout(() => {
				this.modalOpacity = 1
			}, 5);
		},
		computed: {
			modalClass () {
				return this.class.join(' ')
			},
			opacity () {
				return `opacity: ${this.modalOpacity}`
			}
		}
	}
</script>
