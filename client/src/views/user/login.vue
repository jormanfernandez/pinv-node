<template>
  <div>
    <p>Logueo de Usuario</p>

    <form @submit.prevent="send">
      <span @click="$refs.nick.focus()">Usuario: </span> <input ref="nick" type="text" placeholder="Nick" v-model="nick" :disabled="sending">
      <br>
      <span @click="$refs.pass.focus()">Contraseña: </span> <input ref="pass" type="password" placeholder="Contraseña" v-model="pass" :disabled="sending">
      <br>
      <p class="error" :class="{show: withError}">{{error}}</p>
      <input type="submit" :disabled="sending" value="Iniciar sesión">
    </form>
  </div>
</template>

<script>
import {isEmpty} from '../../classes/mainFunctions'
export default {
  name: 'userLogin',
  data () {
    return {
      nick: '',
      pass: '',
      error: '',
      sending: false
    }
  },
  methods: {
    send (ev) {
      this.sending = true
      this.error = ''

      this.$root.axios.post('/user/login', JSON.stringify({
        nick: this.nick,
        pass: this.pass
      })).then(res => {
        if (res.data.code !== 200) {
          this.error = res.data.message
          return
        }

        this.$root.user.Build(Object.assign({logged: true}, res.data.message))
      }).catch(err => {
        this.$root.alert({
          text: `Ha ocurrido un error: ${err}`
        })
        console.warn(err)
      }).finally(() => {
        this.sending = false
      })
    }
  },
  computed: {
    withError () {
      return !isEmpty(this.error)
    }
  }
}
</script>
<style scoped>
  div {
    margin: 10px 0 10px 0;
  }
  form {
    left: 0;
    margin: 20px auto 0 auto;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    max-width: 30%;
  }
  p {
    text-align: center;
  }
  span {
    margin-bottom: 3px;
    cursor: pointer;
  }
  input[type="submit"] {
    margin-top: 35px;
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
  input[type="submit"]:active,
  input[type="submit"]:disabled {
    background-color: #8e7b85;
  }
  input[type="submit"]:focus,
  input[type="submit"]:active {
    font-size: 19px;
  }
  input[type="text"], input[type="password"] {
    border:  1px solid #ccc;
    padding: 3px;
    border-radius: 3px;
    transition: all 0.2s;
  }
  input[type="text"]:hover,
  input[type="text"]:active,
  input[type="text"]:focus,
  input[type="password"]:hover,
  input[type="password"]:active,
  input[type="password"]:focus {
    padding: 5px;
    background-color: #ccc;
    border:  1px solid rgb(110, 110, 110);
  }
  .error {
    color: red;
    text-align: center;
    opacity: 0;
  }

  .show {
    animation-name: display;
    animation-iteration-count: 1;
    animation-duration:  0.2s;
    opacity: 1;
  }

</style>
