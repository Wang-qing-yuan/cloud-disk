<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化用户信息
			this.$store.dispatch('initUser')
			// 初始化任务列表
			this.$store.dispatch('initList')
		},
		onShow: function() {
			console.log('App Show')
			if (this.$store.state.user) {
				//去查看有无分享链接，这样进入页面就可以检测到是不是有粘贴过链接
				this.$store.dispatch('getShareUrl')
			}
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
/*引入官方样式库 */
@import url('./common/uni.css');
/*引入公共样式库 */
@import url('./common/common.css');
/*引入free样式库 */
@import url('./common/free.css');
/*引入图标库 */
@import url('./common/icon.css');
</style>
