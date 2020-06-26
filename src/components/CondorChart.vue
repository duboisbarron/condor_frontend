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
  components: {
    LineChart
  },
  props: ['share_price', 'long_put_strike', 'short_put_strike', 'short_call_strike', 'long_call_strike',
    'long_put_prem', 'short_put_prem', 'short_call_prem', 'long_call_prem'],
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
    this.get_x_values(this.long_put_strike, this.long_call_strike)
    this.get_y_values(
      this.long_put_strike,
      this.short_put_strike,
      this.short_call_strike,
      this.long_call_strike,
      this.long_put_prem,
      this.short_put_prem,
      this.short_call_prem,
      this.long_call_prem
    )

    this.get_graph_colors()

    this.fillData()
  },
  methods: {

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

    get_x_values (long_put_strike, long_call_strike) {
      //   return list of values between these 2

      var x_values = []
      var lower_bound = 0.75 * long_put_strike
      var upper_bound = 1.25 * long_call_strike

      var step_size = 0.10

      var next_val = lower_bound

      while (next_val < upper_bound) {
        x_values.push(Number(next_val.toFixed(2)))
        next_val += step_size
      }

      this.graph_x_values = x_values
    },

    get_y_values (long_put_strike, short_put_strike, short_call_strike, long_call_strike,
      long_put_prem, short_put_prem, short_call_prem, long_call_prem) {
      var max_profit = (short_put_prem + short_call_prem) - (long_put_prem + long_call_prem)

      var newArr = this.graph_x_values.map(function (share_price, index) {
        if ((share_price < short_call_strike) && (share_price > short_put_strike)) {
          return Number((100.0 * max_profit).toFixed(2))
        } else if (share_price < long_put_strike) {
          // loss, both puts in money
          return Number((-100.0 * ((short_put_strike - long_put_strike) - max_profit)).toFixed(2))
        } else if (share_price > long_call_strike) {
          // loss, both calls in money
          return Number((-100.0 * ((long_call_strike - short_call_strike) - max_profit)).toFixed(2))
        } else if (share_price > short_call_strike && share_price < long_call_strike) {
          return Number((100.0 * (max_profit - (share_price - short_call_strike))).toFixed(2))
        } else if (share_price < short_put_strike && share_price > long_put_strike) {
          return Number((100.0 * (max_profit - (short_put_strike - share_price))).toFixed(2))
        }
      })

      this.graph_y_values = newArr
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
