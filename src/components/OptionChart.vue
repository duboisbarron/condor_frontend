<template>
  <div class="small">
    <line-chart
      :chart-data="datacollection"
      :options="options"
    />
  </div>
</template>

<script>

import LineChart from './LineChart.js'

export default {
  name: 'OptionChart',
  components: {
    LineChart
  },
  props: ['options_formulas', 'current_share_price'],

  data () {
    return {

      options: {
        title: {
          display: true,
          text: 'Profit / Loss Diagram'
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Profit / Loss'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Underlying Price @ Expiration'
            }
          }]
        }
      },

      datacollection: null,
      graph_colors: [],
      graph_x_values: [],
      graph_y_values: []
    }
  },

  mounted () {
    console.log('GENERATING GRAPH!!!')
    this.get_x_values(this.current_share_price)
    this.get_y_values(this.options_formulas)
    this.get_graph_colors()
    this.fillData()
  },

  methods: {

    get_y_values (options_formulas) {
      var newArr = this.graph_x_values.map(function (share_price, index) {
        // apply the option formula to the current share price
        var values = options_formulas.map(function (option_formula, index) {
          return option_formula(share_price)
        })
        // now have a list of values, need to sum them up

        var sum = 0
        values.forEach(val => {
          sum += val
        })
        return Number(sum.toFixed(2))
      })

      this.graph_y_values = newArr
      console.log(this.graph_y_values)
    },

    get_x_values (current_share_price) {
      var x_vals = []
      var lower_bound = 0.5 * current_share_price
      var upper_bound = 1.5 * current_share_price
      var step_size = 0.10

      var next_val = lower_bound

      while (next_val < upper_bound) {
        x_vals.push(Number(next_val.toFixed(2)))
        next_val += step_size
      }

      this.graph_x_values = x_vals
      console.log(this.graph_x_values)
    },

    get_graph_colors () {
      var newArr = this.graph_y_values.map(function (value, index) {
        if (value > 0) {
          return 'green'
        } else {
          return 'red'
        }
      })

      this.graph_colors = newArr
    },

    fillData () {
      this.datacollection = {
        // this is the x axis
        labels: this.graph_x_values,
        datasets: [{
          // this is the y axis
          data: this.graph_y_values,
          // backgroundColor: 'red',
          backgroundColor: this.graph_colors,
          bordorColor: this.graph_colors,
          // fill: true,
          showLine: false,
          lineTension: 0,
          fill: true
        }]
      }
    }

  }

}
</script>

<style>
  .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>
