<template>
  <div id="app">
    <navMenu></navMenu>
    <hr>
    <div v-if="$root.user.logged">
      <keep-alive>
        <div v-if="$root.routeAvailable">
          <router-view/>
        </div>
        <div v-else>
          <p>
            Lo siento, {{$root.user.nick}}. No puede acceder a esta ruta
          </p>
        </div>
      </keep-alive>
    </div>
    <div v-else>
      <userLogin></userLogin>
    </div>
  </div>
</template>

<script>
import userLogin from './views/user/login'
import navMenu from './views/Menu'
import AlertBox from './views/Alerts'

export default {
  name: 'App',
  components: {userLogin, navMenu, AlertBox}
}
</script>
