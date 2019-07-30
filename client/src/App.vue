<template>
  <div id="app">
    <navMenu></navMenu>
    <hr>
    <div v-if="$root.user.logged">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
    <userLogin v-else></userLogin>
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
