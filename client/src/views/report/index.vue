<template>
  <div class="wrapper">

    <h1>Reportes</h1>

    <hr>

    <label>
      <span>
        Elija el reporte a generar
      </span>
      <select v-model="selected">
        <option 
          v-for="report in types" 
          :key="report.id"
          :value="report.id"
          >{{report.name}}</option>
      </select>
    </label>

    <br>
    <br>
    
    <ReportArticle
      :class="['hidden', {show: selected == 'article'}]"></ReportArticle>
    <ReportConglomerate
      :class="['hidden', {show: selected == 'conglomerate'}]"></ReportConglomerate>
  </div>
</template>

<style scoped>
  .hidden {
    opacity: 0;
    display: none;
    transition: all 0.2s;
  }

  @keyframes display {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }
  
  div.wrapper {
    width: 70%;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  .show {
    opacity: 1;
    display: block;
    animation: display;
    animation-duration: 1s;
    animation-iteration-count: 1;
  }

  h1 {
    color: #b5b5b5;
    text-align: center;
  }

  label {
  	transform: translateX(-50%);
    left: 50%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    margin-top: 5%;
    width: 70%;
    position: relative;
    cursor: pointer;
    margin: 3px;
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
import ReportArticle from './article'
import ReportConglomerate from './conglomerate'
export default {
  name: 'Report',
  data () {
    return {
      types: [{
        name: 'Conglomerado',
        id: 'conglomerate'
      }, {
        name: 'Articulo',
        id: 'article'
      }],
      selected: 'article'
    }
  },
  components: {
    ReportArticle,
    ReportConglomerate
  }
}

</script>