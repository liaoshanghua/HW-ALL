import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'
import setting from './modules/setting.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		setting
	},
	getters
})
export default store
