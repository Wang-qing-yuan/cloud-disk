<!-- swiper内容随上面tab的切换联动 -->
      <swiper :duration="250" class="flex-1 flex" :current="tabIndex" @change="changeTab($event.detail.current)">
        <swiper-item class="flex-1 flex" v-for="(item, index) in tabBars" :key="index">
          <scroll-view scroll-y="true" class="flex-1">
            <view style="height: 60rpx;" class="bg-light flex align-center font-sm px-2 text-muted">文件下载至: storagr/xxxx/xxxx</view>
            <view class="p-2 border-bottom border-light-secondary font text-muted">下载中({{ downing.length }})</view>
            <!-- 同级还有f-list绑定了key为index，会冲突，所以加上不同的前缀区分，否则会报错 -->
            <f-list v-for="(item, index) in downing" :key="'i' + index" :item="item" :index="index">
              <view style="height: 70rpx;" class="flex align-center text-main">
                <text class="iconfont icon-zanting"></text>
                <text class="ml-1">{{ item.download }}%</text>
              </view>
              <!-- 进度条组件，uniapp自带 -->
              <progress slot="bottom" :percent="item.download" activeColor="#009CFF" :stroke-width="4"/>
            </f-list>
    
            <view class="p-2 border-bottom border-light-secondary font text-muted">下载完成{{ downed.length }}</view>
            <f-list v-for="(item, index) in downed" :key="'d' + index" :item="item" :index="index" :showRight="false"></f-list>
          </scroll-view>
        </swiper-item>
      </swiper>
已读
刚刚

<template>
  <view>
    <view
      class="p-3 flex align-center border-bottom border-light-secondary"
      hover-class="bg-light"
      @click="$emit('click')"
    >
      <text class="iconfont" :class="iconClass" style="font-size: 60rpx;"></text>
      <view class="flex flex-column ml-3" style="line-height: 1.2;">
        <text class="font-md">{{ item.name }}</text>
        <text class="font-sm text-muted">{{ item.create_time }}</text>
      </view>
      <view v-if="showRight" class="ml-auto">
        <slot>
          <view
            class=" flex align-center justify-center"
            style="width: 70rpx;height: 70rpx;"
            @click.stop="select"
          >
            <text
              v-if="!item.checked"
              style="height: 25rpx;width: 25rpx;"
              class="rounded-circle border"
            ></text>
            <text v-else class="iconfont icon-xuanze-yixuan text-primary" style="font-size: 40rpx;"></text>
          </view>
        </slot>
      </view>
      
    </view>
    <slot name="bottom"></slot>
  </view>
</template>
 
<script>
const icons = {
  dir: {
    icon: 'icon-file-b-2',
    color: 'text-warning'
  },
  image: {
    icon: 'icon-file-b-6',
    color: 'text-success'
  },
  video: {
    icon: 'icon-file-b-9',
    color: 'text-primary'
  },
  text: {
    icon: 'icon-file-s-7',
    color: 'text-info'
  },
  none: {
    icon: 'icon-file-b-8',
    color: 'text-muted'
  }
};
export default {
  props: {
    item: Object,
    index: [Number, String],
    showRight: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    iconClass() {
      let item = icons[this.item.type];
      return `${item.icon} ${item.color}`;
    }
  },
  methods: {
    select() {
      this.$emit('select', {
        index: this.index,
        value: !this.item.checked
      });
    }
  }
};
</script>
 
<style></style>