<template>
  <view>
    <!-- 自定义导航栏 -->
    <nav-bar>
      <text slot="left" class="font-md ml-3 text-white">首页</text>
      <template slot="right">
        <view style="width: 60rpx; height: 60rpx;" class="flex align-center justify-center bg-icon rounded-circle mr-3"><text class="iconfont icon-zengjia"></text></view>
        <view style="width: 60rpx; height: 60rpx;" class="flex align-center justify-center bg-icon rounded-circle mr-3"><text class="iconfont icon-gengduo"></text></view>
      </template>
    </nav-bar>
	
   <view class="bg-light" style="height: 1000px;">
		<uni-search-bar radius="100" placeholder="搜索网盘文件"></uni-search-bar>
		<block v-for="(item, index) in list" :key="index"><f-list :item="item" :index="index"></f-list></block>
	</view>
  </view>
</template>

<script>
import uniSearchBar from '../../components/uni-ui/uni-search-bar/uni-search-bar';
import navBar from '@/components/common/nav-bar.vue';
import fList from '@/components/common/f-list.vue'
export default {
  components: {
    navBar,
	uniSearchBar,
	fList
  },
  data() {
    return {
						list: [{
								type: 'dir',
								name: '我的笔记',
								create_time: '2020-10-21 08:00',
								checked: false
							},
							{
								type: 'image',
								name: '风景.jpg',
								create_time: '2020-10-21 08:00',
								checked: false
							},
							{
								type: 'video',
								name: 'uniapp实战教程.mp4',
								create_time: '2020-10-21 08:00',
								checked: false
							},
							{
								type: 'text',
								name: '记事本.txt',
								create_time: '2020-10-21 08:00',
								checked: false
							},
							{
								type: 'none',
								name: '压缩包.rar',
								create_time: '2020-10-21 08:00',
								checked: false
							}
						]
	};
  },
  onLoad() {},
  methods: {}
};
</script>

<style></style>