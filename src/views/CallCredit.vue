<template>
  <v-app>
    <h1> Find Call Credit Spreads </h1>
    <v-row>
      <v-col cols="4" />
      <v-col
        cols="12"
        sm="2"
      >
        <v-text-field
          v-model="ticker"
          solo-inverted
          label="Ticker"
        />
      </v-col>

      <v-col
        cols="12"
        sm="2"
      >
        <v-btn
          text
          color="green"
          @click="get_option_data"
        >
          Get Option Data
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" />
      <v-col
        cols="12"
        sm="2"
      >
        <v-text-field
          solo-inverted
          :label="this.current_share_price"
          disabled
        />
      </v-col>

      <v-col
        cols="2"
        sm="2"
      >
        <v-select
          v-model="expiration"
          :items="items"
          label="Choose Expiration Date"
          solo
        />
      </v-col>
      <v-col
        cols="12"
        sm="2"
      >
        <v-btn
          text
          color="green"
          @click="find_call_credit_spreads"
        >
          Find Call Credit Spreads
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" />

      <v-col
        cols="12"
        sm="2"
      >
        <v-text-field
          v-model="risk_reward_filter_value"
          solo-inverted
          label="Min Risk Reward"
        />
      </v-col>

      <v-col
        cols="12"
        sm="2"
      >
        <v-btn
          text
          color="green"
          @click="risk_reward_filter"
        >
          Filter by Risk Reward
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" />

      <v-col
        cols="12"
        sm="2"
      >
        <v-text-field
          v-model="strike_filter_value"
          solo-inverted
          label="% Strike Difference"
        />
      </v-col>

      <v-col
        cols="12"
        sm="2"
      >
        <v-btn
          text
          color="green"
          @click="strike_filter"
        >
          Filter by Strikes
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="5" />
      <v-col
        cols="12"
        sm="2"
      >
        <v-btn
          text
          color="green"
          @click="find_condors"
        >
          Reset Condors
        </v-btn>
      </v-col>
    </v-row>


    <v-data-table
    :headers="headers"
    :items-per-page="10"
    :expanded.sync="expanded"
    :items="call_credit_spreads"
    show-expand
    single-expand
    class="elevation-1">


      <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
        <v-btn @click="expand(true)">
          Expand
        </v-btn>
      </template>

      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td>
            <v-btn @click="expand(!isExpanded)">
              Graph
            </v-btn>
          </td>
          <td>
            <v-chip
              color="green"
              dark
            >
              {{ item.max_gain }}
            </v-chip>
          </td>
          <td>
            <v-chip
              color="red"
              dark
            >
              {{ item.max_loss }}
            </v-chip>
          </td>
          <td>{{ item.risk_reward }}</td>


          <td
            @mouseenter="show_BA_short_call"
            @mouseleave="hide_BA_short_call"
          >
            {{ item.short_call_premium }}
          </td>
          <td v-if="sc_BA_col">
            {{ item.short_call_BA }}
          </td>

          <td
            @mouseenter="show_BA_buy_call"
            @mouseleave="hide_BA_buy_call"
          >
            {{ item.buy_call_premium }}
          </td>
          <td v-if="bc_BA_col">
            {{ item.buy_call_BA }}
          </td>
          <td>{{ item.current_share_price }}</td>
          <td>{{ item.short_call }}</td>
          <td>{{ item.buy_call }}</td>
        </tr>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info can go here
          <CallCreditChart
            :share_price="item.current_share_price"
            :short_call_strike="item.short_call"
            :long_call_strike="item.buy_call"
            :short_call_prem="item.short_call_premium"
            :long_call_prem="item.buy_call_premium"
          ></CallCreditChart>

          More info can go here
        </td>
      </template>

    </v-data-table>


  </v-app>
</template>

<script>
  import api from '../api.js'

  import CallCreditChart from "../components/CallCreditChart";

    export default {
        name: "CallCredit",
      components: {CallCreditChart},
      data () {
          return {

            sc_BA_col: false,
            bc_BA_col: false,

            ticker: '',
            current_share_price: 'Current Share Price',

            items: ['hello', 'there', 'select this'],
            expiration: '',

            expanded: [],

            call_credit_spreads: [
              {
                id: 1,
                buy_call: 60.0,
                short_call: 55.0,
                current_share_price: 50.0,
                buy_call_premium: 1.50,
                short_call_premium: 2.20,
                max_gain: 70.0,
                max_loss: 430.0,
                risk_reward: 0.162,
                buy_call_BA: 0.10,
                short_call_BA: 0.02
              },
              {
                id: 2,
                buy_call: 60.0,
                short_call: 55.0,
                current_share_price: 50.0,
                buy_call_premium: 1.50,
                short_call_premium: 2.20,
                max_gain: 70.0,
                max_loss: 430.0,
                risk_reward: 0.162,
                buy_call_BA: 0.10,
                short_call_BA: 0.02
              }

            ]

          }
        },
        methods: {
          show_BA_short_call: function () {
            this.sc_BA_col = true
          },
          show_BA_buy_call: function () {
            this.bc_BA_col = true
          },
          hide_BA_short_call: function () {
            this.sc_BA_col = false
          },
          hide_BA_buy_call: function () {
            this.bc_BA_col = false
          },

          get_option_data: function () {
            api.get_option_data(this.ticker)
              .then(data => {
                this.current_share_price = data.current_share_price
                this.items = data.expiration_dates
              })
          },

          find_call_credit_spreads: function () {
            console.log('clicked button');

            api.get_call_credit_spreads(this.ticker, this.expiration)
              .then(data => {
                this.call_credit_spreads = data
              })
          }
        },


      computed: {
        headers () {
          const headers = []
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

          // headers.push({ text: 'Buy Put Premium', value: 'buy_put_premium' })
          // if (this.bp_BA_col) {
          //   headers.push({ text: 'Buy Put Bid/Ask Spread', value: 'buy_put_BA' })
          // }

          // headers.push({ text: 'Short Put Premium', value: 'short_put_premium' })
          // if (this.sp_BA_col) {
          //   headers.push({ text: 'Short Put Bid/Ask Spread', value: 'short_put_BA' })
          // }
          //
          headers.push({ text: 'Short Call Premium', value: 'short_call_premium' })
          if (this.sc_BA_col) {
            headers.push({ text: 'Short Call Bid/Ask Spread', value: 'short_call_BA' })
          }
          headers.push({ text: 'Buy Call Premium', value: 'buy_call_premium' })
          //
          if (this.bc_BA_col) {
            headers.push({ text: 'Buy Call Bid/Ask Spread', value: 'buy_call_BA' })
          }
          headers.push({ text: 'Current Share Price', value: 'current_share_price' })

          headers.push({ text: 'Short Call Strike', value: 'short_call' })
          headers.push({ text: 'Buy Call Strike', value: 'buy_call' })



          return headers
        }
      }



    }
</script>

<style scoped>

</style>
