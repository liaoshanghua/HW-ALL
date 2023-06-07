<template>
	<view class="">


		<u-popup v-model="dialogUser" mode="bottom" :mask-close-able="false" border-radius="10" width="98%"
			class="userDialog">
			<view class="popup_head">
				选择人员
			</view>
			<view class="popup_content">
				<view class="flex_between">
					<u-input type="select" v-model="popup.LineName" placeholder="" size="mini" border @click="openLine2"
						disabled style="margin-right:10px;">
					</u-input>
					<u-input type="text" v-model="popup.Name" placeholder="输入姓名" size="mini" border></u-input>
					<u-button type="searchFooter" size="mini" @click="getUserData" style="margin-left:10px;">查询
					</u-button>
				</view>
				<view class="bottom_border flex">
					<view class="f f1">
						选择
					</view>
					<view class="f f2">
						姓名
					</view>
					<view class="f f3">
						账号
					</view>
					<view class="f f4">
						组织
					</view>
				</view>
				<view class="list">
					<scroll-view class="scroll" scroll-y>
						<view class="bottom_border" v-for="(item, index) in userData" :key="index">
							<view class="f1">
								<u-checkbox v-model="item.checked" v-if="multiple"></u-checkbox>
								<u-checkbox v-model="item.checked" v-else @change="selectRow(item)"></u-checkbox>
							</view>
							<view class="f2">
								{{item.Name}}
							</view>
							<view class="f3">
								{{item.Account}}
							</view>
							<view class="f4">
								{{item.OrganizeName}}
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="popup_footer_2">
				<u-button type="error" size="medium" @click="close">取消</u-button>
				<u-button type="primary" size="medium" @click="sureUser">确定</u-button>
			</view>
		</u-popup>
		<u-select v-model="dialogLine2" :list='popupLines' @confirm="confirmLineValue2"> </u-select>
	</view>
</template>

<script>
	export default {
		props: {
			dialogUser: {
				type: Boolean,
				default: false
			},
			// 是否多选
			multiple: {
				type: Boolean,
				default: true
			},
			checkedUser: {
				type: Array,
				default: () => []
			}
		},
		created() {
			this.userInfo = this.$store.getters.userInfo;
			this.getLineData()
			this.getUserData();
		},
		data() {
			return {
				popupLines: [],
				currentRow: "",
				dialogLine2: false,
				userInfo: {},
				userData: [],
				popup: {
					LineName: '',
					Name: ''
				},
			}
		},
		watch: {
			'dialogUser': {
				handler: function(newValue, oldValue) {
					this.userData.forEach(x => {
						let newIndex = -1;
						this.checkedUser.findIndex(y => y.Account == x.Account);
						if (newIndex != -1) {
							this.$set(x, 'checked', true);
						} else {
							this.$set(x, 'checked', false);
						}
					})
				},
				deep: true
			}
		},
		methods: {
			// 获取生产线数据
			getLineData() {
				this.popupLines = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 3026,
						// OrganizeIDs: this.userInfo.OrganizeID,
						OrganizeTypeID: 6
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							res.data.data.forEach(x => {
								x["LineID"] = x.OrganizeID;
								x["LineName"] = x.OrganizeName;
								x["value"] = x.OrganizeID;
								x["label"] = x.OrganizeName;
							})
						}
						this.$set(this, 'popupLines', res.data.data);
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 打开线
			openLine2() {
				this.dialogLine2 = true;
			},
			// 确认线别
			confirmLineValue2(val) {
				this.popup.LineID = val[0].value;
				this.popup.LineName = val[0].label;
			},
			sureUser() {
				this.$emit('sureUser', this.userData)
			},
			// 关闭弹框
			close() {
				this.$emit('openUser', false);
			},
			getUserData() {
				this.userData = [];
				let form = {};
				form = {
					dicID: 3007,
					// OrganizeIDs: this.userInfo.OrganizeID,
					OrganizeID: this.popup.LineID,
					Name: this.popup.Name,
					OrganizeTypeID:5
				}
				this.$request.post({
					url: '/APSAPI/APSData',
					data: form
				}).then(res => {
					if (res.data.result) {
						this.userData = res.data.data;
						this.userData.forEach(x => {
							let newIndex = -1;
							this.checkedUser.findIndex(y => y.Account == x.Account);
							if (newIndex != -1) {
								this.$set(x, 'checked', true);
							} else {
								this.$set(x, 'checked', false);
							}
						})
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
						})
					}
				})
			},
			// 选择人员
			selectRow(row) {
				if (Object.values(this.currentRow).length != 0) {
					this.$set(this.currentRow, 'checked', false);
				}
				row.checked = true;
				this.$set(this, 'currentRow', row);
			}
		}
	}
</script>

<style>

</style>
