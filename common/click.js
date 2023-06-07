// 处理多次点击
function noMultipleClicks(methods) {
    let that = this;
    
    if (that.noClick) {
        that.noClick= false;
        methods();
        setTimeout(function () {
            that.noClick= true;
        }, 6000)
    } else {
    }
}

//导出
export default {
	noMultipleClicks,//禁止多次点击
}