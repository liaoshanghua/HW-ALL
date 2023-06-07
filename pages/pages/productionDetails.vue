<template>
	<view class="container_nopadding" :style="{height:height + 'px'}">

		<view class="headTwo">
			<view class="head-one">
				<u-tabs-swiper ref="uTabs" name="tabName" :list="list" :current="current" @change="changeTab"
					:is-scroll="false"></u-tabs-swiper>
			</view>
			<view class="head-one">
				<u-row>
					<u-col :span="4" class="twoRow-one">
						<u-input type="text" v-show="current == 0" placeholder="日期" disabled v-model="ProducedDate"
							border>
						</u-input>
						<u-input type="text" v-show="current == 1" placeholder="日期" disabled
							v-model="searchForm[1].ProducedDate" border></u-input>
						<!-- 	<u-input type="text" v-show="current == 1" placeholder="工序" v-model="searchForm[1].ProcessName"
							disabled border @click="openProcess"></u-input> -->
					</u-col>
					<u-col :span="4" class="twoRow-one">

						<u-input type="text" placeholder="搜索名称" v-model="searchForm[current].MaterialName" border>
						</u-input>
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
									<!-- <u-td class="th" width="15%">工序</u-td> -->
									<u-td class="th" width="50%">品名</u-td>
									<u-td class="th" width="20%">排产数</u-td>
									<u-td class="th" width="20%">欠数</u-td>
									<u-td class="th" width='10%'>
										<u-checkbox v-show="multiple" v-model="allSelect[0]"
											@click.native="seelctAll(0)"></u-checkbox>
										<span v-show="!multiple">单选</span>
									</u-td>
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
										<!-- 	<u-td class="th" width="15%">
											{{x.ProcessName}}
										</u-td> -->
										<u-td class="th left blue" width="50%">
											{{x.MaterialName}}
										</u-td>
										<u-td class="th" width="20%">
											{{x.PlanQty}}
										</u-td>
										<u-td class="th red" width="20%">
											{{x.OweQty}}
										</u-td>
										<u-td class="th" width='10%'>
											<u-checkbox v-if="!multiple" v-model="x.isChecked" @change="onlyOne(x,0)">
											</u-checkbox>
											<u-checkbox v-else v-model="x.isChecked"></u-checkbox>
										</u-td>
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
			<swiper-item class="swiper-item" @touchmove.stop>
				<view class="scroll">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<!-- <u-td class="th" width="15%">工序</u-td> -->
									<u-td class="th" width="24%">品名</u-td>
									<u-td class="th" width="18%">已报工数</u-td>
									<u-td class="th" width="15%">确认数</u-td>
									<u-td class="th" width="18%">已报计时</u-td>
									<u-td class="th" width="15%">提报人</u-td>
									<u-td class="th" width='10%'>
										<!-- <u-checkbox v-show="multiple" v-model="allSelect[1]"
											@click.native="seelctAll(1)"></u-checkbox> -->
									</u-td>
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
										<!-- <u-td class="th" width="15%">{{x.ProcessName}}</u-td> -->
										<u-td class="th left blue" width="24%">{{x.MaterialName}}</u-td>
										<u-td class="th blue" width="18%">{{x.ProducedQty}}</u-td>
										<u-td class="th" width="15%">
											{{x.ConfirmQty}}
										</u-td>
										<u-td class="th" width="18%">
											{{x.TotalHours}}
										</u-td>
										<u-td class="th" width="15%">{{x.CreatedByName}}</u-td>
										<u-td class="th" width='10%'>
											<u-checkbox v-if="!multiple" v-model="x.isChecked" @change="onlyOne(x,1)">
											</u-checkbox>
											<u-checkbox v-else v-model="x.isChecked"></u-checkbox>
										</u-td>
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
		</swiper>
		<view :class="multiple_2?'footer':'footerTwo'" v-show="current == 0">
			<u-button v-show="multiple_2" type="warning" size="medium" @click="addMaterial">添加产品</u-button>
			<u-button type="searchFooter" size="medium" @click="toPage(0)">填写报工</u-button>
		</view>
		<view :class="multiple_2?'footer':'footerTwo'" v-show="current == 1">
			<u-button v-show="multiple_2" type="warning" size="medium" @click="addMaterial">添加产品</u-button>
			<u-button type="searchFooter" size="medium" @click="toPage(1)">再次报工</u-button>
		</view>
		<u-picker v-model="dialogPlanDay" mode="time" :params="{year: true,month: true,day:true}"
			@confirm='confirmPlanDay'></u-picker>
		<u-select v-model="dialogProcess" :list='processs' @confirm="confirmProcessValue"> </u-select>
		<u-popup v-model="addDialog" mode="center" class="popup" :mask-close-able="false" border-radius="10"
			width="98%">
			<view class="dialog_head">
				添加产品
			</view>
			<view class="search_input">
				<span>输入产品信息：</span>
				<u-input type="text" v-model="MaterialName" border size="mini" class="margin_right"></u-input>
				<u-button type="primary" @click="serachMaterial(MaterialName)" size="mini">查询</u-button>
			</view>
			<view class="list">
				<scroll-view>
					<view class="dialogList" v-for="(item, index) in addData" :key="index">
						<u-checkbox :disabled="item.isSelect" v-model="item.checked">{{item.MaterialName}} <span
								class="blue">【工艺：{{item.ProcessGroupName}}]</span></u-checkbox>
					</view>
				</scroll-view>
			</view>
			<view class="dialogFooter">
				<u-button type="info" size="small" @click="addDialog = false">取消</u-button>
				<u-button type="warning" size="small" @click="sureAdd(false)">添加并关闭</u-button>
				<u-button type="primary" size="small" @click="sureAdd(true)">添加</u-button>
			</view>
		</u-popup>

		<u-top-tips ref="uToast"></u-top-tips>
		<u-toast ref="uToast2"></u-toast>
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
				isOut8: false,
				addDialog: false,
				MaterialName: '',
				allSelect: [false, false],
				current: 0,
				swiperCurrent: 0,
				list: [{
					tabName: '待报任务'
				}, {
					tabName: '已报记录'
				}],
				searchForm: [{
					ProcessName: '全部工序',
					ProcessID: '',
					PlanDay: '',
					LineID: '',
					MaterialName: "",
					dicID: '6705'
				}, {
					ProcessName: '全部工序',
					ProcessID: '',
					LineID: '',
					PlanDay: '',
					MaterialName: "",
					dicID: "6704"
				}],
				processs: [],
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
				ifOnShow: false,
				height: '',
				Account: '',
				currentRow: ['', ''],
				multiple: true,
				multiple_2: false,
				dialogProcess: false,
				addData: [],
				processValue: {
					ProcessID: '',
					ProcessName: ''
				},
				userInfo: {},
				currentDay: '',
				oldCurrentDay: '',
				ProducedDate: ''
			}
		},
		onShow() {
			if (this.ifOnShow) {
				// 判断是否超过8:30
				let hour = new Date().getHours();
				let minutes = new Date().getMinutes();
				if (hour < 9) {
					this.ProducedDate = this.oldCurrentDay;
					this.searchForm[1].ProducedDate = this.oldCurrentDay;
				}
				// else if (hour >= 8 && hour < 9 && minutes <= 30) {
				// 	this.ProducedDate = this.oldCurrentDay;
				// 	this.searchForm[1].ProducedDate = this.oldCurrentDay;
				// } 
				else {
					this.ProducedDate = this.currentDay;
					this.searchForm[1].ProducedDate = this.currentDay;
				}
				this.height = uni.getSystemInfoSync().windowHeight;
				this.getNum();
				this.allSelect[0] = false;
				this.allSelect[1] = false;
				this.$set(this.tableData, 0, []);
				this.$set(this.tableData, 1, []);
				this.loadData(this.searchForm[0], 0);
				this.loadData(this.searchForm[1], 1);
			}
		},
		onHide() {
			this.ifOnShow = true;
		},
		onLoad(option) {
			this.currentDay = formatDate.formatTodayDate();
			this.oldCurrentDay = formatDate.formatOldDate();
			// 判断是否超过8:30
			let hour = new Date().getHours();
			let minutes = new Date().getMinutes();
			if (hour < 8) {
				this.ProducedDate = this.oldCurrentDay;
				this.searchForm[1].ProducedDate = this.oldCurrentDay;
			} else if (hour >= 8 && hour < 9 && minutes <= 30) {
				this.ProducedDate = this.oldCurrentDay;
				this.searchForm[1].ProducedDate = this.oldCurrentDay;
			} else {
				this.ProducedDate = this.currentDay;
				this.searchForm[1].ProducedDate = this.currentDay;
			}
			this.height = uni.getSystemInfoSync().windowHeight;
			if (Object.values(option).length > 0) {
				uni.showToast({
					title: option.msg
				})
				this.changeTab(1);
			}
			this.getProcessData();
			this.userInfo = this.$store.getters.userInfo;
			this.Account = this.$store.getters.userInfo.Account;

			this.multiple = this.$store.getters.ProductionLine.multiple; // 判断是单选还是多选  false 为集体 单选
			// if (!this.multiple) {
			// 	// 获取这条线是不是班组，且符合调整人就可以新增产品
			// 	if (this.$store.getters.ProductionLine.Extend1 == '班组' && this.$store.getters.ProductionLine.Extend2) {
			// 		let accounts = this.$store.getters.ProductionLine.Extend2.split(',');
			// 		if (accounts.findIndex(a => a == this.userInfo.Account) != -1) {
			// 			this.multiple = true;
			// 		}
			// 	}
			// }

			if (this.$store.getters.ProductionLine.Extend1 == '班组') {
				this.multiple_2 = true;
			} else {
				this.multiple_2 = false;
			}

			this.searchForm[0].LineID = this.$store.getters.ProductionLine.LineID;
			this.searchForm[0].LineName = this.$store.getters.ProductionLine.LineName;
			this.searchForm[1].LineID = this.$store.getters.ProductionLine.LineID;
			this.searchForm[1].LineName = this.$store.getters.ProductionLine.LineName;
			this.getLineProcess();
			this.toDay[0] = formatDate.formatTodayDate();
			this.toDay[1] = formatDate.formatTodayDate();
			// this.searchForm[0].PlanDay = formatDate.formatTodayDate();
			// this.searchForm[1].ProducedDate = formatDate.formatTodayDate();
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
			// 监听头部按钮事件
			onNavigationBarButtonTap(e) {
				let obj = {};
				obj["LineName"] = this.$store.getters.ProductionLine.LineName;
				obj["LineID"] = this.$store.getters.ProductionLine.LineID;
				this.$store.commit('setting/bad_tag_0', 0);
				this.$store.commit('setting/new_bad_1', obj);
				uni.navigateTo({
					url: './new_bad_1'
				})
			},
			// 获取这条线能做什么工序
			getLineProcess() {
				this.processs = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 5144,
						OrganizeID: this.searchForm[0].LineID
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							this.processValue = res.data.data[0];
							// res.data.data.forEach(x => {
							// 	this.processs.push({
							// 		label: x.ProcessName,
							// 		value: x.ProcessID
							// 	})
							// })
						}
						// if (res.data.data.length == 1) {
						// 	this.processValue = res.data.data[0];
						// }
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
				this.$set(this.tableData, this.swiperCurrent, []);
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
					// newForm["PlanDay"] = [form.PlanDay, form.PlanDay];
					newForm["PlanDay"] = [this.ProducedDate, this.ProducedDate];
				}
				if (!newForm.ProcessID) {
					newForm.ProcessName = ''
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
						this.$set(x, 'ID', null);
						this.$set(x, 'ModifiedBy', null);
						this.$set(x, 'ModifiedByName', null);
						this.$set(x, 'ModifiedByOn', null);
						this.$set(x, 'Status', 1);
						this.$set(x, 'TotalHours', null);
						this.$set(x, 'ProducedQty', null);
						this.$set(x, 'ConfirmQty', null);
					})
				}
				this.$store.commit('setting/SetSearchForm', newData);
				let toData = {
					newData: newData,
					ProducedDate: this.ProducedDate,
					tag: index
				};
				if (this.multiple) {
					uni.navigateTo({
						url: './newOnlyProduction?data=' + JSON.stringify(toData)
					})
				} else {
					uni.navigateTo({
						url: './newMoreProduction?data=' + JSON.stringify(toData)
					})
				}
				// uni.navigateTo({
				// 	url: './editProduction'
				// })
			},
			onlyOne(row, index) {
				if (this.currentRow[index]) {
					this.$set(this.currentRow[index], 'isChecked', false);
				}
				this.$set(row, 'isChecked', true);
				this.currentRow[index] = row;
			},
			// 添加数据
			addObj(x, name, index) {
				let obj = {};
				obj["MaterialID"] = x.MaterialID;
				obj["MaterialName"] = x.MaterialName;
				obj["Code"] = x.Code;
				obj["Extend15"] = x.Extend15;
				obj["ProcessCount"] = x.ProcessCount;
				obj["ProcessID"] = this.processValue.ProcessID;
				obj["ProcessName"] = this.processValue.ProcessName;
				obj["ProcessGroupName"] = x.ProcessGroupName;
				obj["PlanQty"] = null;
				obj["Reamrk2"] = '';
				obj["IsAdd"] = true;
				obj["dicID"] = 6704;
				obj["LineID"] = this.searchForm[0].LineID;
				obj["LineName"] = this.searchForm[0].LineName;
				obj["PlanDay"] = this.searchForm[0].PlanDay;
				obj["MFGOrganizeID"] = this.searchForm[0].MFGOrganizeID;
				obj["checked"] = false;
				obj["CreatedBy"] = this.userInfo.Account;
				obj["CreatedByName"] = this.userInfo.Name;
				obj["CreatedOn"] = new Date();
				obj["isSelect"] = false;
				if (!index && index != 0) {
					this[name].push(obj);
				} else {
					this[name][index].push(obj);
				}
			},
			// 查询产品
			serachMaterial(val) {
				if (!this.processValue.ProcessID) {
					this.$refs.uToast.show({
						title: '改线未配置工序，暂不能添加产品！',
						type: 'error',
					})
					return true;
				}
				if (val) {
					this.addData = [];
					this.$request.post({
						url: '/APSAPI/SearchMaterialByLine',
						data: {
							dicID: 1180,
							MaterialName: this.MaterialName,
							ProcessID: this.processValue.ProcessID
						}
					}).then(res => {
						if (res.data.result) {
							if (res.data.data.length == 0) {
								this.$refs.uToast.show({
									title: '未查询到该产品',
									type: 'success',

								})
							} else if (res.data.data.length > 1) {
								res.data.data.forEach(x => {
									this.addObj(x, 'addData');
								})
								this.addDialog = true;
							} else {
								this.addObj(res.data.data[0], 'tableData', this.current);
								this.addDialog = false;
							}
						} else {
							this.$refs.uToast.show({
								title: res.data.msg,
								type: 'error',
							})
						}
					})
				} else {
					this.$refs.uToast.show({
						title: '请输入需要添加的产品！',
						type: 'warning',
					})
				}
			},
			// 添加产品
			addMaterial() {
				this.addDialog = true;
			},
			// 添加并关闭
			sureAdd(tag) {
				let flag = 0;
				this.addData.forEach(x => {
					if (x.checked && !x["isSelect"]) {
						if (x.ProcessCount == 0) {
							flag = 1;
						} else {
							x["isSelect"] = true;
							x["isChecked"] = true;
							this.tableData[this.current].unshift(x);
						}
					}
				})
				
				let newData = this.tableData[this.current].filter(a=>a.isChecked);
				if(newData.length == this.tableData[this.current].length){
					this.$set(this.allSelect,0,true);
				}
				if (flag == 1) {
					this.$refs.uToast2.show({
						title: '没有配置工艺的产品未添加进来！',
						type: 'warning'
					})
				}
				this.addDialog = tag;
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

	.popup {
		::v-deep .u-mode-center-box {
			padding: 10rpx 20rpx;
			overflow: auto;
		}


		.dialog_head {
			height: 30px;
			font-size: 1.2rem;
			color: #000000;
			font-weight: bold;
			text-align: center;
			line-height: 30px;
			border-bottom: 1px solid #e4e4e7;
		}

		.search_input {
			height: 72rpx;
			margin: 20rpx 10rpx 0 10rpx;
			display: flex;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #e4e4e7;
		}

		.margin_right {
			margin-right: 16rpx;
		}

		.label {
			color: #1890FF;
			height: 60rpx;
			line-height: 60rpx;
		}

		.title {
			width: 100%;
			margin: 16rpx 0;
			position: relative;
		}

		.box {
			position: absolute;
			height: 300rpx;
			width: 100%;
			overflow: auto;
			z-index: 9;
			background: #FFFFFF;
			border: 1px solid #1890FF;
			box-shadow: 0px 0px 13px 0px rgba(208, 231, 255, 0.49);

			.box_text {
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 20rpx;
			}
		}

		.list {
			height: 800rpx;
			width: 100%;
			overflow: auto;
			position: relative;
			z-index: 3;

			.dialogList {
				margin: 10rpx 16rpx 24rpx 0;

				::v-deep .u-checkbox__icon-wrap--square {
					width: 22px !important;
					height: 22px !important;
				}
			}
		}

		.dialogFooter {
			border-top: 1px solid #e4e4e7;
			position: relative;
			width: 100%;
			bottom: 0;
			height: 60rpx;
			padding-top: 10rpx;
			display: flex;
			justify-content: flex-end;

			.u-btn {
				width: 30%;
				margin: 0 1%;
				height: 100%;
				font-size: 1rem !important;
			}
		}

		.catergoryBox {
			position: absolute;
			bottom: 60rpx;
			height: 200rpx;
			overflow: auto;
			width: 100%;
			z-index: 9;
			background: #FFFFFF;
			border: 1px solid #1890FF;
			box-shadow: 0px 0px 13px 0px rgba(208, 231, 255, 0.49);

			.box_content {
				padding: 10rpx 20rpx;
				font-size: 1.2rem;
			}
		}

		.active {
			color: #0960bd;
			background-color: #e3f4fc;
		}

		.box_text:hover,
		.box_content:hover {
			color: #0960bd !important;
			background-color: #e3f4fc !important;
		}

		.blue {
			color: #0960bd;
			display: inline-block;
			margin-left: 10rpx;
			font-size: 1rem;
		}
	}
</style>
