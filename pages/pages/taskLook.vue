<template>
	<!-- @touchmove.stop  禁止滑动 -->
	<view class="container_nopadding">
		<view class="head">
			<view class="head-one">
				<u-row>
					<u-tabs-swiper ref="uTabs" name="tabName" :list="list" :current="current" @change="changeTab"
						:is-scroll="false" active-color="#3e82f9 !important" inactive-color="#3e82f9"></u-tabs-swiper>
				</u-row>
			</view>
			<view class="head-one">
				<u-row v-show="current == 0">
					<u-col span="4">
						<u-input type="text" disabled placeholder="选择分厂" v-model="searchForm[0].MFGOrganizeName"
							@click="openOrganzie" border></u-input>
					</u-col>
					<u-col span="4">
						<u-input type="text" disabled placeholder="选择工序" v-model="searchForm[0].ProcessName"
							@click="openProcess" border></u-input>
					</u-col>
					<u-col span="4" class="twoRow-two flexSpaceBet">
						<view>
							<u-button type="search" size="mini" @click="dataSearch(0)">查询</u-button>
						</view>
						<view>
							<u-button type="reset" size="mini" @click="dataset(0)">重置</u-button>
						</view>
					</u-col>
				</u-row>
				<u-row v-show="current == 1">
					<u-col span="4">
						<u-input type="text" disabled placeholder="选择分厂" v-model="searchForm[1].MFGOrganizeName"
							@click="openOrganzie" border></u-input>
					</u-col>
					<u-col span="4">
						<u-input type="text" disabled placeholder="选择工序" v-model="searchForm[1].ProcessName"
							@click="openProcess" border></u-input>
					</u-col>
					<u-col span="4" class="twoRow-two flexSpaceBet">
						<view>
							<u-button type="search" size="mini" @click="dataSearch(1)">查询</u-button>
						</view>
						<view>
							<u-button type="reset" size="mini" @click="dataset(1)">重置</u-button>
						</view>
					</u-col>
				</u-row>
				<u-row v-show="current == 2">
					<u-col span="4">
						<u-input type="text" disabled placeholder="选择分厂" v-model="searchForm[2].MFGOrganizeName"
							@click="openOrganzie" border></u-input>
					</u-col>
					<u-col span="4">
						<u-input type="text" disabled placeholder="选择工序" v-model="searchForm[2].ProcessName"
							@click="openProcess" border></u-input>
					</u-col>
					<u-col span="4" class="twoRow-two flexSpaceBet">
						<view>
							<u-button type="search" size="mini" @click="dataSearch(2)">查询</u-button>
						</view>
						<view>
							<u-button type="reset" size="mini" @click="dataset(2)">重置</u-button>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
			class="contentSeven">
			<swiper-item class="swiper-item " @touchmove.stop>
				<view class="scroll">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td class="th" width="20%">线别</u-td>
									<u-td class="th" width="35%">品名</u-td>
									<u-td class="th" width="15%">计划</u-td>
									<u-td class="th" width="15%">报工</u-td>
									<u-td class="th" width="15%">确认</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContent">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y @scroll='scrollPage' :scroll-top="scrollTop[0]"
								@scrolltolower="loadmore(0)">
								<view v-for="(x,i) in tableData[0]" :key="i">
									<u-tr>
										<u-td class="th" width="20%">{{x.LineName}}</u-td>
										<u-td class="th left" width="35%">{{x.MaterialName}}</u-td>
										<u-td class="th blue" width="15%">{{x.PlanQty}}</u-td>
										<u-td class="th" width="15%">{{x.ProducedQty}}</u-td>
										<u-td class="th" width="15%">{{x.ConfirmQty}}</u-td>
									</u-tr>
								</view>
								<view>
									<u-loadmore :status="status[0]" :load-text="loadText[0]" @loadmore="loadmore(0)"
										color="#3e82f9" />
								</view>
								<to-top :toTop='toTop[0]' @handletotop='handletotop(0)'></to-top>
							</scroll-view>
						</u-table>
					</view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item " @touchmove.stop>
				<view class="scroll">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td class="th" width="20%">线别</u-td>
									<u-td class="th" width="35%">品名</u-td>
									<u-td class="th" width="15%">计划</u-td>
									<u-td class="th" width="15%">报工</u-td>
									<u-td class="th" width="15%">确认</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContent">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y @scroll='scrollPage' :scroll-top="scrollTop[1]"
								@scrolltolower="loadmore(1)">
								<view v-for="(x,i) in tableData[1]" :key="i">
									<u-tr>
										<u-td class="th" width="20%">{{x.LineName}}</u-td>
										<u-td class="th left" width="35%">{{x.MaterialName}}</u-td>
										<u-td class="th blue" width="15%">{{x.PlanQty}}</u-td>
										<u-td class="th" width="15%">{{x.ProducedQty}}</u-td>
										<u-td class="th" width="15%">{{x.ConfirmQty}}</u-td>
									</u-tr>
								</view>
								<view>
									<u-loadmore :status="status[1]" :load-text="loadText[1]" @loadmore="loadmore(1)"
										color="#3e82f9" />
								</view>
								<to-top :toTop='toTop[1]' @handletotop='handletotop(1)'></to-top>
							</scroll-view>
						</u-table>
					</view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item " @touchmove.stop>
				<view class="scroll">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td class="th" width="20%">线别</u-td>
									<u-td class="th" width="35%">品名</u-td>
									<u-td class="th" width="15%">计划</u-td>
									<u-td class="th" width="15%">报工</u-td>
									<u-td class="th" width="15%">确认</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContent">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y @scroll='scrollPage' :scroll-top="scrollTop[2]"
								@scrolltolower="loadmore(2)">
								<view v-for="(x,i) in tableData[2]" :key="i">
									<u-tr>
										<u-td class="th" width="20%">{{x.LineName}}</u-td>
										<u-td class="th left" width="35%">{{x.MaterialName}}</u-td>
										<u-td class="th blue" width="15%">{{x.PlanQty}}</u-td>
										<u-td class="th" width="15%">{{x.ProducedQty}}</u-td>
										<u-td class="th" width="15%">{{x.ConfirmQty}}</u-td>
									</u-tr>
								</view>
								<view>
									<u-loadmore :status="status[2]" :load-text="loadText[2]" @loadmore="loadmore(2)"
										color="#3e82f9" />
								</view>
								<to-top :toTop='toTop[2]' @handletotop='handletotop(2)'></to-top>
							</scroll-view>
						</u-table>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<u-select v-model="dialogOrganzie" :list='organizeDatas' @confirm="confirmOrganizeValue"> </u-select>
		<u-select v-model="dialogProcess" :list='processs' @confirm="confirmProcessValue"> </u-select>
		<u-top-tips ref="uToast"></u-top-tips>
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	import toTop from '@/common/toTop.vue';
	import formatDate from '@/common/formatDate.js';
	export default {
		components: {
			toTop
		},
		data() {
			return {
				list: [{
					tabName: '昨日任务'
				}, {
					tabName: '今日任务'
				}, {
					tabName: '明天任务'
				}],
				current: 0,
				swiperCurrent: 0,
				organizeDatas: [],
				dialogOrganzie: false,
				searchForm: [{
					MFGOrganizeName: '',
					ProcessID: '',
					ProcessName: '全部工序',
					MFGOrganizeID: '',
					PlanDay: []
				}, {
					MFGOrganizeName: '',
					ProcessID: '',
					ProcessName: '全部工序',
					MFGOrganizeID: '',
					PlanDay: []
				}, {
					MFGOrganizeName: '',
					ProcessID: '',
					ProcessName: '全部工序',
					MFGOrganizeID: '',
					PlanDay: []
				}],
				tableData: [
					[],
					[],
					[]
				],
				status: ['loadmore', 'loadmore', 'loadmore'],
				loadText: [{
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '我也是有底线的哦~'
				}, {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '我也是有底线的哦~'
				}, {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '我也是有底线的哦~'
				}],
				toTop: [false, false, false],
				scrollTop: [0, 0, 0],
				old: [{
					scrollTop: 0
				}, {
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
				}, {
					pageIndex: 1,
					pageSize: 40,
					pageTotal: 0
				}],
				isDisabled: true,
				ifOnShow: false,
				processs: [],
				dialogProcess: false,
				userInfo: {}
			}
		},
		onLoad() {
			this.tableData[0] = [];
			this.tableData[1] = [];
			this.tableData[2] = [];
			this.setList()
		},
		mounted() {

		},
		onShow() {
			if (this.ifOnShow) {
				this.tableData[0] = [];
				this.tableData[1] = [];
				this.tableData[2] = [];
				this.loadData(this.searchForm[this.current], this.current);
			}
		},
		onHide() {
			this.ifOnShow = true;
		},
		methods: {
			// 获取工序
			getProcessData() {
				this.processs = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 6659
					}
				}).then(res => {
					if (res.data.result) {

						res.data.data.forEach(m => {
							this.processs.push({
								label: m.ProcessName,
								value: m.ProcessID
							})
						})
						this.processs.unshift({
							label: '全部工序',
							value: ''
						});
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 渲染数据
			setList() {
				this.tableData[0] = [];
				this.tableData[1] = [];
				this.tableData[2] = [];
				this.userInfo = this.$store.getters.userInfo;
				this.searchForm[0].PlanDay = [formatDate.formatOldDate(), formatDate.formatOldDate()];
				this.searchForm[1].PlanDay = [formatDate.formatTodayDate(), formatDate.formatTodayDate()];
				this.searchForm[2].PlanDay = [formatDate.formatTommorowDate(), formatDate.formatTommorowDate()];
				this.getOrganizeData();
				this.getProcessData();
			},
			// 切换标签页
			changeTab(index) {
				this.swiperCurrent = index;
				// this.current = index;
				if (this.tableData[index].length == 0) {
					this.loadData(this.searchForm[index], index);
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
			dataSearch(index) {
				this.$set(this.tableData,index,[]);
				this.pagination[index].pageIndex = 1;
				this.loadData(this.searchForm[index], index);
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
			// 调整计划
			changePlan(index) {
				uni.navigateTo({
					url: './plan?data=' + JSON.stringify(this.searchForm[this.swiperCurrent])
				})
			},
			// 获取数据
			loadData(form, index) {
				form["page"] = this.pagination[index].pageIndex;
				form["rows"] = this.pagination[index].pageSize;
				form["dicID"] = 6709;
				let newForm = JSON.parse(JSON.stringify(form));
				if (!newForm.ProcessID) {
					newForm.ProcessName = '';
				}
				this.$request.post({
					url: '/APSAPI/APSData',
					data: newForm
				}).then(res => {
					if (res.data.result) {
						let Data = res.data.data;
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
			// 打开工序
			openProcess() {
				this.dialogProcess = true;
			},
			// 确认工序
			confirmProcessValue(val) {
				if (val[0].value) {
					let index = this.processs.findIndex(m => {
						return m.value == val[0].value;
					});
					this.searchForm[this.swiperCurrent].ProcessName = this.processs[index].label;
					this.searchForm[this.swiperCurrent].ProcessID = this.processs[index].value;
				} else {
					this.searchForm[this.swiperCurrent].ProcessName = val[0].label;
					this.searchForm[this.swiperCurrent].ProcessID = '';
				}
				this.dataSearch(this.swiperCurrent);
			},
			openOrganzie() {
				this.dialogOrganzie = true;
			},
			// 确认工序
			confirmOrganizeValue(val) {
				if (val[0].value) {
					let index = this.organizeDatas.findIndex(m => {
						return m.value == val[0].value;
					});
					this.searchForm[this.swiperCurrent].MFGOrganizeName = this.organizeDatas[index].label;
					this.searchForm[this.swiperCurrent].MFGOrganizeID = this.organizeDatas[index].value;
				} else {
					this.searchForm[this.swiperCurrent].MFGOrganizeName = val[0].label;
					this.searchForm[this.swiperCurrent].MFGOrganizeID = '';
				}

				this.dataSearch(this.swiperCurrent);
			},
			// 获取分厂数据
			getOrganizeData() {
				this.organizeDatas = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 36,
						OrganizeTypeID: 2,
						Status: 1
					}
				}).then(res => {
					if (res.data.result) {
						res.data.data.forEach(x => {
							this.organizeDatas.push({
								label: x.OrganizeName,
								value: x.OrganizeID
							});
							if (x.OrganizeID == this.userInfo.MFGOrganizeID) {
								this.searchForm.forEach(y => {
									y.MFGOrganizeID = x.OrganizeID;
									y.MFGOrganizeName = x.OrganizeName;
								})
							}
						})
						this.loadData(this.searchForm[0], 0);
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

<style lang="scss" scoped>
	::v-deep .u-tabs-item {
		line-height: 2rem !important;
		height: 2rem !important;
		font-size: 1.25rem !important;
		padding: 0 !important;
		color: #151515 !important;
	}
</style>
