<template>
	<view>
		<!-- 自定义导航栏 -->
		<nav-bar>
			<template v-if="checkCount === 0">
				<text slot="left" class="font-md ml-3">首页</text>
				<template slot="right">
					<view class="flex align-center justify-center bg-icon rounded-circle mr-3" style="width: 60rpx; height: 60rpx;" @tap="openAddDialog">
						<text class="iconfont icon-zengjia"></text>
					</view>
					<view class="flex align-center justify-center bg-icon rounded-circle mr-3" style="width: 60rpx;height: 60rpx;">
						<text class="iconfont icon-gengduo"></text>
					</view>
				</template>
			</template>

			<template v-else>
				<view slot="left" class="font-md ml-3 text-primary" @click="handleCheckAll(false)">取消</view>
				<view class="font-md font-weight-bold">已选中{{ checkCount }}</view>
				<view slot="right" class="font-md mr-3 text-primary" @click="handleCheckAll(true)">全选</view>
			</template>
		</nav-bar>
		<view class="px-3 py-2">
			<view class="position-relative">
				<view class="flex align-center justify-center text-light-muted" style="width: 70rpx;height: 70rpx;position: absolute;top: 0;left: 0;">
					<text class="iconfont icon-sousuo"></text>
				</view>
				<!-- <uni-search-bar :radius="20"  placeholder="搜索网盘文件" @confirm="search" cancelButton="none"></uni-search-bar> -->
				<input style="height: 70rpx;padding-left: 70rpx;" type="text" class="bg-light font-md rounded-circle" placeholder="搜索网盘文件" />
			</view>
		</view>

		<f-list v-for="(item, index) in list" :key="index" :item="item" @click="doEvent(item)" :index="index" @select="select"></f-list>

		<!-- 底部操作条 -->
		<!-- 选中个数大于0才会出现这个操作条 -->
		<view v-if="checkCount > 0">
			<view style="height: 115rpx;"></view>
			<view style="height: 115rpx;" class="flex align-stretch bg-primary text-white fixed-bottom">
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

		<!-- 是否要删除，通过ref指定为delete对话框？ -->
		<f-dialog ref="dialog">是否删除选中文件？</f-dialog>

		<!-- 重命名，通过ref定义不同的对话框对象，不同操作弹出的dialog是不同的对象 -->
		<f-dialog ref="rename"><input type="text" v-model="renameValue" class="flex-1 bg-light rounded px-2" style="height: 95rpx;" placeholder="重命名" /></f-dialog>

		<!-- 新建文件夹，使用自定义弹出层，使用input作为插槽，绑定data中的newdirname变量 -->
		<f-dialog ref="newdir"><input type="text" v-model="newdirname" class="flex-1 bg-light rounded px-2" style="height: 95rpx;" placeholder="新建文件夹名称" /></f-dialog>

		<!-- 添加操作条，应当能理解这里ref的作用了，type表示弹出层的位置类型，具体取值都在popup子组件中 -->
		<uni-popup ref="add" type="bottom">
			<view class="bg-white flex" style="height: 200rpx;">
				<!-- 遍历addList数组，纵向flex，为每个操作分配等高的空间，每个操作有图标和名称组成 -->
				<view class="flex-1 flex align-center justify-center flex-column" hover-class="bg-light" v-for="(item, index) in addList" :key="index" @tap="handleAddEvent(item)">
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
	</view>
</template>

<script>
import navBar from '@/components/common/nav-bar.vue';
import fList from '@/components/common/f-list.vue';
import fDialog from '@/components/common/f-dialog.vue';
import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue';
export default {
	components: {
		navBar,
		fList,
		fDialog,
		uniPopup
	},
	data() {
		return {
			renameValue: '',
			newdirname: '',
			title: 'Hello',
			list: [
				{
					type: 'dir',
					name: '我的笔记',
					create_time: '2020-10-21 08:00',
					//data: 'https://kkkksslls.oss-cn-beijing.aliyuncs.com/campus/积分.png',
					checked: false
				},
				{
					type: 'image',
					name: '风景.jpg',
					data: 'https://kkkksslls.oss-cn-beijing.aliyuncs.com/avatar/20200420202118.png',
					// create_time: '2020-10-21 08:00',
					checked: false
				},
				{
					type: 'video',
					name: 'uniapp实战教程.mp4',
					data: 'https://kkkksslls.oss-cn-beijing.aliyuncs.com/disk/%E7%90%86%E6%83%B3%E4%B8%89%E6%97%AC.mp4',
					// create_time: '2020-10-21 08:00',
					checked: false
				},
				{
					type: 'text',
					name: '记事本.txt',
					// data: 'https://kkkksslls.oss-cn-beijing.aliyuncs.com/campus/积分.png',
					create_time: '2020-10-21 08:00',
					checked: false
				},
				{
					type: 'none',
					name: '压缩包.rar',
					data: 'https://kkkksslls.oss-cn-beijing.aliyuncs.com/campus/积分.png',
					// create_time: '2020-10-21 08:00',
					checked: false
				}
			],
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
	onLoad() {
		uni.request({
			url: 'http://localhost:7001/list',
			method: 'GET',
			success: res => {
				console.log(res.data);
			}
		});
	},
	methods: {
		// 列表点击事件处理
				doEvent(item) {
					switch(item.type) {
						case 'image': //预览图片
						let images = this.list.filter(item => {
							return item.type === 'image'
						})
						uni.previewImage({
							current: item.data,
							urls: images.map(item=>item.data)
						})
						   break;
						case 'video':
						uni.navigateTo({
							url: '../video/video?url='+item.data + '&title='+item.name,
						});
						   break;
						default:
						   break;
					}
				},
		select(e) {
			this.list[e.index].checked = e.value;
		},
		handleCheckAll(checked) {
			this.list.forEach(item => {
				item.checked = checked;
			});
		},
		//处理底部操作条事件
		handleBottomEvent(item) {
			switch (item.name) {
				case '删除':
					this.$refs.dialog.open(close => {
						//对list进行过滤，留下来的未被选中的
						this.list = this.list.filter(item => !item.checked);
						close();
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						});
						// console.log('删除文件');
						// console.log(this.checkList);
					});
					break;
				case '重命名':
					//重命名只能对单个文件进行，所以取this.checkList[0],也就是选中的唯一元素
					this.renameValue = this.checkList[0].name;
					this.$refs.rename.open(close => {
						if (this.renameValue == '') {
							return uni.showToast({
								title: '文件名称不能为空',
								icon: 'none'
							});
						}
						//更新钙元素的name值，实时看到效果
						this.checkList[0].name = this.renameValue;
						close();
					});
					break;
				default:
					break;
			}
		},
		//打开添加操作条
		openAddDialog() {
			this.$refs.add.open();
		},
		//处理添加操作条的各种事件
		handleAddEvent(item){
			this.$refs.add.close();
			switch (item.name) {
				case '新建文件夹':
					this.$refs.newdir.open(close => {
						if (this.newdirname == ''){
						return uni.showToast({
							title: '文件夹名称不能为空',
							icon: 'none'
						});
					}
					//模拟请求服务器，这里先增加到list数组中
					this.list.push({
						type:'dir',
						name:this.newdirname,
						create_time:'2020-10-22 17:00',
						checked:false
					});
					uni.showToast({
						title:'新建文件夹成功',
						icon:'none'
					});
					close();
					});
					break;
				default:
					break;
			}
		}
	},
	computed: {
		checkList() {
			return this.list.filter(item => item.checked);
		},
		checkCount() {
			return this.checkList.length;
		},
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
	}
};
</script>

<style></style>
