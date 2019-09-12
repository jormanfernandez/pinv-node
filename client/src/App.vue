<template>
  <div id="app">
    <navMenu></navMenu>
    <hr>
    <div v-if="$root.user.logged">
      <keep-alive>
        <div v-if="$root.routeAvailable">
          <keep-alive>
            <router-view/>
          </keep-alive>
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

    <Alert v-for="(value, idx) in $root.alerts" :key="value.id" :data="value"></Alert>
    <Confirm v-for="(value, idx) in $root.confirms" :key="value.id" :data="value"></Confirm>
    <Prompt v-for="(value, idx) in $root.prompts" :key="value.id" :data="value"></Prompt>

    <Window v-for="(value, idx) in $root.windows" :key="value.id" :data="value"></Window>
  </div>
</template>

<script>
import userLogin from './views/user/login'
import navMenu from './views/Menu'
import Alert from './views/modals/alert'
import Confirm from './views/modals/confirm'
import Prompt from './views/modals/prompt'
import Window from './views/modals/window'

export default {
  name: 'App',
  components: {userLogin, navMenu, Alert, Confirm, Prompt, Window}
}
</script>
