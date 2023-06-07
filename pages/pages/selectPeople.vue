<template>
	<!-- @touchmove.stop  禁止滑动 -->
	<view class="container_nopadding" :style="{height:height + 'px'}">
		<view class="head">
			<view class="head-one">
				<u-row>
					<u-col span="12">
						<u-input type="text" disabled placeholder="选择线" v-model="searchForm.OrganizeName" @click="openLine" border></u-input>
					</u-col>
				</u-row>
			</view>
			<view class="head-two">
				<u-row>
					<u-col :span="8" class="twoRow-one">
						<view class="icon-searchOne">
						</view>
						<u-input type="text" placeholder="搜索名字" v-model="searchForm.Name" border></u-input>
					</u-col>
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
		</view>
		<view class="content">
			<view class="tableHeader">
				<u-table class="table">
					<view>
						<u-tr>
							<u-td class="th" width="45%">账号</u-td>
							<u-td class="th" width="45%">名字</u-td>
							<u-td class="th" width='10%'>
								<u-checkbox v-model="allSelect" @click.native="seelctAll"></u-checkbox>
							</u-td>
						</u-tr>
					</view>
				</u-table>
			</view>
			<view class="tableContent">
				<u-table class="table">
					<scroll-view class="scroll" scroll-y @scroll='scrollPage' :scroll-top="scrollTop" @scrolltolower="loadmore">
						<view v-for="(x,i) in tableData" :key="i">
							<u-tr>
								<u-td class="th" width="45%">{{x.Account}}</u-td>
								<u-td class="th" width="45%">
									{{x.Name}}
								</u-td>
								<u-td class="th" width='10%'>
									<u-checkbox v-model="x.isChecked" @change="countNum(x,x.isChecked)"></u-checkbox>
								</u-td>
							</u-tr>
						</view>
						<view>
							<u-loadmore :status="status" :load-text="loadText" @loadmore="loadmore" color="#3e82f9" />
						</view>
						<to-top :toTop='toTop' @handletotop='handletotop'></to-top>
					</scroll-view>
				</u-table>
			</view>
		</view>
		<view class="footerTwo">
			<view class="icon-addPeople" @click="openPop">
				<u-badge type="error" :count="count" class="badge"></u-badge>
			</view>
			<u-button type="searchFooter" size="medium" @click="sure">确定</u-button>
		</view>

		<u-select v-model="dialogLine" :list='lines' @confirm="sureLine"> </u-select>

		<u-popup v-model="popDialog" mode="right" border-radius="14">
			<u-card title="报工人员">
				<view class="" slot="body">
					<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0 card" v-for="(x,y) in realData" :key="y">
						<view class="text">
							{{x.Account}}
						</view>
						<view>
							{{x.Name}}
						</view>
						<view class="icon-taskCancel" @click="delRow(x,y)">
						</view>
					</view>
				</view>
			</u-card>
		</u-popup>

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
				popDialog: false,
				count: 0,
				allSelect: false,
				lines: [],
				dialogLine: false,
				searchForm: {
					OrganizeName: '',
					OrganizeID: '',
					Name: ""
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
				selectData: [],
				realData: [],
				height: ''
			}
		},
		onLoad() {
			this.height = uni.getSystemInfoSync().windowHeight;
		},
		mounted() {

		},
		onShow() {
			this.tableData = [];
			this.getLineData();
		},
		methods: {
			// 打开人员购物车人
			openPop() {
				this.popDialog = true;
			},
			// 添加人
			countNum(row, val) {
				this.$set(row, 'isChecked', !val);
				let newIndex = this.realData.findIndex(x => {
					return x.Account == row.Account
				});
				if (row.isChecked && newIndex == -1) {
					this.realData.push(row);
				} else if (!row.isChecked) {
					this.realData.splice(newIndex, 1);
				}
				this.count = this.realData.length;
			},
			// 删除人
			delRow(row, index) {
				let newIndex = this.tableData.findIndex(x => {
					return x.Account == row.Account
				});
				if (newIndex != -1) {
					this.$set(this.tableData[newIndex], 'isChecked', false);
				}
				this.realData.splice(index, 1);
				this.count = this.realData.length;
			},
			// 查询
			dataSearch() {
				this.tableData = [];
				this.pagination.pageIndex = 1;
				this.loadData(this.searchForm);
			},
			// 重置
			dataReset() {
				for (var name in this.searchForm) {
					this.searchForm[name] = null;
				}
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
				form["dicID"] = 25;
				let newForm = JSON.parse(JSON.stringify(form));
				this.$request.post({
					url: '/APSAPI/APSData',
					data: newForm
				}).then(res => {
					if (res.data.result) {
						let Data = res.data.data;
						Data.forEach(x => {
							this.$set(x, 'isChecked', false);
						})
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
			// 获取线
			getLineData() {
				this.lines = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 36,
						OrganizeTypeID: 6,
						Status:1
					}
				}).then(res => {
					if (res.data.result) {
						res.data.data.forEach(m => {
							this.lines.push({
								label: m.OrganizeName,
								value: m.OrganizeID
							})
						})
						this.searchForm.OrganizeName = this.$store.getters.ProductionLine.LineName;
						this.searchForm.OrganizeID = this.$store.getters.ProductionLine.LineID;
						this.loadData(this.searchForm);
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 打开线
			openLine() {
				if (!this.tagDisabled) {
					this.dialogLine = true;
				}
			},
			// 确认线
			sureLine(val) {
				let index = this.lines.findIndex(m => {
					return m.value == val[0].value;
				});
				this.searchForm.OrganizeName = this.lines[index].label;
				this.searchForm.OrganizeID = this.lines[index].value;
				this.loadData(this.searchForm);
			},
			// 全部选中
			seelctAll(e) {
				if (this.tableData.length != 0 && this.allSelect) {
					this.tableData.forEach(m => {
						if (!m.isChecked) {
							this.$set(m, 'isChecked', true);
						}
					})
					this.getSelectData(0);
				} else if (this.tableData.length != 0) {
					this.tableData.forEach(m => {
						if (m.isChecked) {
							this.$set(m, 'isChecked', false);
						}
					})

					this.getSelectData(1);
				}
			},
			// 保存
			sure() {
				let newData = [];
				if (this.realData.length != 0) {
					this.realData.forEach(x => {
						var obj = {};
						obj["dicID"] = 6710;
						obj["Account"] = x.Account;
						obj["Name"] = x.Name;
						newData.push(obj)
					})
				}
				this.$store.commit('setting/SetPeopleData', newData);
				uni.navigateBack({
					url: './editProduction'
				})
			},
			// 获取选中的数据
			getSelectData(val) {
				if (val == 0) {
					this.selectData = [];
					this.tableData.forEach(x => {
						if (x.isChecked) {
							x.Status = val;
							x.dicID = 6710;
							this.selectData.push(x);
						}
					})
					if (this.realData.length == 0) {
						this.realData = this.selectData;
					} else {
						this.selectData.forEach(x => {
							if (this.realData.findIndex(y => {
									return y.Account == x.Account
								}) == -1) {
								this.realData.push(x);
							}
						})
					}
				} else {
					this.tableData.forEach(x => {
						let newIndex2 = this.realData.findIndex(y => {
							return y.Account == x.Account
						});
						if (newIndex2 != -1) {
							this.realData.splice(newIndex2, 1);
						}

					})
				}

				this.count = this.realData.length;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.icon-addPeople {
		width: 3rem;
		height: 2rem;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		position: relative;

		.badge {
			position: absolute;
			top: -8rpx !important;
			right: -14rpx !important;
		}
	}

	::v-deep .u-card {
		margin: 10rpx !important;
	}

	.card {
		margin: 1.4rem 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.text {
		margin: 0 10rpx;
		font-size: 1.25rem;
	}

	.icon-taskCancel {
		width: 1.8rem;
		height: 1.8rem;
		background-size: 100% 100%;
		margin: 0 0.6rem;
	}
</style>
