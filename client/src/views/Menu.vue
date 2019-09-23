<template>
  <nav>
    <div class="logo">
      <h4>PINV</h4>
    </div>
      <ul :class="{'active': show}">
        <li>
          <router-link to="/">Inicio</router-link>
        </li>
        <li v-for="(link, idx) in $root.user.access" 
          :key="idx" v-show="link.url != '/article/assign'">
          <router-link :to="link.url">{{link.name}}</router-link>
        </li>
        <li v-if="$root.user.logged">
          <a href="#" @click.prevent="logout">Salir</a>
        </li>
      </ul>
      <div class="burger" @click="show = !show">
        <div></div>
        <div></div>
        <div></div>
      </div>
  </nav>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  name: 'navMenu',
  data () {
    return {
      show: false
    }
  },
  methods: {
    logout () {
      this.$root.axios.post('/user/logout', JSON.stringify({
        nick: this.$root.user.nick
      })).then(res => {
        if (res.data.code !== 200) {
          this.$root.alert({
            text: res.data.message
          })
          return
        }

        this.$root.user.Build({
          logged: false
        })
      }).catch(err => {
        this.$root.alert({
          text: `Ha ocurrido un error: ${err}`
        })
        console.warn(err)
      })
    }
  },
  components: {vSelect}
}
</script>
<style scoped>
  nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    min-height: 10%;
    background-color: #5d4954;
    font-family: Helvetica, 'san-serif';
  }

  .logo {
    color: rgb(226,226,226);
    text-transform: uppercase;
    letter-spacing: 5px;
    font-size: 20px;
  }

  nav ul {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 30%;
    position: absolute;
    right: 0px;
    height: 90%;
    overflow-y: auto;
    top: 6%;
    background-color: #5d4954;
    transform: translateX(100%);
    transition: transform 0.5s ease-in;
    z-index: 1;
  }

  nav ul li {
    list-style: none;
  }

  nav ul a {
    color: rgb(226,226,226);
    text-decoration: none;
    letter-spacing: 3px;
    font-weight: bold;
    font-size: 14px;
    transition: color 0.2s;
  }

  nav ul a:hover {
    color: rgb(255,255,255);
  }

  .burger {
    display: block;
    cursor:  pointer;
  }

  .burger:hover > div {
    background: rgb(255,255,255);
  }

  .burger div {
    width: 25px;
    height: 3px;
    background-color: rgb(226,226,226);
    margin: 5px;
    transition: all 0.2s;
  }

  .active {
    transform: translateX(0%);
  }

</style>
