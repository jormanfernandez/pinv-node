<template>
  <div class="wrapper">

    <h1>
      Gestion de articulos
    </h1>

    <hr>
    
    <template v-if="!serial">
      <p>
        No se ha buscado ningun articulo
      </p>
    </template>
    <template v-else-if="article">
      <div class="article">
        <p class="header">
          {{article.category.nombre}} {{article.mark.nombre}}
        </p>
        <span title="Fecha de adicion" class="fecha">
          {{article.created_date | datetime}}
        </span>
        <span>
          {{article.nombre | name}}
        </span>
        <span>
          Serial: {{article.serial}}
        </span>
        <span>
          Ultimo estado registrado: {{article.state.nombre}}
        </span>
      </div>

      <br>
    
      <form @submit.prevent="manage">
        <label>
          <span>
            Estado actual
          </span>
          <br>
          <select v-model="state" :disabled="isSending" :class="{error: !validState}">
            <option value="">Elige una opcion</option>
            <option v-for="(elm, idx) in states" 
              :value="elm._id" 
              :key="elm._id">{{elm.nombre}}</option>
          </select>
        </label>
        <label>
          <span>
            Departamento
          </span>
          <br>
          <select v-model="department" :disabled="isSending">
            <option value="">No asignar</option>
            <option v-for="elm in departments" 
              :value="elm._id" 
              :key="elm._id" :selected="elm._id == article.state._id">{{elm.nombre}}</option>
          </select>
        </label>
        <div v-show="assign">        
          <label>
            <span>
              Cedula de la persona a asignar
            </span>
            <br>
            <input type="number" v-model="cedula" placeholder="Cedula">
          </label>
          <label>
            <span>
              Puesto al que se asigno
            </span>
            <br>
            <input type="number" v-model="puesto" placeholder="Puesto">
          </label>
        </div>
        <textarea v-model="note" placeholder="Nota"></textarea>
        <br>
        <input type="submit" name="Gestionar">
      </form>      
    </template>
    <template v-else>
      <p>
        No se ha podido encontrar el articulo
      </p>
    </template>

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

  .article {
    width: 90%;
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

  .article div {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  .fecha {
    text-align: right;
    font-size: 12px;
    color: #777474;
    cursor: default;
  }

  .header {
    text-align: left;
    padding: 3px;
    background-color: #5d4954b0;
    color: #ececec;
  }

  .error {
    border: 1px solid #ce0707;
  }

  textarea {
  	margin: 10px;
    padding: 5px;
    border-radius: 3px;
    border: 1px solid lightgrey;
    resize: none;
    width: 90%;
    height: 100px;
    transition: all 0.2s;
  }

  textarea:active {
  	border: 1px solid grey;
  }

  textarea:hover {
  	background-color: #d8d5d5;
  }
</style>

<script type="text/javascript">
import {trim, isEmpty, extractDate, extractTime} from '../../classes/methods'

export default {
  name: 'articleAssign',
  data () {
    return {
      departments: [],
      states: [],
      isSending: false,
      loader: null,
      timmer: null,
      department: '',
      state: '',
      search: '',
      article: null,
      serial: null,
      cedula: null,
      puesto: null,
      note: null
    }
  },
  methods: {
    getArticle () {
      if (isEmpty(this.serial)) {
        this.article = null
        return
      }

      this.$root.axios.get("/article", {
        params: {
          serial: this.serial
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

        this.article = response.data.message[0]
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
    },
    getDepartments () {
      this.$root.axios.get("/department", {
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

        this.departments = this.departments.concat(response.data.message)
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
    assign () {
      let exists = false

      for (let department of this.departments) {
        if (department._id == this.department) {
          exists = true
          break
        }
      }

      return exists
    },
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
    },
    serial (newValue, oldValue) {
      if (newValue == oldValue) {
        return
      }

      this.getArticle()
    }
  },
  filters: {
    name: name => {
      console.log(name)
      return isEmpty(name) ? 'Sin Nombre' : name
    },
    datetime: datetime => {
      return `${extractDate(datetime)} ${extractTime(datetime)}`
    }
  },
  activated () {
    this.serial = this.$route.params.serial
    this.getStates()
    this.getDepartments()
  }
}
</script>