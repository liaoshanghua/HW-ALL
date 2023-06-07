<template>
	<view class="container_nopadding">
		<view style="font:16px Helvetica Neue, Helvetica, PingFang SC, 微软雅黑, Tahoma, Arial, sans-serif;">
			<view style="width:100%;height:140px;background: #2387f6;position: relative;z-index:4">
				<view class="newHead">
					<span class="icon-login-user"> </span><span style="font-size:1.25em">{{userInfo.Name}},欢迎登录！</span>
				</view>
				<view class="newHead">
					<span>组织名称：{{userInfo.OrganizeName}}</span>
					<span style="position:absolute;right:10px">
						<u-button type="success" size="mini" @click='logout' style='height: 50rpx; '>退出登录</u-button>
					</span>
				</view>
			</view>
			<view style="width:100%;background: #f0eff4;padding:0 0 10px 0;font-size:0.875em;color:#444">
				<view
					style="margin:-30px 10px 0 10px;background:#fff;position:relative;z-index: 5;height:240px;border-radius:10px;">
					<view style="width:100%;height:190px;border-bottom:1px solid #f5f5f5">
						<view class="icon">
							<a class="aLink" href="#" @click="toPage('../pages/taskLook')"><svg class="iconImg"
									style="border-radius:5px;background-image: url(../../static/img/index/img1.png);background-size:100% 100%">
								</svg>
								<br>
								<span class="explain">计划任务</span></a>
						</view>
						<view class="icon">
							<a class="aLink" href="#" @click="toPage('../pages/production')"><svg class="iconImg"
									style="border-radius:5px;background-image: url(../../static/img/index/img2.png);background-size:100% 100%">
									<use xlink:href="#icon-churukujilu"></use>
								</svg>
								<br>
								<span class="explain">生产报工</span></a>
						</view>
						<view class="icon">
							<a class="aLink" href="#" @click="toPage('../pages/production_2')"><svg class="iconImg"
									style="border-radius:5px;background-image: url(../../static/img/index/img2.png);background-size:100% 100%">
									<use xlink:href="#icon-churukujilu"></use>
								</svg>
								<br>
								<span class="explain">其他计时</span></a>
						</view>
						<view class="icon">
							<a class="aLink" href="#" @click="toPage('../pages/productionRecord')"><svg class="iconImg"
									style="border-radius:5px;background-image: url(../../static/img/index/img3.png);background-size:100% 100%">
								</svg>
								<br>
								<span class="explain">报工查询</span></a>
						</view>
						<view class="icon">
							<a class="aLink" href="#" @click="toPage('../pages/aduitRecord')"><svg class="iconImg"
									style="border-radius:5px;background-image: url(../../static/img/index/img4.png);background-size:100% 100%">
								</svg>
								<br>
								<span class="explain">审核查询</span></a>
						</view>
						<view class="icon">
							<a class="aLink" href="#" @click="toPage('../pages/userReport')"><svg class="iconImg"
									style="border-radius:5px;background-image: url(../../static/img/index/img5.png);background-size:100% 100%">
								</svg>
								<br>
								<span class="explain">统计报表</span></a>
						</view>
						<view class="icon">
							<a class="aLink" href="#" @click="toPage('../pages/salarySearch')"> <svg class="iconImg"
									style="border-radius:5px;background-image: url(../../static/img/index/img9.png);background-size:100% 100%">
								</svg>
								<br>
								<span class="explain">工资查询</span></a>
						</view>
						<view class="icon">
							<a class="aLink" href="#" @click="toPage('../pages/AbnormalNo')"> <svg class="iconImg"
									style="border-radius:5px;background-image: url(../../static/img/index/img13.png);background-size:100% 100%">
								</svg>
								<br>
								<span class="explain">不良单据</span></a>
						</view>
					</view>
					<view style="width:100%;margin-top:5px;">
						<view style="padding:5px 0;width:35%;height:30px;float:left;border-right:1px solid #f5f5f5;">
							<a href="#"
								style="font-style:italic;font-size:1.5em;color:#fc7e44;font-weight: 800;margin-left:10px"
								@click="openVideo">操作指南</a>
						</view>
						<view style="width:60%;height:40px;float:left;padding:10px 0 5px 10px;">
							<span style="font-size:1.15em;color:#555;font-weight: 500;display:flex">点击分享二维码 <image
									src="../../static/newVersionImg/share.png" @click="openBarCode"
									style="width:25px;height:25px;margin-left:10px;">
								</image></span>
						</view>
					</view>
				</view>
				<view style="position:relative;height:30px;border-radius:10px;padding:0;margin:5px 10px 0 10px;">
					<u-notice-bar mode="vertical" :list="list"></u-notice-bar>
				</view>
				<!-- 资产情况 -->
				<view
					style="background:#fff;position:relative;height:230px;border-radius:10px;padding:15px 10px;margin:5px 10px 0 10px;">
					<view style="height:40px;">
						<span style="float:left;font-size:1.1em;color:black;font-weight:800;">计划详情</span><svg
							style="float:left;height:2px;width:19px;height:19px;margin-top:3px;margin-left:5px"
							aria-hidden="true">
							<use xlink:href="#icon-wenhao"></use>
						</svg>
					</view>
					<view style="background: #f4f7fe;height:30px;padding:5px 10px">
						<span style="font-size:1em;font-weight:bold;float:left">今日计划</span>
					</view>
					<view style="height:auto;padding:10px 10px 0 10px;display:flex">
						<view
							style="width:110px;height:110px;margin-top:5px;float:left;background-image: url(../../static/img/index/round.png);background-size:100% 100%">
						</view>
						<!-- <canvas canvas-id="canvasPie" id="canvasPie" class="pieChart"></canvas> -->
						<view style="height:120px;float:right;width:57%;margin-left:8px;">
							<view class="balance">
								<i class="dot" style="background: #ed5565;"></i><span>计划总数</span><span
									style="float:right">{{pieForm.Q2}}个</span>
							</view>
							<view class="balance">
								<i class="dot" style="background: #5050d6;"></i><span>已报工产品数</span><span
									style="float:right">{{pieForm.Q3}}个</span>
							</view>
							<view class="balance">
								<i class="dot" style="background: #ba55d3;"></i><span>未报工产品数</span><span
									style="float:right">{{pieForm.Q4}}个</span>
							</view>
							<view class="balance">
								<i class="dot" style="background: #1ab394;"></i><span>今日达成</span><span
									style="float:right">{{pieForm.P1}}</span>
							</view>
						</view>
					</view>
				</view>
				<view
					style="background:#fff;position:relative;height:auto;border-radius:10px;padding:15px 10px;margin:5px 10px 0 10px;">
					<view style="height:30px;">
						<span style="font-size:1.1em;color:black;font-weight:800;float:left;">近7日生产统计</span>
						<span class="trend" :class="{default:show==1}"
							style="border-right: 1px solid #8f8f8f;">本月</span>

					</view>
					<view style="height:auto;padding:0;width:100%">
						<canvas canvas-id="canvasColumn" id="canvasColumn" class="uchart"
							:disable-scroll='true'></canvas>
					</view>
				</view>
				<view style=" clear:both;"></view>
			</view>
		</view>
		<u-popup v-model="dialogCode" mode="center">
			<view class="" style="padding: 20rpx 20rpx;">
				<view class="" style="color: #007AFF;font-weight: bold;margin-bottom: 20rpx;">
					扫码下载安装！
				</view>
				<canvas id="qrcode" canvas-id="qrCodeCanvas"></canvas>
			</view>
		</u-popup>
		<u-popup v-model="dialogVideo" mode="center" length="95%" closeable>
			<view class="" style="padding: 20rpx 20rpx;">
				<video src="http://121.9.64.70:9999/manual-e1.mp4" style="width: 100%;height:600px"></video>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	var _self;
	var canvaBar = null;
	var canvaPie = null;
	const qrCode = require('@/common/weapp-qrcode.js');
	import updateVersion from '@/common/updateVersion.js';
	import formatDate from '../../common/formatDate.js';
	import uCharts from '../../components/u-charts/u-charts.js';
	export default {
		data() {
			return {
				dialogCode: false,
				list: [
					'志在巅峰的攀登者，不会陶醉在沿途的某个脚印中。',
					'当一个人用工作去迎接光明，光明很快就回来照耀着他。',
					'很多时候，我们不缺方法，缺的是一往无前的决心和魄力。',
					'再长的路，一步步也能走完，再短的路，不迈开双脚也无法到达。',
					'我们活着不能与草木同腐，不能醉生梦死，枉度人生，要有所作为。'
				],
				userInfo: {},
				pieChartData: {
					series: [{
						name: '已报工任务',
						data: 50
					}, {
						name: '未报工任务',
						data: 50
					}]
				},
				month: (new Date().getMonth() + 1) + '月',
				oldFivthDate: '',
				today: '',
				someDays: [],
				chartData: {
					categories: [],
					series: [{
							name: "计划数",
							color: '#FECB6C',
							legendShape: 'circle',
							data: []
						},
						{
							name: "确认数",
							color: '#5D8CF7',
							legendShape: 'circle',
							data: []
						}
					]
				},
				pieForm: {
					Q2: 0,
					Q3: 0,
					Q4: 0,
					P1: '0%'
				},
				show: 1,
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				dialogVideo: false
			};
		},
		methods: {
			// 打开操作视频
			openVideo() {
				this.dialogVideo = true;
			},
			// 打开二维码
			openBarCode() {
				this.dialogCode = true;
				setTimeout(() => {
					new qrCode('qrCodeCanvas', {
						text: 'http://121.9.64.70:9999/hw-e.apk',
						width: 200,
						height: 200,
						colorDark: '#333333',
						colorLight: "#ffffff",
						correctLevel: qrCode.CorrectLevel.H
					})
				}, 200)

			},
			// 退出登录
			logout() {
				uni.reLaunch({
					url: '../login/login'
				})
			},
			// 更新版本
			checkUpdate() {
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 6662,
						AppCode: "WJ1.1",
						Status: 1
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {

							if (res.data.data[0].Version != this.$store.getters.Version) {
								//更新
								updateVersion(res.data.data[0].Url, true);
							}
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							icon: true,
							type: 'error'
						})
					}
				})
			},
			// 跳转页面
			toPage(url, val) {
				if (val) {
					this.$refs.uToast.show({
						title: '功能暂未开放！',
						type: 'error',
						icon: true
					})
				} else {
					uni.navigateTo({
						url: url
					});
				}
			},
			// 获取车间看板
			getBoardData() {
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 6720,
						PlanDay: [this.oldFivthDate, this.today],
						fields: "SUM(PlanQty) as PlanQty,SUM(ConfirmQty) as ConfirmQty,FORMAT(PlanDay,'MM/dd') as PlanDay",
						groupby: 'PlanDay',
						sort: "PlanDay asc",
						MFGOrganizeID: this.userInfo.MFGOrganizeID
					}
				}).then(res => {
					if (res.data.result) {
						this.chartData.series[0].data = [];
						this.chartData.series[1].data = [];
						if (res.data.data.length == 0) {
							this.someDays.forEach(x => {
								this.chartData.series[0].data.push(0);
								this.chartData.series[1].data.push(0);
							})
						} else {
							this.someDays.forEach(m => {
								let newValue = {
									PlanQty: 0,
									ConfirmQty: 0
								};
								res.data.data.some(z => {
									if (m == z.PlanDay) {
										newValue.PlanQty = z.PlanQty;
										newValue.ConfirmQty = z.ConfirmQty;
										return
									}
								})
								this.chartData.series[0].data.push(parseFloat(newValue.PlanQty));
								this.chartData.series[1].data.push(parseFloat(newValue.ConfirmQty));
							})
						}
						this.showBar("canvasColumn", this.chartData);
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
							icon: true
						})
					}
				})
			},
			// 补0
			zero(num) {
				if (parseInt(num) < 10) {
					return '0' + num
				} else {
					return num
				}
			},
			// 饼状图
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 10,
					legend: {
						show: true
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: 110,
					height: 130,
					dataLabel: true,
					extra: {
						pie: {
							lableWidth: 5
						}
					},
					// colors: ["#639AFF", "#FFC164"],
					width: 110
				});
			},
			// 获取柱状图
			showBar(canvasId, chartData) {
				canvaBar = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					legend: {
						position: 'top',
						float: 'right'
					},
					fontSize: 10,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						gridType: 'dash',
						dashLength: 8,
						calibration: true,
						splitNumber: 5,
						min: 0,
						max: Math.max.apply(null, this.chartData.series[0].data) ? Number(Math.max.apply(null, this
								.chartData.series[0]
								.data)) +
							200 : null
					},
					dataLabel: true,
					enableScroll: false,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.45 / chartData.categories.length
						}
					}
				});
			},
			// 获取饼图数据
			getPieData() {
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 6721,
						PlanDay: [formatDate.formatTodayDate(), formatDate.formatTodayDate()],
						OrganizeIDs: this.userInfo.OrganizeID
					}
				}).then(res => {
					if (res.data.result) {
						if (res.data.data.length != 0) {
							this.pieForm = res.data.data[0];
						}
						// this.pieChartData.series[0].data = parseInt(this.pieForm.Q3);
						// this.pieChartData.series[1].data = parseInt(this.pieForm.Q4);
						// console.log(this.pieChartData)
						// this.showPie("canvasPie", this.pieChartData);
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
							icon: true
						})
					}
				})
			},
			// 获取登录人当前的信息
			getUserData() {
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 25,
						Account: this.userInfo.Account
					}
				}).then(res => {
					if (res.data.result) {
						this.$store.commit('setting/UserInfoData_2', res.data.data[0]);
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
							icon: true
						})
					}
				})
			}
		},
		watch: {},
		onLoad() {
			// 获取图数量
			this.getPieData();
			// 获取柱状图
			_self = this;
			this.cWidth = uni.upx2px(700);
			this.cHeight = uni.upx2px(500);
			this.oldFivthDate = formatDate.formatFivthDate();
			this.today = formatDate.formatTodayDate();
			this.userInfo = this.$store.getters.userInfo;
			this.getUserData()
			// 虚拟过去十天
			this.someDays = [];
			let someDay = [];
			let val = new Date().getDate();
			for (var i = 6; i >= 0; i--) {
				var d = new Date();
				d.setDate(d.getDate() - i);
				let month = this.zero(d.getMonth() + 1);
				let day = this.zero(d.getDate());
				let obj = month + '/' + day;
				if (day <= val) {
					someDay.push(day);
					this.someDays.push(obj);
				}
			}
			this.chartData.categories = someDay;
			this.getBoardData();

		},
		mounted() {}
	}
</script>

<style lang="scss" scoped>
	.newHead {
		position: relative;
		height: 30px;
		padding: 40px 20px 0px 20px;
		color: #fff;
		font-size: 0.8em;
		display: flex;
		align-items: center;
	}

	.icon-login-user {
		width: 18px;
		margin: 2px 5px 0 0;
		height: 18px;
		background-size: 100% 100%;
	}

	.icon {
		width: 25%;
		height: 42%;
		float: left;
		position: relative;
		text-align: center;
		margin-top: 15px;
	}

	.iconImg {
		width: 40px;
		height: 40px;
		margin-top: 3px;
		margin-bottom: 5px;

	}

	.aLink {
		width: 100%;
		height: 100%;
		text-decoration: none;
		color: #444;
		display: block;
	}

	a {
		text-decoration: none;
		cursor: pointer;
	}

	.aLink:visited {
		background: rgba(0, 0, 0, 0.2);
	}

	.dot {
		float: inherit;
		max-width: 10px;
		min-width: 10px;
		max-height: 10px;
		min-height: 10px;
		border-radius: 50%;
		margin-top: 5px;
		margin-left: 5px;
	}

	.explain {
		font-size: 0.875em
	}

	.balance {
		float: left;
		width: 100%;
		margin-bottom: 18px;
		font-size: 13px;
	}

	.balance span {
		margin-left: 3px;
	}

	.trend {
		float: right;
		width: 50px;
		background: #fff;
		color: #8f8f8f;
		border: hidden;
		text-align: center;
		cursor: pointer;
	}

	.default {
		color: #0A7DFA
	}

	.uchart {
		width: 100%;
		height: 250px;
	}

	.pieChart {
		height: 110px;
		width: 130px;

		uni-canvas {
			height: 130px;
		}
	}
</style>
