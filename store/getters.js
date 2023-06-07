const getters = {
	enterData: state => state.setting.enterData,
	Version: state => state.setting.version,
	userInfo: state => state.setting.UserInfo,
	UserInfoData_2: state => state.setting.UserInfoData_2,
	ProductionLine: state => state.setting.ProductionLine,
	new_bad_1: state => state.setting.new_bad_1,
	bad_tag: state => state.setting.bad_tag,
	new_bad_2: state => state.setting.new_bad_2,
	new_bad_2_2: state => state.setting.new_bad_2_2,
	bad_tag_0: state => state.setting.bad_tag_0,
	AduitLine: state => state.setting.AduitLine,
	AbnormalLine: state => state.setting.AbnormalLine,
	searchForm: state => state.setting.searchForm,
	newHourProduction: state => state.setting.newHourProduction,
	peopleData: state => state.setting.peopleData,
	permission: state => state.setting.permission,
	changePlanPermission: state => state.setting.changePlanPermission,
	badProductDetails: state => state.setting.badProductDetails,
	badProductDetails_2_draft: state => state.setting.badProductDetails_2_draft,
}

export default getters
