<template>
	<view class="container_nopadding" :style="{height:height + 'px'}">
		<view class="more_header">
			<u-row class="row_head">
				<u-col :span="3" class="col_head">名称:</u-col>
				<u-col :span="9">其他计时</u-col>
			</u-row>
			<u-row class="row_head">
				<u-col :span="3" class="col_head">计时数:</u-col>
				<u-col :span="3">
					<u-input v-model="newData[0].TotalHours" type="number" class="disabled_input" placeholder="" border
						disabled>
					</u-input>
				</u-col>
				<!-- <u-col :span="3" class="col_head">日合计:</u-col>
				<u-col :span="3">
					<u-input v-model="newData[0].TotalHours" type="number" class="disabled_input" disabled border>
					</u-input>
				</u-col> -->
			</u-row>
		</view>
		<view class="more_content">
			<view class="scroll">
				<view class="tableHeaderTwo">
					<u-table class="table">
						<view>
							<u-tr>
								<u-td class="th" width="50%">计件类型</u-td>
								<u-td class="th" width="50%">计时</u-td>
							</u-tr>
						</view>
					</u-table>
				</view>
				<view class="tableContentTwo">
					<u-table class="table">
						<scroll-view class="scroll" scroll-y @scroll='scrollPage' :scroll-top="scrollTop">
							<view v-for="(x,i) in LevelTwoProcessData" :key="i">
								<u-tr>
									<u-td class="th" width="50%">
										{{x.LevelTwoProcessName}}
									</u-td>
									<u-td class="th bgOrange" width="50%">
										<input v-model="x.TotalHours" type="number" @input="totalNum"></input>
									</u-td>
								</u-tr>
							</view>
							<!-- <to-top :toTop='toTop' @handletotop='handletotop'></to-top> -->
						</scroll-view>
					</u-table>
				</view>
			</view>

		</view>
		<view class="footerThree flex_around" style="justify-content: start;">
			<view class="">
				人员：{{userInfo.Name}}
			</view>
		</view>
		<view class="footerTwo">
			<u-button type="searchFooter" size="medium" @click="submit" :disabled='adminLoading'>提交</u-button>
		</view>
		<u-select v-model="dialogPWSProcess" :list='pwsprocesss' @confirm="confirmPWSProcessValue"> </u-select>
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
	import formatDate from '@/common/formatDate.js';
	import toTop from '@/common/toTop.vue';
	export default {
		components: {
			toTop
		},
		data() {
			return {
				adminLoading: false,
				newData: [{
					TotalHours: '',
					MaterialID: 7810,
					MaterialName: '其他计时',
					ProcessID: 'P2201080001'
				}],
				levelTwoProcessDialog: false,
				userData: [],
				allSelect: [false, false],
				Types: '',
				list: [{
						name: '计件',
						disabled: false
					},
					{
						name: '计时',
						disabled: false
					},
					{
						name: '计件+计时',
						disabled: false
					}
				],
				userInfo: {},
				dialogPWSProcess: false,
				pwsprocesss: [],
				searchForm: {
					Name: 'haha',
					ProcessName: '嘻嘻',
				},
				status: 'loadmore',
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
				pagination: {
					pageIndex: 1,
					pageSize: 40,
					pageTotal: 0
				},
				tableData: [],
				ifOnShow: false,
				height: '',
				toDay: '',
				ProducedDate: '',
				noticeTag: 0,
				selectionData: [
					[],
					[]
				],
				UserInfoData_2: {},
				LevelTwoProcessData: [],
				CheckedProcessData: [],
				TotalHours: 0,
				newHourProduction: {},
				loginOutDialog: false
			}
		},
		onShow() {
			if (this.ifOnShow) {}
		},
		onHide() {
			this.ifOnShow = true;
		},
		onLoad(option) {
			_this = this;
			this.height = uni.getSystemInfoSync().windowHeight;
			this.userInfo = this.$store.getters.userInfo;
			this.UserInfoData_2 = this.$store.getters.UserInfoData_2;
			this.ProducedDate = formatDate.formatTodayDate();
			this.newHourProduction = this.$store.getters.newHourProduction;
			this.userInfo["dicID"] = 6710;
			this.getLineLevelTwoProcessData();
		},
		mounted() {},
		computed: {},
		watch: {},
		methods: {
			// 获取线对应的二级工序
			getLineLevelTwoProcessData(LineID) {
				this.LevelTwoProcessData = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 7900,
						ProcessID: 'P2201080001'
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							res.data.data.forEach(a => {
								this.$set(a, 'isChecked', false);
								this.LevelTwoProcessData.push(a);
							})
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
						})
					}
				})
			},
			// 滑到顶部
			handletotop() {
				this.toTop = false;
				this.scrollTop = this.old.scrollTop;
				this.$nextTick(() => {
					this.scrollTop = 0;
				});
			},
			// 页面滚动
			scrollPage(e) {
				this.old.scrollTop = e.detail.scrollTop;
				if (e.detail.scrollTop > 0.8) {
					this.toTop = true;
				} else {
					this.toTop = false;
				}
			},
			//滚动到底部
			scrolltolower() {
				this.loadmore();
			},
			// 加载更多
			loadmore() {
				this.pagination.pageIndex++;
				this.loadData(this.searchForm);
			},
			// 获取数据
			loadData(form, index) {
				form["page"] = this.pagination.pageIndex;
				form["rows"] = this.pagination.pageSize;
				form["dicID"] = 6705;
				this.$request.post({
					url: '/APSAPI/APSData',
					data: form
				}).then(res => {
					if (res.data.result) {
						let Data = res.data.data;
						if (Data.length != 0) {
							Data.forEach(x => {
								x.ProducedQty = x.PlanQty;
							})
						}
						if (Data.length > 0) {
							if (Data.length < 40) {
								this.status = 'nomore';
							} else {
								this.status = 'loadmore';
							}
							this.tableData = this.tableData.concat(Data);
						} else {
							this.status = 'nomore';
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 提交报工数
			submit() {
				if (parseFloat(this.newData[0].TotalHours) >= 0) {
					let Remark2 = '';
					if (this.LevelTwoProcessData.length != 0) {
						this.LevelTwoProcessData.some((a, i) => {
							if (a.TotalHours && parseFloat(a.TotalHours) > 0) {
								if (!Remark2) {
									Remark2 += (a.LevelTwoProcessName + ':' + a.TotalHours + 'h');
								} else {
									Remark2 += ('，' + a.LevelTwoProcessName + ':' + a.TotalHours + 'h');
								}
							}
						})
					}
					let childrens = [{
						dicID: 6710,
						ProducedQty: 0,
						Account: this.userInfo.Account,
						TotalHours: this.TotalHours,
						Remark1: '计时',
						Remark2: Remark2,
						ProducedQty: 0
					}];
					this.newData[0]["dicID"] = 6704;
					this.newData[0]["ProducedDate"] = this.ProducedDate;
					this.newData[0]["ProducedQty"] = 0;
					this.newData[0]["Status"] = 1;
					this.newData[0]["LineID"] = this.newHourProduction.LineID;
					this.newData[0]["childrens"] = childrens;
					this.saveData(this.newData);
				} else {
					this.$refs.uToast.show({
						title: '请填写计时！',
						type: 'error',

					})
				}
			},
			// 保存提交的数据
			saveData(newData) {
				if (this.adminLoading) {
					return
				}
				this.adminLoading = true;
				this.$request.post({
					url: '/APSAPI/SaveData',
					data: newData
				}).then(function(res) {
					if (res.data.result) {
						_this.$refs.uToast.show({
							type: 'success',
							title: res.data.msg,
						})
						_this.adminLoading = false;
						_this.loginOutDialog = true;
					} else {
						_this.adminLoading = false;
						_this.$refs.uToast.show({
							type: 'error',
							title: res.data.msg,

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
						let beforePage = pages[pages.length - 1];
						uni.navigateBack({
							delta: 1,
							success: function() {
								// beforePage.$vm.refreshRequest(); // 执行前一个页面的刷新
							}
						});
					}, 2000)
				}
			},
			// 合计数量
			totalNum() {
				this.TotalHours = 0;
				let num = 0;
				this.LevelTwoProcessData.forEach(a => {
					if (a.TotalHours) {
						num += parseFloat(a.TotalHours);
					}
				})
				this.TotalHours = num;
				this.$set(this.newData[0], 'TotalHours', num);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.more_header {
		padding: 1rem 0;

		::v-deep .u-row {
			font-size: 1.25rem;
			margin: 0.6rem 0.5rem;
			height: 2.5rem;
		}

		::v-deep .u-input {
			background: #ffffdd;
		}
	}

	.editInput {
		::v-deep .u-input {
			background: #ffffdd !important;
		}
	}

	.head_one {
		height: 2.5rem;
		line-height: 2.5rem;
		text-align: center;
	}

	.more_content {
		height: calc(100vh - 20rem);
	}
</style>
