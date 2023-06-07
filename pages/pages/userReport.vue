<template>
	<!-- @touchmove.stop  禁止滑动 -->
	<view class="container_nopadding">
		<view class="head">
			<view class="head-one">
				<view style="border:1px solid #dcdfe6;border-radius: 4px;display: flex;padding: 0 4rpx;margin:0 12rpx;">
					<u-input type="text" disabled placeholder="选择人员" v-model="searchForm.ProducedDate[0]"
						@click="openDay(0)"></u-input>
					<view class="">
						-
					</view>
					<u-input type="select" disabled placeholder="=日期范围" v-model="searchForm.ProducedDate[1]"
						@click="openDay(1)"></u-input>
				</view>
			</view>
			<view class="head-one">
				<u-row>
					<u-col span="8">
						<u-input type="text" disabled placeholder="选择人员" v-model="searchForm.Name" @click="openAccount"
							disabled border></u-input>
					</u-col>
					<u-col span="4" class="twoRow-two flexSpaceBet">
						<view>
							<u-button type="search" size="mini" @click="dataSearch">查询</u-button>
						</view>
						<view>
							<u-button type="reset" size="mini" @click="dataset">重置</u-button>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>

		<view class="scroll contentSeven">
			<scroll-view class="scroll" scroll-y scroll-x @scroll='scrollPage' :scroll-top="scrollTop"
				@scrolltolower="loadmore">
				<table class="tableTwo" cellspacing="0" cellpadding="0">
					<thead class="thead-head">
						<tr>
							<th class="th stickyTop3" style="min-width: 100px;">日期</th>
							<!-- <th class="th stickyTop" style="min-width: 70px;">姓名</th> -->
							<th class="th stickyTop" style="min-width: 100px;">产品</th>
							<!-- <th class="th stickyTop" style="min-width: 70px;">工序</th> -->
							<th class="th stickyTop" style="min-width: 50px;">报工数</th>
							<th class="th stickyTop" style="min-width: 50px;">确认数</th>
							<th class="th stickyTop" style="min-width: 50px;">审核人</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(x,i) in tableData" :key="i">
							<td class="td stickyLeft" style="min-width: 100px;">{{x.ProducedDate}}</td>
							<!-- <td class="td" style="min-width: 70px;">{{x.Name}}</td> -->
							<td class="td" style="min-width: 100px;">{{x.MaterialName}}</td>
							<!-- <td class="td" style="min-width: 70px;">{{x.ProcessName}}</td> -->
							<td class="td" style="min-width: 50px;">{{x.ProducedQty}}</td>
							<td class="td blue" style="min-width: 50px;">{{x.ConfirmQty}}</td>
							<td class="td" style="min-width: 50px;">{{x.Approvals}}</td>
						</tr>
					</tbody>
				</table>
				<view>
					<u-loadmore :status="status" :load-text="loadText" @loadmore="loadmore" color="#3e82f9" />
				</view>
				<to-top :toTop='toTop' @handletotop='handletotop'></to-top>
				</table>
			</scroll-view>
		</view>

		<u-select v-model="dialogAccount" :list='accountDatas' @confirm="confirmOrganizeValue"> </u-select>
		<u-picker v-model="dialogProducedDate" mode="time" :params="{year: true,month: true,day:true}"
			@confirm='confirmProducedDate'></u-picker>
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
				tag: 0,
				dialogProducedDate: false,
				accountDatas: [],
				dialogAccount: false,
				dialogProcess: false,
				searchForm: {
					ProducedDate: [],
					CreatedBy: '',
					Name: '',
				},
				tableData: [],
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
				isDisabled: true,
				ifOnShow: false,
				processs: [],
				userInfo: {}
			}
		},
		onLoad() {
			this.tableData = [];
			this.getAccountData();
			this.searchForm.ProducedDate = [formatDate.formatTodayDate(), formatDate.formatTodayDate()];
			this.searchForm.Name = this.$store.getters.userInfo.Name;
			this.loadData(this.searchForm);
		},
		mounted() {

		},
		onShow() {
			if (this.ifOnShow) {
				this.tableData = [];
				this.loadData(this.searchForm);
			}
		},
		onHide() {
			this.ifOnShow = true;
		},
		methods: {
			// 获取人员数据
			getAccountData() {
				this.accountDatas = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 25,
						Account: this.$store.getters.userInfo.Account
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							res.data.data.forEach(m => {
								this.accountDatas.push({
									label: m.Name,
									value: m.Name
								})
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
			// 查询
			dataSearch() {
				this.tableData = [];
				this.pagination.pageIndex = 1;
				this.loadData(this.searchForm);
			},
			// 重置
			dataset(val) {
				this.searchForm.ProducedDate = [];
				this.searchForm.CreatedBy = '';
				this.searchForm.Name = '';

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
			scrolltolower(index) {
				this.loadmore(index);
			},
			// 加载更多
			loadmore(index) {
				this.pagination.pageIndex++;
				this.loadData(this.searchForm, index);
			},
			// 获取数据
			loadData(form) {
				form["page"] = this.pagination.pageIndex;
				form["rows"] = this.pagination.pageSize;
				form["dicID"] = 6726;
				this.$request.post({
					url: '/APSAPI/APSData',
					data: form
				}).then(res => {
					if (res.data.result) {
						let Data = res.data.data;
						if (Data.length > 0) {
							if (Data.length < 40) {
								this.status = 'nomore';
							} else {
								this.status = 'loadmore';
							}
							let newData = this.tableData.concat(Data);
							this.$set(this, 'tableData', newData);
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
			openAccount() {
				this.dialogAccount = true;
			},
			confirmOrganizeValue(val) {
				this.searchForm.Name = val[0].value;
				this.dataSearch();
			},
			// 获取分厂数据
			getOrganizeData() {
				this.accountDatas = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 36,
						OrganizeTypeID: 2
					}
				}).then(res => {
					if (res.data.result) {
						res.data.data.forEach(x => {
							this.accountDatas.push({
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
			// 打开日期弹框
			openDay(val) {
				this.tag = val;
				this.dialogProducedDate = true;
			},
			confirmProducedDate(val) {
				let endDate = val.year + '-' + val.month + '-' + val.day;
				let startDate = this.searchForm.ProducedDate[0];
				if (this.tag == 1) {
					if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
						this.$refs.uToast.show({
							title: '结束日期不能在开始日期之前！',
							type: 'error',

						})
						return;
					}
				}
				this.searchForm.ProducedDate[this.tag] = endDate;
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
		color: #151515 !important;
	}
</style>
