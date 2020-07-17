import axios from 'axios'
const baseUrl = 'https://condor-backend-django.herokuapp.com'

export default {
  async get_option_data (ticker) {
    var endpoint = baseUrl + '/api/v1/get_option_data/' + ticker + '/'
    var response = await axios.get(endpoint)
    return response.data
  },
  async get_condors (ticker, expiration) {
    var endpoint = baseUrl + '/api/v1/condors/'
    var body = {
      params: {
        ticker: ticker,
        expiration: expiration
      }
    }
    var response = await axios.get(endpoint, body)
    return response.data
  },

  async get_call_credit_spreads (ticker, expiration) {
    var endpoint = baseUrl + '/api/v1/callcredit/'
    var body = {
      params: {
        ticker: ticker,
        expiration: expiration
      }
    }
    var response = await axios.get(endpoint, body)
    return response.data

  },

  async get_call_debit_spreads (ticker, expiration) {
    var endpoint = baseUrl + '/api/v1/calldebit/'
    var body = {
      params: {
        ticker: ticker,
        expiration: expiration
      }
    }
    var response = await axios.get(endpoint, body)
    console.log(response.data)
    return response.data

  },

  async get_put_debit_spreads (ticker, expiration) {

    var endpoint = baseUrl + '/api/v1/putdebit/'
    var body = {
      params: {
        ticker: ticker,
        expiration: expiration
      }
    }
    var response = await axios.get(endpoint, body)
    console.log(response.data)
    return response.data
  },
  async get_put_credit_spreads (ticker, expiration) {

    var endpoint = baseUrl + '/api/v1/putcredit/'
    console.log(endpoint)
    console.log(endpoint)
    console.log(endpoint)
    console.log(endpoint)
    console.log(endpoint)
    console.log(endpoint)
    console.log(endpoint)
    var body = {
      params: {
        ticker: ticker,
        expiration: expiration
      }
    }
    var response = await axios.get(endpoint, body)
    console.log(response.data)
    return response.data
  }





}
