<template>
	<view class="container_nopadding">
		<!-- 	<view class="status_bar">
		</view> -->
		<view class="report_head">
			<view class="back_icon" @click="backPage">
				<u-icon name="arrow-left" size="30"></u-icon>
			</view>
			<view class="report_head_head">
				<view class="report_head_input">
					<u-input class="input_head" type="text" disabled v-model="searchForm.YearMonth" @click="openDay" >
					</u-input>
				</view>
				<view class="report_head_span flex">
					<view class="s1">
						月总收入：
					</view>
					<view class="s2">
						{{dataForm.TotalWages}}
					</view>
				</view>
				<view class="report_head_span flex_between">
					<view :class="swiperCurrent == i?'active s3':'s3'" v-for="(item,i) in list" :key="i"
						@click="changeTag(item,i)">
						{{item.tabName}}
					</view>
				</view>
			</view>
		</view>
		<swiper :current="swiperCurrent" class="report_content_one">
			<swiper-item class="swiper-item" @touchmove.stop>
				<view class="table_row_content">
					<u-row class="table_row f">
						<u-col :span="6" class="table_col f1">
							收入构成：
						</u-col>
						<u-col :span="6" class="f1 text_right">
							单位(元)
						</u-col>
					</u-row>
					<view class="bgFFF">
						<u-row class="table_row">
							<u-col :span="6" class="table_col f1">
								计件工资：
							</u-col>
							<u-col :span="6" class="f1 text_right">
								{{dataForm.PieceworkFee}}
							</u-col>
						</u-row>
						<u-row class="table_row">
							<u-col :span="6" class="table_col f1">
								计时工资：
							</u-col>
							<u-col :span="6" class="f1 text_right">
								{{dataForm.ProductionFee}}
							</u-col>
						</u-row>
						<u-row class="table_row">
							<u-col :span="6" class="table_col f1">
								车间补贴：
							</u-col>
							<u-col :span="6" class="f1 text_right">
								{{dataForm.WorkShopFee}}
							</u-col>
						</u-row>
						<u-row class="table_row">
							<u-col :span="6" class="table_col f1 ">
								临时调岗工资：
							</u-col>
							<u-col :span="6" class="f1 text_right">
								{{dataForm.TempoaryChangeFee}}
							</u-col>
						</u-row>
						<u-row class="table_row">
							<u-col :span="6" class="table_col f1">
								返工工资：
							</u-col>
							<u-col :span="6" class="f1 text_right">
								{{dataForm.BackFee}}
							</u-col>
						</u-row>
						<u-row class="table_row">
							<u-col :span="6" class="table_col f1">
								其他计时工资：
							</u-col>
							<u-col :span="6" class="f1 text_right">
								{{dataForm.AntherFee}}
							</u-col>
						</u-row>
						<u-row class="table_row">
							<u-col :span="6" class="table_col f1">
								宵夜补贴：
							</u-col>
							<u-col :span="6" class="f1 text_right">
								{{dataForm.FoodsFee}}
							</u-col>
						</u-row>
					</view>
					<u-row class="table_row f2">
						<u-col :span="6" class="table_col">
							合计：
						</u-col>
						<u-col :span="6" class="blue text_right">
							{{dataForm.TotalWages}}
						</u-col>
					</u-row>
				</view>

			</swiper-item>
			<swiper-item class="swiper-item " @touchmove.stop>
				<view class="new_content_two">
					<view class="report_content">
						<scroll-view class="scroll" scroll-y>
							<view class="bgGray" v-for="(item,i) in listData" :key="i">
								<u-row class="new_row_head">
									<u-col class="new_col f" :span="6"><span
											class="font-size-15">{{item.dayDay}}</span>日
										{{item.dayWeek}}
									</u-col>
									<u-col class="new_col f f6" :span="3">数量</u-col>
									<u-col class="new_col f f6" :span="3">收入(元)</u-col>
								</u-row>
								<u-row v-for="(x,j) in item.childrens" :key="j"
									:class="x.summary?'padding_row_border padding_row ':'padding_row'">
									<u-col :class="x.summary?'new_col f':'new_col'" :span="6">{{x.ProcessName}}</u-col>
									<u-col :class="x.summary?'new_col f7':'new_col f6'" :span="3">{{x.Qty}}</u-col>
									<u-col :class="x.summary?'new_col f7':'new_col f6'" :span="3">{{x.TotalWages}}
									</u-col>
								</u-row>
							</view>
						</scroll-view>
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
	import formatDate from '../../common/formatDate'
	import toTop from '@/common/toTop.vue';
	export default {
		components: {
			toTop
		},
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
				userInfo: {}
			}
		},
		onLoad() {
			this.userInfo = this.$store.getters.userInfo;
			this.searchForm.YearMonth = new Date().getFullYear() + this.zero((new Date().getMonth()));
			this.getData_1(this.searchForm);
			this.getData_2(this.searchForm);
		},
		methods: {
			changeTag(item, index) {
				this.swiperCurrent = index;
			},
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
				this.getData_1(this.searchForm);
				this.getData_2(this.searchForm);
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
				// let newForm2 = JSON.parse(JSON.stringify(newForm));
				// this.getMaterialNum(newForm2);
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
								let nweRow = {};
								nweRow["ProcessName"] = "合计：";
								nweRow["summary"] = true;
								let newIndex = 0;
								if (newDate.length != 0) {
									newIndex = newDate.findIndex(y => y == x.dayDay)
									if (newIndex == -1) {
										newDate.push(x.dayDay);
										let obj = JSON.parse(JSON.stringify(x));
										childrens = res.data.data.filter(z => {
											return z.dayDay == x.dayDay
										});
										if (childrens.length != 0) {
											this.setSummary(childrens, nweRow)
										}
										childrens.push(nweRow);
										obj["childrens"] = childrens;
										list.push(obj);
									}
								} else {
									newDate.push(x.dayDay);
									let obj = JSON.parse(JSON.stringify(x));
									childrens = res.data.data.filter(z => {
										return z.dayDay == x.dayDay
									});
									if (childrens.length != 0) {
										this.setSummary(childrens, nweRow)
									}
									childrens.push(nweRow);
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
			setSummary(childrens, nweRow) {
				let num1 = 0;
				let max1 = 0;
				let num2 = 0;
				let max2 = 0;
				childrens.forEach((m) => {
					if (parseFloat(m.Qty) >
						0) {
						if (m.Qty.toString()
							.split(
								".")[1]) {
							let newMax1 = m.Qty.toString().split(".")[
									1]
								.length;
							if (newMax1 > max1) {
								max1 = newMax1;
							}
						}
					}

					if (parseFloat(m.TotalWages) >
						0) {
						if (m.TotalWages.toString()
							.split(
								".")[1]) {
							let newMax2 = m.TotalWages.toString()
								.split(".")[
									1]
								.length;
							if (newMax2 > max2) {
								max2 = newMax2;
							}
						}
					}
				});
				childrens.forEach((m) => {
					if (parseFloat(m.Qty) >
						0) {
						num1 =
							num1 +
							parseFloat(m.Qty) *
							Math.pow(10, max1);
					}
					if (parseFloat(m.TotalWages) >
						0) {
						num2 =
							num2 +
							parseFloat(m.TotalWages) *
							Math.pow(10, max2);
					}
				});
				nweRow["Qty"] = num1 / Math.pow(10, max1);
				nweRow["TotalWages"] = num2 / Math.pow(10, max2);
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
			// 返回上一页面
			backPage() {
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2];
				uni.navigateBack({
					delta: 1,
					success: function() {
						// beforePage.$vm.refreshRequest(); // 执行前一个页面的刷新
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container_nopadding {
		overflow: hidden;
	}

	.report_head {
		position: relative;
		height: 270rpx;
		padding-top: 70rpx;
		background: url(../../static/newVersionImg/report_head.png);
		background-size: 100% 100%;

		.back_icon {
			position: absolute;
			top: 80rpx;
			left: 15rpx;
			color: #FFF;
		}
	}

	.report_head_head {
		color: #fff;
		text-align: center;


		.report_head_input {
			width: 30%;
			margin: 0 35%;
			height: 60rpx;
			line-height: 60rpx;

			::v-deep .u-input__input {
				color: #fff !important;
			}
		}

		.report_head_span {
			text-align: left;
			padding: 0 40rpx;

			.active {
				color: #fff !important;

				font-size: 1.1rem;
			}

			.s1 {
				color: #fff;
				font-size: 1.4rem;
				margin-bottom: 15rpx;
			}

			.s2 {
				color: #fff;
				font-size: 1.4rem;
				font-weight: bold;
				margin-bottom: 15rpx;
			}

			.s3 {
				font-weight: bold;
				color: #51524e;
				font-size: 1.25rem;
			}
		}
	}

	.contentSeven {
		background: #F5F5F5;
	}

	.input_head::after {
		display: block;
		content: "";
		width: 0;
		height: 0;
		border: 16rpx solid transparent;
		border-top-color: #fff;
		position: absolute;
		top: 20rpx;
		right: -30rpx;
		border-radius: 6rpx;
	}

	.table_row_content {
		// border: 1px solid #151515;
		padding: 20rpx 10rpx;

		.f {
			// background: #F5f5f5;
			color: #151515;
			font-size: 1.25rem;
			font-weight: bold;
		}

		.f2 {
			// background: #29caff;
			color: #151515;
			font-size: 1.25rem;
			font-weight: bold;
		}

		.blue {
			color: #007AFF;
		}
	}

	.table_row {
		// font-weight: bold;
		color: #151515;
		height: 3rem;
		line-height: 3rem;

		::v-deep .u-col {
			height: 100%;
			font-size:1.25rem;
			padding: 0 20rpx !important;
		}

		.f1 {
			// border-bottom: 1px solid #151515;
		}
	}

	.table_col {
		// border-right: 1px solid #151515;
	}

	.report_content_one {
		height: calc(100% - 200rpx);
		background-color: #F5F5F5;
	}

	.new_content_two {
		height: calc(100% - 100rpx);
		background-color: #F5F5F5;
		padding: 0 0;
		overflow: auto;

		.report_head {
			height: 0;

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
			height: calc(100%);

			.f {
				// font-weight: bold;
				color: #ada9a9;
				font-size: 1.25rem;
				height: 2.2rem !important;
				line-height: 2.2rem !important;
			}

			.f6 {
				text-align: right !important;
			}


			.f7 {
				font-size: 1.25rem;
				color: #007AFF;
				text-align: right !important;
				font-weight: bold;
			}

			.padding_row_border {
				border-top: 1px solid #ada9a9;
				padding:0 0 20rpx 0;
			}

			.new_col {
				height: 1.8rem;
				line-height: 1.8rem;
				font-size: 1.1rem;
			}
		}
	}

	.font-size-15 {
		font-size: 1.5rem !important;
	}

	.text_right {
		text-align: right !important;
		padding-right: 15rpx;
	}

	.bgFFF {
		background-color: #FFF !important;
	}

	.padding_row {
		padding: 20rpx 0;
	}

	.bgGray {
		margin-bottom: 20rpx;
		background: #FFFFFF;
		padding: 20rpx 40rpx 0 40rpx;
	}

	.new_row_head {
		border-bottom: 1px solid #ada9a9;
	}
</style>
