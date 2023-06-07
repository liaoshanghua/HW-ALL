<template>
	<view class="container_nopadding" :style="{height:height + 'px'}">
		<view class="head_one flex" style="padding: 0 10px;">
			<u-radio-group v-model="Types">
				<u-radio @change="radioChange" v-for="(item, index) in list" :key="index" :name="item.name"
					:disabled="item.disabled">
					{{item.name}}
				</u-radio>
			</u-radio-group>
			<u-button type="primary" @click="editLevelTwoProcess" size="mini">填写二级工序</u-button>
		</view>
		<view class="contentFour">
			<view class="scroll">
				<view class="tableHeaderTwo">
					<u-table class="table">
						<view>
							<u-tr>
								<u-td class="th" width="10%">
									<u-checkbox v-model="allSelect[0]" @click.native="seelctAll(0)"></u-checkbox>
								</u-td>
								<u-td class="th" width="26%">品名</u-td>
								<u-td class="th" width="16%">数量</u-td>
								<u-td class="th" width="16%">计时</u-td>
								<u-td class="th" width="16%">长度</u-td>
								<u-td class="th" width="16%">类型</u-td>
							</u-tr>
						</view>
					</u-table>
				</view>
				<view class="tableContentTwo">
					<u-table class="table">
						<scroll-view class="scroll" scroll-y @scroll='scrollPage' :scroll-top="scrollTop">
							<view v-for="(x,i) in tableData" :key="i">
								<u-tr>
									<u-td class="th" width="10%">
										<u-checkbox v-model="x.isChecked"></u-checkbox>
									</u-td>
									<!-- <u-td class="th left flex" width="60%">{{x.Spec}}<span class="red">{{x.OweQty}}</span></u-td> -->
									<u-td class="th left flex" width="26%">{{x.MaterialName}}</u-td>
									<u-td class="th bgOrange" width="16%">
										<input v-model="x.ProducedQty" type="number"></input>
									</u-td>
									<u-td class="th bgOrange" width="16%">
										<input v-model="x.TotalHours" type="number"></input>
									</u-td>
									<u-td class="th  bgOrange" width="16%">
										<input v-model="x.ProductLength" type="text"></input>
									</u-td>
									<u-td class="th" width="16%">
										{{x.Types}}
									</u-td>
								</u-tr>
							</view>
							<!-- <to-top :toTop='toTop' @handletotop='handletotop'></to-top> -->
						</scroll-view>
					</u-table>
				</view>
			</view>

		</view>
		<view class="footerThree flex_around" style="justify-content: start;">
			<!-- <view class="">
				人员：{{userInfo.Name}}
			</view> -->
			<view class="flex_wrap editInput">
				<!-- 计件工序：<u-input v-model="userInfo.PWSProcessName" border @click="openPws" placeholder="请选择计件工序"></u-input> -->
				<view class="" v-for="(item,i) in userData" :key="i" style="font-size: 15px;">
					<span class="blueColor">{{item.Name}}:</span><span
						style="display: inline-block;margin-right: 5px;min-width: 40px;">{{item.Remark2}}</span>
				</view>

			</view>
		</view>
		<view class="footer">
			<u-input placeholder="备注" v-model="Extend2" border></u-input>
			<u-button type="searchFooter" size="medium" @click="submit" :disabled="adminLoading">提交</u-button>
		</view>
		<u-select v-model="dialogPWSProcess" :list='pwsprocesss' @confirm="confirmPWSProcessValue"> </u-select>
		<u-toast ref="uToast"></u-toast>
		<u-no-network></u-no-network>
		<u-popup v-model="levelTwoProcessDialog" mode="top" :mask-close-able="false" border-radius="10" width="98%"
			class="popupDialog" closeable>
			<view class="popup_head">
				生产人员
			</view>
			<view class="list_label">
				您正在填写生产人员对应的二级工序，{{LevelTwoProcessData.length > 0?'已':'暂未'}}配置二级工序
			</view>
			<view class="popup_content" style="padding: 0;">
				<view class="list_8">
					<view class="tableHeader">
						<u-table class="table">
							<view>
								<u-tr>
									<u-td class="th" width="10%">
										<u-checkbox v-model="allSelect[1]" @click.native="seelctAll(1)"></u-checkbox>
									</u-td>
									<u-td class="th" width="30%">
										生产人员
									</u-td>
									<u-td class="th" width="60%">
										二级工序
									</u-td>
								</u-tr>
							</view>
						</u-table>
					</view>
					<view class="tableContent">
						<u-table class="table">
							<scroll-view class="scroll" scroll-y>
								<view v-for="(x,i) in userData" :key="i">
									<u-tr>
										<u-td class="th" width="10%">
											<u-checkbox v-model="x.isChecked"></u-checkbox>
										</u-td>
										<u-td class="th" width="30%">
											{{x.Name}}
										</u-td>
										<u-td class="th" width="60%">
											{{x.Remark2}}
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
				<view class="list_label">
					二级工序：单击选中
				</view>
				<view class="list_3 flex_around">
					<view style="width: 80%;border-right:1px solid #dcdcdc;height: 100%;overflow: hidden;">
						<scroll-view scroll-y="true" style="height: 100%;">
							<view class="flex_wrap">
								<u-button v-for="(a,b) in LevelTwoProcessData" :key="b" :type="a.isChecked?'primary':''"
									style="margin:0 5px 10px 5px" @click="clickProcess(a)">
									{{a.LevelTwoProcessName}}
								</u-button>
							</view>
						</scroll-view>
					</view>
					<view class="flex_column" style="width: 20%;height: 100%;">
						<u-button type="warning" style="width: 80%;margin: 0 10% 10px 10%;" @click="sureLevelTwo">添加
						</u-button>
						<u-button type="success" style="width: 80%;margin: 0 10%;" @click="sureClose">确定</u-button>
					</view>
				</view>
				<!-- 	<view class="popup_footer flex">
					<u-button type="primary" @click="sureAdd(true)">确定</u-button>
				</view> -->
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
				adminLoading: false,
				loginOutDialog: false,
				Extend2: "",
				levelTwoProcessDialog: false,
				userData: [],
				allSelect: [false, false],
				Types: '',
				list: [{
						name: '计件',
						disabled: false
					},
					{
						name: '计时',
						disabled: false
					},
					{
						name: '计件+计时',
						disabled: false
					}
				],
				userInfo: {},
				dialogPWSProcess: false,
				pwsprocesss: [],
				searchForm: {
					Name: 'haha',
					ProcessName: '嘻嘻',
				},
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
				ifOnShow: false,
				height: '',
				toDay: '',
				ProducedDate: '',
				noticeTag: 0,
				selectionData: [
					[],
					[]
				],
				UserInfoData_2: {},
				LevelTwoProcessData: [],
				CheckedProcessData: []
			}
		},
		onShow() {
			if (this.ifOnShow) {}
		},
		onHide() {
			this.ifOnShow = true;
		},
		onLoad(option) {
			_this = this;
			this.Types = '计件';
			this.toDay = formatDate.formatTodayDate();
			this.height = uni.getSystemInfoSync().windowHeight;
			let toData = JSON.parse(option.data);
			let newData = toData.newData;
			this.ProducedDate = toData.ProducedDate;
			this.noticeTag = toData.tag;
			this.userInfo = this.$store.getters.userInfo;
			this.UserInfoData_2 = this.$store.getters.UserInfoData_2;
			this.userInfo["dicID"] = 6710;
			this.getPWSData();
			this.getLineLevelTwoProcessData(newData[0].LineID);
			if (newData.length != 0) {
				newData.forEach(x => {
					// x.ProducedQty = x.PlanQty;
					this.$set(x, 'isChecked', false);
					this.$set(x, 'Types', '计件');
				})
			}
			this.userData = [];
			this.tableData = newData;
		},
		mounted() {},
		computed: {},
		watch: {},
		methods: {
			// 获取同一标记的人员
			getTagRemarkUser(Extend2) {
				this.userData = [];
				if (!Extend2) {
					let obj = JSON.parse(JSON.stringify(this.UserInfoData_2));
					obj["isChecked"] = true;
					if (this.LevelTwoProcessData.length == 1) {
						obj["Remark2"] = this.LevelTwoProcessData[0].LevelTwoProcessName;
					} else {
						obj["Remark2"] = ''
					}
					this.userData.push(obj);
					return
				}
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 25,
						Extend2: Extend2
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							res.data.data.forEach(a => {
								this.$set(a, 'isChecked', false);
								if (this.LevelTwoProcessData.length == 1) {
									this.$set(a, 'Remark2', this.LevelTwoProcessData[0]
										.LevelTwoProcessName);
								} else {
									this.$set(a, 'Remark2', '');
								}
								this.userData.push(a);
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
			// 获取线对应的二级工序
			getLineLevelTwoProcessData(LineID) {
				this.LevelTwoProcessData = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 7848,
						OrganizeID: LineID
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							res.data.data.forEach(a => {
								this.$set(a, 'isChecked', false);
								this.LevelTwoProcessData.push(a);
							})
						}
						this.getTagRemarkUser(this.UserInfoData_2.Extend2);
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
						})
					}
				})
			},
			// 全选
			seelctAll(index) {
				if (index == 0) {
					if (this.tableData.length != 0 && this.allSelect[0]) {
						this.tableData.forEach(m => {
							if (!m.isChecked) {
								this.$set(m, 'isChecked', true);
							}
						})
					} else if (this.tableData.length != 0) {
						this.tableData.forEach(m => {
							if (m.isChecked) {
								this.$set(m, 'isChecked', false);
							}
						})
					}
				} else {
					if (this.userData.length != 0 && this.allSelect[1]) {
						this.userData.forEach(m => {
							if (!m.isChecked) {
								this.$set(m, 'isChecked', true);
							}
						})
					} else if (this.userData.length != 0) {
						this.userData.forEach(m => {
							if (m.isChecked) {
								this.$set(m, 'isChecked', false);
							}
						})
					}
				}
			},
			// 选择核算类型
			radioChange(e) {
				this.getSelectionData(0);
				if (this.selectionData[0].length == 0) {
					this.$refs.uToast.show({
						title: '请勾选需要更改类型的数据！',
						type: 'error',
					})
					this.$nextTick(() => {
						_this.$set(_this, 'Types', '');
					})
				} else {
					this.selectionData[0].forEach(a => {
						this.$set(a, 'Types', e)
					})
				}
			},
			// 获取选中的数据
			getSelectionData(index) {
				this.$set(this.selectionData, index, []);
				if (index == 0) {
					this.tableData.forEach(a => {
						if (a.isChecked) {
							this.selectionData[index].push(a)
						}
					})
				} else {
					this.userData.forEach(a => {
						if (a.isChecked) {
							this.selectionData[index].push(a)
						}
					})
				}

			},
			getPWSData() {
				this.pwsprocesss = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 6725
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
			// 打开计件工序
			openPws(row) {
				this.currrentRow = row;
				this.dialogPWSProcess = true;
			},
			// 确定计件工序
			confirmPWSProcessValue(val) {
				let index = this.pwsprocesss.findIndex(m => {
					return m.value == val[0].value;
				});
				this.$set(this.userInfo, 'PWSProcessName', this.pwsprocesss[index].label);
				this.$set(this.userInfo, 'PWSProcessID', this.pwsprocesss[index].value);

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
						if (Data.length != 0) {
							Data.forEach(x => {
								x.ProducedQty = x.PlanQty;
							})
						}
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
			// 确定关闭
			sureClose() {
				this.levelTwoProcessDialog = false;
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
				// if(!this.userInfo.PWSProcessName){
				// 	_self.$refs.uToast.show({
				// 		title: '请选择计件工序！',
				// 		type: 'error',

				// 	})
				// 	return
				// }
				// 有配置二级工序的人员必须填写二级工序
				let newTag = 0;
				if (this.LevelTwoProcessData.length != 0) {
					this.userData.some(c => {
						if (!c.Remark2) {
							newTag = 1;
							return true;
						}
					})
				}
				if (newTag == 1) {
					_self.$refs.uToast.show({
						title: '请给生产人员添加二级工序，必填！',
						type: 'error',
					})
					return
				}
				if (_self.tableData.length != 0) {
					let flag = 0;
					_self.tableData.some(x => {
						x.Status = 1;
						x.dicID = 6704;
						x["Extend2"] = this.Extend2;
						x["ProducedDate"] = this.ProducedDate;
						if (x.Types != '计件') {
							if (!x.TotalHours || parseFloat(x.TotalHours) <= 0) {
								_self.$refs.uToast.show({
									title: '不是计件类型的都需要填时长！',
									type: 'error',

								})
								flag = 1;
								return true
							}
						} else {
							if (!x.ProducedQty || parseFloat(x.ProducedQty) <= 0) {
								_self.$refs.uToast.show({
									title: '计件类型数量必填！',
									type: 'error',

								})
								flag = 1;
								return true
							}
						}
						// if (x.Types == '计件+计时') {
						// 	if ((!x.TotalHours || parseFloat(x.TotalHours) <= 0) && (!x.ProducedQty || parseFloat(x
						// 			.ProducedQty) <= 0)) {
						// 		_self.$refs.uToast.show({
						// 			title: '计件+计时类型的数量与时长都要填写！',
						// 			type: 'error',

						// 		})
						// 		flag = 1;
						// 		return true
						// 	}
						// }
						// 判断是否填了计时，如果是计时类型
						let childrens = [];
						this.userData.forEach(a => {
							let obj = {};
							obj["dicID"] = 6710;
							obj["ProducedQty"] = x.ProducedQty;
							obj["TotalHours"] = x.TotalHours;
							obj["Account"] = a.Account;
							obj["Remark1"] = x.Types;
							obj["Remark2"] = a.Remark2;
							childrens.push(obj);
						})
						x["childrens"] = childrens;
						newData.push(x)

					})
					if (flag == 0) {
						if (newData.length == 0) {
							_self.$refs.uToast.show({
								title: '暂无可提交的数据，请检查是否填写了报工数量！',
								type: 'error',

							})
						} else {
							if (this.noticeTag == 1) {
								// 判断重复的产品相同的报工数是否重复提交
								this.$request.post({
									url: '/APSAPI/APSData',
									data: {
										dicID: 6704,
										MaterialID: this.tableData[0].MaterialID,
										ProducedQty: this.tableData[0].ProducedQty,
										ProducedDate: [this.ProducedDate, this.ProducedDate]
									}
								}).then(res => {
									if (res.data.result) {
										if (res.data.data.length == 0) {
											_self.saveData(_self.tableData);
										} else {
											uni.showModal({
												title: '【重复报工提示】',
												content: _self.tableData[0].MaterialName + '*' + _self
													.tableData[0]
													.ProducedQty +
													'当天存在重复报工记录，是否继续提交？',
												confirmText: '仍然提交',
												cancelText: '返回修改',
												success: function(res) {
													if (res.confirm) {
														_self.saveData(_self.tableData);
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
								uni.showModal({
									title: '提示',
									content: '您的报工数据即将提交，辛苦了！',
									success: function(res) {
										if (res.confirm) {
											_self.saveData(newData);
											// _self.$store.commit('setting/SetPeopleData', []);
										} else if (res.cancel) {
											return;
										}

									}
								});
							}
						}
					}
				} else {
					_self.$refs.uToast.show({
						title: '暂无可提交的数据！',
						type: 'error',

					})
				}
			},
			// 保存提交的数据
			saveData(newData) {
				if (this.adminLoading) {
					return
				}
				this.adminLoading = true
				let flag = 0;
				this.$request.post({
					url: '/APSAPI/SaveData',
					data: newData
				}).then(function(res) {
					if (res.data.result) {
						_self.adminLoading = false;
						_self.loginOutDialog = true;
					} else {
						_self.adminLoading = false;
						_this.$refs.uToast.show({
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
			// 打开填写二级工序弹框
			editLevelTwoProcess() {
				this.levelTwoProcessDialog = true;
			},
			// 选中二级工序
			clickProcess(row) {
				if (!row.isChecked) {
					this.$set(row, 'isChecked', true);
				} else {
					this.$set(row, 'isChecked', false);
				}
			},
			// 添加二级工序
			sureLevelTwo() {
				this.getSelectionData(1);
				if (this.selectionData[1].length == 0) {
					_this.$refs.uToast.show({
						type: 'error',
						title: '请勾选需要添加二级工序的人员！',

					})
				}
				this.getCheckedProcessData();
				if (this.CheckedProcessData.length == 0) {
					_this.$refs.uToast.show({
						type: 'error',
						title: '没有单击选中二级工序！',

					})
				} else {
					let names = this.CheckedProcessData.join(',');
					this.userData.forEach(b => {
						this.$set(b, 'Remark2', names)
					})
					this.clearChecked()
				}
			},
			// 清空二级工序选中
			clearChecked() {
				this.$set(this.selectionData, 1, []);
				this.LevelTwoProcessData.forEach(a => {
					this.$set(a, 'isChecked', false);
				})
			},
			// 获取选中的二级工序
			getCheckedProcessData() {
				this.CheckedProcessData = [];
				if (this.LevelTwoProcessData.length != 0) {
					this.LevelTwoProcessData.forEach(a => {
						if (a.isChecked) {
							this.CheckedProcessData.push(a.LevelTwoProcessName)
						}
					})
				}

			}
		}
	}
</script>
<style lang="scss" scoped>
	.editInput {
		::v-deep .u-input {
			background: #ffffdd !important;
		}
	}

	.head_one {
		height: 2.5rem;
		line-height: 2.5rem;
		text-align: center;
	}
</style>
