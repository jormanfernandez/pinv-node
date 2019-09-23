<template>
  <div class="wrapper">
    <h1>
      Buscar articulos
    </h1>

    <hr>

    <form @submit.prevent="newSearch">
      <label>
        <span>
          Nombre
        </span>
        <br>
        <input type="text" v-model="looking.nombre" placeholder="Nombre del articulo" :disabled="isSending">
      </label>
      <label>
        <span>
          Serial
        </span>
        <br>
        <input type="text" v-model="looking.serial" placeholder="Serial del articulo" :disabled="isSending">
      </label>
    <label>
        <span>
          Categoria
        </span>
        <br>
        <select v-model="looking.category" :disabled="isSending">
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
        <select v-model="looking.mark" :disabled="isSending">
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
        <select v-model="looking.state" :disabled="isSending">
          <option value="">Elige una opcion</option>
          <option v-for="elm in states" 
            :value="elm._id" 
            :key="elm._id">{{elm.nombre}}</option>
        </select>
      </label>
      <input type="submit" value="Buscar" :disabled="isSending">
    </form>

    <br>
    <hr>

  <template v-if="modify">
    
  </template>
  <template v-else-if="list.length > 0">
    <div class="list">
      <div v-for="article in list" :key="article._id" class="article">
        <p class="header">
          {{article.category.nombre}} {{article.mark.nombre}}
        </p>
        <span title="Fecha de adicion" class="fecha">
          {{article.created_date | datetime}}
        </span>
        <span class="editable" @click="editName(article)">
          {{article.nombre | name}}
        </span>
        <span class="editable" @click="editSerial(article)">
          Serial: {{article.serial}}
        </span>
        <span>
          Estado: {{article.state.nombre}}
        </span>
        <br>
        <router-link :to="'/article/assign/' + article.serial">Gestionar</router-link>
      </div>

      <input type="button" value="Buscar mas" @click="search">
    </div>
  </template>
  <template v-else>
    <p>No se han encontrado registros</p>
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

  div.list .header {
    text-align: left;
    padding: 3px;
    background-color: #5d4954b0;
    color: #ececec;
  }

  .editable {
    cursor: pointer;
    transition: all 0.2s;
    padding: 3px;
  }

  .editable:hover {
    background-color: #ccc;
  }
</style>

<script type="text/javascript">
import {trim, isEmpty, extractDate, extractTime} from '../../classes/methods'

export default {
  name: 'articleList',
  data () {
    return {
      marks: [],
      categories: [],
      states: [],
      list: [],
      looking: {
        nombre: '',
        serial: '',
        mark: '',
        category: '',
        state: '',
      },
      modify: null,
      isSending: false,
      loader: null,
      timmer: null,
    }
  },
  methods: {
    editName (article) {
      this.$root.prompt({
        text: 'Indique el nuevo nombre del articulo',
        placeholder: 'Nuevo nombre',
        buttons: {
          yes: 'Cambiar'
        },
        callback: value => {
          value = trim(value)

          if (value == article.nombre) {
          	this.$root.alert({
              text: 'El nombre es el mismo'
            })
            return
          }

          this.isSending = true

          this.$root.axios.patch('/article', JSON.stringify({
          	nombre: value,
          	_id: article._id
          }))
          .then(response => {
	        if (response.data.code !== 200) {
	          this.$root.window({
	            message: response.data.message,
	            type: 'error'
	          })
	          return
	        }

	        article.nombre = value
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
    editSerial (article) {
      this.$root.prompt({
        text: 'Indique el nuevo serial del articulo',
        placeholder: 'Nuevo serial',
        buttons: {
          yes: 'Cambiar'
        },
        callback: value => {
          value = trim(value)

          if(isEmpty(value)) {
            this.$root.alert({
              text: 'El serial no puede estar vacio'
            })
            return
          }

          if (value == article.serial) {
          	this.$root.alert({
              text: 'El serial es el mismo'
            })
            return
          }

          this.isSending = true

          this.$root.axios.patch('/article', JSON.stringify({
          	serial: value,
          	_id: article._id
          }))
          .then(response => {
	        if (response.data.code !== 200) {
	          this.$root.window({
	            message: response.data.message,
	            type: 'error'
	          })
	          return
	        }

	        article.serial = value
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
    newSearch () {
      this.list = []
      this.search()
    },
    search () {
      this.isSending = true
      let search = {}

      for(let idx in this.looking) {
        if (isEmpty(this.looking[idx]))
          continue

        search[idx] = trim(this.looking[idx])
      }

      if (this.list.length > 0) {
        search.last = this.list[this.list.length -1]._id
      }

      this.$root.axios.get("/article", {
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
    this.getStates()
    this.getCategories()
    this.getMarks()
    this.newSearch()
  }
}
</script>