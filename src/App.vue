<template>
  <v-app>
    <v-row>
      <v-col cols="4"></v-col>
    <v-col cols="12" sm="2">
      <v-text-field
        v-model="ticker"
        solo-inverted
        label="Ticker"
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="2">
      <v-btn
        text="true"
        color="green"
        @click="button_click"
      > Get Option Data </v-btn>
    </v-col>
    </v-row>

    <v-row>

      <v-col cols="4"></v-col>
      <v-col cols="12" sm="2">
        <v-text-field
          v-model="last"
          solo-inverted
          :label=this.current_share_price
          disabled="true"
        ></v-text-field>
      </v-col>

      <v-col cols="2" sm="2">
        <v-select
          v-model="expiration"
          :items="items"
          label="Choose Expiration Date"
          solo
        ></v-select>
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn
          text="true"
          color="green"
          @click="find_condors"
        > Find Condors </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4"></v-col>
      <v-col cols="12" sm="2">
        <v-text-field
          v-model="risk_reward_filter_value"
          solo-inverted
          label="Min Risk Reward"
        ></v-text-field>
      </v-col>
    <v-col cols="12" sm="2">
      <v-btn
        text="true"
        color="green"
        @click="risk_reward_filter"
      > Filter by Risk Reward </v-btn>
    </v-col>
    </v-row>
    <v-row>
      <v-col cols="4"></v-col>
      <v-col cols="12" sm="2">
        <v-text-field
          v-model="strike_filter_value"
          solo-inverted
          label="% Strike Difference"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn
          text="true"
          color="green"
          @click="strike_filter"
        > Filter by Strikes </v-btn>
      </v-col>


    </v-row>

    <v-row>
      <v-col cols="5"></v-col>
      <v-col cols="12" sm="2">
        <v-btn
          text="true"
          color="green"
          @click="find_condors"
        > Reset Condors </v-btn>
      </v-col>

    </v-row>

    <v-data-table
      :headers="headers"
      :items="condors"
      :items-per-page="10"
      :expanded.sync="expanded"
      show-expand
      single-expand=true
      class="elevation-1"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <RandomChart
          :share_price="item.current_share_price"
          :long_put_strike="item.buy_put"
          :short_put_strike="item.short_put"
          :short_call_strike="item.short_call"
          :long_call_strike="item.buy_call"

          :long_put_prem="item.buy_put_premium"
          :short_put_prem="item.short_put_premium"
          :short_call_prem="item.short_call_premium"
          :long_call_prem="item.buy_call_premium"

          ></RandomChart>
          {{item.max_gain}}
          {{item.max_loss}}
          {{item.short_call}}

        </td>
      </template>

      <template v-slot:item.max_gain="{ item }">
        <v-chip color="green" dark>{{ item.max_gain }}</v-chip>
      </template>
      <template v-slot:item.max_loss="{ item }">
        <v-chip color="red" dark>{{ item.max_loss }}</v-chip>
      </template>
<!--      <template v-slot:item.graph_button="{ item }">-->
<!--        <v-btn-->
<!--          text="true"-->
<!--          color="primary"-->
<!--          @click="graph_condor(item)"-->
<!--        > Graph </v-btn>-->
<!--      </template>-->

<!--      <template v-slot:expanded-item="{ headers, item }">-->
<!--        <td :colspan="headers.length">More info about {{ item.name }}</td>-->
<!--      </template>-->
<!--      <template v-slot:item="row">-->
<!--        <tr>-->
<!--          <td>{{row.item.no}}</td>-->
<!--          <td>{{row.item.result}}</td>-->
<!--          <td>-->
<!--            <v-btn class="mx-2" dark small color="pink" @click="onButtonClick(row.item)">-->
<!--              Graph Me-->
<!--            </v-btn>-->
<!--          </td>-->
<!--        </tr>-->
<!--      </template>-->
    </v-data-table>
  </v-app>
</template>

<script>

import api from './api.js'

import RandomChart from './components/RandomChart'


export default {
  name: 'App',

  components: {
    RandomChart
  },
  methods: {
    button_click: function () {
      api.get_option_data(this.ticker)
        .then(data => {
          this.current_share_price = data.current_share_price
          this.items = data.expiration_dates
        })
    },
    find_condors: function () {
      console.log('finding iron condors')
      api.get_condors(this.ticker, this.expiration)
        .then(data => {
          this.condors = data
        })
    },
    graph_condor: function (item) {
      console.log('clicked button')
      console.log(item)
    },

    risk_reward_filter: function () {
      // console.log('clicked button!')
      // console.log(this.risk_reward_filter_value)
      this.condors = this.condors.filter(condor => condor.risk_reward > Number(this.risk_reward_filter_value))
    },
    strike_filter_truthy: function (condor, strike_percentage){
      return condor.short_put < strike_percentage * Number(this.current_share_price)
    },
    strike_filter: function () {
      console.log((1.0 - Number(this.strike_filter_value)) * Number(this.current_share_price))
      this.condors = this.condors.filter(condor =>
        (condor.short_put < (1.0 - Number(this.strike_filter_value)) * Number(this.current_share_price))
        &&
        (condor.short_call > (1.0 + Number(this.strike_filter_value)) * Number(this.current_share_price))
      )
    }

  },
  data () {
    return {

      graph_data: [{
        x: 10,
        y: 20
      }, {
        x: 15,
        y: 10
      }],
      expanded: [],
      expiration: '',
      ticker: '',
      risk_reward_filter_value: '',
      strike_filter_value: '',
      items: ['hello', 'there', 'select this'],
      current_share_price: 'Current Share Price',
      headers: [
        {
          text: 'Max Gain',
          align: 'start',
          sortable: true,
          value: 'max_gain'
        },
        { text: 'Max Loss', value: 'max_loss' },
        { text: 'Risk Reward', value: 'risk_reward' },
        { text: 'Buy Put Strike', value: 'buy_put' },
        { text: 'Short Put Strike', value: 'short_put' },
        { text: 'Current Share Price', value: 'current_share_price' },
        { text: 'Short Call Strike', value: 'short_call' },
        { text: 'Buy Call Strike', value: 'buy_call' },
        { text: 'Buy Put Premium', value: 'buy_put_premium' },
        { text: 'Short Put Premium', value: 'short_put_premium' },
        { text: 'Short Call Premium', value: 'short_call_premium' },
        { text: 'Buy Call Premium', value: 'buy_call_premium' },
        // { text: 'Graph', value: 'graph_button' },
      ],
      condors: [
        {
          id: 1,
          buy_put: 45.0,
          short_put: 50.0,
          current_share_price: 50.0,
          short_call: 55.0,
          buy_call: 60.0,
          buy_put_premium: 0.78,
          short_put_premium: 2.21,
          short_call_premium: 2.32,
          buy_call_premium: 1.01,
          max_gain: 274,
          max_loss: -262,
          risk_reward: 1.04
        },

        {
          id: 2,
          buy_put: 45.0,
          short_put: 50.0,
          current_share_price: 50.0,
          short_call: 55.0,
          buy_call: 60.0,
          buy_put_premium: 0.78,
          short_put_premium: 2.21,
          short_call_premium: 2.32,
          buy_call_premium: 1.01,
          max_gain: 274,
          max_loss: -262,
          risk_reward: 1.04
        }

      ]
    }
  }
}
</script>
