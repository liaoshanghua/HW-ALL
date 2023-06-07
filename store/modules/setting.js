const state = {
	version: 'v3.3',
	enterData: [],
	ProductionLine: {},
	AduitLine: {},
	AbnormalLine: {},
	UserInfo: {},
	UserInfoData_2:{},
	searchForm: [],
	peopleData: [],
	newHourProduction:{},
	permission:true,
	changePlanPermission:true,
	badProductDetails:{},
	badProductDetails_2_draft:{},
	new_bad_1: {},
	new_bad_2: [],
	new_bad_2_2: [],
	bad_tag: 0,
	bad_tag_0:0
}

const mutations = {
	setEnterData(state, newData) {
		state.enterData = newData;
	},
	UserInfoData(state, newData) {
		state.UserInfo = newData;
	},
	UserInfoData_2(state, newData) {
		state.UserInfoData_2 = newData;
	},
	SetProductionLine(state, newData) {
		state.ProductionLine = newData;
	},
	SetAduitLine(state, newData) {
		state.AduitLine = newData;
	},
	SetSearchForm(state, newData) {
		state.searchForm = newData;
	},
	SetPeopleData(state, newData) {
		state.peopleData = newData;
	},
	SetAbnormalLine(state, newData) {
		state.AbnormalLine = newData;
	},
	PermissionAduit(state, newData) {
		state.permission = newData;
	},
	PermissionCnagePlan(state,newData){
		state.changePlanPermission = newData;
	},
	badProductDetails(state,newData){
		state.badProductDetails = newData;
	},
	badProductDetails_2_draft(state,newData){
		state.badProductDetails_2_draft = newData;
	},
	newHourProduction(state,newData){
		state.newHourProduction = newData;
	},
	new_bad_1(state, newData) {
		state.new_bad_1 = newData;
	},
	new_bad_2(state, newData) {
		state.new_bad_2 = newData;
	},
	new_bad_2_2(state, newData) {
		state.new_bad_2_2 = newData;
	},
	bad_tag_0(state, newData) {
		state.bad_tag_0 = newData;
	},
	bad_tag(state, newData) {
		state.bad_tag = newData;
	},
}

const actions = {}


export default {
	namespaced: true,
	state,
	mutations,
	actions
}
