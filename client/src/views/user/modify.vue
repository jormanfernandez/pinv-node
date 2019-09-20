<template>
  <div class="wrapper">
    <h1>
      Busqueda de usuarios
    </h1>

    <hr>

    <form @submit.prevent="newSearch">
      <label>
        <span>
          Nick
        </span>
        <br>
        <input type="text" v-model="nick" placeholder="Nombre del usuario" :disabled="isSending">
      </label>
      <label>
        <span>
          Cedula
        </span>
        <br>
        <input type="number" v-model="cedula" placeholder="Cedula de quien posee el usuario" :disabled="isSending">
      </label>
      <hr>
      <input type="submit" value="Buscar" :disabled="isSending">
    </form>

    <br>
    <hr>

    <template v-if="!modifying">
      <template v-if="list.length < 1">
        <p>No se encontraron resultados</p>
      </template>
      <div v-else class="user-list">
        <div v-for="user in list" :key="user._id" class="user">
          <p class="header">{{user.nick}}</p>
          <div>
            <a @click.prevent="setModify(user)">Modificar</a>
          </div>        
        </div>

        <input type="button" value="Buscar mas" @click="search">
      </div>
    </template>
    <template v-else>
      <form @submit.prevent="modify">
        <label>
          <span>
            Nick
          </span>
          <br>
          <input type="text" name="username" v-model="modifyingNick" placeholder="Nombre de Usuario" :disabled="isSending">
        </label>
        <br>
        <div :class="['row', {active: modifyingPwd}]">
          <label>
            <span>
              Reiniciar contraseña
            </span>
            <br>
            <input type="checkbox" v-model="modifyingPwd" value="reset">
          </label>
      </div>
        <br>
        <p>Lista de Accesos</p>

        <input type="button" value="Marcar todos" @click="markAll">

        <div class="access">
          <div v-for="(route, idx) in $root.routes" 
            :key="idx" 
            :class="['row', {active: routes.indexOf(route.url) > -1}]">
            <label :for="'route'+route.url">
              <p>Permitir acceso a</p>
              <br>
              <p>{{route.name}}</p>
            </label>
            <input type="checkbox" :id="'route'+route.url" v-model="modifyingAccess" :value="route">
          </div>  
        </div>
        <hr>
        <input type="submit" value="Guardar" :disabled="isSending">
      </form>
    </template>
    <div class="overlay" :style="loader">
      <img src="/static/assets/loading.gif">
    </div>
  </div>
</template>

<style scoped>
 div.wrapper {
    width: 70%;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  .overlay {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: none;
    top: 0;
    left: 0;
    position: fixed;
    opacity: 0;
    transition: all 0.2s ease;
    background-color: #0000003d;
  }

  .overlay img {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
        height: 70px;
  }

  .access {
    display: flex;
    flex-wrap: wrap;
  }
  .row.active {
    background-color: #d23f555c;
  }
  .row {
    transition: all 0.2s;
    padding: 5px;
    margin: 5px;
    border-radius: 3px;
    border: 1px solid lightgray;
    width: 45%;
  }

  input[type='checkbox'] {
    width: auto !important;
    visibility: hidden;
  }

  .user {
    width: 40%;
    left: 50%;
    transform: translateX(-50%);
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 15px;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.75);
  }

  .user div {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  div.user-list .header {
    text-align: left;
    padding: 3px;
    background-color: #5d4954b0;
    color: #ececec;
  }

  div.user-list input,
  .back-btn {
    width: 20% !important;
    left: 50%;
    transform: translateX(-50%);
    position: relative;
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

  input[type="submit"],
  input[type="button"] {
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
    input[type="submit"]:disabled,
    input[type="button"]:hover,
    input[type="button"]:focus,
    input[type="button"]:disabled {
      background-color: #8e7b85;
    }
    input[type="submit"]:focus,
    input[type="button"]:focus {
      font-size: 19px;
    }
</style>

<script type="text/javascript">
import {trim, isEmpty} from '../../classes/mainFunctions'
export default {
  name: 'userModify',
  data () {
    return {
      isSending: false,
      modifying: null,
      modifyingPwd: null,
      modifyingNick: '',
      modifyingAccess: [],
      loader: null,
      timmer: null,
      list: [],
      cedula: null,
      nick: ''
    }
  },
  methods: {
    setModify(user) {
      this.modifying = user
      this.modifyingAccess = Object.assign([], user.access)
      this.modifyingNick = user.nick
    },
    newSearch () {
      this.list = []
      this.modifying = null
      this.search()
    },
    search () {
      this.isSending = true

      let search = {}
      if (!isEmpty(this.nick)) {
        search.nick = trim(this.nick)
      }

      if (!isNaN(this.cedula) && this.cedula > 500000) {
        search.cedula = this.cedula
      }

      if (this.list.length > 0) {
        search.last = this.list[this.list.length -1]._id
      }

      this.$root.axios.get("/user", {
        params: search
      })
      .then(response => {
        if (response.data.code !== 200) {
          this.$root.window({
            message: response.data.message,
            type: 'error'
          })
          return
        }

        this.list = this.list.concat(response.data.message)
      }).catch(err => {
        this.$root.window({
          message: err,
          type: 'error'
        })
      }).finally(() => {
        this.isSending = false
      })
    },
    modify () {
      this.$root.confirm({
        onCancel: () => this.isSending = false,
        text: '¿Desea modificar a este usuario?',
        callback: () => {
          this.$root.axios.patch("/user", JSON.stringify({
            nick: this.modifyingNick,
            _id: this.modifying._id,
            access: this.modifyingAccess,
            reset_pwd: this.modifyingPwd ? true : false
          }))
          .then(response => {
            if (response.data.code !== 200) {
             this.$root.window({
                message: response.data.message,
                type: 'error'
              })
              return
            }
            
            if (this.$root.user.id == this.modifying._id) {
              setTimeout(() => {
                window.location.reload()
              },1500)
            }

            this.$root.window({
              message: 'Los datos han sido actualizados exitosamente',
              type: 'success'
            })
          }).catch(err => {
            this.$root.window({
              message: err,
              type: 'error'
            })
          }).finally(() => {
            this.isSending = false
          })
        }
      })
    },
    markAll () {
      this.$root.blur()

        const checkbox = document.querySelectorAll(`div.access input[type='checkbox']`)
        const boxes = {marked: [], unmarked: []}

        checkbox.forEach(box => {
            boxes[box.checked ? 'marked' : 'unmarked'].push(box)
        })

        if (boxes.marked.length < checkbox.length) {
          boxes.unmarked.forEach(box => {
            box.click()
          })
        } else {
          boxes.marked.forEach(box => {
            box.click()
          })
        }
    }
  },
  computed: {
    routes () {
        let routes = []
        for (let i in this.modifyingAccess) {
          routes.push(this.modifyingAccess[i].url)
        }

        return routes
      }
  },
  watch: {
    isSending (value) {
      if (this.timmer) {
        clearTimeout(this.timmer)
      }

      if (value) {
        this.loader = 'display: block;'
        this.timmer = setTimeout(() => {
          this.loader = 'display: block; opacity: 1'
        }, 10)
      } else {
        this.loader = 'display: block; opacity: 0'
        this.timmer = setTimeout(() => {
          this.loader = null
        }, 250)
      }
    }
  },
  created () {
    this.newSearch()
  }
}
</script>
