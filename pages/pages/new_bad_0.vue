<template>
	<view class="container_nopadding ">
		<u-sticky :enable="enable">
			<!-- 只能有一个根元素 -->
			<view class="sticky">
				请选择你要提报不良的拉线！
			</view>
		</u-sticky>

		<view class="guideContent">
			<view class="btn" v-for="(item,x) in lines" :key="x">
				<u-button type="gray" @click="toPageDetails(item)">{{item.LineName}}</u-button>

			</view>
		</view>
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
				userInfo: {},
				enable: true,
				lines: [],
				ifOnShow: false
			}
		},
		onShow() {
			if (this.ifOnShow) {
				this.enable = true;
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
			// 获取拉线
			getLinesData() {
				this.lines = [];
				let OrganizeIDs = this.$store.getters.userInfo.MFGOrganizeID;
				let orgData = this.$store.getters.userInfo.Organizes;
				this.$request.post({
					url: '/APSAPI/APSData',
					data: {
						dicID: 36,
						OrganizeTypeID: 6,
						OrganizeIDs: OrganizeIDs,
						Status: 1,
						sort: 'ParentID ASC'
					}
				}).then(res => {
					if (res.data.result) {
						this.lines = [];
						if (res.data.data.length != 0) {
							res.data.data.forEach(m => {
								let newIndex = -1;
								if (this.userInfo.Organizes.length != 0) {
									newIndex = this.userInfo.Organizes.findIndex(n => {
										return n == m.OrganizeID
									});
								}
								if (newIndex != -1) {
									let obj = m;
									obj["LineName"] = m.OrganizeName;
									obj["LineID"] = m.OrganizeID;
									this.lines.push(obj);
								}
								// let newOrg = m.OrganizeIDs.split('$');
								// if (newOrg.findIndex(x => {
								// 		return x == this.userInfo.OrganizeID
								// 	}) != -1) {
								// 	let obj = m;
								// 	obj["LineName"] = m.OrganizeName;
								// 	obj["LineID"] = m.OrganizeID;
								// 	obj["PlanTotal"] = 0;
								// 	this.lines.push(obj);
								// }
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
			// 跳转至详情页
			toPageDetails(item, index) {
				this.$store.commit('setting/new_bad_1', item);
				uni.navigateTo({
					url: './new_bad_1'
				})
			}
		}
	}
</script>
