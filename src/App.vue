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
      :items-per-page="20"
      class="elevation-1"
    ></v-data-table>
  </v-app>
</template>

<script>

import api from './api.js'

export default {
  name: 'App',

  components: {
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
        { text: 'Buy Call Premium', value: 'buy_call_premium' }
      ],
      condors: [
        {
          buy_put: 5.79,
          short_put: 10.79,
          current_share_price: 12.00,
          short_call: 15.79,
          buy_call: 20.79,
          buy_put_premium: 0.1,
          short_put_premium: 0.5,
          short_call_premium: 0.2,
          buy_call_premium: 0.1,
          max_gain: 0.49999999999999994,
          max_loss: -4.5,
          risk_reward: 0.1111111111111111
        },
        {
          buy_put: 5.79,
          short_put: 10.79,
          current_share_price: 12.00,
          short_call: 15.79,
          buy_call: 20.79,
          buy_put_premium: 0.1,
          short_put_premium: 0.5,
          short_call_premium: 0.2,
          buy_call_premium: 0.1,
          max_gain: 0.49999999999999994,
          max_loss: -4.5,
          risk_reward: 0.1111111111111111
        }

      ]
    }
  }
}
</script>
