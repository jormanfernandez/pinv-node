<template>
	<Overlay :node="node">
		<template slot="body">
			<p>
				{{data.text}}
			</p>
			<br>
			<div class="actions">
				<input type="button" :value="button" @click="close" ref="yes">
			</div>			
		</template>
	</Overlay>	
</template>

<style scoped>
	p {
		text-align: center;
	}

	.actions {
		display: flex;
    	justify-content: space-evenly;
    	margin-bottom: 3px;
	}

	input[type="button"] {
    	position: relative;
	    border: 0px;
	    border-radius: 3px;
	    padding: 3px;
	    background-color: #5d4954;
	    color: white;
	    font-size: 20px;
	    cursor: pointer;
	    transition: all 0.2s;
	  }
	  input[type="button"]:hover,
	  input[type="button"]:focus,
	  input[type="button"]:active,
	  input[type="button"]:disabled {
	    background-color: #8e7b85;
	  }
	  input[type="button"]:focus,
	  input[type="button"]:active {
	    font-size: 19px;
	  }
</style>

<script type="text/javascript">
	import Overlay from './overlay'

	export default {
		name: 'Alert',
		props: {
			data: Object
		},
		methods: {
			close () {
				this.$children[0].close()
			}
		},
		computed: {
			button () {
				if (this.data.button) {
					return this.data.button
				} else {
					return 'Aceptar'
				}
			},
			node () {
				return {
					key: this.$vnode.key,
					type: 'Alert'
				}
			}
		},
		mounted () {
			this.$refs.yes.focus()
		},
		components: {
			Overlay
		}
	}
</script>

