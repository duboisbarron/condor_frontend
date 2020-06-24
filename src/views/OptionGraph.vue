<template>
  <v-app>
    <v-container>
      <v-col>
        <h1> Graph Your Option Strategies </h1>
      </v-col>

      <v-row v-if="this.show_graph">
        <v-col>
          <OptionChart
            :key="graph_id"
            :options_formulas="formulas"
            :current_share_price="current_share_price"
          />
        </v-col>
      </v-row>

      <v-row v-for="n in num_options">
        <v-col cols="2" />
        <v-col
          class="d-flex"
          cols="2"
        >
          <v-select
            v-model="option_data_write_buy.indices[n]"
            :items="write_or_buy"
            label="Write / Buy"
            solo
          />
        </v-col>
        <v-col
          class="d-flex"
          cols="2"
        >
          <v-select
            v-model="option_data_call_put.indices[n]"
            :items="call_or_put"
            label="Call / Put"
            solo
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="option_data_strikes.indices[n]"
            label="Strike Price"
            solo
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="option_data_premiums.indices[n]"
            label="Premium"
            solo
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2" />
        <v-col cols="1">
          <v-btn
            class="mx-2"
            fab
            dark
            color="indigo"
            @click="increment_num_options"
          >
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-col>

        <v-col cols="1">
          <v-btn
            class="mx-2"
            fab
            dark
            color="indigo"
            @click="decrement_num_options"
          >
            <v-icon dark>
              mdi-minus
            </v-icon>
          </v-btn>
        </v-col>

        <v-col
          cols="1"
          align-self="center"
        >
          <p> Current Price: </p>
        </v-col>

        <v-col
          cols="1"
          align-self="bottom"
        >
          <v-text-field
            v-model="current_share_price"
            label="Current Share Price"
            solo
          />
        </v-col>

        <v-col
          cols="1"
          align-self="top"
        >
          <v-btn
            class="mx-2"
            dark
            color="indigo"
            @click="graph"
          >
            Graph
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import OptionChart from '../components/OptionChart.vue'

export default {
  name: 'OptionGraph',
  components: { OptionChart },

  data () {
    return {

      graph_id: 0,
      show_graph: false,
      formulas: [],

      current_share_price: 50.0,
      num_options: 1,

      option_data_write_buy: {
        indices: []
      },
      option_data_call_put: {
        indices: []
      },
      option_data_strikes: {
        indices: []
      },
      option_data_premiums: {
        indices: []
      },

      option_data: [],

      write_or_buy: ['WRITE', 'BUY'],
      call_or_put: ['CALL', 'PUT']
    }
  },
  methods: {
    graph: function () {
      var array_of_options = []
      for (var i = 1; i <= this.num_options; i++) {
        array_of_options.push({
          buy_write: this.option_data_write_buy.indices[i],
          call_put: this.option_data_call_put.indices[i],
          strike_price: Number(this.option_data_strikes.indices[i]),
          premium: Number(this.option_data_premiums.indices[i])
        })
      }

      console.log(array_of_options)
      //
      var option_formulas = this.get_option_formulas(array_of_options)

      this.formulas = option_formulas

      this.show_graph = true
      this.graph_id += 1
    },

    get_option_formulas: function (option_data_array) {
      var option_formulas = []

      option_data_array.forEach(option => {
        if (option.call_put === 'CALL') {
          if (option.buy_write === 'BUY') {
            var buy_call_formula = function (current_share_price) {
              return 100.0 * (Math.max(current_share_price - option.strike_price, 0.00) - option.premium)
            }

            option_formulas.push(buy_call_formula)
          } else if (option.buy_write === 'WRITE') {
            var sell_call_formula = function (current_share_price) {
              return 100.0 * (option.premium - Math.max(0.00, current_share_price - option.strike_price))
            }

            option_formulas.push(sell_call_formula)
          }
        } else if (option.call_put === 'PUT') {
          if (option.buy_write === 'BUY') {
            var buy_put_formula = function (current_share_price) {
              return 100.0 * (Math.max(option.strike_price - current_share_price, 0.00) - option.premium)
            }
            option_formulas.push(buy_put_formula)
          } else if (option.buy_write === 'WRITE') {
            var sell_put_formula = function (current_share_price) {
              return 100.0 * (option.premium - Math.max(option.strike_price - current_share_price, 0.00))
            }
            option_formulas.push(sell_put_formula)
          }
        }
      })

      return option_formulas
    },

    increment_num_options: function () {
      console.log('clicked button')
      this.num_options += 1
      console.log(this.num_options)
    },

    decrement_num_options: function () {
      console.log('clicked button')
      this.num_options -= 1
      console.log(this.num_options)
    }

  }
}
</script>

<style scoped>

</style>
