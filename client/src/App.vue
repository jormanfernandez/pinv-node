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
    <button :style="visible" class="up-btn" @click="scrollTop">
      Arriba
    </button>
    <Footer></Footer>

    <Confirm v-for="value in $root.confirms" :key="value.id" :data="value"></Confirm>
    <Prompt v-for="value in $root.prompts" :key="value.id" :data="value"></Prompt>

    <Window v-for="value in $root.windows" :key="value.id" :data="value"></Window>
    <Alert v-for="value in $root.alerts" :key="value.id" :data="value"></Alert>
  </div>
</template>

<style scoped>
  #app {
    margin-bottom: 30px;
  }
  .up-btn {
    position: fixed;
    top: 10%;
    margin-left: 10px;
    border: 1px solid lightgrey;
    border-radius: 3px;
    padding: 3px;
    color: white;
    cursor: pointer;
    background-color: #5d4954;
    transition: all 0.2s;
    opacity: 0;
    display: none;
  }

  .up-btn:active {
    padding: 2px;
  }
</style>

<script>
import userLogin from './views/user/login'
import navMenu from './views/Menu'
import Alert from './views/modals/alert'
import Confirm from './views/modals/confirm'
import Prompt from './views/modals/prompt'
import Window from './views/modals/window'
import Footer from './views/footer'

export default {
  name: 'App',
  data () {
    return {
      visible: '',
      timmer: null
    }
  },
  components: {userLogin, navMenu, Alert, Confirm, Prompt, Window, Footer},
  methods: {
    scrollTop () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  computed: {
    upBtnVisible () {
      return this.$root.scrollTop
    }
  },
  watch: {
    upBtnVisible (value) {
      if (this.timmer) {
        clearTimeout(this.timmer)
      }

      if (value) {
        this.visible = 'display: block;'
        this.timmer = setTimeout(() => {
          this.visible = 'display: block; opacity: 1'
        }, 10)
      } else {
        this.visible = 'display: block; opacity: 0'
        this.timmer = setTimeout(() => {
          this.visible = null
        }, 250)
      }
    }
  }
}
</script>
