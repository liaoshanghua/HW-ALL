<template>
	<view class="container_nopadding" :style="{height:height + 'px'}">

		<view class="headTwo">
			<!-- 		:active-item-style="{
				width: '40%',
				background:'#1890ff',
				color: '#fff !important'
			}" -->
			<view class="head-one">
				<u-tabs-swiper ref="uTabs" name="tabName" :list="list" :current="current" @change="changeTab" :is-scroll="false"></u-tabs-swiper>
			</view>
			<view class="head-one">
				<u-row>
					<u-col :span="4" class="twoRow-one">
						<!-- @click="openPlanDay(0)" -->
						<u-input type="text" v-show="current == 0" placeholder="搜索日期" v-model="searchForm[0].PlanDay" disabled border></u-input>
						<u-input type="text" v-show="current == 1" placeholder="搜索日期" v-model="searchForm[1].ProducedDate" disabled
						 border></u-input>
					</u-col>
					<u-col :span="4" class="twoRow-one">

						<u-input type="text" placeholder="搜索名称" v-model="searchForm[current].MaterialName" border></u-input>
					</u-col>

					<!-- <u-col :span="8" class="twoRow-one" v-show="current == 1">
						<u-input disabled type="text" placeholder="日期" v-model="searchForm[1].ProducedDate" border @click="openPlanDay(1)"></u-input>
					</u-col> -->
					<u-col :span="4" class="twoRow-two flexSpaceBet">
						<view>
							<u-button type="reset" size="mini" @click="dataReset">重置</u-button>
						</view>
						<view>
							<u-button type="search" size="mini" @click.native="dataSearch">搜索</u-button>
						</view>
					</u-col>
				</u-row>
			</view>
			<!-- 只能有一个根元素 -->
			<view class="sticky" v-show="current == 0">
				请查询需要报工数据并点击填写报工！
			</view>
			<!-- 只能有一个根元素 -->
			<view class="sticky" v-show="current == 1">
				报工{{num}}笔，已审{{num2}}笔，待审{{num3}}笔
			</view>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="contentTwo">
			<swiper-item class="swiper-item " @touchmove.stop>
				<view class="scroll">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<!-- <u-td class="th" width="22%">编码</u-td> -->
									<u-td class="th" width="36%">品名</u-td>
									<u-td class="th" width="18%">排产数</u-td>
									<u-td class="th" width="18%">已报工数</u-td>
									<u-td class="th" width="18%">欠数</u-td>
									<u-td class="th" width='10%'>
										<u-checkbox v-model="allSelect[0]" @click.native="seelctAll(0)"></u-checkbox>
									</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContent">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y @scroll='scrollPage' :scroll-top="scrollTop[0]" @scrolltolower="loadmore(0)">
								<view v-for="(x,i) in tableData[0]" :key="i">
									<u-tr>
										<!-- <u-td class="th left" width="22%">{{x.Code}}</u-td> -->
										<u-td class="th left blue" width="36%">
											{{x.MaterialName}}
										</u-td>
										<u-td class="th" width="18%">
											{{x.PlanQty}}
										</u-td>
										<u-td class="th left blue" width="18%">
											{{x.ProducedQty}}
										</u-td>
										<u-td class="th red" width="18%">
											{{x.OweQty}}
										</u-td>
										<u-td class="th" width='10%'>
											<u-checkbox v-model="x.isChecked"></u-checkbox>
										</u-td>
									</u-tr>
								</view>
								<view>
									<u-loadmore :status="status[0]" :load-text="loadText[0]" @loadmore="loadmore(0)" color="#3e82f9" />
								</view>
								<to-top :toTop='toTop[0]' @handletotop='handletotop(0)'></to-top>
							</scroll-view>
						</u-table>
					</view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item" @touchmove.stop>
				<view class="scroll">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<!-- <u-td class="th" width="22%">编码</u-td> -->
									<u-td class="th" width="35%">品名</u-td>
									<u-td class="th" width="20%">已报工数</u-td>
									<u-td class="th" width="20%">确认数</u-td>
									<u-td class="th" width="15%">提报人</u-td>
									<u-td class="th" width='10%'>

									</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContent">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y @scroll='scrollPage' :scroll-top="scrollTop[1]" @scrolltolower="loadmore(1)">
								<view v-for="(x,i) in tableData[1]" :key="i">
									<u-tr>
										<!-- <u-td class="th" width="22%">{{x.Code}}</u-td> -->

										<u-td class="th left blue" width="35%">{{x.MaterialName}}</u-td>
										<u-td class="th blue" width="20%">{{x.ProducedQty}}</u-td>
										<u-td class="th" width="20%">
											{{x.ConfirmQty}}
										</u-td>
										<u-td class="th" width="15%">{{x.CreatedByName}}</u-td>
										<u-td class="th" width='10%'>
											<u-checkbox v-model="x.isChecked" @change="onlyOne(x)"></u-checkbox>
										</u-td>
									</u-tr>
								</view>
								<view>
									<u-loadmore :status="status[1]" :load-text="loadText[1]" @loadmore="loadmore(1)" color="#3e82f9" />
								</view>
								<to-top :toTop='toTop[1]' @handletotop='handletotop(1)'></to-top>
							</scroll-view>
						</u-table>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="footerTwo" v-show="current == 0">
			<u-button type="searchFooter" size="medium" @click="toPage(0)" :disabled="isDisabled">填写报工</u-button>
			<!-- <u-button type="searchFooter" size="medium" @click="submit">提交</u-button> -->
		</view>
		<view class="footerTwo" v-show="current == 1">
			<u-button type="searchFooter" size="medium" @click="toPage(1)" :disabled="isDisabled">再次报工</u-button>
			<!-- <u-button type="searchFooter" size="medium" @click="submit">提交</u-button> -->
		</view>
		<!-- 	<view class="footerTwo flex_around" v-show="current == 1">
			<view class="blue">已报工总数：{{total}} </view>
			<view class="green">已确认总数:{{total2}}</view>
		</view> -->

		<u-picker v-model="dialogPlanDay" mode="time" :params="{year: true,month: true,day:true}" @confirm='confirmPlanDay'></u-picker>
		<u-top-tips ref="uToast"></u-top-tips>
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	import formatDate from '@/common/formatDate.js';
	import toTop from '@/common/toTop.vue';
	export default {
		components: {
			toTop
		},
		data() {
			return {
				allSelect: [false, false],
				current: 0,
				swiperCurrent: 0,
				list: [{
					tabName: '待报任务'
				}, {
					tabName: '已报记录'
				}],
				searchForm: [{
					PlanDay: '',
					LineID: '',
					MaterialName: "",
					dicID: '6705'
				}, {
					LineID: '',
					PlanDay: '',
					MaterialName: "",
					dicID: "6704"
				}],
				status: ['loadmore', 'loadmore'],
				loadText: [{
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '我也是有底线的哦~'
				}, {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '我也是有底线的哦~'
				}],
				toTop: [false, false],
				scrollTop: [0, 0],
				old: [{
					scrollTop: 0
				}, {
					scrollTop: 0
				}],
				pagination: [{
					pageIndex: 1,
					pageSize: 40,
					pageTotal: 0
				}, {
					pageIndex: 1,
					pageSize: 40,
					pageTotal: 0
				}],
				tableData: [
					[],
					[]
				],
				dialogPlanDay: false,
				num: 0,
				num2: 0,
				num3: 0,
				total: 0,
				total2: 0,
				toDay: [],
				tagRemark: 0,
				selectionData: [
					[],
					[]
				],
				isDisabled: true,
				ifOnShow: false,
				height: '',
				Account: '',
				currentRow: ''
			}
		},
		onShow() {
			if (this.ifOnShow) {
				// 获取产出汇总
				this.height = uni.getSystemInfoSync().windowHeight;
				this.getNum();
				this.tableData[0] = [];
				this.tableData[1] = [];
				this.loadData(this.searchForm[0], 0);
			}
		},
		onHide() {
			this.ifOnShow = true;
		},
		onLoad(option) {
			this.height = uni.getSystemInfoSync().windowHeight;
			if (Object.values(option).length > 0) {
				uni.showToast({
					title: option.msg
				})
				this.changeTab(1);
			}
			// 判断是否是线的负责人
			this.Account = this.$store.getters.userInfo.Account;
			let ManagerCode = this.$store.getters.ProductionLine.ManagerCode;
			if (this.Account == ManagerCode || this.Account == 'admin') {
				this.isDisabled = false;
			}
			this.searchForm[0].LineID = this.$store.getters.ProductionLine.LineID;
			this.searchForm[0].LineName = this.$store.getters.ProductionLine.LineName;
			this.searchForm[1].LineID = this.$store.getters.ProductionLine.LineID;
			this.searchForm[1].LineName = this.$store.getters.ProductionLine.LineName;
			this.toDay[0] = formatDate.formatTodayDate();
			this.toDay[1] = formatDate.formatTodayDate();
			this.searchForm[0].PlanDay = formatDate.formatTodayDate();
			this.searchForm[1].ProducedDate = formatDate.formatTodayDate();
			this.loadData(this.searchForm[0], 0);
			// 动态更改表头名字
			uni.setNavigationBarTitle({
				title: "生产报工：" + this.searchForm[0].LineName
			});
		},
		mounted() {},
		computed: {},
		watch: {},
		methods: {
			// 切换标签页
			changeTab(index) {
				this.swiperCurrent = index;
				this.current = index;
				if (index == 1) {
					if (this.tableData[1].length == 0) {
						this.loadData(this.searchForm[1], 1);
					}
				}
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
			// 查询
			dataSearch() {
				this.$set(this.tableData,this.swiperCurrent,[]);
				this.pagination[this.swiperCurrent].pageIndex = 1;
				this.loadData(this.searchForm[this.swiperCurrent], this.swiperCurrent);
			},
			// 重置
			dataReset() {
				if ([this.swiperCurrent] == 0) {
					this.$set(this.searchForm[0], 'MaterialName', null);
				} else {
					this.searchForm[1].PlanDay = '';
				}
			},
			// 滑到顶部
			handletotop(index) {
				this.toTop[index] = false;
				this.scrollTop[index] = this.old[index].scrollTop;
				this.$nextTick(() => {
					this.scrollTop[index] = 0;
				});
			},
			// 页面滚动
			scrollPage(e) {
				this.old[this.swiperCurrent].scrollTop = e.detail.scrollTop;
				if (e.detail.scrollTop > 0.8) {
					this.toTop[this.swiperCurrent] = true;
				} else {
					this.toTop[this.swiperCurrent] = false;
				}
			},
			//滚动到底部
			scrolltolower(index) {
				this.loadmore(index);
			},
			// 加载更多
			loadmore(index) {
				this.pagination[index].pageIndex++;
				this.loadData(this.searchForm[index], index);
			},
			// 获取数据
			loadData(form, index) {
				form["page"] = this.pagination[index].pageIndex;
				form["rows"] = this.pagination[index].pageSize;
				let newForm = JSON.parse(JSON.stringify(form));
				if (index == 1) {
					if (this.Account != "admin") {
						newForm["CreatedBy"] = this.Account;
					}
					newForm["ProducedDate"] = [form.ProducedDate, form.ProducedDate];
					delete newForm.PlanDay;
				} else {
					newForm["PlanDay"] = [form.PlanDay, form.PlanDay];
				}
				this.$request.post({
					url: '/APSAPI/APSData',
					data: newForm
				}).then(res => {
					if (res.data.result) {
						let Data = [];
						this.getNum();
						if (index == 0) {
							res.data.data.forEach(x => {
								if (!x.ProducedQty) {
									Data.push(x)
								}
							})
						} else {
							res.data.data.forEach(x => {
								if (x.ProducedQty) {
									Data.push(x)
								}
							})
						}
						if (Data.length > 0) {
							if (Data.length < 40) {
								this.status[index] = 'nomore';
							} else {
								this.status[index] = 'loadmore';
							}
							let newData = this.tableData[index].concat(Data);
							this.$set(this.tableData, index, newData);
						} else {
							this.status[index] = 'nomore';
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 打开计划日期
			openPlanDay(val) {
				this.tagRemark = val;
				this.dialogPlanDay = true;
			},
			// 确认日期
			confirmPlanDay(val) {
				let newDate = val.year + '-' + val.month + '-' + val.day;
				if (this.tagRemark == 0) {
					this.searchForm[0].PlanDay = newDate;

				} else {
					this.searchForm[1].ProducedDate = newDate;
				}
				this.dataSearch();
			},
			// 全部选中
			seelctAll(index) {
				if (this.tableData[index].length != 0 && this.allSelect[index]) {
					this.tableData[index].forEach(m => {
						if (!m.isChecked) {
							this.$set(m, 'isChecked', true);
						}
					})
				} else if (this.tableData[index].length != 0) {
					this.tableData[index].forEach(m => {
						if (m.isChecked) {
							this.$set(m, 'isChecked', false);
						}
					})
				}
			},
			// 获取选中的数据
			getSelectionData(index) {
				this.selectionData[index] = [];
				this.tableData[index].forEach(x => {
					if (x.isChecked) {
						this.selectionData[index].push(x);
					}
				})
			},
			// 获取未审核数据
			getNum() {
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 6704,
						row: 0,
						ProducedDate: [this.searchForm[1].ProducedDate, this.searchForm[1].ProducedDate],
						LineID: this.searchForm[1].LineID
					}
				}).then(res => {
					if (res.data.result) {
						this.num = res.data.count;
						if (res.data.data.length != 0) {
							let total = 0;
							let total2 = 0;
							let num2 = 0;
							let num3 = 0;
							res.data.data.forEach(x => {
								total += parseFloat(x.ProducedQty);
								if (x.Status == 1) {
									num3++
								}
								if (x.Status == 25) {
									num2++;
									total2 += parseFloat(x.ConfirmQty);
								}
							})
							this.total = total;
							this.total2 = total2;
							this.num2 = num2;
							this.num3 = num3
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 跳转至填写报工页面
			toPage(index) {
				this.getSelectionData(index);
				if (this.selectionData[index].length == 0) {
					this.$refs.uToast.show({
						title: '请勾选需要报工的数据！',
						type: 'warning',
					})
					return;
				}
				let newData = JSON.parse(JSON.stringify(this.selectionData[index]));
				if (index == 1) {
					// 再次报工需清除数据
					newData.forEach(x => {
                      this.$set(x,'ID',null);
					})
				}
				this.$store.commit('setting/SetSearchForm', newData);
				uni.navigateTo({
					url: './editProduction'
				})
			},
			onlyOne(row) {
				if (this.currentRow) {
					this.$set(this.currentRow, 'isChecked', false);
				}
				this.$set(row, 'isChecked', true);
				this.currentRow = row;

			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-tabs-item {
		// border-radius: 60rpx !important;
		height: 2rem !important;
		line-height: 2rem !important;
		font-size: 1.25rem !important;
	}
</style>
