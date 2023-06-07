<template>
	<view class="container_nopadding" :style="{height:height + 'px'}">
		<view class="headOne">
			<view class="head-one head_1">
				<u-row>
					<!-- 		<u-col :span="4" class="flex">
						<span>工序：</span>
						<u-input v-model="searchForm[0].ProcessName" placeholder="" border></u-input>
					</u-col> -->
					<u-col :span="10" class="flex">
						<span>① 产品：</span>
						<u-input v-model="searchForm[0].MaterialName" placeholder="" border></u-input>
					</u-col>
					<u-col :span="2" class="twoRow-two flexSpaceBet">
						<!-- <view>
							<u-button type="reset" size="mini" @click="dataReset(0)">重置</u-button>
						</view> -->
						<view>
							<u-button type="search" size="mini" @click.native="dataSearch(0)">搜索</u-button>
						</view>
					</u-col>
				</u-row>
			</view>
			<view class="head-one head_2">
				<u-row>
					<u-col :span="8" class="flex">
						<span>② 不良工序：</span>
						<u-input disabled placeholder="" v-model="TinyProcess.TinyProcessName" @click="openDialog(1)"
							type="select" border></u-input>
					</u-col>
					<u-col :span="4" class="twoRow-two flexSpaceBet">
						<view>
							<u-button type="warning" size="mini" @click="openDialog(0)">添加</u-button>
						</view>
						<view>
							<u-button type="search" size="mini" @click="nextProgress">下一步</u-button>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
		<view class="contentSeven">
			<view class="tableHeader">
				<u-table class="table">
					<view>
						<u-tr>
							<u-td v-for="(item,i) in tableHeader[0]" :key="i" class="th" :width="item.width"
								@click.native="openDialog(i)">
								{{item.label}}
							</u-td>
							<u-td class="th" width="15%">
								选择
							</u-td>
						</u-tr>
					</view>
				</u-table>
			</view>
			<view class="tableContent">
				<u-table class="table">
					<scroll-view class="scroll" scroll-y @scroll='(e)=>scrollPage(e,0)'>
						<view v-for="(x,i) in tableData[0]" :key="i">
							<u-tr :style="{'background':x.isRow?'#abffc5':'#fff'}">
								<u-td v-for="(w,e) in tableHeader[0]" :key="e" :class="(w.class?w.class:'th')"
									:width="w.width"
									:style="{'color':w.color,'textAlign':w.textAlign?w.textAlign:'center'}">

									<span v-if="w.render">{{ w.render(x)}}</span>
									<span v-else="w.render">{{x[w.prop]}}</span>
								</u-td>
								<u-td class="th" width="15%">
									<u-checkbox v-model="x.isChecked" @change="onlyOne(x)"></u-checkbox>
								</u-td>
							</u-tr>
						</view>
						<view>
							<u-loadmore :status="status[0]" :load-text="loadText[0]" @loadmore="loadmore(0)"
								color="#3e82f9">
							</u-loadmore>
						</view>
					</scroll-view>
				</u-table>
			</view>
		</view>

		<u-popup v-model="reasonDialog" mode="top" :mask-close-able="false" border-radius="10" width="98%"
			class="popupDialog" closeable>
			<view class="popup_head">
				添加报废明细
			</view>
			<view class="list_label">
				您正在提报{{currentRow.MaterialName}}，{{TinyProcess.TinyProcessName}}工序的不良，合计{{currentRow.Count}}
			</view>
			<view class="popup_content" style="padding: 0;">
				<!-- <view class="" style="margin: 10px 10px 0 10px;">
					<u-radio-group v-model="Extend4" placement="row">
						<u-radio name="报废">报废
						</u-radio>
						<u-radio name="返工">返工
						</u-radio>
					</u-radio-group>
				</view> -->
				<view class="list">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td v-for="(item,i) in tableHeader[1]" :key="i" class="th" :width="item.width">
										{{item.label}}
									</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContent">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y>
								<view v-for="(x,i) in tableData[1]" :key="i">
									<u-tr>
										<u-td v-for="(w,e) in tableHeader[1]" :key="e" :class="(w.class?w.class:'th')"
											:width="w.width"
											:style="{'color':w.color,'textAlign':w.textAlign?w.textAlign:'center'}">
											<u-input v-if="w.inputNumber" placeholder="" v-model="x[w.prop]"
												:type="x.type">
											</u-input>
											<u-input v-else-if="w.type == 'select'" placeholder="" v-model="x[w.prop]"
												disabled @click="openUser(true,x)">
											</u-input>
											<span v-else-if="w.render">{{ w.render(x)}}</span>
											<span v-else>{{x[w.prop]}}</span>
										</u-td>
									</u-tr>
								</view>
								<view>
									<u-loadmore :status="status[1]" :load-text="loadText[1]" @loadmore="loadmore(1)"
										color="#3e82f9" />
								</view>
							</scroll-view>
						</u-table>
					</view>
				</view>
				<view class="popup_footer flex">
					<u-button type="primary" @click="sureAdd(true)">确认添加</u-button>
				</view>
			</view>
		</u-popup>
		<userCom :dialogUser="dialogUser" :checkedUser="userData" @sureUser="sureUser" @openUser="openUser"></userCom>
		<u-select v-model="tinyProcessDialog" :list='templateData' @confirm="confirmTinyProcess"> </u-select>
		<u-toast ref="uToast"></u-toast>
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	var _this;
	import userCom from '@/components/u-user.vue';
	import formatDate from '@/common/formatDate.js';
	import toTop from '@/common/toTop.vue';
	export default {
		components: {
			toTop,
			userCom
		},
		data() {
			return {
				dialogUser: false,
				userData: [],
				height: '',
				TinyProcess: {
					TinyProcessName: '',
					TinyProcessID: ''
				},
				Count: '',
				Extend4: '报废',
				currentRow: {},
				currentRow_2: {},
				reasonDialog: false,
				TinyProcessData: [],
				tableHeader: [
					[{
							label: '日期',
							prop: 'PlanDay',
							width: '15%',
							render: (row) => {
								if (row.PlanDay) {
									return row.PlanDay.substring(5, 10)
								}
							}
						},
						{
							label: '产品',
							prop: 'MaterialName',
							width: '27%',
							textAlign: 'left'
						},
						{
							label: '工序',
							prop: 'ProcessName',
							width: '15%'
						},
						{
							label: '数量',
							prop: 'ConfirmQty',
							width: '15%',
						},
						{
							label: '已报',
							prop: 'Count',
							width: '13%',
						}
					],
					[{
							label: '不良原因',
							prop: 'AbnormalReason',
							width: '30%',
							textAlign: 'left'
						},
						{
							label: '不良数量',
							prop: 'BadQty',
							width: '20%',
							inputNumber: true,
							type: 'number',
							class: 'bgOrange th'
						},
						{
							label: '人员',
							prop: 'Remark2',
							width: '25%',
							type: 'select',
							class: 'bgOrange th'
						},
						{
							label: '备注',
							prop: 'Remark1',
							inputNumber: true,
							type: 'text',
							class: 'bgOrange th',
							width: '25%'
						}
					]
				],
				searchForm: [{
					MaterialName: '',
					ProcessName: "",
					dicID: 6720,
					PlanDay: [],
					sort: 'PlanDay desc,ProcessID desc'
				}],
				tableData: [
					[],
					[]
				],
				status: ['点击加载更多', 'nomore', 'loadmore'],
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
					pageSize: 200,
					pageTotal: 0
				}, {
					pageIndex: 1,
					pageSize: 200,
					pageTotal: 0
				}, {
					pageIndex: 1,
					pageSize: 200,
					pageTotal: 0
				}],
				templateData: [],
				tinyProcessDialog: false,
				submitData: [],
				tag: 0,
				userInfo: {},
				ifOnShow: false,
			}
		},
		onShow() {
			this.submitData = this.$store.getters.new_bad_2;
			// 重新绑定下总数
			this.tableData[0].forEach(x => {
				let newFilterData = this.submitData.filter(a => a
					.SalesPlanProcessMaterialDayID == x
					.SalesPlanProcessMaterialDayID);
				if (newFilterData.length != 0) {
					let num = 0;
					newFilterData.forEach(b => {
						num += parseFloat(b.BadQty);
					})
					this.$set(x, 'Count', num);
				} else {
					this.$set(x, 'Count', null);
				}
			})

		},
		onLoad(option) {
			// if (Object.values(option).length != 0) {
			// 	this.tag = option.tag;
			// }else{
			// 	this.tag = 0;
			// }
			// 区分从草稿进来的还是新增进来的
			this.userInfo = this.$store.getters.userInfo;
			this.tag = this.$store.getters.bad_tag_0;
			_this = this;
			this.submitData = [];
			this.height = uni.getSystemInfoSync().windowHeight;
			this.submitData = this.$store.getters.new_bad_2;
			// 往前推一个月
			let d = new Date();
			let t = d.setMonth(d.getMonth() - 1);
			t = new Date(t);
			let startDate = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
			this.searchForm[0].PlanDay = [startDate, formatDate.formatTodayDate()];
			if (this.tag == 1) {
				// 草稿那进来只能默认是当前登录人的线
				this.searchForm[0].OrganizeIDs = this.userInfo.OrganizeID;
			} else {
				// 直接新增
				this.searchForm[0].LineID = this.$store.getters.new_bad_1.LineID;
			}
			this.dataSearch(0);
		},
		methods: {
			// 打开异常原因弹框
			openDialog(val) {
				if (val == 0) {
					if (!this.TinyProcess.TinyProcessName || Object.values(this.currentRow).length == 0) {
						this.$refs.uToast.show({
							title: '请先选择不良工序和要提报的产品！',
							type: 'error',

						})
					} else {
						// this.Extend4 = '报废';
						this.reasonDialog = true;
						this.clearData(this.TinyProcess.TinyProcessID);
					}
				} else {
					// if (Object.values(this.currentRow).length == 0) {
					// 	this.$refs.uToast.show({
					// 		title: '请先选择提报的产品！',
					// 		type: 'error',

					// 	})
					// } else {
					this.tinyProcessDialog = true;
					// }
				}
			},
			// 清空数据
			clearData(val) {
				this.$set(this.tableData, 1, []);
				let newData = this.templateData.filter(a => a.TinyProcessID == val);
				let obj = {
					SalesPlanProcessMaterialDayID: this.currentRow.SalesPlanProcessMaterialDayID,
					TinyProcessID: val
				};
				// 去已经添加过的数据里找是否存在同样的，存在即赋值
				let childrens = JSON.parse(JSON.stringify(newData[0].childrens));
				childrens.forEach(x => {
					let newIndex = _this.submitData.findIndex(b => {
						return b.SalesPlanProcessMaterialDayID == obj.SalesPlanProcessMaterialDayID && b
							.TinyProcessID == obj.TinyProcessID && b.AbnormalReasonID == x.AbnormalReasonID
					})
					if (newIndex != -1) {
						this.$set(x, 'BadQty', this.submitData[newIndex].BadQty);
						this.$set(x, 'Remark1', this.submitData[newIndex].Remark1);
						this.$set(x, 'Remark2', this.submitData[newIndex].Remark2);
						// this.$set(this, 'Extend4', this.submitData[newIndex].Extend4);
					} else {
						this.$set(x, 'BadQty', '');
						this.$set(x, 'Remark1', '');
						this.$set(x, 'Remark2', '');
					}
				})
				this.$set(this.tableData, 1, childrens);
			},
			// 下一步
			nextProgress() {
				if (this.submitData.length == 0) {
					this.$refs.uToast.show({
						title: '没有数据可进行下一步！',
						type: 'error',
					})
					return
				}
				this.$store.commit('setting/new_bad_2', this.submitData);
				if (this.tag == 1) {
					this.$store.commit('setting/bad_tag', 1);
					uni.navigateTo({
						url: './new_bad_2_2'
					})
				} else {
					uni.navigateTo({
						url: './new_bad_2'
					})
				}

			},
			// 查询
			dataSearch(index) {
				this.$set(this.tableData, index, []);
				this.pagination[index].pageIndex = 1;
				this.loadData(this.searchForm[index], index);
			},
			// 重置
			dataReset(val) {
				this.searchForm[val].MaterialName = '';
				this.searchForm[val].ProcessName = '';
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
			// 获取一个月的数据
			loadData(form, index) {
				form["page"] = this.pagination[index].pageIndex;
				form["rows"] = this.pagination[index].pageSize;
				let newForm = JSON.parse(JSON.stringify(form));
				this.$request.post({
					url: '/APSAPI/APSData',
					data: newForm
				}).then(res => {
					if (res.data.result) {
						let Data = JSON.parse(JSON.stringify(res.data.data));
						if (Data.length > 0) {
							Data = Data.filter(a => a.ConfirmQty > 0);
							Data.forEach(x => {
								this.$set(x, 'isChecked', false);
								let newFilterData = this.submitData.filter(a => a
									.SalesPlanProcessMaterialDayID == x
									.SalesPlanProcessMaterialDayID);
								if (newFilterData.length != 0) {
									let num = 0;
									newFilterData.forEach(b => {
										num += parseFloat(b.BadQty);
									})
									this.$set(x, 'Count', num);
								}
							})
							if (res.data.data.length < 200) {
								this.status[index] = 'nomore';
							} else {
								this.status[index] = 'loadmore';
							}
							let newData = [];
							newData = this.tableData[index].concat(Data);
							// newData.sort(function (a, b) { return parseFloat(b.BadQty) - parseFloat(a.BadQty) }) ;
							this.$set(this.tableData, index, newData);
							if (this.templateData.length == 0) {
								this.getTinyProcessData();
							}
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
			// 获取异常不良工序
			getTinyProcessData() {
				let newData = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 7774,
						rows: 0
					}
				}).then(res => {
					if (res.data.result) {
						let Data = res.data.data;
						if (Data.length > 0) {
							this.getReturnData(Data);
							this.TinyProcessData = Data;
						}
					} else {
						this.loading = false;
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 获取接口返回有异常原因childrens的数据
			getReturnData(submitData) {
				this.$request.post({
					url: '/APSAPI/ReturnAbnormalData',
					data: submitData
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							res.data.data.forEach(s => {
								this.$set(s, 'label', s.TinyProcessName);
								this.$set(s, 'value', s.TinyProcessID);
							})
						}
						this.templateData = res.data.data;
						if (this.tableData[0].length != 0) {
							let newFilter = this.templateData.filter(a => a.TinyProcessName == this.tableData[0][0]
								.ProcessName);
							if (newFilter.length != 0) {
								this.TinyProcess.TinyProcessName = newFilter[0].label;
								this.TinyProcess.TinyProcessID = newFilter[0].value;
							}
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error'
						})
					}
				})
			},
			// 单选
			onlyOne(row) {
				if (row.isChecked) {
					this.$set(this, 'currentRow', {});
					return
				}
				if (Object.values(this.currentRow).length != 0) {
					this.$set(this.currentRow, 'isChecked', false);
				}
				this.$set(row, 'isChecked', true);
				this.currentRow = row;
			},
			// 确认这一工序
			confirmTinyProcess(val) {
				this.clearData(val[0].value);
				this.TinyProcess.TinyProcessName = val[0].label;
				this.TinyProcess.TinyProcessID = val[0].value;
			},
			// 汇总不良
			sumBad() {
				let sum = 0;
				this.tableData[1].forEach(x => {
					if (x.BadQty) {
						sum += parseFloat(x.BadQty);
					}
				})
				this.$set(this.currentRow, 'Count', sum);
			},
			// 确认添加
			sureAdd() {
				if (this.tableData[1].length != 0) {
					this.tableData[1].forEach(a => {
						let newIndex = this.submitData.findIndex(b => {
							return b.TinyProcessID == this.TinyProcess.TinyProcessID && b
								.SalesPlanProcessMaterialDayID ==
								this.currentRow.SalesPlanProcessMaterialDayID && b.AbnormalReasonID == a
								.AbnormalReasonID
						});
						if (newIndex != -1) {
							// 如果清空了则删除掉，否则就直接替换
							if (!a.BadQty || parseFloat(a.BadQty) <= 0) {
								this.submitData.splice(newIndex, 1);
							} else {
								this.$set(this.submitData[newIndex], 'BadQty', a.BadQty);
								this.$set(this.submitData[newIndex], 'Remark1', a.Remark1);
								this.$set(this.submitData[newIndex], 'Remark2', a.Remark2);
								// this.$set(this.submitData[newIndex], 'Extend4', this.Extend4);
							}
						} else {
							// 找不到添加过的且有填写不良数的直接添加
							if (a.BadQty && parseFloat(a.BadQty) > 0) {
								let obj = JSON.parse(JSON.stringify(this.currentRow));
								obj["TinyProcessID"] = this.TinyProcess.TinyProcessID;
								obj["TinyProcessName"] = this.TinyProcess.TinyProcessName;
								for (let name in a) {
									this.$set(obj, name, a[name])
								}
								// obj["Extend4"] = this.Extend4;
								this.submitData.push(obj);
							}
						}
					})
				}
				this.$refs.uToast.show({
					title: '已添加',
					type: 'success'
				})
				this.sumBad();
				this.reasonDialog = false;
			},
			// 打开用户弹框
			openUser(val, tag) {
				this.$set(this, 'dialogUser', val);
				this.currentRow_2 = tag;
			},
			// 确认用户
			sureUser(data) {
				this.userData = [];
				if (data.length != 0) {
					data.forEach(x => {
						if (x.checked) {
							this.userData.push(x);
						}
					})
				}
				if (this.userData.length != 0) {
					let usernames = [];
					this.userData.forEach(z => {
						usernames.push(z.Name);
					})
					this.$set(this.currentRow_2, 'Remark2', usernames.join(','));
				}
				this.dialogUser = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.head_1 {
		padding: 0.3rem 0;
		border-bottom: 1px solid #e3dbdb;
		margin-bottom: 0.3rem !important;
	}

	.head_2 {
		margin-bottom: 0.3rem !important;
	}
</style>
