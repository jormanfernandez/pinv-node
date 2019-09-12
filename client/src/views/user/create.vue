<template>
	<div>
		<h1>
			Crear usuario
		</h1>

		<hr>

		<form @submit.prevent="submit">
			<label>
				<span>
					Username
				</span>
				<br>
				<input type="text" name="username" v-model="username" placeholder="Nombre de Usuario" :disabled="isSending">
			</label>
			<br>
			<label>
				<span>
					Contraseña
				</span>
				<br>
				<input :type="passwordField" name="password" v-model="pwd" placeholder="Contraseña" :disabled="isSending">
				<div class="pass-btn" @click="showPwd = !showPwd">&nbsp;</div>
			</label>
			<br>
			<label>
				<span>
					Cedula del usuario
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

	.pass-btn {
	    background-image: url(/static/assets/eye.png);
	    background-size: cover;
	    background-repeat: no-repeat;
	    width: 30px;
	    height: 30px;
	    float: right;
	    margin-top: -30px;
	    margin-right: 10px;
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
	export default {
		name: 'userCreate',
		data () {
			return {
				username: '',
				pwd: '',
				access: [],
				cedula: null,
				isSending: false,
				showPwd: false
			}
		},
		methods: {
			submit () {

			}
		},
		computed: {
			passwordField () {
				return this.showPwd ? 'text' : 'password'
			}
		}
	}
</script>