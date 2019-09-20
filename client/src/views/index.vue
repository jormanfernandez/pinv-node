<template>
  <div class="wrapper">
    <h1>
    	Bienvenido, {{$root.user.nick}}
    </h1>

    <hr>
    <div class="access">
      <div v-for="(route, idx) in $root.user.access" 
        :key="idx" 
        class="row">
        <router-link :to="route.url">{{route.name}}</router-link>
      </div>  
    </div>

  </div>
</template>

<script>
export default {
  name: 'index',
}
</script>

<style scoped>
  .wrapper {
    width: 70%;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  .access {
    display: flex;
    flex-wrap: wrap;
  }

  .row {
    transition: all 0.2s;
    padding: 5px;
    margin: 5px;
    border-radius: 3px;
    border: 1px solid lightgray;
    width: 45%;
  }

  a {
    color: black;
    transition: all 0.2s;
    text-align: right;
    text-decoration: underline;
    cursor: pointer;
  }

  a:hover {
    color: #777777;
  }

  h1 {
    color: #b5b5b5;
    text-align: center;
  }
</style>
