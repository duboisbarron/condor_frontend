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
    props: ['share_price', 'short_call_strike', 'long_call_strike', 'short_call_prem', 'long_call_prem'],
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
      this.get_x_values(this.share_price, this.long_call_strike)


      this.get_y_values(this.short_call_strike, this.long_call_strike, this.short_call_prem, this.long_call_prem)

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

      get_x_values (share_price, long_call_strike) {
        //   return list of values between these 2
        var x_values = []
        var num_points = 100
        var lower_bound = 0.75 * share_price
        var upper_bound = 1.25 * long_call_strike
        var step_size = (upper_bound - lower_bound) / num_points

        var index = 0
        var next_value = lower_bound

        while (index < num_points){
          x_values.push(Number(next_value.toFixed(2)));
          next_value += step_size
          index += 1
        }

        this.graph_x_values = x_values
      },

      get_y_values (short_call_strike, long_call_strike, short_call_prem, long_call_prem) {

        var buy_call_formula = function (current_share_price) {
          return 100.0 * (Math.max(current_share_price - long_call_strike, 0.00) - long_call_prem)
        }

        var sell_call_formula = function (current_share_price) {
          return 100.0 * (short_call_prem - Math.max(0.00, current_share_price - short_call_strike))
        }

        var newArr = this.graph_x_values.map(function (share_price, index) {

          return Number((buy_call_formula(share_price) + sell_call_formula(share_price)).toFixed(2))

        })

        console.log(newArr)

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
