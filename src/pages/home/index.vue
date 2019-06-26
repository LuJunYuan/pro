<template>
  <div>
    <!-- 轮播图 -->
   <swiper indicator-dots
  autoplay interval=5000 duration=2000 indicator-active-color="#fff">
  <block v-for="item in zhuye.message" :key="item.id">
    <navigator :url="item.navigator_url">
    <swiper-item>
      <image :src=item.image_src class="image" width="355" height="150"/>
    </swiper-item>
    </navigator>
  </block>
</swiper>
<!-- 分类 -->
<div class="categories">
  <div class="category-item" v-for="item in catitems.message" :key="item.name">
     <img :src="item.image_src" alt="">
  </div>
</div>
    <!-- 内容 -->
  <div class="floor" v-for="item in floordata.message" :key="item.index">
    <div class="floor-head">
 <!-- 注意要绑定属性 -->
 <img :src="item.floor_title.image_src" alt="">
    </div>
    <div class="floor-body">
      <!-- 左 -->
      <div class="floor-body-left">
 <img :src="item.product_list[0].image_src" alt="">
      </div>
      <!-- 右 -->
    <div class="floor-body-right">
                                         <!--注意下标，不写默认是0  -->
            <div  v-if="index2 > 0" v-for="(subitem,index2) in item.product_list" :key="subitem.name">
              <img :style="{width:subitem.image_width+'rpx'}" class="floor-body-right-img" :src="subitem.image_src" alt="">
            </div>
          </div>
    </div>
  </div>
        <!-- 返回顶部 -->
        <div v-show="dingbu" >
        <div @click="dainding" class="to-top">
       <img src="/static/img/arrow_top@2x.png" alt=""/>
       <text>顶部</text>
  </div>
       </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
     zhuye:[],
     catitems:[],
     floordata:[],
     dingbu:false
    }
  },
  onLoad(){
  
    this.getswiperdata()
    this.getcatitems()
    this.getfloordata()
  },
  // onPageScroll中的scrollTop是个对象,解构赋值
                 // 注意大小写 scrollTop 
  onPageScroll({scrollTop}){
    // console.log(scrollTop)

if(scrollTop>100){
  if(this.dingbu) return
  this.dingbu=true
}else{
    if(!this.dingbu) return
   this.dingbu=false
}

  },
  methods:{
    async getswiperdata(){
      const res = await this.$axios.get('home/swiperdata')
 console.log(res)
       
            this.zhuye=res.data
    },
    async getcatitems(){
      const res = await this.$axios.get('home/catitems')
 console.log(res)
       
            this.catitems=res.data
    },
    async getfloordata(){
      const res = await this.$axios.get('home/floordata')
        console.log(res)
            this.floordata=res.data
    },
    dainding(){
      // 返回顶部
         wx.pageScrollTo({
		  scrollTop: 0,
		  duration: 300
		})
    }
  }
}
</script>
<style  lang="less" scoped>

  swiper{
  width:750rpx;
  height: 400rpx;
  image{
    width:100%;
    height: 100%;
  }
}
.categories {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #ffffff;
  height: 150rpx;
  .category-item {
    width: 120rpx;
    height: 120rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.floor {
  margin-top: 20rpx;
  background-color: white;
  &-head {
    width: 750rpx;
    height: 59rpx;
    image {
      margin: 10rpx 0rpx 0rpx 10rpx;
      width: 100%;
      height: 100%;
    }
  }
  &-body {
    display: flex;
    padding: 20rpx 16rpx 10rpx 16rpx;
    &-left {
      width: 232rpx;
      height: 386rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    &-right {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      &-img {
        height: 188rpx;
        margin: 0 0 10rpx 10rpx;
      }
    }
  }
}
.end-tips {
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #888;
  .bottomline {
    margin-left: 5rpx;
  }
}
.to-top {
  width: 90rpx;
  height: 90rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  position: fixed;
  right: 40rpx;
  bottom: 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  image {
    width: 24rpx;
    height: 14rpx;
  }
  text {
    margin-top: 20rpx;
    color: #999;
  }
}
</style>
