<template>
	<div class="not-found">
	    <br>
	    <div class="where-am-i"></div>

	    <p class="title">Ruta "<u><i><b>{{this.$route.path}}</b></i></u>" no encontrada</p>
	    <p>No hemos encontrado la ruta a la cual quieres acceder</p>

	    <router-link to="/">Inicio</router-link>
	</div>
</template>

<style scoped>
	div.not-found {
	  text-align: center;
	  left: 0;
	  margin: auto;
	  margin-top: 70px;
	  border-radius: 3px;
	  background-color: white;
	  width: 900px;
	  height: 300px;
	}

	div.where-am-i {
	  background-image: url("/static/assets/broken-link.png");
	  background-size: cover;
	  background-repeat: no-repeat;
	  left: 0;
	  margin-top: 20px;
	  margin: auto;
	  margin-bottom: 2%;
	  width: 400px;
	  height: 170px;
	}

	div.not-found p.title {
	  margin-bottom: 20px;
	}

	div.not-found a {
	  text-decoration: underline;
	  color: black !important;
	}
</style>

<script>
export default {
  name: 'notFound'
}
</script>
