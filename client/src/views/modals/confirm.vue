<template>
	<Overlay :node="node">
		<template slot="body">
			<p>
				{{data.text}}
			</p>
			<br>
			<div class="actions">				
				<input type="button" :value="button.no" @click="cancel">
				<input type="button" :value="button.yes" @click="accept" ref="yes">
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
		name: 'Confirm',
		props: {
			data: Object
		},
		methods: {
			cancel () {
				if (typeof this.data.onCancel == 'function') {
					this.data.onCancel();
				}
				this.close()
			},
			close () {
				this.$children[0].close()
			},
			accept () {

				if (typeof this.data.callback == 'function') {
					this.data.callback()
				}

				this.close()
			}
		},
		computed: {
			button () {
				return Object.assign({
					yes: 'Aceptar',
					no: 'Cancelar'
				}, this.data.buttons ? this.data.buttons : {})
			},
			node () {
				return {
					key: this.$vnode.key,
					type: 'Confirm'
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

