/* eslint-disable no-console */
/* eslint-disable no-mixed-spaces-and-tabs */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
	  meal: [],
		meals:[],
		cartCounter:0
  },
  mutations: {
  getMeal(state, meal) {
  		state.meal = [...meal]
	  },
	getMeals(state, meals){
		state.meals = [...meals]
	},
	updateCart(state){
		state.cartCounter = state.cartCounter+1
	}
  },
  actions: {
  	getAMeal({commit}, meal) {
  		axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
  			.then((res) => {
  				commit('getMeal', res.data.meals)
  			})
  			.catch(err => {
  				console.log(err)
  			})	
	  },
	getAllMeals({commit}){
		axios
		.get("https://www.themealdb.com/api/json/v1/1/categories.php")
		.then(response => {
			commit('getMeals', response.data.categories)
		})
		.catch(err => {
		  console.log(err);
		});
		},
  },
});
