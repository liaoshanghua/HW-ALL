<template>
	<!-- @touchmove.stop  禁止滑动 -->
	<view class="container_nopadding">
		<view class="head">
			<view class="head-one">
				<u-row>
					<u-tabs-swiper ref="uTabs" name="tabName" :list="list" :current="current" @change="changeTab" :is-scroll="false"
					 active-color="#3e82f9 !important" inactive-color="#3e82f9"></u-tabs-swiper>
				</u-row>
			</view>
			<view class="head-one">
				<u-row>
					<u-col span="4">
						<u-input type="text" placeholder="选择工序" v-model="searchForm[current].ProcessName" @click="openProcess" disabled
						 border></u-input>
					</u-col>
					<u-col span="4">
						<u-input type="text" placeholder="产品名称" v-model="searchForm[current].MaterialName" border></u-input>
					</u-col>
					<u-col span="4" class="twoRow-two flexSpaceBet">
						<view>
							<u-button type="search" size="mini" @click="dataSearch">查询</u-button>
						</view>
						<view>
							<u-button type="reset" size="mini" @click="dataReset">重置</u-button>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="contentSeven">
			<swiper-item class="swiper-item " @touchmove.stop v-for="(item,y) in 7" :key="y">
				<view class="scroll">
					<scroll-view class="scroll" scroll-y scroll-x @scroll='scrollPage' :scroll-top="scrollTop[y]" @scrolltolower="loadmore(y)">
						<table class="tableTwo" cellspacing="0" cellpadding="0">
							<thead class="thead-head">
								<tr>
									<th class="th stickyTop3" style="min-width: 100px;">品名</th>
									<th class="th stickyTop" style="min-width: 70px;">确认数</th>
									<th class="th stickyTop" style="min-width: 90px;">报工</th>
									<th class="th stickyTop" style="min-width: 90px;">审批日期</th>
									<th class="th stickyTop" style="min-width: 70px;">状态</th>
									<th class="th stickyTop" style="min-width: 160px;">生产人员</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(x,i) in tableData[y]" :key="i">
									<td class="td stickyLeft" style="min-width: 100px;">{{x.MaterialName}}</td>
									<td class="td  blue" style="min-width: 70px;">{{x.ConfirmQty}}</td>
									<td class="td" style="min-width: 90px;">{{x.CreatedByName}}({{x.ProducedQty}})</td>
									<td class="td" style="min-width: 90px;">{{x.ModifyedOn}}</td>
									<td style="min-width: 70px;" :class="x.Status==1?'bgYellow td':x.Status == 25?'bgBlue td':x.Status == 2?'bgGreen th':'bgRed td'">{{x.Status==1?'待审':x.Status == 25?'已审':x.Status == 2?'完成':'草稿'}}</td>
									<td class="td" style="min-width: 160px;">{{x.Peoples}}</td>
								</tr>
							</tbody>
							<view>
								<u-loadmore :status="status[y]" :load-text="loadText[y]" @loadmore="loadmore(y)" color="#3e82f9" />
							</view>
							<to-top :toTop='toTop[y]' @handletotop='handletotop(y)'></to-top>
						</table>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
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
				list: [],
				current: 0,
				swiperCurrent: 0,
				processs: [],
				dialogProcess: false,
				searchForm: [{
					LineID: '',
					MFGOrganizeID: '',
					ProducedDate: [],
					MaterialName: '',
					ProcessID: "",
					ProcessName: '全部工序'
				}, {
					LineID: '',
					MFGOrganizeID: '',
					ProducedDate: [],
					MaterialName: '',
					ProcessID: "",
					ProcessName: '全部工序'
				}, {
					LineID: '',
					MFGOrganizeID: '',
					ProducedDate: [],
					MaterialName: '',
					ProcessID: "",
					ProcessName: '全部工序'
				}, {
					LineID: '',
					MFGOrganizeID: '',
					ProducedDate: [],
					MaterialName: '',
					ProcessID: "",
					ProcessName: '全部工序'
				}, {
					LineID: '',
					MFGOrganizeID: '',
					ProducedDate: [],
					MaterialName: '',
					ProcessID: "",
					ProcessName: '全部工序'
				}, {
					LineID: '',
					MFGOrganizeID: '',
					ProducedDate: [],
					MaterialName: '',
					ProcessID: "",
					ProcessName: '全部工序'
				}, {
					LineID: '',
					MFGOrganizeID: '',
					ProducedDate: [],
					MaterialName: '',
					ProcessID: "",
					ProcessName: '全部工序'
				}],
				tableData: [
					[],
					[],
					[],
					[],
					[],
					[],
					[]
				],
				status: ['loadmore', 'loadmore', 'loadmore', 'loadmore', 'loadmore', 'loadmore', 'loadmore'],
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
				}, {
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
				}, {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '我也是有底线的哦~'
				}],
				toTop: [false, false, false, false, false, false, false],
				scrollTop: [0, 0, 0],
				old: [{
					scrollTop: 0
				}, {
					scrollTop: 0
				}, {
					scrollTop: 0
				}, {
					scrollTop: 0
				}, {
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
				}, {
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
				}, {
					pageIndex: 1,
					pageSize: 40,
					pageTotal: 0
				}],
				isDisabled: true,
				ifOnShow: false,
				peopleData: '',
				currentRow: '',
				dialogProcess: false,
				processs: []
			}
		},
		onLoad() {
			let userInfo = this.$store.getters.userInfo;
			for (var i = 0; i < 7; i++) {
				let date = new Date();
				let newDate = date.setDate(date.getDate() - i);
				newDate = new Date(newDate)
				let year = newDate.getFullYear();
				let month = this.zero(newDate.getMonth() + 1);
				let day = this.zero(newDate.getDate());
				let listName = year + '-' + month + '-' + day;
				let listName2 = month + '-' + day;
				this.list.push({
					tabName: listName2
				})
				this.searchForm[i].ProducedDate = [listName, listName];
				this.searchForm[i].MFGOrganizeID = userInfo.MFGOrganizeID;
				if (userInfo.Account == 'admin') {
					this.searchForm[i].LineID = '';
				} else {
					this.searchForm[i].LineID = userInfo.OrganizeID;
				}
			}
			this.getProcessData();
			this.loadData(this.searchForm[0], 0);
		},
		mounted() {

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
			// 补0
			zero(num) {
				if (parseInt(num) < 10) {
					return '0' + num
				} else {
					return num
				}
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
			dataSearch() {
				this.$set(this.tableData,this.current,[]);
				this.pagination[this.current].pageIndex = 1;
				this.loadData(this.searchForm[this.current], this.current);
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
				form["dicID"] = 6704;
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-tabs-item {
		line-height: 2rem !important;
		height: 2rem !important;
		font-size: 1.25rem !important;
		padding: 0 !important;
		margin: 0 20rpx;
		color: #151515 !important;
	}
</style>
