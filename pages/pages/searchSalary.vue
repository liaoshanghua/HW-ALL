<template>
	<view class="container_nopadding">
		<view class="head">
			<view class="head-one">
				<u-tabs-swiper ref="uTabs" name="tabName" :list="list" :current="current" @change="changeTab"
					:is-scroll="false"></u-tabs-swiper>
			</view>
			<view class="head-one">
				<u-row>
					<u-col :span="6" class="twoRow-one">
						请选择需要查询的月份：
					</u-col>
					<u-col :span="6">
						<u-input type="select" placeholder="" v-model="searchForm.YearMonth" disabled border
							@click="openDay"></u-input>
					</u-col>
				</u-row>
			</view>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
			class="contentSeven">
			<swiper-item class="swiper-item" @touchmove.stop>
				<view class="table_row_content">
					<u-row class="table_row f">
						<u-col :span="6" class="table_col f1">
							收入构成：
						</u-col>
						<u-col :span="6" class="f1">
							单位（元）
						</u-col>
					</u-row>
					<u-row class="table_row">
						<u-col :span="6" class="table_col f1">
							计件工资：
						</u-col>
						<u-col :span="6" class="f1">
							{{dataForm.PieceworkFee}}
						</u-col>
					</u-row>
					<u-row class="table_row">
						<u-col :span="6" class="table_col f1">
							计时工资：
						</u-col>
						<u-col :span="6" class="f1">
							{{dataForm.ProductionFee}}
						</u-col>
					</u-row>
					<u-row class="table_row">
						<u-col :span="6" class="table_col f1">
							车间补贴：
						</u-col>
						<u-col :span="6" class="f1">
							{{dataForm.WorkShopFee}}
						</u-col>
					</u-row>
					<u-row class="table_row">
						<u-col :span="6" class="table_col f1 ">
							临时调岗工资：
						</u-col>
						<u-col :span="6" class="f1">
							{{dataForm.TempoaryChangeFee}}
						</u-col>
					</u-row>
					<u-row class="table_row">
						<u-col :span="6" class="table_col f1">
							返工工资：
						</u-col>
						<u-col :span="6" class="f1">
							{{dataForm.BackFee}}
						</u-col>
					</u-row>
					<u-row class="table_row">
						<u-col :span="6" class="table_col f1">
							其他计时工资：
						</u-col>
						<u-col :span="6" class="f1">
							{{dataForm.AntherFee}}
						</u-col>
					</u-row>
					<u-row class="table_row">
						<u-col :span="6" class="table_col f1">
							宵夜补贴：
						</u-col>
						<u-col :span="6" class="f1">
							{{dataForm.FoodsFee}}
						</u-col>
					</u-row>
					<u-row class="table_row f2">
						<u-col :span="6" class="table_col">
							收入合计：
						</u-col>
						<u-col :span="6" class="">
							{{dataForm.TotalWages}}
						</u-col>
					</u-row>
				</view>

			</swiper-item>
			<swiper-item class="swiper-item " @touchmove.stop>
				<view class="new_content_two">
					<view class="report_head">
						<view class="report_head_span flex">
							<view class="s1">
								月总收入：
							</view>
							<view class="s1">
								{{dataForm.TotalWages}}
							</view>
						</view>
					<!-- 	<view class="">
							<u-row class="report_row">
								<u-col :span="6">计件总收入：{{dataForm.PieceworkFee}}</u-col>
								<u-col :span="6">产品总数：{{dataForm.MaterialNum}}</u-col>
							</u-row>
							<u-row class="report_row">
								<u-col :span="6">计时总收入：{{dataForm.ProductionFee}}</u-col>
								<u-col :span="6">车间补贴：{{dataForm.WorkShopFee}}</u-col>
							</u-row>
						</view> -->
					</view>
					<view class="report_content">
						<view class="" v-for="(item,i) in listData" :key="i">
							<u-row class="new_row_head">
								<u-col class="new_col f" :span="6">{{item.dayDay}} {{item.dayWeek}}</u-col>
								<u-col class="new_col f f6" :span="3">数量</u-col>
								<u-col class="new_col f f6" :span="3">收入(元)</u-col>
							</u-row>
							<u-row v-for="(x,j) in item.childrens" :key="j">
								<u-col class="new_col" :span="6">{{x.ProcessName}}</u-col>
								<u-col class="new_col f6" :span="3">{{x.Qty}}</u-col>
								<u-col class="new_col f6" :span="3">{{x.TotalWages}}</u-col>
							</u-row>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>

		<u-picker v-model="dialogDay" mode="time" :params="{year: true,month: true}" @confirm='confirmDay'>
		</u-picker>
		<u-top-tips ref="uToast"></u-top-tips>
		<u-toast ref="uToast2"></u-toast>
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					tabName: '收入统计'
				}, {
					tabName: '工资明细'
				}],
				searchForm: {
					YearMonth: ''
				},
				current: 0,
				swiperCurrent: 0,
				numQty: 0,
				listData: [{}],
				dialogDay: false,
				dataForm: {
					PieceworkFee: "",
					NewEmployeesFee: "",
					AntherFee: '',
					TotalWages: ''
				},
				userInfo: {},
				monthDay: ''

			}
		},
		onLoad() {
			this.userInfo = this.$store.getters.userInfo;
			this.searchForm.YearMonth = new Date().getFullYear() + this.zero((new Date().getMonth() + 1));
			this.monthDay = new Date().getFullYear() + '-' + this.zero((new Date().getMonth() + 1)) + '-';
			this.getData_1(this.searchForm);
			this.getData_2(this.searchForm);
		},
		methods: {
			// 补0 
			zero(num) {
				if (Number(num) < 10) {
					return '0' + num
				} else {
					return num
				}
			},
			// 切换标签页
			changeTab(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			openDay() {
				this.dialogDay = true;
			},
			confirmDay(val) {
				this.searchForm.YearMonth = val.year + val.month;
				this.monthDay = val.year + '-' + val.month + '-';
			},
			getData_1(form) {
				form["dicID"] = 5134;
				form["Account"] = this.userInfo.Account;
				for (var name in this.dataForm) {
					this.dataForm[name] = '';
				}
				this.$request.post({
					url: '/APSAPI/APSData',
					data: form
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							for (var i in res.data.data[0]) {
								if (res.data.data[0][i]) {
									this.dataForm[i] = res.data.data[0][i];
								} else {
									this.dataForm[i] = 0;
								}
							}
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},

			getData_2(form) {
				let newForm = JSON.parse(JSON.stringify(form));
				newForm["dicID"] = 6745;
				let startDate = this.monthDay + '01';
				let endDate = '';
				let currentMonth = new Date().getMonth() + 1;
				if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth ==
					8 || currentMonth == 10 || currentMonth == 12) {
					endDate = this.monthDay + '31';
				} else {
					endDate = this.monthDay + '30';
				}
				newForm["DDate"] = [startDate, endDate];
				let newForm2 = JSON.parse(JSON.stringify(newForm));
				this.getMaterialNum(newForm2);
				this.$request.post({
					url: '/APSAPI/APSData',
					data: newForm
				}).then(res => {
					if (res.data.result) {
						let list = [];
						let newDate = [];
						if (res.data.data.length != 0) {
							console.log(res.data.data)
							res.data.data.forEach(x => {
								let childrens = [];
								let newIndex = 0;
								if (newDate.length != 0) {
									newIndex = newDate.findIndex(y => y == x.dayDay)
									if (newIndex == -1) {
										newDate.push(x.dayDay);
										let obj = JSON.parse(JSON.stringify(x));
										childrens = res.data.data.filter(z => {
											return z.dayDay == x.dayDay
										});
										obj["childrens"] = childrens;
										list.push(obj);
									}
								} else {
									newDate.push(x.dayDay);
									let obj = JSON.parse(JSON.stringify(x));
									childrens = res.data.data.filter(z => {
										return z.dayDay == x.dayDay
									});
									obj["childrens"] = childrens;
									list.push(obj);
								}
							})

						}
						this.listData = list;
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 获取产品总数
			getMaterialNum(form) {
				form["dicID"] = 6743;
				form["fields"] = 'count(1) as num';
				form["groupby"] = ' ProductName';
				form["sort"] = ' ProductName';
				this.$request.post({
					url: '/APSAPI/APSData',
					data: form
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							this.dataForm.MaterialNum = res.data.data[0].num;
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},

		}
	}
</script>

<style lang="scss">
	::v-deep .u-tabs-item {
		// border-radius: 60rpx !important;
		height: 2rem !important;
		line-height: 2rem !important;
		font-size: 1.25rem !important;
	}

	.table_row_content {
		border: 1px solid #151515;
		margin: 20rpx 10rpx;

		.f {
			background: #01ba9a;
			color: #fff;
		}

		.f2 {
			background: #29caff;
			color: #fff;
		}
	}

	.table_row {
		font-weight: bold;
		height: 3rem;
		line-height: 3rem;

		::v-deep .u-col {
			height: 100%;
			padding: 0 20rpx !important;
		}

		.f1 {
			border-bottom: 1px solid #151515;
		}
	}

	.table_col {
		border-right: 1px solid #151515;
	}

	.new_content_two {
		height: 100%;
		padding: 20rpx 10rpx;

		.report_head {
			height: 2rem;

			.s1 {
				font-size: 1.25rem;
				font-weight: bold;
				margin-bottom: 10rpx;
				margin-left: 5px;
			}

			.report_row {
				height: 2rem;
				color: #151515;
				line-height: 2rem;
			}
		}

		.report_content {
			height: calc(100% - 2rem);

			.f {
				// font-weight: bold;
				color: #ada9a9;
				border-bottom: 1px solid #ada9a9;
				font-size: 1.1rem;
				height: 2.5rem !important;
				line-height: 2.5rem !important;
			}

			.f6 {
				text-align: right !important;
			}

			.new_col {
				height: 1.8rem;
				line-height: 1.8rem;
			}
		}
	}
</style>
