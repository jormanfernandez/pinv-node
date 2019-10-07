<template>
  <div>
    <h1>Reporte por articulo</h1>
  <hr>
    <form @submit.prevent="search">
      <label>
        <span>Serial</span>
        <input 
          type="text" 
          v-model="serial" 
          placeholder="Serial del articulo" 
          :disabled="isSending">
      </label>
  
      <label>
        <span>Bucar asignado</span>  
          <select v-model="assigned" :disabled="isSending">
            <option value="both">Asignado y no asignado</option>
            <option value="no">No asignado</option>
            <option value="yes">Asignado</option>
          </select>      
      </label>

      <label>
        <span>
          Categoria
        </span>
        <br>
        <select v-model="category" :disabled="isSending">
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
        <select v-model="mark" :disabled="isSending">
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
        <select v-model="state" :disabled="isSending">
          <option value="">Elige una opcion</option>
          <option v-for="elm in states" 
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
            <option value="">Elige una opcion</option>
            <option v-for="elm in departments" 
              :value="elm._id" 
              :key="elm._id">{{elm.nombre}}</option>
          </select>
        </label>
      <br>
      
      <span>Desde:</span>
      <datepicker 
        v-model="date_min"
        placeholder="Desde"
        :inline="true"
        :clear-button="true"
        :monday-first="true"
        :language="lang"></datepicker>

      <br>

      <span>Hasta:</span>
      <datepicker 
        v-model="date_max"
        placeholder="Hasta"
        :inline="true"
        :clear-button="true"
        :monday-first="true"
        :language="lang"></datepicker>

       <br>
       <br>
       
       <input type="submit" value="Generar reporte">

       <br>

    </form>
  
  <br>
    <hr>

    <input 
      type="button" 
      value="Exportar" 
      v-show="result.length > 0" 
      @click="exportCSV">

      <br>
      <br>

    <div v-show="result.length > 0" class="results">
      <div class="divTable redTable">
        <div class="divTableHeading">
          <div class="divTableRow">
            <div 
              class="divTableHead" 
              v-for="head in resultHeaders" 
              :key="head">{{head}}</div>
          </div>
        </div>
        <div class="divTableBody">
          <div 
            class="divTableRow"
            v-for="row in result">
            <div 
              class="divTableCell"
              v-for="field in row">{{field}}</div>
          </div>
        </div>
      </div>
    </div>

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
  input:not([type='submit']) {
    width: 100%;
    position: relative;
    border-radius: 3px;
    background-color: transparent;
    border: 1px solid grey;
    padding: 5px;
    transition: all 0.2s;
  }


  h1 {
    color: #b5b5b5;
    text-align: center;
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
  
  input[type="button"] {
    width: 40%;
    transform: translateX(-50%);
    left: 50%;
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

  div.redTable {
  border: 2px solid #A40808;
  background-color: #EEE7DB;
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}
.divTable.redTable .divTableCell, .divTable.redTable .divTableHead {
  border: 1px solid #AAAAAA;
  padding: 3px 2px;
}
.divTable.redTable .divTableBody .divTableCell {
  font-size: 12px;
}
.divTable.redTable .divTableRow:nth-child(even) {
  background: #F5C8BF;
}
.divTable.redTable .divTableHeading {
  background: #A40808;
}
.divTable.redTable .divTableHeading .divTableHead {
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
  text-align: center;
  border-left: 2px solid #A40808;
}
.divTable.redTable .divTableHeading .divTableHead:first-child {
  border-left: none;
}

.redTable .tableFootStyle {
  font-size: 13px;
}
.redTable .tableFootStyle .links {
   text-align: right;
}
.redTable .tableFootStyle .links a{
  display: inline-block;
  background: #FFFFFF;
  color: #A40808;
  padding: 2px 8px;
  border-radius: 5px;
}
.redTable.outerTableFooter {
  border-top: none;
}
.redTable.outerTableFooter .tableFootStyle {
  padding: 3px 5px; 
}
/* DivTable.com */
.divTable{ display: table; }
.divTableRow { display: table-row; }
.divTableHeading { display: table-header-group;}
.divTableCell, .divTableHead { display: table-cell;}
.divTableHeading { display: table-header-group;}
.divTableFoot { display: table-footer-group;}
.divTableBody { display: table-row-group;}

.results {
  padding: 3px;
}
</style>

<script type="text/javascript">
import Datepicker from 'vuejs-datepicker'
import {trim, isEmpty, getDateLang, exportCSV} from '../../classes/methods'
export default {
  name: 'Report',
  data () {
    return {
      lang: getDateLang(),
      result: [],
      marks: [],
      categories: [],
      departments: [],
      states: [],
      department: '',
      serial: '',
      mark: '',
      category: '',
      state: '',
      isSending: false,
      loader: null,
      timmer: null,
      assigned: 'both',
      date_min: null,
      date_max: null
    }
  },
  methods: {
    search () {
      this.isSending = true
      this.result = []
      this.$root.axios.get("/report", {
      params: {
        department: this.department,
        mark: this.mark,
        state: this.state,
        serial: this.serial,
        category: this.category,
        assigned: this.assigned,
        date_max: this.date_max,
        date_min: this.date_min
      }
      }).then(response => {
        if (response.data.code !== 200) {
          this.$root.window({
            message: response.data.message,
            type: 'error'
          })
          return
        }

        this.result = response.data.message 
    }).catch(err => {
        this.$root.window({
          message: err,
          type: 'error'
        })
      }).finally(() => {
        this.isSending = false
      })
    },
    exportCSV () {
      exportCSV(this.result, 'articleReport.csv')
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

        this.marks = response.data.message
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

        this.categories = response.data.message
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

        this.states = response.data.message
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

        this.departments = response.data.message
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
  computed: {
    resultHeaders () {
      return Object.keys(this.result.length > 0 ? this.result[0] : [])
    }
  },
  components: {
    Datepicker
  },
  activated () {
    this.getDepartments()
    this.getStates()
    this.getCategories()
    this.getMarks()
  }
}

</script>