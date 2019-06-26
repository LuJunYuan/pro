<template>
    <div>
     <!-- 1.0 选项卡 -->
    <view class="head">
      <block
        v-for="(item,index) in menus"
        :key="index"
      >
       <view
          @click="toggleSelect(index)"
          :class="['head-item',index === selectIndex ? 'head-active':'']"
        >
          <text>{{item}}</text>
        </view>
      </block>
    </view>
     <!-- 2.0 订单列表（分状态） -->
    <view class="order">
      <block
        v-for="order in dingdansuju"
        :key="order.order_id"
      >
        <view class="order-item">
          <!-- 2.1 列表项(需要循环) -->
          <block
            v-for="(item,index2) in order.goods"
            :key="index2"
          >
            <view class="product-item">
              <navigator
                :url="'/pages/goods_detail/main?goods_id='+item.goods_id"
                class="product-left"
              >
                <image
                  class="product-img holder-image"
                  :src="item.goods_small_logo"
                />
              </navigator>
              <view class="product-right">
                <navigator
                  :url="'/pages/goods_detail/main?goods_id='+item.goods_id"
                  class="product-name"
                >
                  {{ item.goods_name }}
                </navigator>
                <view class="product-price">
                  <text class="product-price-symbol">￥</text>
                  <text class="product-price-integer">{{ item.goods_price }}</text>
                  <text class="product-price-decimal">.00</text>
                </view>
                <view class="product-count">x{{ item.goods_number }}</view>
              </view>
            </view>
          </block>
     </view>
   </block>
    </view>
    </div>
</template>

<script>
export default {
data(){
    return {
          menus:['全部订单','待付款','待收货','退货/退款'],
          selectIndex:0,
           dingdansuju:[],
           pageIndex:1,
           pageSize:10,
           token:null,
           type:1
    }
},
onLoad(options){
    //    console.log(options.type)
      this.type=options.type
       this.selectIndex= parseInt(options.type) - 1
      this.dingdan()
},
methods:{
   async dingdan(){
    const res=await this.$axios.get(`my/orders/all?type=${this.type}&pageIndex=${this.pageIndex}$pageSize=${this.pageSize}`)
    //  const res = await this.$axios.get(`my/orders/all?type=${this.type}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
                                          
    console.log(res)
    //  this.dingdansuju.push(res.data)
    
    },
toggleSelect(index){
    this.selectIndex=index
    this.type=index+1
    console.log(index);
    
}

}
}
</script>

<style lang="less" scoped>
.head {
  display: flex;
  align-items: center;
  width: 750rpx;
  background-color: white;
  height: 100rpx;
  justify-content: space-between;
  &-item {
    flex: 1;
    text-align: center;
    position: relative;
    line-height: 100rpx;
  }
  &-active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 5rpx;
    background-color: red;
  }
  &-active text {
    color: red;
  }
}
.order {
  margin-bottom: 30rpx;
  &-item {
    background-color: #ffffff;
    margin-top: 30rpx;
    // background-color: yellow;
  }
}

.product-item {
  display: flex;
  padding: 30rpx 20rpx;
  position: relative;
}
.product-item::after {
  content: '';
  position: absolute;
  left: 20rpx;
  right: 0;
  bottom: 0;
  border-bottom: 1rpx solid #ddd;
}
// .product-item:first-child::after {
//   border-bottom: 0 none;
// }

.product-left {
  margin-right: 26rpx;
}
.product-left,
.product-left .product-img {
  width: 200rpx;
  height: 200rpx;
  background-color: #eee;
}
.product-right {
  width: 480rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
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
.product-price {
  color: #ff2d4a;
}
.product-price-symbol,
.product-price-decimal {
  font-size: 28rpx;
}
.product-price-integer {
  font-size: 44rpx;
}

.product-count {
  position: absolute;
  right: 0;
  bottom: 0;
  letter-spacing: 2rpx;
}

.order-total {
  font-size:14px;
  height: 88rpx;
  background-color: #fff;
  padding: 0 20rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  color: #999;
  &::after {
    content: '';
    position: absolute;
    left: 20rpx;
    right: 20rpx;
    right: 0;
    bottom: 0;
    border-bottom: 1rpx solid #ddd;
  }
}

.order-item-pay {
  display: flex;
  font-size: 12px;
  height: 88rpx;
  align-items: center;
  padding: 0rpx 20rpx;
  justify-content: space-between;
}

.btn-line {
  border: 2rpx solid #999;
  border-radius: 5rpx;
  width: 156rpx;
  height: 56rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40rpx;
}
.btn-color-main {
  color: #ff2d4a;
}

.no_order {
  width: 750rpx;
  height: 500rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: 100rpx;
    height: 100rpx;
  }
  text {
    color: #999999;
    font-size: 30rpx;
    margin-top: 30rpx;
  }
}
text{
  font-size: 12px;
}

.loadMore {
  font-size: 30rpx;
  color: #888;
  text-align: center;
  line-height: 100rpx;
}

.loadMore.loading::before {
  content: '';
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
  vertical-align: middle;
  margin-top: -5rpx;
  margin-right: 10rpx;
  animation: loading 1s steps(12) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;
}

@keyframes loading {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}
</style>