<template>
  <div>
    <!-- 1.收获地址选择 -->
    <view @click="chooseAddress" class="address">
      <view v-if="address" class="address-info">
        <view class="address-info-name-phone">
          <view>
            <text style="font-size:12px;">收货人：{{address.userName}}</text>
          </view>
          <view style="display:flex;align-items: center;">
            <text style="margin-right:36rpx;font-size:12px;">{{address.telNumber}}</text>
            <view class="iconfont-tap icon-jiantouyou"></view>
          </view>
        </view>
        <view class="address-info-detail-info">
          <text style="font-size:12px;">收货地址：{{address.detailAddress}}</text>
        </view>
      </view>
      <view v-else class="address-add">
        <text style="font-size:12px;">+ 新增地址</text>
      </view>
      <!-- <view class="address-pic">
        <image src="/static/img/cart_border@2x.png" />
      </view> -->
    </view>
    <!-- 2.0 购买的商品列表 -->
    <view class="order-list">
      <block v-for="item in goodsList" :key="item.goods_id">
        <view class="product-item">
          <navigator class="product-left">
            <image :src="item.goods_small_logo" />
          </navigator>
          <view class="product-right">
            <navigator class="product-name">{{item.goods_name}}</navigator>
            <view class="product-right-price">
              <text class="product-right-price-symbol">￥</text>
              <text class="product-right-price-integer">{{item.goods_price}}</text>
              <text class="product-right-price-decimal">.00</text>
            </view>
            <view class="product-right-num">x{{item.goods_number}}</view>
          </view>
        </view>
      </block>
    </view>
     <!-- 3.0 金额统计 -->
    <view class="order-total">
      <view class="order-total-item">
        <text>商品金额</text>
        <text class="order-total-item-price">￥{{totalAmount}}</text>
      </view>
      <view class="order-total-item">
        <text>运 费</text>
        <text class="order-total-item-price">￥+0.00</text>
      </view>
      <block v-if="token">
        <view @click="goToOrder" class="wxPay">微信支付</view>
      </block>
      <block v-else>
          <!-- 获取用户信息，可以从getuserinfo回调中获取到用户信息 -->
        <button @getuserinfo="wxLogin" open-type="getUserInfo" class="wxLogin">登录后下单支付</button>
      </block>
    </view>
  </div>
</template>

<script>
import { getcart } from "../commpon/cart";
// 导入获取位置的逻辑
import chooseAddress from '../weizhi/weizhi'
export default {
// 执行获取位置的逻辑
  mixins:[chooseAddress],
  data() {
    return {
      address:null,  //地址
      goodsList: [],  //数据
      totalAmount:0,   //金额
      token:null   //token
    };
  },
  onLoad(options) {
    // 接收id
    this.getGoodsListData(options.ids)
    //  判断之前是否存过地址
    if (wx.getStorageSync('address')){
      this.address = wx.getStorageSync('address')
    }
    if (wx.getStorageSync('token')){
      this.token = wx.getStorageSync('token')
    }
  // console.log(this.address);
  // wxLogin( wx.login({}))
  },
  methods: {
    async getGoodsListData(ids) {
      // 去本地获取商品
      const localGoods = getcart();
      const res = await this.$axios.get(`goods/goodslist?goods_ids=${ids}`);
      console.log(res);
      
        // 遍历数据 ，在数据中添加了数量和总金额
      res.data.message.forEach(item => {
        item.goods_number = localGoods[item.goods_id];
        this.totalAmount+=item.goods_price*item.goods_number
      });

      // 先处理好数据，再赋值
      this.goodsList = res.data.message;
    },
  //  登录后下单支付
    wxLogin(e){
         console.log(e);
        //  如果用户点击的是取消，就返回
        if(e.mp.detail.errMsg==="getUserInfo:fail ayth deny"){
          return
        }
        // 保存用户信息在本地
        wx.setStorageSync('userInfo',e.mp.detail.userInfo)
        // 登录
      wx.login({
        //  async  要放在 最近一个函数前面   
        // code  用户登录凭证   通过wx.login()获取 
        // success:res=>{
        //   console.log(res.code);
          
        // }
            //  {code} 结构赋值 
  success:async ({code})=>{
    console.log(code)
    
      const res=await this.$axios.post( "users/wxlogin" ,{
          code,
     encryptedData:e.mp.detail.encryptedData,
     iv:e.mp.detail.iv,
     rawData:e.mp.detail.rawData,
     signature:e.mp.detail.signature
      })
if(res.data.meta.status===200){
  // 给token赋值
  this.token=res.data.message.token
  // console.log(11111);
  //  console.log(res.data.message.token);
  //  保存在本地
   wx.setStorageSync('token',res.data.message.token)
}
  }
})    
    },
    // 下单
   async goToOrder(){
      if(!this.address){
        // 展现弹框
          wx.showToast({
          title: '请选择收获地址', //提示的内容,
          image: '/static/img/error.png', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透
        });
        return 
      }
      // 获取参数
     const zhifu= {
      //  总价格
       order_price:this.totalAmount,
      //  地址
       consignee_addr:this.address.detailAddress,
      //  map数组的方法，他的内容就是他返回的内容  
      // 商品内容
       goods:this.goodsList.map(item=>{
         return {
            goods_price:item. goods_price,
          goods_id:item. goods_id,
          goods_number:item.goods_number
         }
       })
     }
    //   发送请求
     const res=await this.$axios.post("my/orders/create",zhifu)
     if(res.data.meta.status==200){
      //  生成订单进行支付
       this.pay(res.data.message.order_number)
     }
    },
    // 支付
    async pay(order_number){
      console.log(1111111111111);
      // 发送请求
      const res =await this.$axios.post('my/orders/req_unifiedorder',{
        order_number
      })
      // 调用wx.requestPayement 唤起微信支付
      wx.requestPayment({
          timeStamp: res.data.message.pay.timeStamp,
        nonceStr: res.data.message.pay.nonceStr,
        package: res.data.message.pay.package,
        signType: res.data.message.pay.signType,
        paySign: res.data.message.pay.paySign,
        success:async res2=>{  //支付成功后的处理
        // 调用后台的接口，更改订单的状态已支付
          const  res3=await this.this.$axios.post("my/orders/chkOrder",{
            order_number
          })
          if(res3.data.meta.status==200){
            wx.showToast({
              title: '支付成功', //提示的内容,
              image: '/static/img/duigou.png', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            })
            setTimeout(()=>{
              wx.navigateTo({
                url:'/pags/orders/mian?type=3'
              })
            },2000)
          }
        },
       fail: ({errMsg}) => { // 支付失败之后的处理
          if (errMsg === "requestPayment:fail cancel"){
            wx.showToast({
              title: '您取消的了支付', //提示的内容,
              image: '/static/img/error2.png', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透
            })
          } else {
            wx.showToast({
              title: '支付失败', //提示的内容,
              image: '/static/img/error2.png', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透
            })
          }

          setTimeout(() => {
            // 跳转到我的订单页面
            wx.navigateTo({ url: '/pages/orders/main?type=2' })
          }, 2000)
        }
      })
    }
  
  }
};
</script>

<style scoped lang="less">
.address {
  height: 222rpx;
  background-color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &-info {
    display: flex;
    height: 160rpx;
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
    &-name-phone {
      display: flex;
      justify-content: space-between;
      padding: 0rpx 30rpx;
    }
    &-detail-info {
      padding: 0rpx 30rpx;
    }
  }
  &-add {
    width: 360rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    margin: 100px auto;
    color: #999;
    background-color: #f4f4f4;
  }
  &-pic {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 750rpx;
    height: 15rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.iconfont-tap {
  font-family: "iconfont" !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  min-width: 88rpx;
  min-height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-jiantouyou {
  position: absolute;
  top: 32rpx;
  right: 0;
}
.icon-jiantouyou:before {
  font-size: 24rpx;
  color: #999;
  line-height: 1;
  width: 15rpx;
  height: 25rpx;
}
.order-list {
  background-color: #fff;
}
.product-item {
  display: flex;
  padding: 30rpx 20rpx;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 20rpx;
    right: 0;
    bottom: 0;
    border-bottom: 1rpx solid #ddd;
  }
  .product-left {
    width: 200rpx;
    height: 200rpx;
    background-color: #eee;
    margin-right: 26rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .product-right {
    width: 480rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    .product-name {
      height: 84rpx;
      font-size: 30rpx;
      line-height: 1.4;
      /* 多行文字隐藏省略号 */
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    &-price {
      text {
        color: #ff2d4a;
      }
      &-symbol,
      &-decimal {
        font-size: 28rpx;
      }
      &-integer {
        font-size: 44rpx;
      }
    }
    &-num {
      position: absolute;
      right: 0;
      bottom: 0;
      letter-spacing: 2rpx;
      color: #999;
    }
  }
}
.order-total {
  background-color: #fff;
  margin-top: 20rpx;
  height: 300rpx;
  &-item {
    height: 80rpx;
    display: flex;
    align-items: center;
    padding: 0rpx 30rpx;
    justify-content: space-between;
    &-price {
      color: #ff2d4a;
    }
  }
}
.wxLogin {
  margin-top: 10rpx;
  width: 720rpx;
}
.wxPay {
  margin-top: 10rpx;
  margin-left: 15rpx;
  width: 720rpx;
  background-color: #00c000;
  display: flex;
  height: 80rpx;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 32rpx;
  border-radius: 5rpx;
}
</style>
