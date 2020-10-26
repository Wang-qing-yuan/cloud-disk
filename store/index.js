import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import $H from '../common/request.js'
export default new Vuex.Store({
	state: {
		user: null,
		token: null,
		uploadList: [],
		downlist: [],
	},
	actions: {
		logout({
			state
		}) {
			$H.post('/logout', {}, {
				token: true
			})
			state.user = null
			state.token = null
			uni.removeStorageSync('user')
			uni.removeStorageSync('token')
			uni.removeStorageSync('dirs');

			uni.reLaunch({
				url: '/pages/login/login'
			});
		},
		login({
			state
		}, user) {
			state.user = user
			state.token = user.token

			uni.setStorageSync('user', JSON.stringify(user))
			uni.setStorageSync('token', user.token)
		},
		initUser({
			state
		}) {
			let user = uni.getStorageSync('user')
			if (user) {
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		initList({
			state
		}) {
			if (stste.user) {
				let d = uni.getStorageSync("downlist_" + state.user.id)
				let u = uni.getStorageSync("uploadList_" + state.user.id)

				state.downlist = d ? JSON.parse(d) : [],
					state.uploalList = u ? JSON.parse(u) : []
			}
		},
		updateSize({
			state
		}, e) {
			state.user.total_size = e.total_size
			state.user.used_size = e.used_size
		},
		//创建一个上传任务
		createUploadJob({
			state
		}, obj) {
			//添加到上传队列的最前面
			state.uploadList.unshift(obj)
			//异步设置本地存储，记录键值对为：上传人和上传内容
			uni.setStorage({
				key: "uploadList_" + state.user.id,
				dadt: JSON.stringify(state.uploadList)
			})
		},
		//更新上传任务进度
		updateUploadJob({
			state
		}, obj) {
			//在上传队列中查找该用户的上传任务
			let i = state.uploadList.findIndex(item => item.key === obj.key)
			//如果存在
			if (i !== -1) {
				state.uploadList[i].progress = obj.progress
				state.uploadList[i].status = obj.status
				uni.setStorage({
					key: "uploadList_" + state.user.id,
					data: JSON.stringify(state.uploadList)
				})
			}
		},
		//创建一个下载任务
		createDownLoadJob({
			state
		}, obj) {
			//添加到上传队列的最前面
			state.downlist.unshift(obj)
			//异步设置本地存储，记录键值对为：下载人和下载内容
			uni.setStorage({
				key: 'downlist_' + state.user.id,
				data: JSON.stringify(state.downlist)
			})
		},
		//更新上传任务进度
		updateDownLoadJob({
			state
		}, obj) {
			//在上传队列中查找该用户的上传任务
			let i = state.downlist.findIndex(item => item.key === obj.key)
			//如果存在
			if (i !== -1) {
				//更新proress属性和上传状态值
				state.downlist[i].progress = obj.progress
				state.downlist[i].status = obj.status
				//异步更新本地存储
				uni.setStorage({
					key: 'downlist_' + state.user.id,
					data: JSON.stringify(state.downlist)
				})
			}
		},
		clearList({
			state
		}) {
			if (state.user) {
				uni.removeStorageSync('downlist_' + state.user.id)
				uni.removeStorageSync('uploadList' + state.user.id)

				state.uploadList = []
				state.downlist = []
			}

		},
		getShareUrl({
			state
		}) {
			// #ifndef H5
			uni.getClipboardData({
				success: (res) => {
					//通过前端结果可以看到剪贴的链接是以http://127.0.0.0:7001/开头的
					if (res.data.includes('http://127.0.0.1:7001/')) {
						//需要从完整的链接取出key的值
						let key = res.data.substring(res.data.lastIndexOf('\/') + 1, res.data.length)
						if (!key) {
							return
						}
						uni.showModal({
							content: '检测到有分享内容，是否打开',
							success: (res) => {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/shareurl/shareurl?key=' + key
									})
									//清空剪切板
									uni.setClipboardData({
										data: ''
									})
								}
							}
						})
					}
				}
			});
			// #endif
		}
	}
})
