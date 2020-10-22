<template>
  <view>
    <!-- 自定义导航栏 -->
    <nav-bar>
      <template v-if="checkCount == 0">
        <text slot="left" class="font-md ml-3">首页</text>
        <template slot="right">
          <view style="width: 60rpx; height: 60rpx;" 
          class="flex align-center justify-center bg-icon rounded-circle mr-3">
            <text class="iconfont icon-zengjia"></text>
          </view>
          <view style="width: 60rpx; height: 60rpx;" 
          class="flex align-center justify-center bg-icon rounded-circle mr-3">
            <text class="iconfont icon-gengduo"></text>
          </view>
        </template>
      </template>
      
      <template v-else>
        <view slot="left" class="font-md ml-3 text-primary" @click="handleCheckAll(false)">取消</view>
        <view class="font-md font-weight-bold">已选中{{checkCount}}个</view>
        <view slot="right" class="font-md ml-3 text-primary" @click="handleCheckAll(true)">全选</view>
      </template>

    </nav-bar>
    <view style="height: 1000px;">
      <!-- 搜索框，设置圆角 -->
      <uni-search-bar :radius="100"></uni-search-bar>
      <f-list v-for="(item, index) in list" :key="index" :item="item" :index="index" @select="select"></f-list>
    </view>
	
	<!-- 底部操作条 -->
			<!-- 选中个数大于0才会出现操作条 -->
			<view v-if="checkCount > 0">
				<!-- 这里要留一定高度，因为底部操作条需要被固定在底部，并空出底部tabbar高度的地方 -->
				<view style="height: 115rpx;"></view>
				<view style="height: 115rpx;" class="flex align-center bg-primary text-white fixed-bottom">
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
	<f-dialog ref="dialog">是否删除选中的文件？</f-dialog>
  </view>
</template>

<script>
  import uniSearchBar from '@/components/uni-ui/uni-search-bar/uni-search-bar.vue'
  import navBar from '@/components/common/nav-bar.vue'
  import fList from '@/components/common/f-list.vue'
  import fDialog from '@/components/common/f-dialog.vue'
  export default {
    components: {
      uniSearchBar,
      navBar,
      fList,
	  fDialog
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
    methods: {
      select(e) {
        //接收到子组件传递过来的索引选中状态，将对应的list中的数据更新
        this.list[e.index].checked = e.value
      },
      //全选/取消全选
      handleCheckAll(checked) {
        this.list.forEach(item => {
          item.checked = checked;
        });
      },
	  handleBottomEvent(item) {
	  			switch (item.name) {
	  				case '删除':
	  					this.$refs.dialog.open(close => {
	  						close();
	  						console.log('删除文件');
	  						console.log(this.checkList);
	  					});
	  					break;
	  				default:
	  					break;
	  			}
	  		}
    },
    computed: {
      //选中列表
      checkList() {
        return this.list.filter(item => item.checked);
      },
      //选中数量
      checkCount() {
        return this.checkList.length;
      },
      // 操作菜单
      actions() {
        if(this.checkCount > 1){
          return [{
            icon:"icon-xiazai",
            name:"下载"
          },{
            icon:"icon-shanchu",
            name:"删除"
          }]
        }
        return [{
          icon:"icon-xiazai",
          name:"下载"
        },{
          icon:"icon-fenxiang-1",
          name:"分享"
        },{
          icon:"icon-shanchu",
          name:"删除"
        },{
          icon:"icon-chongmingming",
          name:"重命名"
        }]
      }
    }
  };
</script>

<style></style>