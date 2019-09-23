<template>
  <div class="wrapper">
    <h1 v-show="insert">
      Añadir una nueva marca
    </h1>
    <h1 v-show="!insert">
      Buscar una marca
    </h1>

    <hr>
    <br>

    <input type="button" @click="insert = !insert" 
      :value="'Presione para ' + (!insert ? 'Guardar' : 'Buscar')">

    <form @submit.prevent="save" v-show="insert">
      <label>
        <span>Nombre</span>
        <br>
        <input type="text" placeholder="Nombre de la marca" v-model="newMark">
      </label>

      <input type="submit" value="Guardar">
    </form>

    <form @submit.prevent="newSearch" v-show="!insert">
      <label>
        <span>Nombre</span>
        <br>
        <input type="text" placeholder="Nombre de la marca" v-model="searchMark">
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
          <input type="text" placeholder="Nombre de la marca" v-model="modMark">
        </label>
        <input type="submit" value="Modificar">
      </form>
    </template>
    <template v-else-if="list.length > 0">
      <div class="mark-list">
        <div v-for="mark in list" :key="mark._id" class="mark">
          <p class="header">{{mark.nombre}}</p>
          <div>
            <a @click.prevent="setMod(mark)">Modificar</a>
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

  .mark {
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

  .mark div {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  div.mark-list .header {
    text-align: left;
    padding: 3px;
    background-color: #5d4954b0;
    color: #ececec;
  }

  div.mark-list input {
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
import {trim, isEmpty} from '../../classes/methods'
export default {
  name: 'markView',
  data () {
    return {
      list: [],
      modifying: null,
      newMark: '',
      searchMark: '',
      modMark: '',
      insert: true,
      loader: null,
      timmer: null,
      isSending: false
    }
  },
  methods: {
  	setMod (mark) {
  	  this.modMark = mark.nombre
  	  this.modifying = mark
  	},
    save () {
      this.$root.blur()
      this.isSending = true

      this.newMark = trim(this.newMark)

      if (isEmpty(this.newMark)) {
      	this.isSending = false
        this.$root.alert({
          text: 'El nombre de la marca no puede estar vacio'
        })
        return
      }

      this.$root.confirm({
        onCancel: () => this.isSending = false,
        text: `¿Desea crear la marca ${this.newMark}?`,
        callback: () => {
          this.$root.axios.put("/mark", JSON.stringify({
            nombre: this.newMark
          }))
          .then(response => {
	        if (response.data.code !== 200) {
	          this.$root.window({
	            message: response.data.message,
	            type: 'error'
	          })
	          return
	        }

	        this.newMark = ''

	        this.$root.window({
              message: 'Marca creada exitosamente',
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
      this.modMark = ''
      this.list = []
      this.search()
    },
    search () {
      this.isSending = true

      let search = {}
      if (!isEmpty(this.searchMark)) {
        search.nombre = trim(this.searchMark)
      }

      if (this.list.length > 0) {
        search.last = this.list[this.list.length -1]._id
      }

      this.$root.axios.get("/mark", {
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

      this.modMark = trim(this.modMark)

      if (isEmpty(this.modMark)) {
        this.$root.alert({
          text: 'El nombre de la marca no puede estar vacio'
        })
        return
      }

      this.$root.confirm({
        onCancel: () => this.isSending = false,
        text: `¿Desea cambiar el nombre de la marca a ${this.modMark}?`,
        callback: () => {
          this.$root.axios.patch("/mark", JSON.stringify({
            nombre: this.modMark,
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
              message: 'Marca actualizada exitosamente',
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
