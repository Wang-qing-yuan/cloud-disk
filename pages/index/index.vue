<template>
	<view>
		<!-- 自定义导航栏 -->
		<nav-bar>
			<template v-if="checkCount == 0">
				<!-- 插槽再一次发挥逆天作用，进入子目录，左边将变成返回箭头，导航栏变成子目录名称 -->
				<template slot="left">
					<view
						style="width: 60rpx;height: 60rpx;"
						class="flex align-center justify-center bg-light rounded-circle ml-3"
						hover-class="bg-hover-light"
						@tap="backUp"
						v-if="current"
					>
						<text class="iconfont icon-fanhui"></text>
					</view>
					<text class="font-md ml-3">{{ current ? current.name : '首页' }}</text>
				</template>
				<template slot="right">
					<view
						style="width: 60rpx; height: 60rpx;"
						class="flex align-center justify-center bg-icon rounded-circle mr-3"
						@tap="openAddDialog"
					>
						<text class="iconfont icon-zengjia"></text>
					</view>
					<view
						style="width: 60rpx; height: 60rpx;"
						class="flex align-center justify-center bg-icon rounded-circle mr-3"
						@click="openSortDialog"
					>
						<text class="iconfont icon-gengduo"></text>
					</view>
				</template>
			</template>

			<template v-else>
				<view slot="left" class="font-md ml-3 text-primary" @click="handleCheckAll(false)">取消</view>
				<view class="font-md font-weight-bold">已选中{{ checkCount }}个</view>
				<view slot="right" class="font-md ml-3 text-primary" @click="handleCheckAll(true)">全选</view>
			</template>
		</nav-bar>
		<view style="height: 1000px;">
			<!-- 搜索框，设置圆角 -->
			<!-- <uni-search-bar :radius="100" ></uni-search-bar> -->

			<!-- 搜索框 -->
			<view class="px-3 py-2">
				<view class="position-relative">
					<view
						style="height: 70rpx;width: 70rpx;position: absolute;top: 0;left: 0;"
						class="flex align-center justify-center text-light-muted"
					>
						<text class="iconfont icon-sousuo"></text>
					</view>
					<input
						style="height: 70rpx;padding-left: 70rpx;"
						type="text"
						class="bg-light font-md rounded-circle"
						placeholder="搜索网盘文件"
						@input="search"
					/>
				</view>
			</view>
			<!-- 列表 -->
			<f-list
				v-for="(item, index) in list"
				:key="index"
				:item="item"
				@click="doEvent(item)"
				:index="index"
				@select="select"
			></f-list>
		</view>

		<!-- 底部操作条 -->
		<!-- 选中个数大于0才会出现这个操作条 -->
		<view v-if="checkCount > 0">
			<!-- 这里要留一定的高度，因为底部操作条需要被固定在底部，并空出底部tabbar高度的地方 -->
			<view style="height: 115rpx;"></view>
			<!-- 操作条容器的样式，高度，颜色，固定在底部，垂直方向拉升效果 -->
			<view style="115rpx" class="flex align-stretch bg-primary text-white fixed-bottom">
				<!-- 根据元素个数等分容器，所以要么四个等分，要么两个等分，行高的修改可以让图标和文字之间的距离变得合理，点击还会变色:hover-class -->
				<view
					class="flex-1 flex flex-column align-center justify-center"
					style="line-height: 1.5;"
					v-for="(item, index) in actions"
					:key="index"
					hover-class="bg-hover-primary"
					@click="handleBottomEvent(item)"
				>
					<text class="iconfont" :class="item.icon"></text>
					{{ item.name }}
				</view>
			</view>
		</view>

		<!-- 是否要删除 -->
		<f-dialog ref="delete">是否删除选中的文件？</f-dialog>

		<!-- 重命名，通过ref定义不同的对话框对象，不同操作弹出的dialog是不同的对象 -->
		<f-dialog ref="rename">
			<input
				type="text"
				v-model="renameValue"
				class="flex-1 bg-light rounded px-2"
				style="height: 95rpx;"
				placeholder="重命名"
			/>
		</f-dialog>

		<!-- 新建文件夹，使用自定义弹出层，使用input作为插槽，绑定data中的newdirname变量 -->
		<f-dialog ref="newdir">
			<input
				type="text"
				v-model="newdirname"
				class="flex-1 bg-light rounded px-2"
				style="height: 95rpx;"
				placeholder="新建文件夹名称"
			/>
		</f-dialog>
		<!-- 添加操作条，应当能理解这里ref的作用了，type表示弹出层的位置类型，具体取值都在popup子组件中 -->
		<uni-popup ref="add" type="bottom">
			<view class="bg-white flex" style="height: 200rpx;">
				<!-- 遍历addList数组，纵向flex，为每个操作分配等高的空间，每个操作有图标和名称组成 -->
				<view
					class="flex-1 flex align-center justify-center flex-column"
					hover-class="bg-light"
					v-for="(item, index) in addList"
					:key="index"
					@tap="handleAddEvent(item)"
				>
					<!-- 每个操作的图标，可以传入图标的名称和颜色，很灵活 -->
					<text
						style="width: 110rpx;height: 110rpx;"
						class="rounded-circle bg-light iconfont flex align-center justify-center"
						:class="item.icon + ' ' + item.color"
					></text>
					<!-- 每个操作系统 -->
					<text class="font text-muted">{{ item.name }}</text>
				</view>
			</view>
		</uni-popup>
		<!-- 排序框，底部弹出，遍历排序操作数组，为当前索引项绑定文字蓝色样式 -->
		<uni-popup ref="sort" type="bottom">
			<view class="bg-white">
				<view
					v-for="(item, index) in sortOptions"
					:key="index"
					class="flex align-center justify-center py-3 font border-bottom border-light-secondary"
					:class="index === sortIndex ? 'text-main' : 'text-dark'"
					hover-class="bg-light"
					@click="changeSort(index)"
				>
					{{ item.name }}
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar.vue';
import navBar from '@/components/common/nav-bar.vue';
import fList from '@/components/common/f-list.vue';
import fDialog from '@/components/common/f-dialog.vue';
import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue';
export default {
	components: {
		uniSearchBar,
		navBar,
		fList,
		fDialog,
		uniPopup
	},
	data() {
		return {
			renameValue: '',
			newdirname: '',
			dirs: [],
			sortIndex: 0,
			sortOptions: [
				{
					name: '按名称排序',
					key: 'name'
				},
				{
					name: '按时间排序',
					key: 'created_time'
				}
			],
			list: [],
			addList: [
				{
					icon: 'icon-file-b-6',
					color: 'text-success',
					name: '上传图片'
				},
				{
					icon: 'icon-file-b-9',
					color: 'text-primary',
					name: '上传视频'
				},
				{
					icon: 'icon-file-b-8',
					color: 'text-muted',
					name: '上传文件'
				},
				{
					icon: 'icon-file-b-2',
					color: 'text-warning',
					name: '新建文件夹'
				}
			]
		};
	},
	methods: {
		select(e) {
			this.list[e.index].checked = e.value;
		},
		//全选/取消全选
		handleCheckAll(checked) {
			this.list.forEach(item => {
				item.checked = checked;
			});
		},
		//处理底部操作时间
		handleBottomEvent(item) {
			switch (item.name) {
				case '删除':
					this.$refs.delete.open(close => {
						//加载框过渡下
						uni.showLoading({
							title: '删除中...',
							mask: false
						});
						let ids = this.checkList.map(item => item.id).join(',');
						this.$H
							.post(
								'/file/delete',
								{
									ids
								},
								{ token: true }
							)
							.then(res => {
								this.getData();
								uni.showToast({
									title: '删除成功',
									icon: 'none'
								});
								uni.hideLoading();
							})
							.catch(err => {
								uni.hideLoading();
							});
						//对List进行过滤，留下未被选中的
						//this.list = this.list.filter(item => !item.checked);
						close();
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						});
					});
					break;
				case '重命名':
					//只能对单个文件进行，所以取this.checkList[0],也就是选中的唯一元素
					this.renameValue = this.checkList[0].name;
					this.$refs.rename.open(close => {
						if (this.renameValue == '') {
							return uni.showToast({
								title: '文件名称不能为空',
								icon: 'none'
							});
						}
						console.log(this.checkList[0].id + '>>>>>>>>' + this.file_id);
						this.$H
							.post(
								'/file/rename',
								{
									id: this.checkList[0].id,
									file_id: this.file_id,
									name: this.renameValue
								},
								{ token: true }
							)
							.then(res => {
								this.checkList[0].name = this.renameValue;
								uni.showToast({
									title: '重命名成功',
									icon: 'none'
								});
							});
						close();
					});
					break;
				case '下载':
					this.download();
					break;
				case '分享':
					this.share();
					this.handleCheckAll(false);
					break;
				default:
					break;
			}
		},
		//打开添加操作条
		openAddDialog() {
			this.$refs.add.open();
		},
		handleAddEvent(item) {
			this.$refs.add.close();
			switch (item.name) {
				case '上传图片':
					uni.chooseImage({
						count: 9,
						success: res => {
							// 选择图片成功，就循环异步调用上传接口
							res.tempFiles.forEach(item => {
								this.upload(item, 'image');
							});
						}
					});
					break;
				case '新建文件夹':
					this.$refs.newdir.open(close => {
						if (this.newdirname == '') {
							return uni.showToast({
								title: '文件夹名称不能为空',
								icon: 'none'
							});
						}
						//模拟请求服务器，这里先增加到List数组中
						this.$H
							.post(
								'/file/createdir',
								{
									file_id: this.file_id,
									name: this.newdirname
								},
								{ token: true }
							)
							.then(res => {
								this.getData();
								uni.showToast({
									title: '新建文件夹成功',
									icon: 'none'
								});
							});

						close();
						this.newdirname = '';
					});
					break;

				default:
					break;
			}
		},
		doEvent(item) {
			switch (item.type) {
				case 'image':
					let images = this.list.filter(item => {
						return item.type === 'image';
					});
					uni.previewImage({
						current: item.url,
						urls: images.map(item => item.url)
					});
					break;

				case 'video':
					uni.navigateTo({
						url: '../video/video?url=' + item.url + '&title=' + item.name
					});
					break;
				default:
					this.dirs.push({
						id: item.id,
						name: item.name
					});
					this.getData();
					uni.setStorage({
						key: 'dirs',
						data: JSON.stringify(this.dirs)
					});
					break;
			}
		},
		//根据排序类型的索引切换不同的排序，关闭sort排序框
		changeSort(index) {
			// this.sortIndex = index;
			// this.$refs.sort.close();
			this.sortIndex = index;
			this.getData();
			this.$refs.sort.close();
		},
		//打开sort排序框
		openSortDialog() {
			this.$refs.sort.open();
		},
		//将数据格式化为需要显示的样子
		formatList(list) {
			return list.map(item => {
				let type = 'none';
				if (item.isdir === 1) {
					type = 'dir';
				} else {
					type = item.ext.split('/')[0] || 'none';
				}
				return {
					type,
					checked: false,
					...item
				};
			});
		},
		getData() {
			console.log(this.file_id + '>>>>>>>>');
			let orderby = this.sortOptions[this.sortIndex].key;
			console.log(orderby + '&&&&&');
			this.$H
				.get(`/file?file_id=${this.file_id}&orderby=${orderby}`, {
					token: true
				})
				.then(res => {
					console.log(res);
					this.list = this.formatList(res.rows);
				});
		},
		backUp() {
			this.dirs.pop();
			this.getData();
			uni.setStorage({
				key: 'dirs',
				data: JSON.stringify(this.dirs)
			});
		},
		search(e) {
			if (e.detail.value == '') {
				return this.getData();
			}
			this.$H
				.get('/file/search?keyword=' + e.detail.value, {
					token: true
				})
				.then(res => {
					this.list = this.formatList(res.rows);
				});
		},
		//生成唯一ID
		getID(length) {
			return Number(
				Math.random()
					.toString()
					.substr(3, length) + Date.now()
			).toString(36);
		},
		//上传
		upload(file, type) {
			//上传文件的类型
			let t = type;
			//上传的key，用来区分每个文件
			const key = this.getID(8);
			//构建上传文件的对象
			let obj = {
				name: file.name,
				type: t,
				size: file.size,
				key,
				progress: 0,
				status: true,
				create_time: new Date().getTime()
			};
			//创建上传任务，分发给Vuex的Actions，异步上传调度。主要是实现上传的进度的回调
			this.$store.dispatch('createUploadJob', obj);
			//上传、查询参数为当前位置所在目录的id，body参数为文件路径
			this.$H
				.upload(
					'/upload?file_id=' + this.file_id,
					{
						filePath: file.path
					},
					p => {
						//更新上传任务进度
						this.$store.dispatch('updateUploadJob', {
							status: true,
							progress: p,
							key
						});
					}
				)
				.then(res => {
					console.log(res);
					this.getData();
				});
		},
		download() {
			this.checkList.forEach(item => {
				if (item.isdir === 0) {
					const key = this.getID(8);

					let obj = {
						name: item.name,
						type: item.type,
						size: item.size,
						key,
						progress: 0,
						status: true,
						created_time: new Date().getTime()
					};

					//创建下载任务
					this.$store.dispatch('createDownLoadJob', obj);

					let url = item.url;

					let d = uni.downloadFile({
						url,
						success: res => {
							if (res.statusCode === 200) {
								console.log('下载成功', res);
								uni.saveFile({
									tempFilePath: item.tempFilePath
								});
							}
						}
					});

					d.onProgressUpdate(res => {
						this.$store.dispatch('updateDownLoadJob', {
							progress: res.progress,
							status: true,
							key
						});
					});
				}
			});

			uni.showToast({
				title: '已加入下载列表',
				icon: 'none'
			});
			this.handleCheckAll(false);
		},
		share() {
			this.$H
				.post(
					'/share/create',
					{
						file_id: this.checkList[0].id
					},
					{ token: true }
				)
				.then(res => {
					uni.showModal({
						content: res,
						showCancel: false,
						success: result => {
							//不能再用res,会和前面冲突
							// #ifndef H5
							uni.setClipboardData({
								//复制到剪切板
								data: res,
								success: () => {
									uni.showToast({
										title: '复制成功',
										icon: 'none'
									});
								}
							});
							// #endif
						}
					});
				});
		}
	},
	computed: {
		file_id() {
			let l = this.dirs.length;
			if (l === 0) {
				return 0;
			}
			return this.dirs[l - 1].id;
		},
		current() {
			let l = this.dirs.length;
			if (l === 0) {
				return false;
			}
			return this.dirs[l - 1];
		},
		//选中列表
		checkList() {
			return this.list.filter(item => item.checked);
		},
		//选中数量
		checkCount() {
			return this.checkList.length;
		},
		//操作菜单
		actions() {
			if (this.checkCount > 1) {
				return [
					{
						icon: 'icon-xiazai',
						name: '下载'
					},
					{
						icon: 'icon-shanchu',
						name: '删除'
					}
				];
			}
			return [
				{
					icon: 'icon-xiazai',
					name: '下载'
				},
				{
					icon: 'icon-fenxiang-1',
					name: '分享'
				},
				{
					icon: 'icon-shanchu',
					name: '删除'
				},
				{
					icon: 'icon-chongmingming',
					name: '重命名'
				}
			];
		}
	},
	onLoad() {
		let dirs = uni.getStorageSync('dirs');
		if (dirs) {
			this.dirs = JSON.parse(dirs);
		}
		this.getData();
	}
};
</script>

<style></style>
