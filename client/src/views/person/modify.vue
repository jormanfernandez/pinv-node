<template>
  <div class="wrapper">
    <h1>
      Busqueda de personas
    </h1>

    <hr>

    <form @submit.prevent="newSearch">
      <label>
        <span>
          Nombre
        </span>
        <br>
        <input type="text" name="nombre" v-model="nombre" placeholder="Nombre" :disabled="isSending">
      </label>
      <br>
      <label>
        <span>
          Apellido
        </span>
        <br>
        <input type="text" name="apellido" v-model="apellido" placeholder="Apellido" :disabled="isSending">
      </label>
      <br>
      <label>
        <span>
          Cedula
        </span>
        <br>
        <input type="number" name="cedula" v-model="cedula" placeholder="Cedula" :disabled="isSending">
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
      <div v-else class="person-list">
        <div v-for="person in list" :key="person._id" class="person">
          <p class="header">{{person.nombre}} {{person.apellido}}</p>
          <div>
            <span>Cedula: {{person.cedula}}</span>
            <a @click.prevent="modifying=person">Modificar</a>
          </div>        
        </div>

        <input type="button" value="Buscar mas" @click="search">
      </div>
    </template>
    <template v-else>
      <div class="modify">
        <input @click="modifying=null" type="button" value="&lt;" class="back-btn">
        <h1>
          Modificando a {{modifying.nombre}} {{modifying.apellido}}
        </h1>      

        <form @submit.prevent="modify">
          <label>
            <span>
              Nombre
            </span>
            <br>
            <input type="text" name="nombre" v-model="modifying.nombre" placeholder="Nombre" :disabled="isSending">
          </label>
          <br>
          <label>
            <span>
              Apellido
            </span>
            <br>
            <input type="text" name="apellido" v-model="modifying.apellido" placeholder="Apellido" :disabled="isSending">
          </label>
          <br>
          <label>
            <span>
              Cedula
            </span>
            <br>
            <input type="number" name="cedula" v-model="modifying.cedula" placeholder="Cedula" :disabled="isSending">
          </label>
          <hr>
          <input type="submit" value="Modificar" :disabled="isSending">
        </form>
      </div>
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

  .person {
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

  .person div {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  div.person-list .header {
    text-align: left;
    padding: 3px;
    background-color: #5d4954b0;
    color: #ececec;
  }

  div.person-list input,
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
  name: 'personModify',
  data () {
    return {
      nombre: '',
      apellido: '',
      cedula: null,
      isSending: false,
      list: [],
      loader: null,
      timmer: null,
      modifying: null
    }
  },
  methods: {
    newSearch () {
      this.list = []
      this.modifying = null
      this.search()
    },
    modify () {
      this.$root.blur()
      this.isSending = true

      this.modifying.nombre = trim(this.modifying.nombre)
      this.modifying.apellido = trim(this.modifying.apellido)

      if (isEmpty(this.modifying.nombre) || isEmpty(this.modifying.apellido)) {
        this.$root.alert({
          text: 'El nombre y apellido no pueden estar vacios'
        })
        this.isSending = true
        return
      }

      if (isNaN(this.modifying.cedula) || this.modifying.cedula < 500000) {
        this.$root.alert({
          text: 'La cedula introducida es invalida'
        })
        this.isSending = true
        return
      }

      this.$root.confirm({
        text: `¿Desea modificar a esta persona?`,
        onCancel: () => this.isSending = false,
        callback: () => {
          this.$root.axios.patch("/person", JSON.stringify({
            nombre: this.modifying.nombre,
            apellido: this.modifying.apellido,
            cedula: this.modifying.cedula,
            _id: this.modifying._id
          }))
          .then(response => {
            if (response.data.code !== 200) {
                 this.$root.window({
                    message: response.data.message,
                    type: 'error'
                  })
                  return
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
          });
        }
      })
    },
    search () {
      this.$root.blur()
      this.isSending = true

      let search = {}

      this.nombre = trim(this.nombre)
      this.apellido = trim(this.apellido)

      if (!isEmpty(this.nombre)) {
        search.nombre = this.nombre
      }

      if (!isEmpty(this.apellido)) {
        search.apellido = this.apellido
      }

      if (!isNaN(this.cedula) && this.cedula > 0) {
        search.cedula = this.cedula
      }

      if(this.list.length > 0) {
        search.last = this.list[this.list.length -1]._id
      }

      this.$root.axios.get("/person/", {
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
      });
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
