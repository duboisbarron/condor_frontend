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
        text
        color="green"
        @click="button_click"
      > Get Option Data </v-btn>
    </v-col>
    </v-row>

    <v-row>

      <v-col cols="4"></v-col>
      <v-col cols="12" sm="2">
        <v-text-field
          solo-inverted
          :label=this.current_share_price
          disabled
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
          text
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
        text
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
          text
          color="green"
          @click="strike_filter"
        > Filter by Strikes </v-btn>
      </v-col>

    </v-row>

    <v-row>
      <v-col cols="5"></v-col>
      <v-col cols="12" sm="2">
        <v-btn
          text
          color="green"
          @click="find_condors"
        > Reset Condors </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items-per-page="10"
      :expanded.sync="expanded"
      :items="condors"
      show-expand
      single-expand
      class="elevation-1"
    >
      <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
        <v-btn @click="expand(true)">Expand</v-btn>
      </template>

      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td><v-btn @click="expand(!isExpanded)">Graph</v-btn></td>
          <td><v-chip color="green" dark>{{ item.max_gain }}</v-chip></td>
          <td><v-chip color="red" dark>{{ item.max_loss }}</v-chip></td>
          <td>{{ item.risk_reward }}</td>

          <td @mouseenter="show_BA_buy_put()" @mouseleave="hide_BA_buy_put()">{{ item.buy_put_premium }}</td>
          <td v-if="bp_BA_col"> {{item.buy_put_BA}}</td>

          <td @mouseenter="show_BA_short_put" @mouseleave="hide_BA_short_put">{{ item.short_put_premium }}</td>
          <td v-if="sp_BA_col"> {{item.short_put_BA}}</td>

          <td @mouseenter="show_BA_short_call" @mouseleave="hide_BA_short_call">{{ item.short_call_premium }}</td>
          <td v-if="sc_BA_col"> {{item.short_call_BA}}</td>

          <td @mouseenter="show_BA_buy_call" @mouseleave="hide_BA_buy_call">{{ item.buy_call_premium }}</td>
          <td v-if="bc_BA_col"> {{item.buy_call_BA}}</td>

          <td >{{ item.buy_put }}</td>
          <td >{{ item.short_put }}</td>
          <td>{{ item.current_share_price }}</td>
          <td >{{ item.short_call }}</td>
          <td >{{ item.buy_call }}</td>
        </tr>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info can go here
          <CondorChart
          :share_price="item.current_share_price"
          :long_put_strike="item.buy_put"
          :short_put_strike="item.short_put"
          :short_call_strike="item.short_call"
          :long_call_strike="item.buy_call"

          :long_put_prem="item.buy_put_premium"
          :short_put_prem="item.short_put_premium"
          :short_call_prem="item.short_call_premium"
          :long_call_prem="item.buy_call_premium"

          ></CondorChart>
          More info can go here

        </td>
      </template>

    </v-data-table>

  </v-app>
</template>

<script>

import api from './api.js'

import CondorChart from './components/CondorChart'

export default {
  name: 'App',

  components: {
    CondorChart
  },
  computed: {
    headers() {
      let headers = []
      headers.push(
        {
          text: 'Max Gain',
          align: 'start',
          sortable: true,
          value: 'max_gain'
        },
        { text: 'Max Loss', value: 'max_loss' },
        { text: 'Risk Reward', value: 'risk_reward' }
      )

        headers.push({ text: 'Buy Put Premium', value: 'buy_put_premium' })
        if (this.bp_BA_col){
          headers.push({text: 'Buy Put Bid/Ask Spread', value: 'buy_put_BA'})
        }

        headers.push({ text: 'Short Put Premium', value: 'short_put_premium' })
        if (this.sp_BA_col){
          headers.push({text: 'Short Put Bid/Ask Spread', value: 'short_put_BA'})
        }

        headers.push({ text: 'Short Call Premium', value: 'short_call_premium' })
        if (this.sc_BA_col){
          headers.push({text: 'Short Call Bid/Ask Spread', value: 'short_call_BA'})
        }
        headers.push({ text: 'Buy Call Premium', value: 'buy_call_premium' })

        if (this.bc_BA_col){
          headers.push({text: 'Buy Call Bid/Ask Spread', value: 'buy_call_BA'})
        }
        headers.push({ text: 'Buy Put Strike', value: 'buy_put' })
        headers.push( { text: 'Short Put Strike', value: 'short_put' })
        headers.push({ text: 'Current Share Price', value: 'current_share_price' })
        headers.push({text: 'Short Call Strike', value: 'short_call'})
        headers.push({ text: 'Buy Call Strike', value: 'buy_call' })
      return headers

    }
  },

  methods: {

    show_BA_buy_put: function () {
      this.bp_BA_col = true
    },
    show_BA_short_put: function () {
      this.sp_BA_col = true
    },
    show_BA_short_call: function () {
      this.sc_BA_col = true
    },
    show_BA_buy_call: function () {
      this.bc_BA_col = true
    },
    hide_BA_buy_put: function () {
      this.bp_BA_col = false
    },
    hide_BA_short_put: function () {
      this.sp_BA_col = false
    },
    hide_BA_short_call: function () {
      this.sc_BA_col = false
    },
    hide_BA_buy_call: function () {
      this.bc_BA_col = false
    },
    button_click: function () {
      api.get_option_data(this.ticker)
        .then(data => {
          this.current_share_price = data.current_share_price
          this.items = data.expiration_dates
        })
    },
    find_condors: function () {
      // console.log('finding iron condors')
      api.get_condors(this.ticker, this.expiration)
        .then(data => {
          this.condors = data
        })
    },

    risk_reward_filter: function () {
      // console.log('clicked button!')
      // console.log(this.risk_reward_filter_value)
      this.condors = this.condors.filter(condor => condor.risk_reward > Number(this.risk_reward_filter_value))
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

      bp_BA_col: false,
      sp_BA_col: false,
      sc_BA_col: false,
      bc_BA_col: false,

      expanded: [],
      expiration: '',
      ticker: '',
      risk_reward_filter_value: '',
      strike_filter_value: '',
      items: ['hello', 'there', 'select this'],
      current_share_price: 'Current Share Price',

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
          risk_reward: 1.04,
          buy_put_BA: 0.08,
          short_put_BA: 0.50,
          short_call_BA: 0.10,
          buy_call_BA: 0.02
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
          risk_reward: 1.04,
          buy_put_BA: 0.08,
          short_put_BA: 0.50,
          short_call_BA: 0.10,
          buy_call_BA: 0.02
        }

      ]
    }
  }
}
</script>
