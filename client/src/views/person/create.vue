<template>
	<div>
		<h1>
			Ingreso de personas
		</h1>

		<hr>

		<form @submit.prevent="submit">
			<label>
				<span>
					Nombre
				</span>
				<br>
				<input type="text" name="nombre" v-model="nombre" placeholder="Nombre" :disabled="isSending">
			</label>
			<br>
			<label>
				<span>
					Apellido
				</span>
				<br>
				<input type="text" name="apellido" v-model="apellido" placeholder="Apellido" :disabled="isSending">
			</label>
			<br>
			<label>
				<span>
					Cedula
				</span>
				<br>
				<input type="number" name="cedula" v-model="cedula" placeholder="Cedula" :disabled="isSending">
			</label>
			<hr>
			<input type="submit" value="Guardar" :disabled="isSending">
		</form>
	</div>
</template>

<style scoped>
	div {
		width: 70%;
		left: 0;
		margin-left: auto;
		margin-right: auto;
		position: relative;
	}

	input:not([type='submit']) {
		width: 100%;
		position: relative;
		border-radius: 3px;
		background-color: transparent;
		border: 1px solid grey;
		padding: 5px;
		transition: all 0.2s;
	}

	input:not([type='submit']):hover,
	input:not([type='submit']):active,
	input:not([type='submit']):focus {
		background-color: #00000008;
		padding:  7px;
	}

	label {
		width: 70%;
		position: relative;
		cursor: pointer;
	}

	h1 {
		color: #b5b5b5;
		text-align: center;
	}

	form {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-direction: column;
		margin-top: 5%;
	}

	input[type="submit"] {
		margin-top: 10px;
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
	  input[type="submit"]:hover,
	  input[type="submit"]:focus,
	  input[type="submit"]:disabled {
	    background-color: #8e7b85;
	  }
	  input[type="submit"]:focus {
	    font-size: 19px;
	  }
</style>

<script type="text/javascript">
	import {trim, isEmpty} from '../../classes/mainFunctions'
	export default {
		name: 'personCreate',
		data () {
			return {
				nombre: '',
				apellido: '',
				cedula: null,
				isSending: false
			}
		},
		methods: {
			submit() {
				this.isSending = true
				this.nombre = trim(this.nombre)
				this.apellido = trim(this.apellido)

				if (this.cedula < 500000) {
					this.isSending = false
					this.$root.alert({
						text: 'La cedula no es valida'
					})
					return
				}

				if (isEmpty(this.nombre) || isEmpty(this.apellido)) {
					this.isSending = false
					this.$root.alert({
						text: 'El nombre y apellido no pueden estar vacios'
					})
					return
				}

				this.$root.confirm({
					text: `¿Desea agregar a ${this.nombre} ${this.apellido}`,
					callback: () => {
						this.$root.axios.put("/person/", JSON.stringify({
							nombre: this.nombre,
							apellido: this.apellido,
							cedula: this.cedula
						})).then(response => {
							if (response.data.code !== 200) {
						       this.$root.window({
						          message: response.data.message,
						          type: 'error'
						        })
					          return
					        }

					        this.$root.window({
					        	type: 'success',
					        	message: `${this.nombre} ${this.apellido} fue añadido exitosamente`
					        })

					        this.nombre = ''
					        this.apellido = ''
					        this.cedula = ''
						}).catch(err => {
							this.$root.window({
					          message: err,
					          type: 'error'
					        })
						}).finally(() => this.isSending = false)
					},
					onCancel: () => this.isSending = false,
					buttons: {
						yes: 'Ingresar'
					}
				})
			}
		}
	}
</script>