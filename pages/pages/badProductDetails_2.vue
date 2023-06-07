<template>
	<view class="container_nopadding" :style="{height:height + 'px'}">
		<view class="row_head_2">
			<u-row class="popup_row">
				<u-col :span="2.5" class="border_2 top left byYellow">异常单据:</u-col>
				<u-col :span="4" class="border_2 top ">{{headForm.AbnormalNo}}</u-col>
				<u-col :span="2.5" class="border_2 top byYellow">当前环节:</u-col>
				<u-col :span="3" class="border_2 top">
					{{headForm.AbnormalStatus?(headForm.AbnormalStatus == 0?'草稿':headForm.AbnormalStatus == 1?'工艺待审':headForm.AbnormalStatus == 2?'巡检待审':headForm.AbnormalStatus == 3?'经理待审':headForm.AbnormalStatus == 4?'已结案':'起草'):'起草'}}
				</u-col>
			</u-row>
			<u-row class="popup_row">
				<u-col :span="2.5" class="border_2 left byYellow">线别名称:</u-col>
				<u-col :span="4" class="border_2 ">{{headForm.LineName}}</u-col>
				<u-col :span="2.5" class="border_2 byYellow">提报人员:</u-col>
				<u-col :span="3" class="border_2 ">{{headForm.CreatedByName}}</u-col>
			</u-row>
		</view>
		<view class="list_label">
			*产品信息：请点击选中(切换行填写下方异常原因)！
		</view>
		<view class="list_up">
			<view class="tableHeader">
				<u-table class="table">
					<view>
						<u-tr>
							<u-td v-for="(item,i) in tableHeader[0]" :key="i" class="th" :width="item.width"
								@click.native="openDialog(i)">
								{{item.label}}
							</u-td>
							<u-td class="th" width="15%">
								操作
							</u-td>
						</u-tr>
					</view>
				</u-table>
			</view>
			<view class="tableContent">
				<u-table class="table">
					<scroll-view class="scroll" scroll-y @scroll='(e)=>scrollPage(e,0)'>
						<view v-for="(x,i) in tableData[0]" :key="i">
							<u-tr @click.native="getChildrenData(x)" :style="{'background':x.isRow?'#abffc5':'#fff'}">
								<u-td v-for="(w,e) in tableHeader[0]" :key="e" :class="(w.class?w.class:'th')"
									:width="w.width"
									:style="{'color':w.color,'textAlign':w.textAlign?w.textAlign:'center'}">
									<span v-if="w.methods" class="alinkOrange" @click="toPage(w.methods,x,i)">
										{{x[w.prop]}}
									</span>
									<span v-else-if="w.render">{{ w.render(x)}}</span>
									<span v-else>{{x[w.prop]}}</span>
								</u-td>
								<u-td class="th" width="15%">
									<span class="dangerText" @click="delRow(x,i)">删除</span>
								</u-td>
							</u-tr>
						</view>
						<view>
							<u-loadmore :status="status[0]" :load-text="loadText[0]" @loadmore="loadmore[0]"
								color="#3e82f9" />
						</view>
					</scroll-view>
				</u-table>
			</view>
		</view>
		<view class="list_label">
			*填写不良数：不良数为必填项！
		</view>
		<view class="list_content_4">
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
					<scroll-view class="scroll" scroll-y @scroll='(e)=>scrollPage(e,1)'>
						<view v-for="(x,i) in tableData[1]" :key="i">
							<u-tr>
								<u-td v-for="(w,e) in tableHeader[1]" :key="e" :class="(w.class?w.class:'th')"
									:width="w.width"
									:style="{'color':w.color,'textAlign':w.textAlign?w.textAlign:'center'}">
									<u-input v-if="w.inputNumber" placeholder="" v-model="x[w.prop]" type="number">
									</u-input>
									<u-input v-else-if="w.select" placeholder="" v-model="x[w.prop]" type="select"
										disabled @click="openTinyProcess(x,i)" disabled></u-input>
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
		<view class="footer">
			<u-button type="primary" size="medium" @click="passAduit(0)">保存草稿</u-button>
			<u-button type="success" size="medium" @click="passAduit(1)">提交</u-button>
		</view>
		<u-popup v-model="reasonDialog" mode="center" :mask-close-able="false" border-radius="10" width="98%"
			class="popupDialog" closeable>
			<view class="popup_head">
				添加产品（报工的数据才能提报不良！）
			</view>
			<view class="popup_content" style="padding: 0;">
				<view class="list">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td class="th" width="15%">
										添加
									</u-td>
									<u-td v-for="(item,i) in tableHeader[2]" :key="i" class="th" :width="item.width">
										{{item.label}}
									</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContent">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y @scroll='(e)=>scrollPage(e,2)'
								@scrolltolower="loadmore(2)" :scroll-top="scrollTop[2]">
								<view v-for="(x,i) in tableData[2]" :key="i">
									<u-tr>
										<u-td class="th" width="15%">
											<image src="../../static/newVersionImg/addReal.png" @click="addRow(x)"
												v-show="!x.IsAdd" style="width: 1.6rem;height: 1.6rem;margin: auto;">
											</image>
										</u-td>
										<u-td v-for="(w,e) in tableHeader[2]" :key="e" :class="(w.class?w.class:'th')"
											:width="w.width"
											:style="{'color':w.color,'textAlign':w.textAlign?w.textAlign:'center'}">
											<span v-if="w.render">{{ w.render(x)}}</span>
											<span v-else>{{x[w.prop]}}</span>
										</u-td>
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
			</view>
		</u-popup>
		<u-select v-model="dialogTinyProcess" :list='tinyProcessData' @confirm="confirmProcessValue"> </u-select>
		<u-toast ref="uToast"></u-toast>
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
				headForm: {
					AbnormalStatus: '',
					AbnormalNo: '',
					CreatedByName: '',
					LineName: '',
					dicID: 7780
				},
				tinyProcessData: [],
				dialogTinyProcess: false,
				processData: [],
				dialogTag: 2,
				editType: 0,
				reasonDialog: false,
				currentRow: '',
				reasons: [],
				currentRow2: '',
				searchForm: [{
					LineName: "",
					MFGOrganizeName: "",
					MFGOrganizeID: '',
					LineID: ""
				}, {
					LineName: "",
					MFGOrganizeName: "",
					MFGOrganizeID: '',
					LineID: ""
				}, {
					// CreatedByBadName: 'null',
					dicID: 6720
				}],
				status: ['nomore', 'nomore', 'loadmore'],
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
				tableData: [
					[],
					[],
					[]
				],
				tableHeader: [
					[{
							label: '产品(添加)',
							prop: 'MaterialName',
							width: '31%',
							textAlign: 'left'
						},
						{
							label: '计划数',
							prop: 'PlanQty',
							width: '18%',
						},
						{
							label: '报工数',
							prop: 'ProducedQty',
							width: '18%',
						},
						{
							label: '报废数',
							prop: 'BadQty',
							width: '18%'
						}
					],
					[{
							label: '原因',
							prop: 'AbnormalReason',
							width: '40%',
							textAlign: 'left'
						},
						{
							label: '不良数量',
							prop: 'BadQty',
							width: '20%',
							inputNumber: true,
							class: 'bgOrange'
						},
						{
							label: '对应工序',
							prop: 'TinyProcessName',
							width: '40%',
							select: true,
							class: 'bgOrange'
						}
					],
					[{
							label: '计划日期',
							prop: 'PlanDay',
							width: '18%',
							render: (row) => {
								if (row.PlanDay) {
									return row.PlanDay.substring(5, 10)
								}
							}
						}, {
							label: '产品',
							prop: 'MaterialName',
							width: '31%',
							textAlign: 'left'
						},
						{
							label: '生产数',
							prop: 'ProducedQty',
							width: '18%'
						},
						{
							label: '已报不良',
							prop: 'AbnormalTotalQty',
							width: '18%',
							color: '#F56C6C'
						}
					]
				],
				height: '',
				ifOnShow: false,
				loading: false,
				selectionData: [
					[],
					[],
					[]
				],
				addForm: {},
				userInfo: {},
				isTag: 0
			}
		},
		onShow() {
			if (this.ifOnShow) {
				this.allSelect = false;
				this.$set(this.tableData, 0, []);
				this.$set(this.tableData, 1, []);
				this.$set(this.tableData, 2, []);
				this.pagination[2].pageIndex = 1;
				let PlanDay = [formatDate.formatOldDate(), formatDate.formatTodayDate()];
				this.searchForm[2]['PlanDay'] = PlanDay;
				this.loadData(this.searchForm[2], 2);
			}
		},
		onHide() {
			this.ifOnShow = true;
		},
		onLoad() {
			_this = this;
			this.height = uni.getSystemInfoSync().windowHeight;
			this.userInfo = this.$store.getters.userInfo;
			let getForm = this.$store.getters.badProductDetails;
			this.searchForm['LineID'] = getForm.LineID;
			this.headForm.LineName = getForm.LineName;
			this.headForm.LineID = getForm.LineID;
			this.headForm.CreatedByName = this.userInfo.Name;
			this.searchForm[2]['LineID'] = getForm.LineID;
			let PlanDay = [formatDate.formatOldDate(), formatDate.formatTodayDate()];
			this.searchForm[2]['PlanDay'] = PlanDay;
			this.loadData(this.searchForm[2], 2);
			this.getProcessData();
		},
		methods: {
			// 获取这条线能做什么工序
			getProcessData() {
				this.processData = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 5144,
						rows: 0,
						OrganizeID: this.searchForm[2].LineID
					}
				}).then(res => {
					if (res.data.result) {
						let Data = res.data.data;
						if (Data.length > 0) {
							Data.forEach(x => {
								this.processData.push(x.ProcessID)
							})
							this.getAbnormalReasonData();
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
			// 获取符合这些工序有哪些异常原因Id
			getAbnormalReasonData() {
				let reasons = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 7771,
						rows: 0,
						ProcessID: this.processData
					}
				}).then(res => {
					if (res.data.result) {
						let Data = res.data.data;
						if (Data.length > 0) {
							Data.forEach(x => {
								if (reasons.findIndex(y => y == x.AbnormalReasonID) == -1) {
									reasons.push(x.AbnormalReasonID)
								}
							})
							this.getAbnormalReasonData2(reasons);
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
			// 获取异常数据
			getAbnormalReasonData2(val) {
				this.reasons = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 7779,
						rows: 0,
						AbnormalReasonID: val
					}
				}).then(res => {
					if (res.data.result) {
						let Data = res.data.data;
						if (Data.length != 0) {
							Data.forEach(x => {
								this.$set(x, 'temporyTinyProcessData', JSON.parse(JSON.stringify(x
									.TinyProcessID)))
							})
						}
						this.$set(this, 'reasons', Data);
					} else {
						this.loading = false;
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
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
						this.loading = false;
						let Data = res.data.data;
						let Data2 = [];
						if (Data.length > 0) {
							if (index == 2) {
								Data.forEach(x => {
									if (parseInt(x.ProducedQty) > 0) {
										Data2.push(x);
									}
								})
							}
							if (Data.length < 40) {
								this.status[index] = 'nomore';
							} else {
								this.status[index] = 'loadmore';
							}
							let newData = [];
							if (index == 2) {
								newData = this.tableData[index].concat(Data2);
							} else {
								newData = this.tableData[index].concat(Data);
							}
							this.$set(this.tableData, index, newData);
						} else {
							this.status[index] = 'nomore';
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
			// 新增产品
			openDialog(index) {
				if (index == 0) {
					if (this.tableData[2].length == 0) {
						this.pagination[2].pageIndex = 1;
						this.loadData(this.searchForm[2], 2);
					}
					this.reasonDialog = true;
				}
			},
			delRow(row, index) {
				let newIndex = this.tableData[2].findIndex(x => x.SalesPlanProcessMaterialDayID == row
					.SalesPlanProcessMaterialDayID);
				this.$set(this.tableData[2][newIndex], 'IsAdd', false);
				this.tableData[0].splice(index, 1);
				this.$set(this.tableData, 1, []);
			},
			// 提交
			passAduit(val) {
				// 判断当前哪个产品有被填异常加数量的
				if (this.tableData[0].length == 0) {
					this.$refs.uToast.show({
						title: '暂无提交的数据，请点添加产品！',
						type: 'error',

					})
					return
				}
				let submitData = [];
				let childrens = [];
				let titlte = '';
				let MaterialIDs = [];
				this.tableData[0].forEach(x => {
					let childrens2 = [];
					x["dicID"] = 7781;
					x["AbnormalStatus"] = val;
					let rowChildrens = JSON.parse(JSON.stringify(x.childrens));
					let flag = 0;
					if (rowChildrens.length != 0) {
						rowChildrens.forEach(y => {
							if (y.BadQty) {
								flag = 1;
								y["dicID"] = 7782;
								y["AbnormalStatus"] = val;
								childrens2.push(y)
							}
						})
					}

					if (flag == 1) {
						titlte = titlte + x.MaterialName + '，';
						MaterialIDs.push(x.MaterialID);
						let obj = JSON.parse(JSON.stringify(x));
						obj["childrens"] = childrens2;
						childrens.push(obj);
					}
				})
				this.$set(this.headForm, 'childrens', childrens);
				this.$set(this.headForm, 'AbnormalStatus', val);
				submitData.push(this.headForm);
				uni.showModal({
					title: '提示',
					content: titlte + "有填写异常数量，确认是否提交",
					success: function(res) {
						if (res.confirm) {
							_this.saveData(submitData, MaterialIDs);
						} else if (res.cancel) {
							return;
						}

					}
				});
			},
			// 保存数据
			saveData(submitData, MaterialIDs) {
				this.$request.post({
					url: '/APSAPI/SaveData',
					data: submitData
				}).then(res => {
					if (res.data.result) {
						let newData = [];
						this.$set(this.tableData, 2, []);
						this.$set(this.tableData, 1, []);
						newData = this.tableData[0].filter(x => !MaterialIDs.some(y => y == x.MaterialID));
						this.$set(this.tableData, 0, newData);
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'success'
						})
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error'
						})
					}
				})
			},
			// 获取异常数据
			getChildrenData(row) {
				if (this.currentRow) {
					this.$set(this.currentRow, 'isRow', false);
				}
				this.$set(row, 'isRow', true);
				this.currentRow = row;
				this.$set(this.tableData, 1, row.childrens);
			},
			toPage(methods, row, index) {
				this[methods](row, index);
			},
			openTinyProcess(row, index) {
				this.currentRow2 = row;
				this.tinyProcessData = [];
				let TinyProcessID = [];
				let TinyProcessName = [];
				if (row.TinyProcessID) {
					TinyProcessID = row.temporyTinyProcessData.split(',')
				}
				if (row.TinyProcessIDText) {
					TinyProcessName = row.TinyProcessIDText.split(',')
				}
				if (TinyProcessID.length != 0) {
					TinyProcessID.forEach((x, i) => {
						this.tinyProcessData.push({
							value: parseInt(x),
							label: TinyProcessName[i]
						})
					})
				}
				this.dialogTinyProcess = true;
			},
			confirmProcessValue(val) {
				this.$set(this.currentRow2, 'TinyProcessID', val[0].value);
				this.$set(this.currentRow2, 'TinyProcessName', val[0].label);
			},
			// 添加进来一行
			addRow(row) {
				let newIndex = this.tableData[0].findIndex(x => x.MaterialID == row.MaterialID);
				if (newIndex == -1) {
					let childrens = JSON.parse(JSON.stringify(this.reasons));
					this.$set(row, 'childrens', childrens);
					this.$set(row, 'IsAdd', true);
					this.tableData[0].unshift(row);
					this.$refs.uToast.show({
						title: '已添加！',
						type: 'success',
					})
				} else {
					this.$refs.uToast.show({
						title: '该产品已在列表！',
						type: 'error',
					})
				}
			}

		}
	}
</script>

<style>

</style>
