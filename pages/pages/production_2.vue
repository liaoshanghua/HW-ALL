<template>
	<view class="container_nopadding">
		<u-sticky :enable="enable">
			<!-- 只能有一个根元素 -->
			<view class="sticky">
				请选择要报工的生产组织：
			</view>
		</u-sticky>
		<u-tabs-swiper ref="uTabs" name="tabName" :list="list" :current="current" @change="changeTab" :is-scroll="false"
			active-color="#3e82f9 !important" inactive-color="#3e82f9"></u-tabs-swiper>

		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
			class="guideContent contentFour">
			<swiper-item class="swiper-item " @touchmove.stop>
				<view class="scroll">
					<scroll-view scroll-y>
						<view class="btn" v-for="(item,x) in lines" :key="x">
							<u-button type="gray" @click="toPageDetails(item,0)"
								:class="userInfo.OrganizeID == item.LineID?'active_gray':''">{{item.LineName}}
							</u-button>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item" @touchmove.stop>
				<view class="scroll">
					<scroll-view scroll-y>
						<view class="btn" v-for="(item,x) in lines_2" :key="x">
							<u-button type="gray" @click="toPageDetails(item,0)"
								:class="userInfo.OrganizeID == item.LineID?'active_gray':''">{{item.LineName}}
							</u-button>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item" @touchmove.stop>
				<view class="scroll">
					<scroll-view scroll-y>
						<view class="btn" v-for="(item,x) in lines_3" :key="x">
							<u-button type="gray" @click="toPageDetails(item,0)"
								:class="userInfo.OrganizeID == item.LineID?'active_gray':''">{{item.LineName}}</span>
							</u-button>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
		<view class="noticeFooter">
			<span class="text">用户：{{userInfo.Name}}</span>
			<span class="text">组织：{{userInfo.OrganizeName}}</span>
		</view>
		<u-top-tips ref="uToast"></u-top-tips>
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	import toTop from '@/common/toTop.vue';
	import formatDate from '@/common/formatDate.js';
	export default {
		components: {
			toTop
		},
		data() {
			return {
				list: [{
					tabName: '默认报工'
				}, {
					tabName: '借调报工'
				}, {
					tabName: '厂调报工'
				}],
				current: 0,
				swiperCurrent: 0,
				userInfo: {},
				enable: true,
				lines: [],
				lines_2: [],
				lines_3:[],
				Today: [],
				ifOnShow: false
			}
		},
		onShow() {
			if (this.ifOnShow) {
				this.enable = true;
				this.Today = [formatDate.formatTodayDate(), formatDate.formatTodayDate()];
				this.getLinesData();
			}
		},
		onHide() {
			this.enable = false;
			this.ifOnShow = true;
		},
		onLoad() {
			this.userInfo = this.$store.getters.userInfo;
			this.getLinesData();
		},
		mounted() {

		},
		methods: {
			// 切换标签页
			changeTab(index) {
				this.swiperCurrent = index;
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
			// 获取拉线
			getLinesData() {
				this.lines = [];
				let OrganizeIDs = this.userInfo.MFGOrganizeID;
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 36,
						OrganizeTypeID: 6,
						// OrganizeIDs: OrganizeIDs,
						// sort: 'ParentID ASC',
						Status: 1
					}
				}).then(res => {
					if (res.data.result) {
						this.lines = [];
						if (this.userInfo.MFGOrganizeID == 106) {
							this.lines_3 = res.data.data.filter(a =>
								a.OrganizeIDs.includes('107')
							);
						} else if (this.userInfo.MFGOrganizeID == 107) {
							this.lines_3 = res.data.data.filter(a =>
								a.OrganizeIDs.includes('106')
							);
						} else {
							this.lines_3 = [];
						}
						res.data.data.forEach(m => {
							this.$set(m, 'LineID', m.OrganizeID);
							this.$set(m, 'LineName', m.OrganizeName);
							let newIndex = -1;
							if (m.OrganizeID == this.userInfo.OrganizeID) {
								let obj = m;
								obj["LineName"] = m.OrganizeName;
								obj["LineID"] = m.OrganizeID;
								this.lines.push(obj);
							}
						})
						this.lines_2 = res.data.data.filter(a => !this.lines.some(b => {return b.OrganizeID == a && a.OrganizeIDs.includes(OrganizeIDs)
							.LineID}));
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',

						})
					}
				})
			},
			// 跳转至详情页
			toPageDetails(item) {
				this.$store.commit('setting/newHourProduction', item);
				uni.navigateTo({
					url: './newHourProduction'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	uni-swiper-item {
		overflow: auto !important;
	}
</style>
