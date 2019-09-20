<template>
  <div class="wrapper">
    <h1 v-show="insert">
      Añadir un nuevo departamento
    </h1>
    <h1 v-show="!insert">
      Buscar un departamento
    </h1>

    <hr>
    <br>

    <input type="button" @click="insert = !insert" 
      :value="'Presione para ' + (!insert ? 'Guardar' : 'Buscar')">

    <form @submit.prevent="save" v-show="insert">
      <label>
        <span>Nombre</span>
        <br>
        <input type="text" placeholder="Nombre del departamento" v-model="newDep">
      </label>

      <input type="submit" value="Guardar">
    </form>

    <form @submit.prevent="newSearch" v-show="!insert">
      <label>
        <span>Nombre</span>
        <br>
        <input type="text" placeholder="Nombre del departamento" v-model="searchDep">
      </label>

      <input type="submit" value="Buscar">
    </form>

    <br>
    <hr>

    <template v-if="modifying">
      <form @submit.prevent="modify">
        <label>
          <span>Nombre</span>
          <br>
          <input type="text" placeholder="Nombre del departamento" v-model="modDep">
        </label>
        <input type="submit" value="Modificar">
      </form>
    </template>
    <template v-else-if="list.length > 0">
      <div class="department-list">
        <div v-for="department in list" :key="department._id" class="department">
          <p class="header">{{department.nombre}}</p>
          <div>
            <a @click.prevent="setMod(department)">Modificar</a>
          </div>        
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

  .department div {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  div.department-list .header {
    text-align: left;
    padding: 3px;
    background-color: #5d4954b0;
    color: #ececec;
  }

  div.department-list input {
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
  name: 'departmentView',
  data () {
    return {
      list: [],
      modifying: null,
      newDep: '',
      searchDep: '',
      modDep: '',
      insert: true,
      loader: null,
      timmer: null,
      isSending: false
    }
  },
  methods: {
  	setMod (department) {
  	  this.modDep = department.nombre
  	  this.modifying = department
  	},
    save () {
      this.$root.blur()
      this.isSending = true

      this.newDep = trim(this.newDep)

      if (isEmpty(this.newDep)) {
      	this.isSending = false
        this.$root.alert({
          text: 'El nombre del departamento no puede estar vacio'
        })
        return
      }

      this.$root.confirm({
        onCancel: () => this.isSending = false,
        text: `¿Desea agregar el departamento ${this.newDep}?`,
        callback: () => {
          this.$root.axios.put("/department", JSON.stringify({
            nombre: this.newDep
          }))
          .then(response => {
	        if (response.data.code !== 200) {
	          this.$root.window({
	            message: response.data.message,
	            type: 'error'
	          })
	          return
	        }

	        this.newDep = ''

	        this.$root.window({
              message: 'Departamento creado exitosamente',
              type: 'success'
            })
            this.newSearch()
	      }).catch(err => {
	        this.$root.window({
	          message: err,
	          type: 'error'
	        })
	      }).finally(() => {
	        this.isSending = false
	      })
        },
        buttons: {
          yes: 'Si',
          no: 'No'
        }
      })
    },
    newSearch() {
      this.modifying = null
      this.modDep = ''
      this.list = []
      this.search()
    },
    search () {
      this.isSending = true

      let search = {}
      if (!isEmpty(this.searchDep)) {
        search.nombre = trim(this.searchDep)
      }

      if (this.list.length > 0) {
        search.last = this.list[this.list.length -1]._id
      }

      this.$root.axios.get("/department", {
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
      this.isSending = true

      this.modDep = trim(this.modDep)

      if (isEmpty(this.modDep)) {
        this.$root.alert({
          text: 'El nombre del departamento no puede estar vacio'
        })
        return
      }

      this.$root.confirm({
        onCancel: () => this.isSending = false,
        text: `¿Desea cambiar el nombre del departamento a ${this.modDep}?`,
        callback: () => {
          this.$root.axios.patch("/department", JSON.stringify({
            nombre: this.modDep,
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
              message: 'Departamento actualizado exitosamente',
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
        },
        buttons: {
          yes: 'Si',
          no: 'No'
        }
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
}
</script>
