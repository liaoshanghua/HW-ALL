function updateVersion(url, showCancel) {
	if (url) {
		uni.showToast({
			icon: "none",
			mask: true,
			title: '有新版本出现哦，下载完成后将自动弹出安装程序',
			duration: 3000
		});
		//设置最新版本apk的下载链接
		let downloadApkUrl = uni.getStorageSync('url') + url;
		let dtask = plus.downloader.createDownload(downloadApkUrl, {}, function(d, status) {
			// 下载完成
			uni.showToast({
				title: '下载完成',
				mask: false,
				duration: 1000
			});
			// 下载
			if (status == 200) {
				plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, e => e, function(error) {
					uni.showToast({
						title: '安装失败！',
						icon: 'none',
						duration: 2000
					});
				})
			} else {
				uni.showToast({
					title: '更新失败！',
					icon: 'none',
					duration: 2000
				});
			}
		});
		try {
			dtask.start(); // 开启下载的任务
			var prg = 0;
			var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
			dtask.addEventListener('statechanged', function(
				task,
				status
			) {
				// 给下载任务设置一个监听 并根据状态  做操作
				switch (task.state) {
					case 1:
						showLoading.setTitle("正在下载");
						break;
					case 2:
						showLoading.setTitle("已连接到服务器");
						break;
					case 3:
						prg = parseInt(
							(parseFloat(task.downloadedSize) /
								parseFloat(task.totalSize)) *
							100
						);
						showLoading.setTitle("  正在下载" + prg + "%  ");
						break;
					case 4:
						plus.nativeUI.closeWaiting();
						//下载完成
						break;
				}
			});
		} catch (err) {
			plus.nativeUI.closeWaiting();
			uni.showToast({
				title: '更新失败',
				mask: false,
				duration: 1500
			});
		}
	} else {
		uni.showToast({
			icon: "none",
			mask: true,
			title: '服务器上还未存放apk程序！',
			duration: 3000
		});
	}
	
	// uni.showModal({
	// 	title: "版本更新",
	// 	content: '有新版本发布，是否下载新版本？',
	// 	confirmText: '立即更新',
	// 	cancelText: '稍后进行',
	// 	showCancel,
	// 	success: (res) => {
	// 		if (res.confirm) {
				
	// 		}
	// 	}
	// });
}

export default updateVersion
