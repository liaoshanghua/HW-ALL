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
				<u-row>
					<u-col span="4">
						<u-input type="text" placeholder="单据号" v-model="searchForm[current].AbnormalNo"
							@click="openOrganzie" border></u-input>
					</u-col>
					<u-col span="4">
						<u-input type="select" disabled placeholder="日期" v-model="searchForm[current].BadDate"
							@click="openDay" border></u-input>
					</u-col>
					<u-col span="4" class="twoRow-two flexSpaceBet">
						<view>
							<u-button type="search" size="mini" @click="dataSearch(current)">查询</u-button>
						</view>
						<view>
							<u-button type="reset" size="mini" @click="dataset(current)">重置</u-button>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
			class="contentSeven">
			<swiper-item class="swiper-item " @touchmove.stop v-for="(item,s) in 4" :key="s">
				<view class="scroll">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td v-for="(item,i) in tableHeader[0]" :key="i" class="th" :width="item.width">
										{{item.label}}
									</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContent">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y @scroll='(e)=>scrollPage(e,s)'
								:scroll-top="scrollTop[s]" @scrolltolower="loadmore(s)">
								<view v-for="(x,i) in tableData[s]" :key="i">
									<u-tr :style="{'background':x.isRow?'#4cffff':'#fff'}">
										<u-td v-for="(w,e) in tableHeader[0]" :key="e" :class="(w.class?w.class:'th')"
											:width="w.width"
											:style="{'color':w.color,'textAlign':w.textAlign?w.textAlign:'center'}">
											<span v-if="w.methods && w.isMethods(x)" class="alinkOrange"
												@click="toPage(w.methods,x,i)">
												{{x[w.prop]}}
											</span>
											<span v-else-if="w.render">{{ w.render(x)}}</span>
											<span v-else>{{x[w.prop]}}</span>
										</u-td>
									</u-tr>
								</view>
								<view>
									<u-loadmore :status="status[s]" :load-text="loadText[s]" @loadmore="loadmore[s]"
										color="#3e82f9" />
								</view>
								<to-top :toTop='toTop[s]' @handletotop='handletotop[s]'></to-top>
							</scroll-view>
						</u-table>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<u-picker v-model="dialogDay" model='tiem' :parmas="{year:true,month:true,day:true}" @confirm="confirmDayValue">
		</u-picker>
		<u-top-tips ref="uToast"></u-top-tips>
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
				list: [{
					tabName: '全部'
				}, {
					tabName: '草稿'
				}, {
					tabName: '已结案'
				}],
				current: 0,
				swiperCurrent: 0,
				organizeDatas: [],
				dialogDay: false,
				dialogProcess: false,
				searchForm: [{
					AbnormalNo: '',
					BadDate: '',
					AbnormalStatus: [1, 2, 3, 4],
					sort: 'CreatedOn desc',
					CreatedByName: '',
					dicID: 7780
				}, {
					AbnormalNo: '',
					BadDate: '',
					AbnormalStatus: 0,
					sort: 'CreatedOn desc',
					CreatedByName: '',
					dicID: 7780
				}, {
					AbnormalNo: '',
					BadDate: '',
					AbnormalStatus: '5',
					sort: 'CreatedOn desc',
					CreatedByName: '',
					dicID: 7780
				}],
				tableHeader: [
					[{
							label: '日期',
							prop: 'BadDate',
							width: "15%",
							render: (row) => {
								if (row.BadDate) {
									return row.BadDate.substring(5, 10)
								}
							}
						},
						{
							label: '单号',
							prop: 'AbnormalNo',
							width: "35%",
							textAlign: 'left'
						},
						{
							label: '数量',
							prop: 'BadQty',
							width: "15%",
						}, {
							label: '提报人',
							prop: 'CreatedByName',
							width: "15%",
							methods: 'toDraft',
							isMethods: (row) => {
								if (_this.current == 1 && row.CreatedByName == _this.userInfo.Name) {
									return true
								} else {
									return false
								}
							},
						}, {
							label: '当前环节',
							prop: 'AbnormalStatus',
							width: "20%",
							render: (row) => {
								if (row.AbnormalStatus == 0) {
									return '草稿'
								} else if (row.AbnormalStatus == 1) {
									return '工艺待审'
								} else if (row.AbnormalStatus == 2) {
									return '巡检待审'
								} else if (row.AbnormalStatus == 3) {
									return '经理待审'
								} else if (row.AbnormalStatus == 4) {
									return '仓管待审'
								} else if (row.AbnormalStatus == 5) {
									return '已结案'
								}
							}
						}
					],
					[],
					[]
				],
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
				userInfo: {}
			}
		},
		onLoad() {
			_this = this;
			this.tableData[0] = [];
			this.tableData[1] = [];
			this.tableData[2] = [];
			this.userInfo = this.$store.getters.userInfo;
			this.searchForm.forEach(a => {
				a.CreatedByName = this.userInfo.Name;
			})
			this.loadData(this.searchForm[0], 0);
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
			// 监听头部按钮事件
			onNavigationBarButtonTap(e) {
				uni.navigateTo({
					url: "./newBadProductDetails_2"
				});
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
				this.$set(this.tableData, index, []);
				this.pagination[index].pageIndex = 1;
				this.loadData(this.searchForm[index], index);
			},
			// 重置
			dataset(val) {
				this.searchForm[val].CreatedOn = '';
				this.searchForm[val].AbnormalNo = '';
			},
			// 滑到顶部
			handletotop(index) {
				this.$set(this.toTop, index, false);
				this.$set(this.scrollTop, index, this.old[index].scrollTop);
				this.$nextTick(() => {
					this.$set(this.scrollTop, index, 0);
				});
			},
			// 页面滚动
			scrollPage(e, index) {
				this.old[index].scrollTop = e.detail.scrollTop;
				if (e.detail.scrollTop > 0.8) {
					this.toTop[index] = true;
				} else {
					this.toTop[index] = false;
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
				let newForm = JSON.parse(JSON.stringify(form));
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
			openDay() {
				this.dialogDay = true;
			},
			confirmDayValue(val) {
				let date = val.year + '-' + val.month + '-' + val.day;
				this.$set(this.searchForm[this.current], 'CreatedOn', date);
			},
			toPage(methods, row, index) {
				this[methods](row, index)
			},
			toDraft(row, index) {
				// this.$set(row, 'isTag', 1);
				// this.$set(row, 'NoAduit', true);
				// this.$store.commit('setting/badProductDetails_2_draft', row);
				// uni.navigateTo({
				// 	url: './newBadProductDetails_2_draft'
				// })

				this.$set(row, 'isTag', 1);
				this.$store.commit('setting/badProductDetails_2_draft', row);
				this.$store.commit('setting/bad_tag', 0);
				uni.navigateTo({
					url: './new_bad_2_2'
				})

			},
			// 去审核界面
			toBadDetails(row, index) {
				// 判断能审核的角色 先空着	
				this.$set(row, 'NoAduit', false);
				this.$store.commit('setting/badProductDetails_2_draft', row);
				uni.navigateTo({
					url: './newBadProductDetails_2_draft'
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
