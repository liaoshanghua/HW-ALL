<template>
	<view :style="{backgroundImage:`url(${imageSrc})`,height:height + 'px !important' }" class="bg">
		<!-- <u-notice-bar type="warning" :list="list" mode="vertical" v-show="openDialog" class="notice"></u-notice-bar> -->
		<view class="login">
			<view class="title" @click="clickNum">APS生产报工
			</view>
			<div class='inputArea'>

				<view class="input right-icon">
					<u-input type='text' v-model:value="Account" placeholder='账号' class="icon-user" size="mini"
						autocomplete="off" />
				</view>
				<!-- <view class="input" style="display: none;">
					<u-input type='text' v-model="Account" placeholder='账号' class="icon-user" size="mini"  />
				</view>
				<view class="input" style="display: none;">
					<u-input type='password' v-model="Pwd" placeholder='账号' class="icon-user" size="mini"  />
				</view> -->
				<view class="input">
					<u-input type='password' v-model:value="Pwd" :password-icon="true" placeholder='密码' class="icon-password"
						size="mini" autocomplete="new-password" />
				</view>
				<!-- 			<view class="input down-icon">
					<u-input type='text' @click="openUnit" v-model="MFGOrganizeName" disabled placeholder='请选择' class="icon-unit2"
					 size="mini">
					</u-input>
					<u-icon name="arrow-down" @click="openUnit" size="30" class="selectRight">
					</u-icon>
				</view> -->
				<view class="input" :style="{display:clickSign == 5?'block':'none'}">
					<u-input type='text' v-model="url" placeholder='请输入URL地址' class='icon-url' />
				</view>
				<view class="alink">
					<view class="text" @click="editDialog = true">
						修改密码？
					</view>
				</view>
				<button @click="$noMultipleClicks(login)" class="btn">
					<view class="btnText">登录</view>
				</button>
			</div>
		</view>
		<view
			style="position:fixed;bottom:5px;right:0;font-size:9px;text-align: center;display: flex;justify-content: center;width: 100%;">
			<view class="">
				【此APP终端主要适用对象为车间员工】版本：{{$store.getters.Version}}
			</view>
		</view>

		<u-modal v-model="editDialog" @confirm="handleOk" ref="uModal" show-cancel-button :mask-close-able="false"
			title="修改密码" :title-style="{color: '#FFFFFF',
    background: 'rgb(24, 144, 255)',
    paddingTop: '10px',
    height: '40px',
    fontSize: '1.2rem'}">
			<view class="slot-content">
				<u-row class="row">
					<u-col :span="3.2">账号：</u-col>
					<u-col :span="8.8">
						<u-input v-model="userCode" placeholder="请输入账号" type="text" border></u-input>
					</u-col>
				</u-row>
				<u-row class="row">
					<u-col :span="3.2">旧密码：</u-col>
					<u-col :span="8.8">
						<u-input v-model="oldPwd" placeholder="请输入原始密码" type="text" border></u-input>
					</u-col>
				</u-row>
				<u-row class="row">
					<u-col :span="3.2">新密码：</u-col>
					<u-col :span="8.8">
						<u-input v-model="newPwd" placeholder="请输入新密码" type="text" border></u-input>
					</u-col>
				</u-row>
				<view class="text" @click="openNotice">
					忘记密码？
				</view>
			</view>
		</u-modal>
		<u-select v-model="OrgDialog" :list='OrganizeData' @confirm="comfirmOrg"> </u-select>
		<u-toast ref="uToast" />
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	// http://14.116.223.250:9257      
	import imageSrc from "@/static/newVersionImg/loginBG.png"
	var _self
	export default {
		data() {
			return {
				userCode: '',
				oldPwd: '',
				newPwd: '',
				editDialog: false,
				openDialog: false,
				Account: '',
				Pwd: '',
				url: '',
				MFGOrganizeName: '',
				MFGOrganizeID: '',
				OrgDialog: false,
				OrganizeData: [],
				clickSign: 0,
				show: false,
				imageSrc: imageSrc,
				clickSign: 0,
				showSelect: false,
				companysList: [{
					OrganizeName: '电子公司'
				}],
				unitDialog: false,
				isUpdate: false,
				noClick: true,
				height: '',
				list: ['请联系管理员：陈欣(337188)', '请联系管理员：陈欣(337188)', '请联系管理员：陈欣(337188)', '请联系管理员：陈欣(337188)',
					'请联系管理员：陈欣(337188)'
				]
			}
		},
		methods: {
			// 确认修改密码
			handleOk() {
				_self.editDialog = true;
				if (this.userCode && this.oldPwd && this.newPwd) {
					// 先判断原账号密码是否错误
					this.$request.post({
						url: '/APSAPI/APSData',
						data: {
							dicID: 25,
							Account: this.userCode
						}
					}).then(function(res) {
						if (res.data.result) {
							if (_self.oldPwd != res.data.data[0].Pwd) {
								_self.$refs.uToast.show({
									title: '账号或密码错误！',
									icon: true,
									type: 'error'
								})
							} else {
								_self.saveData();
							}
						} else {
							_self.$refs.uToast.show({
								title: res.data.msg,
								icon: true,
								type: 'error'
							})
						}
					})

				} else {
					_self.$refs.uToast.show({
						title: '请将修改信息填写完整！',
						icon: true,
						type: 'error'
					})

				}
			},
			// 忘记密码
			openNotice() {
				this.$refs.uToast.show({
					title: '请联系管理员陈欣(337188)',
					type: 'warning',
					icon: true,
					duration: '3000'
				})
			},
			// 保存新修改的密码
			saveData() {
				let newData = [];
				let obj = {};
				obj["Account"] = this.userCode;
				obj["Pwd"] = this.newPwd;
				obj["dicID"] = 25;
				newData.push(obj);
				this.$request.post({
					url: '/APSAPI/SaveData',
					data: newData
				}).then(function(res) {
					if (res.data.result) {
						_self.$refs.uToast.show({
							title: '修改成功！',
							icon: true,
							type: 'success'
						})
						_self.userCode = '';
						_self.oldPwd = '';
						_self.newPwd = '';
					} else {
						_self.$refs.uToast.show({
							title: res.data.msg,
							icon: true,
							type: 'error'
						})
					}
					_self.editDialog = false;
				})
			},
			// 点击五次出现地址
			clickNum() {
				if (this.clickSign > 5) {
					this.clickSign = 0
				} else {
					this.clickSign++
				}
			},
			// 获取焦点
			getFocus() {
				this.showSelect = true;
			},
			// 打开分公司
			openUnit() {
				setTimeout(() => {
					this.OrgDialog = true;
				}, 500)
			},
			// 确认分公司
			comfirmOrg(val) {
				this.MFGOrganizeName = val[0].label;
				this.MFGOrganizeID = val[0].value;
			},
			// 替换地址，重新获取分公司
			changeUrl(val) {
				this.MFGOrganizeID = '';
				this.MFGOrganizeName = '';
				this.getOrgData();
			},
			// 登录
			login() {
				if (this.Account == '' || this.Pwd == '') {
					uni.showToast({
						title: '请将登录信息填写完整！',
						icon: 'none'
					})
				} else {
					uni.setStorageSync('url', this.url);
					this.$request.post({
						url: '/Login/CheckAccount',
						data: {
							Account: this.Account,
							Pwd: this.Pwd
						}
					}).then(res => {
						if (res.data.result) {
							uni.setStorageSync('url', this.url);
							uni.setStorageSync('token', res.data.token);
							uni.setStorageSync('Account', res.data.Account);
							uni.setStorageSync('Pwd', this.Pwd);
							uni.setStorageSync('MFGOrganizeID', res.data.dev_Account.CenterID);
							this.$store.commit('setting/UserInfoData', {
								Account: res.data.Account,
								Pwd: this.pwd,
								Name: res.data.Name,
								OrganizeID: res.data.dev_Account.OrganizeID,
								OrganizeName: res.data.dev_Account.OrganizeName,
								Organizes: res.data.dev_Account.Organizes,
								MFGOrganizeID: res.data.dev_Account.CenterID,

							});
							uni.navigateTo({
								url: '/pages/index/newIndex'
							});
						} else {
							this.$refs.uToast.show({
								title: res.data.msg,
								icon: true,
								type: 'error'
							})
						}
					})
				}
			},
			// 获取分公司
			getOrgData() {
				uni.setStorageSync('url', this.url);
				this.OrganizeData = [];
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 36,
						OrganizeTypeID: 2
					}
				}).then(res => {
					if (res.data.result) {
						res.data.data.forEach(m => {
							this.OrganizeData.push({
								label: m.OrganizeName,
								value: m.OrganizeID
							})
						})
						if (res.data.data.length == 0) {
							this.MFGOrganizeName = res.data.data[0].OrganizeName;
							this.MFGOrganizeID = res.data.data[0].OrganizeID;
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.title,
							type: 'error',

						})
					}
				})
			}
		},
		onLoad() {
			// 192.168.43.214
			this.height = uni.getSystemInfoSync().windowHeight;
			_self = this;
			this.url = uni.getStorageSync('url') == '' ? 'http://121.9.64.70:9999' : uni.getStorageSync('url');
			this.Account = '';
			this.Pwd = '';
		},
		mounted() {
			uni.clearStorage()


		}
	};
</script>

<style lang="scss" scoped>
	.notice {
		position: absolute;
		top: 0;
		z-index: 99;
		left: 0;
		right: 0;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	::v-deep .u-input__input {
		font-size: 1.4rem;
		min-height: 3.15rem !important;
	}

	.login {
		width: 100%;
		margin-top: 35%;
		display: flex;
		flex-direction: column;

		.title {
			margin-bottom: 12rpx;
			letter-spacing: 0.3rem;
			font-weight: bold;
			font-size: 2.3rem;
			color: #FFFFFF;
			position: relative;
			display: flex;
			width: 100%;
			justify-content: center;
		}

		.inputArea {
			width: 70%;
			margin: 0 auto;
			margin-top: 50rpx;

			.input {
				margin-bottom: 1.2rem;
				border: 0.1rem solid rgba(255, 255, 255, 0.1);
				// background: rgba(255, 255, 255, 0.1);
				background: #FFFFFF;

				border-radius: 0.3rem;

				.uni-input-input,
				.uni-input-placeholder {
					color: #FFFFFF !important;
				}
			}

			.right-icon ::v-deep .u-flex {
				// padding: 0 0.5rem !important;
			}


			.down-icon {
				position: relative;
				margin-bottom: 0.3rem;

				.selectRight {
					position: absolute;
					right: 0.6rem;
					top: 1rem;
				}
			}

			.box {
				width: 88%;
				height: 350rpx;
				overflow: auto;
				position: absolute;
				top: 70rpx;
				left: 0;
				font-size: 30rpx;
				line-height: 60rpx;
				color: #9A9A9A;
				background: #fff;
				z-index: 100000;

				.list {
					padding-left: 20rpx;
				}
			}

			.icon-user,
			.icon-password,
			.icon-unit2,
			.icon-url {
				background-repeat: no-repeat;
				background-size: 1.2rem 1.2rem;
				background-position: 0.8rem;
			}

			.alink {
				font-size: 0.9rem;
				width: 100%;
				margin: 0 auto 1.1rem auto;
				color: #C4D6FF;

				.text {
					margin: 0 0 0 76%;
					width: 24%;
					border-bottom: 0.1rem solid #C4D6FF;
				}
			}

			.btn {
				background-color: #FFFFFF;
				color: #000000;
				letter-spacing: 0.2rem;
				border-radius: 0.3rem;
				font-weight: 550;
				border: none !important;
				line-height: 3.15rem;
				height: 3.15rem;
				background: #ffdb2b;
				font-size: 1.4rem;
			}
		}

	}



	.u-input {
		padding: 0 0.5rem 0 80rpx !important;
	}


	.slot-content {
		padding: 20rpx;

		.row {
			margin: 16rpx;
		}

		.text {
			font-size: 0.9rem;
			text-align: right;
			color: #7992ff;

		}

		::v-deep .u-input__input {
			min-height: 60rpx !important;
		}
	}
</style>
