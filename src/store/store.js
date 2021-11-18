import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loading: false,
    token: localStorage.getItem('Authorization') || null,
    userDetails: {},
    expensesCurrentMonth: [],
    expensesLastMonth: [],
    contribution: 300
  },
  getters: {
    isLoading: state => state.loading,
    isAuthenticated: state => !!state.token,
    getExpensesCurrentMonth: state => state.expensesCurrentMonth,
    getExpensesLastMonth: state => state.expensesLastMonth,
    getUserDetails: state => state.userDetails,
    getToken: state => state.token,
    getContribution: state => state.contribution,
  },
  mutations: {
    toggleLoading: state => state.loading = !state.loading,
    setExpensesForThisMonth: (state, payload) => state.expensesCurrentMonth = payload,
    setExpensesForLastMonth: (state, payload) => state.expensesLastMonth = payload,
    setUserDetails: (state, payload) => state.userDetails = payload,
    setToken: (state, payload) => state.token = payload,  
    login: (state, token) => state.token = token,
    logout(state) {
      state.token = '',
      state.userDetails = {},
      state.expenses = [],
      localStorage.removeItem('Authorization')
    },
    addExpense: (state, expense) => state.expensesCurrentMonth.push(expense),
    deleteExpense: (state, id) => state.expensesCurrentMonth = state.expensesCurrentMonth.filter(item => item.id !== id),
    updateExpense: (state, payload) => 
      state.expensesCurrentMonth = state.expensesCurrentMonth.map(item => 
        item.id === payload.id ? {...item, amount: payload.amount} : item)
  },
  actions: {
    async verifyLogin ({ commit }, credentials) {
      try {
        const response = await axios.post(process.env.VUE_APP_BASEURL + '/users/login', credentials)
        localStorage.setItem('Authorization', response.data.token);
        commit('login', response.data.token)
        commit('setUserDetails', response.data)
        return response.status
      } catch (e) {
        localStorage.removeItem('Authorization');
      }
    },
    async validateToken({commit}, token) {
      try {
        const userDetails = await axios.post(process.env.VUE_APP_BASEURL + '/users/me', {token})
        commit('setToken', token)
        commit('setUserDetails', userDetails.data)        
      } catch (error) {
        console.error(error)
        commit('logout')
        localStorage.removeItem('Authorization')
      }
    },
    async setExpenses({commit}) {
      commit('toggleLoading')
			if(this.state.token) {
				try {
					const response = await axios.get(process.env.VUE_APP_BASEURL + '/expenses', {
						headers: { 'Authorization': this.state.token }
					})
          const currentMonth = response.data.filter(expense => 
            moment(new Date(expense.createdAt)).month() === moment().month() &&
            moment(new Date(expense.createdAt)).year() === moment().year())
          commit('setExpensesForThisMonth', currentMonth)

          // special case for January
          let lastMonth
          if (moment().month() === 0) {
            lastMonth = response.data.filter(expense => 
              moment(new Date(expense.createdAt)).month() === moment().subtract(1, 'months').month() &&
              moment(new Date(expense.createdAt)).year() === moment().subtract(1, 'years').year())
          } else {            
            lastMonth = response.data.filter(expense => 
              moment(new Date(expense.createdAt)).month() === moment().subtract(1, 'months').month() &&
              moment(new Date(expense.createdAt)).year() === moment().year())
          }
          commit('setExpensesForLastMonth', lastMonth)
				} catch (error) {
					this.state.token = ''
				} finally {
          commit('toggleLoading')
        }
			}
		}
  }
})