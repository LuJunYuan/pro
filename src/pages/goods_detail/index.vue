<template>
<!-- 要加div -->
    <div v-if="goodsu">
       <swiper indicator-dots
  autoplay interval=5000 duration=2000 indicator-active-color="#fff">
  <block v-for="item in goodsu.pics" :key="item.id">
    <swiper-item>
      <image :src="item.pics_mid" @click="yulan(item.pics_big)" class="image" width="355" height="150"/>
    </swiper-item>
  </block>
</swiper>
           <!-- 商品信息 -->
<view class="product-info">
      <view class="product-head">
        <text class="price">￥{{goodsu.goods_price}}</text>
      </view>
      <view class="product-body">
        <view class="product-name">{{goodsu.goods_name}}</view>
        <view class="product-like">
          <view class="iconfont icon-shoucang"></view>
          <view>
            <text>收藏</text>
          </view>
        </view>
      </view>
      <view class="product-foot">
        <text>快递：免运费</text>
      </view>
    </view>
     <view class="part">
      <view class="part-item part-line">
        <text class="note">促销
        </text>
        <text class="color-main description">满300减30元
        </text>
      </view>
      <view class="part-item">
        <text class="note">已选
        </text>
        <text class="description">黑色/S/1件
        </text>
      </view>
    </view>
     <!-- 4.0 收获地址 -->
    <view
      class="part"
      @click="chooseAddress"
    >
      <view class="part-item">
        <text class="note">送至</text>
        <view v-if="address">
             {{address.provinceName}} {{address.cityName}} {{address.countyName}} 
        </view>
        <view v-else>
          <text>请选择收货地址</text>
        </view>
        <view
          style="float:right;"
          class="iconfont icon-jiantouyou"
        ></view>
      </view>
    </view>
      <!-- 5.0 tabs栏目的展示 -->
    <view class="tabs">
      <view class="tabs-head">
        <view @click="tabSelect(index)" :class="[currentTabIndex===index ? 'active':'','tabs-item']" v-for="(item,index) in tabs" :key="index">
          <text>{{item}}</text>
        </view>
      </view>
      <view class="tabs-body">
      <!-- 图文介绍 -->
        <view v-show="currentTabIndex === 0">
          <div v-html="goodsu.goods_introduce"></div>
        </view>
        <view v-show="currentTabIndex === 1">
          <view v-for="(item,index) in goodsu.attrs" :key="item .attr_id" class="param-item">
            <text :class="['note',index ===goodsu.attrs.length-1?'param-item-last':'']">{{item.attr_name}}</text>
            <text :class="['description',index ===goodsu.attrs.length-1?'param-item-last':'']">{{item.attr_vals}}</text>
          </view>
        </view>
      </view>
    </view>
      <!-- 6.0 底部菜单条 -->
    <view class="fixed-bar">
      <view class="item">
        <!-- contact打开客服会话，如果用户在会话中点击消息卡片后返回小程序，可以从 bindcontact 回调中获得具体信息 -->
         <button class="contact-btn" open-type="contact"></button>
        <view class="iconfont icon-kefu"></view>
        <text class="note">联系客服</text>
      </view>
      <view @click="goToShopCart" class="item">
        <view class="iconfont icon-gouwuche"></view>
        <text class="note">购物车</text>
      </view>
      <view class="btn-group">
        <view @click="addToShopCart" class="btn yellow-btn">加入购物车</view>
        <view class="btn red-btn">立即购买</view>
      </view>
    </view>
    </div>
    
</template>

<script>
// 导入cart处理逻辑
import {addcart} from '../commpon/cart.js'
export default {
    data(){
        return {
          // 如果goodsu设置为null可能会报错,用v-if解决（v-if要包含所有内容）
        goodsu:null,  //获取数据
        address:null , //信息地址
         tabs:['图文介绍','规格参数'],
        currentTabIndex:0
        }

    },
onLoad(options){

 console.log(options.goods_id);
 
//   const id=options.goods_id
// options.goods_id 获取URL中的数据
   this.goodsid(options.goods_id)
    // 从本地加载address赋值
    // console.log(wx.getStorageSync('address'));
    if (wx.getStorageSync('address')){
      this.address = wx.getStorageSync('address')
    }
},

 methods:{
  //  获取数据
     async goodsid(id){
          const res= await this.$axios.get(`goods/detail?goods_id=${id}`)
        //  console.log(res);
        this.goodsu=res.data.message
         
     },
    //   图片预览
     yulan(current){
         wx.previewImage({
         current,  //需要预览图片的数组
         urls:this.goodsu.pics.map(item => item.pics_big) //需要预览的图片链接列表,
})
       
     },
    //  tab切换
     tabSelect(index){
    this.currentTabIndex=index
     },
    //  点击进入购物车
     goToShopCart(){
           wx.switchTab({ url:'/pages/shopcart/main'})
     },
    //  加入购物车
     addToShopCart(){
        //  提示加入购物车
         mpvue.showToast({
           title:'加入购物车',
           icon:'none',
           image:'/static/img/duigou.png',
           duration:2000,
           mask:true,
           success:res=>{}
         });
        //  给逻辑发送需要的参数
         addcart({
           goods_id:this.goodsu.goods_id,
           goods_number:1
         })

         
     },

    //  获取收货地址
     chooseAddress(){
      // 获取用户地址
       wx.chooseAddress({
         success:res=>{
            console.log(res);
            res.detailAddres=`${res.provinceName}${res.cityName}${res.countyName}${res.datailInfo}`
            // 给address赋值
            this.address=res
              // 保存到本地
          wx.setStorageSync("address",res)
         },
           // 用户拒绝，用户同意了，但是没有选择地址
         fail:({errMsg})=>{
           console.log(errMsg);
             // errMsg: "chooseAddress:fail auth deny" 用户拒绝的信息
             if (errMsg === 'chooseAddress:fail auth deny'){
            wx.showModal({
              title: '提示', //提示的标题,
              content: '请去我的页面打开授权选择收货地址', //提示的内容,
              showCancel: false, //是否显示取消按钮,
              confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
                // confirm为 true 时，表示用户点击了确定按钮
                if (res.confirm) {
                  // console.log('aaaaaaaaaa');
                                   // 跳转的时候要加上/(跟目录)  
                  wx.switchTab({ url:'/pages/my/main'})
                }
              }
            })
          }
         }

       })
     }
 }
}
</script>

<style lang="less" scoped>
 swiper{
  width:750rpx;
  height: 400rpx;
  image{
    width:100%;
    height: 100%;
  }
}
.product-info {
  display: flex;
  flex-direction: column;
  height: 300rpx;
  background-color: #fff;
  padding: 0 16rpx;
}

.product-head {
  height: 38rpx;
  padding: 40rpx 0;
}

.product-head .price {
  color: #ff2d4a;
  font-size: 50rpx;
  // margin-left: 10rpx;
}

.product-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-body .product-name {
  font-size: 34rpx;
  width: 546rpx;
  height: 88rpx;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-body .product-like {
  width: 50rpx;
  height: 78rpx;
  border-left: 1rpx solid #ddd;
  padding-left: 46rpx;
  margin-right: 30rpx;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.product-foot {
  font-size: 30rpx;
  color: #999;
  margin-top: 34rpx;
}

.part {
  background-color: #fff;
  margin: 20rpx 0;
  font-size: 32rpx;
  color: #999;
  &-line:after {
    content: '';
    height: 1rpx;
    width: 734rpx;
    background-color: #ddd;
    display: block;
    position: absolute;
    bottom: -1rpx;
  }
  &-item {
    display: flex;
    padding: 28rpx 16rpx;
    position: relative;
    align-items: center;
    // justify-content: space-between;
  }
}
.part .note {
  color: #333;
  margin-right: 40rpx;
}

.part .description {
  width: 490rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
.part .color-main {
  color: #ff2d4a;
}

.tabs {
  &-head {
    height: 100rpx;
    background-color: #fff;
    display: flex;
    .active {
      color: #ff2d4a;
      font-weight: 400;
      &:after {
        content: '';
        height: 12rpx;
        width: 100%;
        background-color: #ff2d4a;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
  &-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    position: relative;
  }
  &-body {
    background-color: #fff;
    padding: 16rpx;
    margin-bottom: 100rpx;
  }
}
.param-item {
  display: flex;
  height: 100rpx;
  line-height: 100rpx;
  border-top: 1px solid rgba(92, 92, 92, 0.3);
  border-right: 1px solid rgba(92, 92, 92, 0.3);
  border-left: 1px solid rgba(92, 92, 92, 0.3);
}
.param-item .note {
  padding-left: 30rpx;
  width: 300rpx;
  border-right: 1px solid rgba(92, 92, 92, 0.3);
}

.param-item-last {
  border-bottom: 1px solid rgba(92, 92, 92, 0.3);
}

.param-item .description {
  padding-left: 30rpx;
  width: 400rpx;
}
.fixed-bar {
  width: 750rpx;
  height: 98rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn-group {
    display: flex;
  }
  .btn {
    width: 213rpx;
    height: 98rpx;
    line-height: 98rpx;
    text-align: center;
    font-size: 30rpx;
    color: #fff;
  }
  .yellow-btn {
    background-color: #ffb400;
  }
  .red-btn {
    background-color: #ff2d4a;
  }
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .contact-btn {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .iconfont {
      width: 40rpx;
      height: 40rpx;
      font-size: 40rpx;
    }
    .note {
      margin-top: 10rpx;
      font-size: 22rpx;
      color: #666;
    }
  }
}
.iconfont .icon-shoucang {
  font-size: 50px;
  color: '#ff2d4a' !important;
}

.iconfont .icon-shoucang-fill {
  font-size: 50px;
  color: '#ff2d4a' !important;
}
</style>

