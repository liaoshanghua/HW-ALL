<template>
	<view class="container_nopadding" :style="{height:height + 'px'}">
		<view class="sticky">
			请填写，提交后不能修改哦！
		</view>
		<view class="contentFour">
			<view class="scroll">
				<view class="tableHeaderTwo">
					<u-table class="table">
						<view>
							<u-tr>
								<u-td class="th" width="40%">品名</u-td>
								<u-td class="th" width="30%">未完成</u-td>
								<u-td class="th" width="30%">数量</u-td>
							</u-tr>
						</view>
					</u-table>
				</view>
				<view class="tableContentTwo">
					<u-table class="table">
						<scroll-view class="scroll" scroll-y @scroll='scrollPage' :scroll-top="scrollTop">
							<view v-for="(x,i) in tableData" :key="i">
								<u-tr>
									<!-- <u-td class="th left flex" width="60%">{{x.Spec}}<span class="red">{{x.OweQty}}</span></u-td> -->
									<u-td class="th left flex" width="40%">{{x.MaterialName}}</u-td>
									<u-td class="th  red" width="30%">{{x.OweQty}}</u-td>
									<u-td class="th bgOrange" width="30%">
										<input v-model="x.ProducedQty" type="number"></input>
									</u-td>
								</u-tr>
							</view>
							<to-top :toTop='toTop' @handletotop='handletotop'></to-top>
						</scroll-view>
					</u-table>
				</view>
			</view>

		</view>
		<view class="footerThree">
			<view class="">
				人员：
			</view>
			<view class="text" v-for="(x,y) in peopleData">
				{{x.Name}}
			</view>
		</view>
		<view class="footer">
			<u-button type="warning" size="medium" @click="toPage">生产人员</u-button>
			<u-button type="searchFooter" size="medium" @click="submit">提交</u-button>
		</view>
		<u-top-tips ref="uToast"></u-top-tips>
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
				peopleData: [],
				ifOnShow: false,
				height: ''
			}
		},
		onShow() {
			if (this.ifOnShow) {
				this.peopleData = this.$store.getters.peopleData;
				this.tableData = this.$store.getters.searchForm;
			}
		},
		onHide() {
			this.ifOnShow = true;
		},
		onLoad() {
			_this = this;
			this.height = uni.getSystemInfoSync().windowHeight;
			let newData = this.$store.getters.searchForm;
			newData.forEach(x => {
				x.ProducedQty = null;
			})
			this.tableData = newData;
			this.peopleData = [];
			// this.loadData(this.searchForm);
		},
		mounted() {},
		computed: {},
		watch: {},
		methods: {
			// 跳转至选择人员页面
			toPage() {
				uni.navigateTo({
					url: './selectPeople'
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
			// 报工数不能大于欠数
			isOutNum(row, val) {
				if (parseFloat(val) > parseFloat(row.OweQty)) {
					this.$refs.uToast.show({
						title: '报工数不能大于欠数！',
						type: 'error',

					})
					row.ProducedQty = null;
				}
			},
			// 提交报工数
			submit() {
				let _self = this;
				let newData = [];
				if (_self.tableData.length != 0) {
					_self.tableData.forEach(x => {
						if (parseFloat(x.ProducedQty) > 0) {
							x.Status = 1;
							x.dicID = 6704;
							x["ProducedDate"] = formatDate.formatTodayDate();
							x["childrens"] = _self.peopleData;
							newData.push(x)
						}
					})
				} else {
					_self.$refs.uToast.show({
						title: '暂无可提交的数据！',
						type: 'error',

					})
				}
				if (newData.length == 0) {
					_self.$refs.uToast.show({
						title: '暂无可提交的数据，请检查是否填写了报工数量！',
						type: 'error',

					})
				} else {
					uni.showModal({
						title: '提示',
						content: '确认是否提交已填写的报工数？报工数未填写或0的不会提交哦！',
						success: function(res) {
							if (res.confirm) {
								_self.saveData(newData);
								_self.$store.commit('setting/SetPeopleData', []);
							} else if (res.cancel) {
								return;
							}

						}
					});
				}


			},
			// 保存提交的数据
			saveData(newData) {
				let flag = 0;
				this.$request.post({
					url: '/APSAPI/SaveData',
					data: newData
				}).then(function(res) {
					if (res.data.result) {
						let pages = getCurrentPages(); // 当前页面
						let delta = 1;
						pages.some((x, i) => {
							if (x.route == "pages/pages/productionDetails") {
								delta = i + 1;
								return true
							}
						})
						let beforePage = pages.length - delta;
						if (_this.peopleData.length != 0) {
							delta = beforePage;
						}
						uni.navigateBack({
							delta: delta,
							success: function() {
								// beforePage.$vm.refreshRequest(); // 执行前一个页面的刷新
							}
						});
					} else {
						_this.$refs.uToast.show({
							type: 'error',
							title: res.data.msg,

						})
					}
				})
			}
		}
	}
</script>
