<template>
	<view>
		<view class="toTop" v-show="toTop" @click="handletoTop">
			<image src="../static/img/icon/top.png" mode="" style="width:60rpx;height: 60rpx;margin: 8rpx;"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'toTop',
		data() {
			return {

			};
		},
		props: ['toTop'],
		methods: {
			handletoTop() {
				this.$emit('handletotop');
			},
		}
	}
</script>

<style scoped>

</style>
