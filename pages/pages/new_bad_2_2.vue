<template>
	<view>
		<view class="new_bad_2_head flex_between">
			<u-button type="warning" size="mini" @click="continueAdd">继续添加不良品</u-button>
			<u-button type="search" size="mini" @click="submitData" :disabled="adminLoading">提交草稿</u-button>
		</view>
		<view class="new_bad_2_content">
			<view class="scroll">
				<scroll-view class="scroll" scroll-y scroll-x>
					<table class="tableTwo" cellspacing="0" cellpadding="0">
						<thead class="thead-head">
							<tr>
								<th class="th stickyTop3" style="min-width: 50px;">操作</th>
								<th class="th stickyTop" style="min-width: 70px;">产品</th>
								<th class="th stickyTop" style="min-width: 70px;">细小工序</th>
								<th class="th stickyTop" style="min-width: 70px;">生产数</th>
								<th class="th stickyTop" style="min-width: 70px;">不良数</th>
								<th class="th stickyTop" style="min-width: 80px;">不良原因</th>
								<!-- <th class="th stickyTop" style="min-width: 70px;">处置方式</th> -->
								<th class="th stickyTop" style="min-width: 90px;">日期</th>
								<th class="th stickyTop" style="min-width: 90px;">报废人员</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(x,i) in tableData" :key="i">
								<td class="td stickyLeft" style="min-width: 50px;" @click="delRow(x,i)">
									<span class="redColor">删除</span>
								</td>
								<td class="td" style="min-width: 70px;">{{x.MaterialName}}</td>
								<td class="td" style="min-width: 70px;">{{x.TinyProcessName}}</td>
								<td class="td" style="min-width: 70px;">{{x.ProducedQty}}</td>
								<td class="td" style="min-width: 70px;">{{x.BadQty}}</td>
								<td class="td" style="min-width: 80px;">{{x.AbnormalReason}}</td>
								<!-- <td class="td" style="min-width: 70px;">{{x.Extend4}}</td> -->
								<td class="td" style="min-width: 90px;">{{x.PlanDay}}</td>
								<td class="td" style="min-width: 90px;">{{x.Remark2}}</td>
							</tr>
						</tbody>
					</table>
					<view>
						<u-loadmore :status="status" :load-text="loadText" color="#3e82f9" />
					</view>
					<!-- <to-top :toTop='toTop' @handletotop='handletotop'></to-top> -->
					</table>
				</scroll-view>
			</view>
		</view>
		<u-modal v-model="loginOutDialog" width="70%" :show-title="false" :show-confirm-button="false">
			<view style="font-size: 1.4rem;color:#000000;font-weight: bold;margin: 40rpx;">
				提报后是否登出？
			</view>
			<view class="flex_around" style="margin-bottom: 40rpx;">
				<u-button type="warning" @click="loginOut(false)" style="width: 160rpx;">否</u-button>
				<u-button type="primary" @click="loginOut(true)" style="width: 160rpx;">是</u-button>
			</view>
		</u-modal>
		<u-toast ref="uToast"></u-toast>
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	var _this;
	import toTop from '@/common/toTop.vue';
	import formatDate from '@/common/formatDate.js';
	export default {
		components: {
			toTop
		},
		data() {
			return {
				adminLoading: false,
				loginOutDialog: false,
				status: 'nomore',
				loadText: {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '我也是有底线的哦~'
				},
				toTop: false,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				searchForm: {
					AbnormalNoID: '',
					dicID: 7811
				},
				tableData: [],
				tag: 0,
				templateData: []
			}
		},
		onLoad(option) {
			// if (Object.values(option).length != 0) {
			// 	this.tag = option.tag;
			// } else {
			// 	this.tag = 0;
			// }
			_this = this;
			this.templateData = this.$store.getters.new_bad_2_2;
			this.searchForm.AbnormalNoID = this.$store.getters.badProductDetails_2_draft.AbnormalNoID;
			this.tag = this.$store.getters.bad_tag;
			if (this.tag == 1) {
				this.tableData = this.$store.getters.new_bad_2;
			} else {
				this.loadData(this.searchForm);
			}
		},
		methods: {
			// 获取单据下面的不良
			loadData(form) {
				form["rows"] = 0;
				let newForm = JSON.parse(JSON.stringify(form));
				this.$request.post({
					url: '/APSAPI/APSData',
					data: newForm
				}).then(res => {
					if (res.data.result) {
						this.tableData = [];
						this.tableData = res.data.data;
						this.$store.commit('setting/new_bad_2_2', JSON.parse(JSON.stringify(res.data
							.data))); // 保存最原始的草稿数据
					} else {
						this.loading = false;
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 删除行
			delRow(row, index) {
				this.tableData.splice(index, 1);
			},
			// 继续添加产品
			continueAdd() {
				this.$store.commit('setting/new_bad_2', this.tableData); // 最新的不良数据
				this.$store.commit('setting/bad_tag_0', 1);
				let pages = getCurrentPages(); // 当前页面
				let delta = -1;
				pages.some((x, i) => {
					if (x.route == "pages/pages/new_bad_1") {
						delta = i + 1;
						return true
					}
				})
				if (delta == -1) {
					uni.navigateTo({
						url: './new_bad_1'
					})
				} else {
					let beforePage = pages.length - delta;
					uni.navigateBack({
						delta: beforePage,
						success: function() {
							// beforePage.$vm.refreshRequest(); // 执行前一个页面的刷新
						}
					});
				}

			},
			// 提交
			submitData() {
				if (this.tableData.length == 0) {
					return
				} else {
					uni.showModal({
						title: '提示',
						content: "确认提交吗",
						success: function(res) {
							if (res.confirm) {
								let submitData = [];
								let rowChildrens = [];
								_this.tableData.forEach(x => {
									if (rowChildrens.findIndex(b => {
											return b.SalesPlanProcessMaterialDayID == x
												.SalesPlanProcessMaterialDayID && b
												.TinyProcessID == x.TinyProcessID
										}) == -1) {
										let obj = JSON.parse(JSON.stringify(x));
										obj["AbnormalStatus"] = 0;
										obj["dicID"] = 7781;
										obj["BadQty"] = x.Count;
										obj["childrens"] = [];
										rowChildrens.push(obj)
									}
								})
								rowChildrens.forEach(c => {
									let filterData = _this.tableData.filter(d => {
										return d
											.SalesPlanProcessMaterialDayID == c
											.SalesPlanProcessMaterialDayID && d
											.TinyProcessID == c.TinyProcessID
									});
									let childrens = [];
									let BadQty = JSON.parse("[" + String(filterData.map(p => {
										return p.BadQty
									})) + "]");
									let newBadQty = BadQty.reduce((n, m) => {
										return n + m
									});
									filterData.forEach(e => {
										let obj2 = {};
										obj2["AbnormalNoDetailsReasonID"] = e
											.AbnormalNoDetailsReasonID;
										obj2["dicID"] = 7782;
										obj2["AbnormalStatus"] = 0;
										obj2["Remark1"] = e.Remark1;
										obj2["Remark2"] = e.Remark2;
										obj2["TinyProcessID"] = e.TinyProcessID;
										obj2["TinyProcessName"] = e.TinyProcessName;
										obj2["AbnormalReasonID"] = e.AbnormalReasonID;
										obj2["AbnormalReason"] = e.AbnormalReason;
										obj2["BadQty"] = e.BadQty;
										childrens.push(obj2) // 具体的不良了
									})
									_this.$set(c, 'BadQty', newBadQty);
									_this.$set(c, 'childrens', childrens);
								})
								// 判断需要删除的草稿
								let delData = [];
								let newFilterData_0 = _this.templateData.filter(g => !_this.tableData
									.some(
										j => {
											return g.SalesPlanProcessMaterialDayID == j
												.SalesPlanProcessMaterialDayID && g
												.TinyProcessID == j
												.TinyProcessID && j.AbnormalNoDetailsID
										})); //是否有工序需要删除
								let newFilterData = _this.templateData.filter(g => !_this.tableData
									.some(j => {
										return g.AbnormalNoDetailsReasonID == j
											.AbnormalNoDetailsReasonID && j.AbnormalNoDetailsReasonID
									}));
								if (newFilterData_0.length != 0) {
									newFilterData_0.forEach(m => {
										let obj3 = {};
										obj3["ElementDeleteFlag"] = 1;
										obj3["dicID"] = 7781;
										obj3["AbnormalNoDetailsID"] = m.AbnormalNoDetailsID;
										delData.push(obj3);
									})
								}
								if (newFilterData.length != 0) {
									newFilterData.forEach(l => {
										let obj4 = {};
										obj4["ElementDeleteFlag"] = 1;
										obj4["dicID"] = 7782;
										obj4["AbnormalNoDetailsReasonID"] = l
											.AbnormalNoDetailsReasonID;
										delData.push(obj4);
									})
								}
								let BadQty_2 = JSON.parse("[" + String(rowChildrens.map(p => {
									return p.BadQty
								})) + "]");
								let newBadQty_2 = BadQty_2.reduce((n, m) => {
									return n + m
								});

								let form = {
									BadDate: formatDate.formatTodayDate(),
									AbnormalStatus: 0,
									AbnormalNoID: _this.searchForm.AbnormalNoID,
									BadQty: newBadQty_2,
									dicID: 7780,
									childrens: rowChildrens
								}
								submitData.push(form);
								submitData = delData.concat(submitData);
								if (submitData.length != 0) {
									_this.saveData(submitData);
								} else {
									_this.$refs.uToast.show({
										title: '暂无可提交的数据！',
										type: 'error'
									})
								}
							} else if (res.cancel) {
								return;
							}

						}
					});
				}
			},
			// 保存数据
			saveData(submitData) {
				if (this.adminLoading) {
					return
				}
				this.adminLoading = true;
				this.$request.post({
					url: '/APSAPI/SaveData',
					data: submitData
				}).then(res => {
					if (res.data.result) {
						this.adminLoading = false;
						this.$store.commit('setting/new_bad_2_2', []);
						this.$store.commit('setting/new_bad_2', []);
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'success'
						})
						this.loginOutDialog = true;

					} else {
						this.adminLoading = false;
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error'
						})
					}
				})
			},
			// 确认是否登出
			loginOut(val) {
				this.loginOutDialog = false;
				if (val) {
					uni.reLaunch({
						url: '../login/login'
					})
				} else {
					setTimeout(() => {
						let pages = getCurrentPages(); // 当前页面
						let delta = 1;
						pages.some((x, i) => {
							if (x.route == "pages/pages/productionDetails") {
								delta = i + 1;
								return true
							}
						})
						let beforePage = pages.length - delta;
						uni.navigateBack({
							delta: beforePage,
							success: function() {
								// beforePage.$vm.refreshRequest(); // 执行前一个页面的刷新
							}
						});
					}, 2000)
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.new_bad_2_head {
		height: 2.5rem;
		line-height: 2.5rem;
		padding: 0.3rem;
	}

	.new_bad_2_content {
		height: calc(100% - 3.1rem);
	}

	.redColor {
		color: red;
		font-weight: bold;
	}
</style>
