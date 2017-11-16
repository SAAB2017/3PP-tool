<template>
  <div id="app">
    <navbar></navbar>
    <main-content></main-content>
  </div>
</template>

<script>
  import Navbar from './components/layout/Navbar'
  import MainContent from './components/layout/Content'

  export default {
    name: 'app',
    components: {
      Navbar,
      MainContent
    },
  }
</script>

<style>
  #app {
    margin: 10px;
  }
  .tbodyadd {
    display: block;
    max-height: 200px;
    overflow: auto;
  }

  .tbodyhome {
    display: block;
    max-height: 450px;
    overflow: auto;
  }

  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  table {
    border: 1px solid #ccc;
    border-collapse: collapse;
    margin: 0;
    padding: 0;
    width: 100%;
    table-layout: fixed;
  }
  table caption {
    font-size: 1.5em;
    margin: .5em 0 .75em;
  }
  table tr {
    background: #ffffff;
    border: 1px solid #ddd;
    padding: .35em;
  }
  table th,
  table td {
    padding: .625em;
    text-align: center;
  }
  table th {
    font-size: .85em;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  @media screen and (max-width: 600px) {
    table {
      border: 0;
    }
    table caption {
      font-size: 1.3em;
    }
    table thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
    table tr {
      border-bottom: 3px solid #ddd;
      display: block;
      margin-bottom: .625em;
    }
    table tbody td {
      border-bottom: 1px solid #ddd;
      display: block;
      font-size: .8em;
      text-align: right;
    }
    table tbody td:before {
      content: attr(data-label);
      float: left;
      font-weight: bold;
      text-transform: uppercase;
    }
    table td:last-child {
      border-bottom: 0;
    }
  }
</style>
