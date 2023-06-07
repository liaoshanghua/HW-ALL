<template>
	<view class="container_nopadding" :style="{height:height + 'px'}">
		<view class="sticky_two">
			1、请填写完成数量，如为计时请填写工时
		</view>
		<view class="more_header">
			<u-row class="row_head">
				<u-col :span="2.5" class="col_head">品名:</u-col>
				<u-col :span="3.5">{{newData[0].MaterialName}}</u-col>
				<u-col :span="2.5" class="col_head">计划:</u-col>
				<u-col :span="3.5">{{newData[0].PlanQty}}</u-col>
			</u-row>
			<!-- 	<u-row class="row_head">
				<u-col :span="3" class="col_head">数量:</u-col>
				<u-col :span="9">{{newData[0].PlanQty}}</u-col>
			</u-row> -->
			<u-row class="row_head">
				<u-col :span="3" class="col_head">报工数:</u-col>
				<u-col :span="3">
					<u-input v-model="newData[0].ProducedQty" type="number" @input="pullInput" placeholder="必填" border>
					</u-input>
				</u-col>
				<u-col :span="3" class="col_head">累计:</u-col>
				<u-col :span="3">
					<u-input v-model="newData[0].SumProducedQty" type="number" class="disabled_input" disabled border>
					</u-input>
				</u-col>
			</u-row>
			<u-row class="row_head">
				<u-col :span="3" class="col_head">备注:</u-col>
				<u-col :span="9">
					<u-input v-model="newData[0].Extend1" type="text" class="" placeholder="" border>
					</u-input>
				</u-col>
			</u-row>
			<!-- 	<u-row class="row_head">
				<u-col :span="3" class="col_head">计时(h)：</u-col>
				<u-col :span="4">
					<u-input v-model="newData[0].TotalHours" type="number" border></u-input>
				</u-col>
				<u-col :span="2" class="col_head">备注：</u-col>
				<u-col :span="3">
					<u-input v-model="newData[0].Remark1" type="text" class="disabled_input" disabled border></u-input>
				</u-col>
			</u-row> -->
		</view>
		<!-- 	<view class="sticky_two">
			2、请选择参与生产的人员 <span class="defaultText">已选【{{selectionData.length}}】</span>
		</view> -->

		<view class="sticky_two" style="background-color: #fff;padding: 0;">
			<span style="background: rgba(255,165,0,0.4);display: inline-block;height: 100%;padding: 0 1rem;"
				@click="tag = 0">生产人员<span class="defaultText">已选【{{selectionData.length}}】</span></span>
			<span style="background: #eaffe6;display: inline-block;height: 100%;padding: 0 1rem;"
				@click="tag = 1">物料耗用</span>
		</view>
		<view class="more_content scroll">
			<swiper :current="tag" class="innerSwap">
				<swiper-item class="swiper-item" @touchmove.stop>
					<view class="tableHeaderTwo">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td class="th" width="15%">
										<u-checkbox v-model="allSelect" @click.native="seelctAll"></u-checkbox>
									</u-td>
									<u-td class="th" width="20%">工号</u-td>
									<u-td class="th" width="20%">人员</u-td>
									<!-- <u-td class="th" width="15%">数量</u-td> -->
									<u-td class="th" width="15%">计时</u-td>
									<u-td class="th" width="30%">类型</u-td>

								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContentTwo">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y>
								<view v-for="(x,i) in peopleData" :key="i">
									<u-tr>
										<u-td class="th" width="15%">
											<u-checkbox v-model="x.isChecked" @change="setCheck(x)"></u-checkbox>
										</u-td>
										<u-td class="th" width="20%">{{x.Account}}</u-td>
										<u-td class="th" width="20%">{{x.Name}}</u-td>
										<!-- <u-td class="th bgOrange" width="15%">
											<input v-model="x.ProducedQty" type="number"></input>
										</u-td> -->
										<u-td class="th bgOrange" width="15%">
											<input v-model="x.TotalHours" type="number"></input>
										</u-td>
										<u-td class="th left bgOrange" width="30%">
											<input v-model="x.Remark1" @click="openType(x)" disabled></input>
										</u-td>

									</u-tr>
								</view>
							</scroll-view>
						</u-table>
					</view>
				</swiper-item>
				<swiper-item class="swiper-item" @touchmove.stop>
					<view class="tableHeaderTwo">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td class="th" width="30%">物料</u-td>
									<u-td class="th" width="30%">库存</u-td>
									<u-td class="th" width="30%">耗用</u-td>
									<u-td class="th" width="10%">
										<u-checkbox v-model="allSelect2" @click.native="seelctAll2"></u-checkbox>
									</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContentTwo">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y>
								<view v-for="(x,i) in materialData" :key="i">
									<u-tr>
										<!-- <u-td class="th" width="15%">{{x.Account}}</u-td> -->
										<u-td class="th" width="30%">{{x.MaterialName}}</u-td>
										<u-td class="th" width="30%">
											{{x.AvailableQty}}
										</u-td>
										<u-td class="th bgOrange" width="30%">
											<input v-model="x.OperationQty" type="number"></input>
										</u-td>
										<u-td class="th" width="10%">
											<u-checkbox v-model="x.isChecked" @change="setCheck2(x)"></u-checkbox>
										</u-td>
									</u-tr>
								</view>
							</scroll-view>
						</u-table>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="footer">
			<u-button type="warning" size="medium" @click="addPeople">新增人员</u-button>
			<u-button type="searchFooter" size="medium" @click="submit" :disabled="adminLoading">提交</u-button>
		</view>
		<u-modal v-model="dialogAdd" @confirm="addUser" title="">
			<view class="slot-content" style="width: 80%;margin: auto;">
				<u-input v-model="userValue" type='text' border></u-input>
			</view>
		</u-modal>


		<u-popup v-model="addDialog" mode="center" class="popup" :mask-close-able="false" border-radius="10"
			width="98%">
			<view class="dialog_head">
				添加人员
			</view>
			<view class="search_input">
				<span>输入人员信息：</span>
				<u-input type="text" v-model="Name" border size="mini" class="margin_right"></u-input>
				<u-button type="primary" @click="searchName(Name)" size="mini">查询</u-button>
			</view>
			<view class="list">
				<scroll-view class="scroll" scroll-y>
					<view class="dialogList" v-for="(item, index) in addData" :key="index">
						<u-checkbox :disabled="item.isSelect" v-model="item.checked">{{item.Account}} <span
								class="blue">【姓名：{{item.Name}}]</span> <span>{{item.OrganizeName}}</span></u-checkbox>
					</view>
				</scroll-view>
			</view>
			<view class="dialogFooter">
				<u-button type="info" size="small" @click="addDialog = false">取消</u-button>
				<!-- <u-button type="warning" size="small" @click="sureAdd(false)">添加并关闭</u-button> -->
				<u-button type="primary" size="small" @click="sureAdd(false)">添加</u-button>
			</view>
		</u-popup>

		<u-modal v-model="loginOutDialog" width="70%" :show-title="false" :show-confirm-button="false">
			<view style="font-size: 1.4rem;color:#000000;font-weight: bold;margin: 40rpx;">
				提报后是否登出？
			</view>
			<view class="flex_around" style="margin-bottom: 40rpx;">
				<u-button type="warning" @click="loginOut(false)" style="width: 160rpx;">否</u-button>
				<u-button type="primary" @click="loginOut(true)" style="width: 160rpx;">是</u-button>
			</view>
		</u-modal>

		<u-select v-model="dialogPWSProcess" :list='pwsprocesss' @confirm="confirmPWSProcessValue"> </u-select>
		<u-select v-model="dialogType" :list='types' @confirm="confirmTypesValue"> </u-select>
		<u-top-tips ref="uToast"></u-top-tips>
		<u-toast ref="uToast2"></u-toast>
		<u-no-network></u-no-network>

	</view>
</template>

<script>
	var _self;
	import formatDate from '@/common/formatDate.js';
	export default {
		data() {
			return {
				adminLoading: false,
				loginOutDialog: false,
				dialogType: false,
				tag: 0,
				types: [{
					label: '计件',
					value: '计件'
				}, {
					label: '计时',
					value: '计时'
				}, {
					label: '计件+计时',
					value: '计件+计时'
				}],
				userInfo: {},
				dialogPWSProcess: false,
				pwsprocesss: [],
				userValue: '',
				newData: [],
				allSelect: false,
				allSelect2: false,
				peopleData: [],
				materialData: [],
				height: '',
				selectionData: [],
				selectionData2: [],
				dialogAdd: false,
				currrentRow: '',
				toDay: '',
				addDialog: false,
				Name: '',
				addData: [],
				ProducedDate: ''
			};
		},
		onLoad(option) {
			_self = this;
			this.userInfo = this.$store.getters.userInfo;
			let toData = JSON.parse(option.data);
			let newData = toData.newData;
			this.ProducedDate = toData.ProducedDate;
			newData[0]["Remark1"] = '集体';
			// newData[0]["ProducedQty"] = newData[0].PlanQty;
			this.newData = newData;
			this.height = uni.getSystemInfoSync().windowHeight;
			// 获取人员数据
			this.toDay = formatDate.formatTodayDate();
			this.getPeopleData();
			// 获取这个工序下的计件工序
			this.getPWSData();
		},
		methods: {
			// 填充勾选的
			pullInput(val) {
				if (this.peopleData.length != 0) {
					this.peopleData.forEach(x => {
						if (x.isChecked) {
							x["ProducedQty"] = val;
						}
					})
				}
			},
			getPWSData() {
				this.pwsprocesss = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 6725,
						// ProcessID: this.newData[0].ProcessID
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							res.data.data.forEach(x => {
								this.pwsprocesss.push({
									label: x.PWSProcessName,
									value: x.PWSProcessID
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
			// 确定计件工序
			confirmPWSProcessValue(val) {
				let index = this.pwsprocesss.findIndex(m => {
					return m.value == val[0].value;
				});
				this.$set(this.currrentRow, 'PWSProcessName', this.pwsprocesss[index].label);
				this.$set(this.currrentRow, 'PWSProcessID', this.pwsprocesss[index].value);

			},
			// 确认核算类型
			confirmTypesValue(val) {
				this.$set(this.currrentRow, 'Remark1', val[0].value);
			},
			// 获取人员数据
			getPeopleData() {
				let lineID = this.$store.getters.ProductionLine.LineID;
				this.peopleData = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 3007,
						OrganizeID: lineID
					}
				}).then(res => {
					if (res.data.result) {
						this.selectionData = [];
						if (res.data.data.length != 0) {
							res.data.data.forEach(x => {
								// let newIndex = this.pwsprocesss.findIndex(y => {
								// 	return y.value == x.PWSProcessID
								// });
								// if (newIndex == -1) {
								// 	x.PWSProcessID = null;
								// 	x.PWSProcessName = null;
								// }
								this.$set(x, 'Remark1', '计件');
								this.$set(x, 'isChecked', true);
								this.selectionData.push(x);

								// if (x.Account == this.userInfo.Account) {
								// 	this.$set(x, 'isChecked', true);
								// 	this.selectionData.push(x);
								// } else {
								// 	this.$set(x, 'isChecked', false);
								// }
							})
						}
						this.$set(this, 'peopleData', res.data.data);
						this.pullInput(this.newData[0].ProducedQty);
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 新增
			toPage() {
				this.dialogAdd = true;
			},
			// 确认添加
			addUser() {
				this.$request.post({
					url: '/APSAPI/APSDataOR',
					data: {
						dicID: 25,
						Account: this.userValue,
						Name: this.userValue
					}
				}).then(res => {
					if (res.data.result) {
						_self.peopleData = _self.peopleData.cancat(res.data.data);
						this.dialogAdd = false;
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 提交
			submit() {
				if (parseFloat(this.newData[0].ProducedQty) >= 0) {
					let flag = this.getSelectionData();
					if (flag == 1) {
						this.$refs.uToast.show({
							title: '请检查含有计时类型的人员是否填写了时长！',
							type: 'error',

						})
						return
					}
					if (this.selectionData.length != 0) {
						this.newData[0]["dicID"] = 6704;
						this.newData[0]["ProducedDate"] = this.ProducedDate;
						this.newData[0]["Status"] = 1;
						this.newData[0]["childrens"] = this.selectionData;
					} else {
						this.$refs.uToast.show({
							title: '请选择生产人员！',
							type: 'error',

						})
						return
					}
					// 判断重复的产品相同的报工数是否重复提交
					this.$request.post({
						url: '/APSAPI/APSData',
						data: {
							dicID: 6704,
							MaterialID: this.newData[0].MaterialID,
							ProducedQty: this.newData[0].ProducedQty,
							ProducedDate: [this.ProducedDate, this.ProducedDate]
						}
					}).then(res => {
						if (res.data.result) {
							if (res.data.data.length == 0) {
								_self.saveData(_self.newData);
							} else {
								uni.showModal({
									title: '【重复报工提示】',
									content: _self.newData[0].MaterialName + '*' + _self.newData[0]
										.ProducedQty +
										'当天存在重复报工记录，是否继续提交？',
									confirmText: '仍然提交',
									cancelText: '返回修改',
									success: function(res) {
										if (res.confirm) {
											_self.saveData(_self.newData);
										} else if (res.cancel) {
											return;
										}
									}
								});
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
						title: '请填写报工数！',
						type: 'error',

					})
				}
			},
			// 保存提交的数据
			saveData(newData) {
				if (this.adminLoading) {
					return
				}
				this.adminLoading = true;
				this.$request.post({
					url: '/APSAPI/SaveData',
					data: newData
				}).then(function(res) {
					if (res.data.result) {
						_self.adminLoading = false;
						_self.loginOutDialog = true;
					} else {
						_self.adminLoading = false;
						_self.$refs.uToast.show({
							type: 'error',
							title: res.data.msg,

						})
					}
				})
			},
			// 确认是否登出
			loginOut(val) {
				this.loginOutDialog = false;
				if (val) {
					uni.reLaunch({
						url: '../login/login'
					})
				} else {
					let pages = getCurrentPages(); // 当前页面
					let beforePage = pages[pages.length - 2];
					uni.navigateBack({
						delta: 1,
						success: function() {
							// beforePage.$vm.refreshRequest(); // 执行前一个页面的刷新
						}
					});
				}
			},
			// 获取选中的数据
			getSelectionData(index) {
				let flag = 0;
				this.selectionData = [];
				let TotalHours = 0;
				this.peopleData.forEach(x => {
					if (x.isChecked) {
						if ((x.Remark1 == '计时' || x.Remark1 == '计件+计时') && (!x.TotalHours || parseFloat(x
								.TotalHours) <= 0)) {
							flag = 1;
						}
						if (x.Remark1 == '计时' || x.Remark1 == '计件+计时') {
							TotalHours += parseFloat(x.TotalHours);
						}
						if (x.Remark1 != '计时') {
							x.ProducedQty = this.newData[0].ProducedQty;
						}
						x.Status = 1;
						x.dicID = 6710;
						this.selectionData.push(x);
					}
				})
				this.$set(this.newData[0], 'TotalHours', TotalHours);
				return flag;
			},
			// 获取选中的数据
			getSelectionData2(index) {
				let flag = 0;
				this.selectionData2 = [];
				this.materialData.forEach(x => {
					if (x.isChecked) {
						this.selectionData2.push(x);
					}
				})
				return flag;
			},
			// 全选
			seelctAll() {
				if (this.peopleData.length != 0 && this.allSelect) {
					this.peopleData.forEach(m => {
						if (!m.isChecked) {
							this.$set(m, 'isChecked', true);
						}
					})
				} else if (this.peopleData.length != 0) {
					this.peopleData.forEach(m => {
						if (m.isChecked) {
							this.$set(m, 'isChecked', false);
						}
					})
				}
				this.getSelectionData();
				this.pullInput();
			},
			// 全选
			seelctAll2() {
				if (this.materialData.length != 0 && this.allSelect2) {
					this.materialData.forEach(m => {
						if (!m.isChecked) {
							this.$set(m, 'isChecked', true);
						}
					})
				} else if (this.materialData.length != 0) {
					this.materialData.forEach(m => {
						if (m.isChecked) {
							this.$set(m, 'isChecked', false);
						}
					})
				}
				this.getSelectionData2();
			},
			// 单击选择
			setCheck(x) {
				this.$set(x, 'isChecked', !x["isChecked"]);
				this.$set(x, 'ProducedQty', this.newData[0].ProducedQty);
				this.$set(x, 'TotalHours', this.newData[0].TotalHours);
				this.getSelectionData();
			},
			// 单击选择
			setCheck2(x) {
				this.$set(x, 'isChecked', !x["isChecked"]);
			},
			// 打开计件工序
			openPws(row) {
				this.currrentRow = row;
				this.dialogPWSProcess = true;
			},
			// 打开类型
			openType(row) {
				this.currrentRow = row;
				this.dialogType = true;
			},
			// 新增人员
			addPeople() {
				this.addDialog = true;
			},
			// 添加人员进来
			sureAdd(tag) {
				let newData = [];
				if (this.addData.length != 0) {
					this.addData.forEach(x => {
						if (x.checked) {
							let newIndex = this.peopleData.findIndex(y => y.Account == x.Account);
							if (newIndex == -1) {
								this.peopleData.unshift(x);
							}
						}
					})
				}
				this.addDialog = tag;
			},
			// 查询人员
			searchName(val) {
				if (val) {
					this.addData = [];
					this.$request.post({
						url: '/APSAPI/APSData',
						data: {
							dicID: 3007,
							Name: val,
							OrganizeTypeID: 6
						}
					}).then(res => {
						if (res.data.result) {
							if (res.data.data.length == 0) {
								this.$refs.uToast2.show({
									title: '未查询到该人员',
									type: 'success',

								})
							} else if (res.data.data.length > 1) {
								res.data.data.forEach(a => {
									this.$set(a, 'checked', false);
								})
								this.addData = res.data.data;
								this.addDialog = true;
							} else {
								this.addDialog = false;
								this.peopleData.unshift(res.data.data[0]);
							}
						} else {
							this.$refs.uToast2.show({
								title: res.data.msg,
								type: 'error',
							})
						}
					})
				} else {
					this.$refs.uToast2.show({
						title: '请输入需要查询的姓名！',
						type: 'warning',
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.more_header {
		margin: 1rem 0;

		::v-deep .u-row {
			font-size: 1.25rem;
			margin: 0.6rem 0.5rem;
			height: 2.5rem;
		}

		::v-deep .u-input {
			background: #ffffdd;
		}
	}

	.row_head {
		font-weight: bold;
	}

	.more_content {

		height: calc(100vh - 24rem);
	}

	.flex_unset {
		::v-deep .u-td {
			flex-direction: unset !important;
			justify-content: space-between;
		}
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



	::v-deep .uni-modal__bd {
		color: red;
	}

	::v-deep .uni-modal__btn_default {
		background-color: #b3adad;
		color: #fff;
	}

	::v-deep .uni-modal__btn_primary {
		color: #fff;
		background-color: #fb5454;
	}

	::v-deep .uni-modal__hd {
		background-color: #dfebef;
	}
</style>
