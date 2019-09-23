<template>
  <div class="wrapper">
    <h1>
      Agregar articulos
    </h1>

    <hr>

    <form @submit.prevent="send">
      <label>
        <span>
          Nombre
        </span>
        <br>
        <input type="text" v-model="nombre" placeholder="Nombre del articulo" :disabled="isSending">
      </label>
      <label>
        <span>
          Serial
        </span>
        <br>
        <input type="text" v-model="serial" placeholder="Serial del articulo" :disabled="isSending">
      </label>
    <label>
        <span>
          Categoria
        </span>
        <br>
        <select :class="{error: !validCategory}" v-model="category" :disabled="isSending">
          <option value="">Elige una opcion</option>
          <option v-for="elm in categories" 
            :value="elm._id" 
            :key="elm._id">{{elm.nombre}}</option>
        </select>
      </label>
      <label>
        <span>
          Marca
        </span>
        <br>
        <select :class="{error: !validMark}" v-model="mark" :disabled="isSending">
          <option value="">Elige una opcion</option>
          <option v-for="elm in marks" 
            :value="elm._id" 
            :key="elm._id">{{elm.nombre}}</option>
        </select>
      </label>
      <label>
        <span>
          Estado
        </span>
        <br>
        <select :class="{error: !validState}" v-model="state" :disabled="isSending">
          <option value="">Elige una opcion</option>
          <option v-for="elm in states" 
            :value="elm._id" 
            :key="elm._id">{{elm.nombre}}</option>
        </select>
      </label>
      <input type="submit" value="Guardar" :disabled="isSending">
    </form>

    <div class="overlay" :style="loader">
      <img src="/static/assets/loading.gif">
    </div>
  </div>
</template>

<style scoped>
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

  div.wrapper {
    width: 70%;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    position: relative;
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
    margin: 3px;
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

  .error {
    border: 1px solid #ce0707;
  }

  select {
    width: 100%;
    border-radius: 3px;
    padding: 3px;
    border: 1px solid lightgrey;
    transition: all 0.2s;
    cursor: pointer;
  }

  select:hover,
  select:focus,
  select:active {
    background-color: lightgrey;
  }
</style>

<script type="text/javascript">
import {trim, isEmpty} from '../../classes/methods'

export default {
  name: 'articleAdd',
  data () {
    return {
      marks: [],
      categories: [],
      states: [],
      nombre: '',
      serial: '',
      mark: '',
      category: '',
      state: '',
      isSending: false,
      loader: null,
      timmer: null,
    }
  },
  methods: {
    send () {
      this.$root.blur()
      this.isSending = true

      this.category = trim(this.category)
      this.serial = trim(this.serial)
      this.nombre = trim(this.nombre)
      this.state = trim(this.state)
      this.mark = trim(this.mark)

      if (!this.validCategory) {
        this.isSending = false
        this.$root.alert({
          text: 'Debe elegir una categoria valida'
        })
        return
      }

      if (!this.validState) {
        this.isSending = false
        this.$root.alert({
          text: 'Debe elegir un estado valido'
        })
        return
      }

      if (!this.validMark) {
        this.isSending = false
        this.$root.alert({
          text: 'Debe elegir una marca valida'
        })
        return
      }

      if (isEmpty(this.serial)) {
        this.isSending = false
        this.$root.alert({
          text: 'El serial no puede estar vacio'
        })
        return
      }

      /*
      if (isEmpty(this.nombre)) {
        this.$root.alert({
          text: 'El nombre esta vacio'
        })
      }
      */

      this.$root.confirm({
        onCancel: () => this.isSending = false,
        text: `¿Desea agregar el articulo ${this.nombre} con el serial ${this.serial}?`,
        buttons: {
          yes: 'Si',
          no: 'No'
        },
        callback: () => {
          this.$root.axios.put("/article", JSON.stringify({
          	category: this.category,
          	nombre: this.nombre,
          	serial: this.serial,
          	state: this.state,
          	mark: this.mark
          }))
          .then(response => {
	        if (response.data.code !== 200) {
	          this.$root.window({
	            message: response.data.message,
	            type: 'error'
	          })
	          return
	        }

          this.category = ''
          this.nombre = ''
          this.serial = ''
          this.state = ''
          this.mark = ''

	        this.$root.window({
	        	type: 'success',
	        	message: response.data.message
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
    getMarks () {
      this.$root.axios.get("/mark", {
        params: {
          all: true
        }
      })
      .then(response => {
        if (response.data.code !== 200) {
          this.$root.window({
            message: response.data.message,
            type: 'error'
          })
          return
        }

        this.marks = this.marks.concat(response.data.message)
      }).catch(err => {
        this.$root.window({
          message: err,
          type: 'error'
        })
      }).finally(() => {
        this.isSending = false
      })
    },
    getCategories () {
      this.$root.axios.get("/category", {
        params: {
          all : true
        }
      })
      .then(response => {
        if (response.data.code !== 200) {
          this.$root.window({
            message: response.data.message,
            type: 'error'
          })
          return
        }

        this.categories = this.categories.concat(response.data.message)
      }).catch(err => {
        this.$root.window({
          message: err,
          type: 'error'
        })
      }).finally(() => {
        this.isSending = false
      })
    },
    getStates () {
      this.$root.axios.get("/article/state", {
        params: {
          all: true
        }
      })
      .then(response => {
        if (response.data.code !== 200) {
          this.$root.window({
            message: response.data.message,
            type: 'error'
          })
          return
        }

        this.states = this.states.concat(response.data.message)
      }).catch(err => {
        this.$root.window({
          message: err,
          type: 'error'
        })
      }).finally(() => {
        this.isSending = false
      })
    }
  },
  computed: {
    validState () {
      let exists = false

      for (let state of this.states) {
        if (state._id == this.state) {
          exists = true
          break
        }
      }

      return exists
    },
    validMark () {
      let exists = false

      for (let mark of this.marks) {
        if (mark._id == this.mark) {
          exists = true
          break
        }
      }

      return exists
    },
    validCategory () {
      let exists = false

      for (let category of this.categories) {
        if (category._id == this.category) {
          exists = true
          break
        }
      }

      return exists
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
  activated () {
    this.getStates()
    this.getCategories()
    this.getMarks()
  }
}
</script>