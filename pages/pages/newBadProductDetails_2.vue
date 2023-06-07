<template>
	<view class="container_nopadding" :style="{height:height + 'px'}">
		<view class="row_head">
			<u-row class="popup_row">
				<u-col :span="2.5" class="border_2 left top byYellow">提报时间:</u-col>
				<u-col :span="4" class="border_2 top bgOrange">
					<u-input type="select" v-model="headForm.BadDate" disabled @click="openDay" placeholder="必选日期">
					</u-input>
				</u-col>
				<u-col :span="2.5" class="border_2 top byYellow">提报人员:</u-col>
				<u-col :span="3" class="border_2 top ">{{headForm.CreatedByName}}</u-col>
			</u-row>
			<u-row class="popup_row">
				<u-col :span="2.5" class="border_2  left byYellow">异常单据:</u-col>
				<u-col :span="4" class="border_2 ">{{headForm.AbnormalNo}}</u-col>
				<u-col :span="2.5" class="border_2  byYellow">当前环节:</u-col>
				<u-col :span="3" class="border_2 ">
					{{headForm.AbnormalStatus?(headForm.AbnormalStatus == 0?'草稿':headForm.AbnormalStatus == 1?'工艺待审':headForm.AbnormalStatus == 2?'巡检待审':headForm.AbnormalStatus == 3?'经理待审':headForm.AbnormalStatus == 4?'已结案':'起草'):'起草'}}
				</u-col>
			</u-row>
		</view>
		<view class="list_label">
			*产品信息：请点击选中(生产数也必填哦，不填不提交)！
		</view>
		<view class="list_up_5">
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
						<view v-for="(x,i) in tableData[0]" :key="i" @click="getChildrenData(x)">
							<u-tr :style="{'background':x.isRow?'#abffc5':'#fff'}">
								<u-td v-for="(w,e) in tableHeader[0]" :key="e" :class="(w.class?w.class:'th')"
									:width="w.width"
									:style="{'color':w.color,'textAlign':w.textAlign?w.textAlign:'center'}">
									<u-input v-if="w.inputNumber" placeholder="" v-model="x[w.prop]" :type="w.type">
									</u-input>
									<span v-else-if="w.methods" class="alinkOrange" @click="toPage(w.methods,x,i)">
										{{x[w.prop]}}
									</span>
									<span v-else-if="w.render">{{ w.render(x)}}</span>
									<span v-else>{{x[w.prop]}}</span>
								</u-td>
								<u-td class="th" width="15%" @click.native.stop="delRow(x,i)">
									<view class="dangerText">删除</view>
								</u-td>
							</u-tr>
						</view>
						<view>
							<u-loadmore :status="status[0]" :load-text="loadText[0]" @loadmore="loadmore[0]"
								color="#3e82f9">
							</u-loadmore>
						</view>
					</scroll-view>
				</u-table>
			</view>
		</view>
		<view class="list_label">
			*填写不良数：不良数为必填项！
		</view>
		<view class="list_content_5">
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
									<u-input v-if="w.inputNumber" placeholder="" v-model="x[w.prop]" :type="x.type"
										@input="sumBad">
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
		<view class="footerTwo">
			<u-button type="primary" size="medium" @click="passAduit(0)">保存草稿</u-button>
			<!-- <u-button type="success" size="medium" @click="passAduit(1)">提交</u-button> -->
		</view>
		<u-popup v-model="reasonDialog" mode="bottom" :mask-close-able="false" border-radius="10" width="98%"
			class="popupDialog" closeable>
			<view class="popup_head">
				添加产品
			</view>
			<view class="search_input flex_around">
				<u-input type="text" v-model="MaterialName" border size="mini" class="margin_right" placeholder="代码">
				</u-input>
				<u-button type="primary" @click="serachMaterial(MaterialName)" size="mini">查询</u-button>
			</view>
			<view class="popup_content" style="padding: 0;">
				<view class="list_8">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td class="th" width="20%">
										选择
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
										<u-td class="th" width="20%">
											<u-checkbox v-model="x.isChecked" @click.native="onlyOne(x)"></u-checkbox>
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
				<view class="list_label">
					*细小工序：请选择产品对应的工序！
				</view>
				<view class="list_7">
					<scroll-view class="scroll" scroll-y>
						<u-checkbox v-for="(item, index) in tinyProcessData" :key="index" v-model="item.isChecked"
							:disabled="item.Disabled" :name="item.TinyProcessName">{{item.TinyProcessName}}
						</u-checkbox>
					</scroll-view>
				</view>
				<view class="popup_footer_2 flex">
					<u-button type="primary" @click="sureAdd(true)">添加</u-button>
					<u-button type="success" @click="sureAdd(false)">添加并关闭</u-button>
				</view>
			</view>
		</u-popup>
		<u-picker modal="time" v-model="dialogDay" :parmas="{year:true,month:true,day:true}" @confirm="confirmDay">
		</u-picker>
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
				dialogRurrentRow: '',
				adminLoading: false,
				dialogDay: false,
				MaterialName: '',
				selectTinyProcess: [],
				headForm: {
					AbnormalStatus: '',
					AbnormalNo: '',
					CreatedByName: '',
					CreatedBy: '',
					LineName: '',
					dicID: 7780,
					BadDate: ''
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
					dicID: 7808,
					MaterialType: ["组件", "成品"]
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
							width: '25%',
							textAlign: 'left'
						},
						{
							label: '细小工序',
							prop: 'TinyProcessName',
							width: '20%',
						},
						{
							label: '生产数',
							prop: 'ProducedQty',
							width: '20%',
							inputNumber: true,
							class: "bgOrange th",
							type: 'number'
						}, {
							label: '报废数',
							prop: 'BadQty',
							width: '20%',
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
							width: '30%',
							inputNumber: true,
							type: 'number',
							class: 'bgOrange th'
						},
						{
							label: '备注',
							prop: 'Remark1',
							inputNumber: true,
							type: 'text',
							class: 'bgOrange th',
							width: '30%'
						}
					],
					[{
						label: '料号',
						prop: 'Code',
						width: '40%',
					}, {
						label: '代码',
						prop: 'MaterialName',
						width: '40%',
						textAlign: 'left'
					}]
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
				isTag: 0,
			}
		},
		onShow() {
			if (this.ifOnShow) {
				this.allSelect = false;
				this.$set(this.tableData, 0, []);
				this.$set(this.tableData, 1, []);
				this.$set(this.tableData, 2, []);
				this.pagination[2].pageIndex = 1;
			}
		},
		onHide() {
			this.ifOnShow = true;
		},
		onLoad() {
			_this = this;
			this.height = uni.getSystemInfoSync().windowHeight;
			this.userInfo = this.$store.getters.userInfo;
			this.headForm.CreatedByName = this.userInfo.Name;
			this.headForm.CreatedBy = this.userInfo.Account;
			// this.loadData(this.searchForm[2], 2);
			// 获取细小工序
			this.getTinyProcessData();
		},
		methods: {
			getTinyProcessData() {
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
							Data.forEach(x => {
								this.$set(x, 'isChecked', false);
							})
							this.tinyProcessData = Data;
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
				if (index == 2 && !this.MaterialName) {
					this.$refs.uToast.show({
						title: '请输入名称再搜索！',
						type: 'error',

					})
					return;
				}
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
						if (Data.length > 0) {
							if (index == 2) {
								Data.forEach(x => {
									this.$set(x, 'isChecked', false);
								})
							}
							if (Data.length < 40) {
								this.status[index] = 'nomore';
							} else {
								this.status[index] = 'loadmore';
							}
							let newData = [];
							newData = this.tableData[index].concat(Data);
							this.$set(this.tableData, index, newData);
							if (index == 2 && this.tableData[2].length == 1) {
								this.$set(this.tableData[2][0], 'isChecked', true);
								this.dialogRurrentRow = this.tableData[2][0];
								// 判断选中的产品是否已经有添加过的工序
								this.judgeMaterial(this.tableData[2][0]);
							}
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
					// if (this.tableData[2].length == 0) {
					// 	this.pagination[2].pageIndex = 1;
					// 	this.loadData(this.searchForm[2], 2);
					// }
					this.reasonDialog = true;
				}
			},
			delRow(row, index) {
				this.currentRow = '';
				this.tableData[0].splice(index, 1);
				this.$set(this.tableData, 1, []);
			},
			// 提交
			passAduit(val) {
				if (!this.headForm.BadDate) {
					this.$refs.uToast.show({
						title: '不良日期必须选择，请在头部选择日期！',
						type: 'error',

					})
					return
				}
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
				let flag = 0;
				// !x.ProducedQty || parseFloat(x.ProducedQty) == 0  ||  // 没有生产数默认为返工产品
				this.tableData[0].some(x => {
					if (!x.BadQty || parseFloat(x.BadQty) ==
						0) {
						flag = 1;
						return true;
					}
					let childrens2 = [];
					x["dicID"] = 7781;
					if (!x.ProducedQty || parseFloat(x.ProducedQty) == 0) {
						x["Extend4"] = '是'
					}
					x["AbnormalStatus"] = val;
					let rowChildrens = JSON.parse(JSON.stringify(x.childrens));
					// if (parseFloat(x.ProducedQty) > 0) {
					if (rowChildrens.length != 0) {
						rowChildrens.forEach(y => {
							if (y.BadQty) {
								// flag = 1;
								y["dicID"] = 7782;
								y["AbnormalStatus"] = val;
								childrens2.push(y)
							}

						})
					}
					// }
					MaterialIDs.push(x.MaterialID);
					let obj = JSON.parse(JSON.stringify(x));
					obj["childrens"] = childrens2;
					childrens.push(obj);

					// if (flag == 1) {
					// 	titlte = titlte + x.MaterialName + '，';
					// 	MaterialIDs.push(x.MaterialID);
					// 	let obj = JSON.parse(JSON.stringify(x));
					// 	obj["childrens"] = childrens2;
					// 	childrens.push(obj);
					// }
				})


				// if (!titlte) {
				// 	titlte = '无产品'
				// }
				if (flag == 1) {
					this.$refs.uToast.show({
						title: '请检查是否都填了生产数与报废数，无需填写的请删除！',
						type: 'error'
					})
				} else {
					this.$set(this.headForm, 'childrens', childrens);
					this.$set(this.headForm, 'AbnormalStatus', val);
					submitData.push(this.headForm);
					uni.showModal({
						title: '提示',
						content: "确认提交吗",
						success: function(res) {
							if (res.confirm) {
								if (submitData.length != 0) {
									_this.saveData(submitData, MaterialIDs);
								} else {
									_this.$refs.uToast.show({
										title: '暂无可提交的数据！',
										type: 'error'
									})
								}
							} else if (res.cancel) {
								return;
							}

						}
					});
				}
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
						this.$set(this.tableData, 0, []);
						// newData = this.tableData[0].filter(x => !MaterialIDs.some(y => y == x.MaterialID));
						// this.$set(this.tableData, 0, newData);
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'success'
						})
						setTimeout(() => {
							let pages = getCurrentPages(); // 当前页面
							let delta = 1;
							pages.some((x, i) => {
								if (x.route == "pages/pages/badAduit") {
									delta = i + 1;
									return true
								}
							})
							let beforePage = pages.length - delta;
							uni.navigateBack({
								delta: beforePage,
								success: function() {
									// beforePage.$vm.refreshRequest(); // 执行前一个页面的刷新
								}
							});
						}, 4000)
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
			// 查询
			dataSearch(index) {
				this.$set(this.tableData, index, []);
				this.pagination[index].pageIndex = 1;
				this.loadData(this.searchForm[index], index);
			},
			// 查询产品
			serachMaterial(val) {
				this.searchForm[2].MaterialName = val;
				this.dataSearch(2);
			},
			// 获取选中的数据
			getSelectData(index) {
				this.$set(this.selectionData, index, []);
				if (this.tableData[index].length != 0) {
					this.tableData[index].forEach(x => {
						if (x.isChecked) {
							this.selectionData[index].push(x)
						}
					})
				}
			},
			// 获取选中的工序
			getTinyProcessList() {
				this.selectTinyProcess = [];
				if (this.tinyProcessData.length != 0) {
					this.tinyProcessData.forEach(x => {
						if (!x.Disabled && x.isChecked) {
							this.selectTinyProcess.push(x)
						}
					})
				}
			},
			// 确定添加这些 产品
			sureAdd(tag) {
				if (this.adminLoading) {
					this.$refs.uToast.show({
						title: '上一笔添加还在操作中！',
						type: 'error',
					})
					return;
				}
				this.getSelectData(2);
				if (this.selectionData[2].length == 0) {
					this.$refs.uToast.show({
						title: '请勾选要添加的产品！',
						type: 'success',
					})
					return;
				}
				this.getTinyProcessList();
				if (this.selectTinyProcess.length == 0) {
					this.$refs.uToast.show({
						title: '请勾选要产品对应的细小工序！',
						type: 'success',
					})
					return;
				}
				this.reasonDialog = tag;
				this.adminLoading = true;
				let submitData = [];
				let MaterialIDs = []; //用来查询提报日期的生产数
				this.selectionData[2].forEach(x => {
					MaterialIDs.push(x.MaterialID);
					this.selectTinyProcess.forEach(y => {
						let obj = JSON.parse(JSON.stringify(x));
						obj["TinyProcessID"] = y.TinyProcessID;
						obj["TinyProcessName"] = y.TinyProcessName;
						submitData.push(obj)
					})
				})
				this.getReturnData(submitData, MaterialIDs);
			},
			// 获取接口返回有异常原因childrens的数据
			getReturnData(submitData, MaterialIDs) {
				this.$request.post({
					url: '/APSAPI/ReturnAbnormalData',
					data: submitData
				}).then(res => {
					if (res.data.result) {
						if (this.headForm.BadDate) {
							this.getProductionData(MaterialIDs);
						}
						// 已添加过的无需再添加
						let newList = this.tableData[0].concat(res.data.data);
						this.$set(this.tableData, 0, newList);
						// res.data.data.forEach(x => {
						// 	let newIndex = this.tableData[0].findIndex(y => y.TinyProcessID == x
						// 		.TinyProcessID && y.MaterialID == x.MaterialID);
						// 	if (newIndex == -1) {
						// 		this.tableData[0].push(x)
						// 	}
						// })
						// this.reasonDialog = false;
						// 清空刚选中的
						this.adminLoading = false;
						this.$refs.uToast.show({
							title: '已添加！',
							type: 'success',
						})
						this.MaterialName = "";
						this.clearChecked();
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error'
						})
					}
				})
			},
			// 获取当前提报日期的生产数
			getProductionData(MaterialIDs) {
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						PlanDay: this.headForm.BadDate,
						MaterialID: MaterialIDs,
						dicID: 6720,
						fields: "max(ProducedQty) as ProducedQty,MaterialID",
						groupby: 'MaterialID',
						sort: 'ProducedQty desc',
						LineID: this.userInfo.Organizes
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							this.tableData[0].forEach(y => {
								let newIndex = -1;
								newIndex = res.data.data.findIndex(a => a.MaterialID == y.MaterialID);
								if (newIndex != -1) {
									this.$set(y, 'ProducedQty', res.data.data[newIndex].ProducedQty);
								}
							})
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error'
						})
					}
				})
			},
			clearChecked() {
				// this.tableData[2].forEach(x => {
				// 	this.$set(x, 'isChecked', false)
				// })
				this.$set(this.tableData, 2, []);
				this.dialogRurrentRow = "";
				this.tinyProcessData.forEach(y => {
					this.$set(y, 'isChecked', false);
					this.$set(y, 'Disabled', false);
				})
				this.selectTinyProcess = [];
			},
			// 汇总不良
			sumBad() {
				let sum = 0;
				this.tableData[1].forEach(x => {
					if (x.BadQty) {
						sum += parseFloat(x.BadQty);
					}
				})
				this.$set(this.currentRow, 'BadQty', sum);
			},
			openDay() {
				this.dialogDay = true;
			},
			confirmDay(val) {
				let date = val.year + '-' + val.month + '-' + val.day;
				this.headForm.BadDate = date;
			},
			// 单选
			onlyOne(row) {
				if (this.dialogRurrentRow) {
					this.$set(this.dialogRurrentRow, 'isChecked', false);
				}
				this.$set(row, 'isChecked', true);
				this.dialogRurrentRow = row;
				this.judgeMaterial(row);
			},
			// 判断是否添加过工序，直接禁用
			judgeMaterial(row) {
				if (this.tableData[0].length != 0) {
					let newList = this.tableData[0].filter(x => {
						return x.MaterialID == row.MaterialID
					});
					if (newList.length != 0) {
						newList.forEach(a => {
							let newIndex = -1;
							newIndex = this.tinyProcessData.findIndex(b => b.TinyProcessID == a.TinyProcessID);
							if (newIndex != -1) {
								this.$set(this.tinyProcessData[newIndex], 'Disabled', true);
							}
						})
					} else {
						this.tinyProcessData.forEach(c => {
							this.$set(c, 'Disabled', false);
						})
					}
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
</style>
