const KEY = "GOODS"
// 获取本地的商品信息
export const getcart = () => {
  return wx.getStorageSync(KEY) || {}
}
//  用户新增的商品
export const addcart = goods => {
  //  console.log(goods) 
//  {38: 2, 129: 16, 395: 13}
// 先从本地上取出
  const asdgetcart = getcart()
  // 判断传过来的商品id，之前是否存过，
  // 如果存过就把他的数量累加
  // 如果没有存过，就新增一个属性名：值
  console.log(asdgetcart[goods.goods_id])
  if (asdgetcart[goods.goods_id]) {
    //  {38: 2, 129: 16, 395: 13}
    // ?????????????????????
    asdgetcart[goods.goods_id] += goods.goods_number
  } else {
    asdgetcart[goods.goods_id] = goods.goods_number
  }
  wx.setStorageSync(KEY,asdgetcart)
//   console.log(KEY)
// console.log(asdgetcart[goods.goods_id])

// console.log(asdgetcart)
 

}
// 修改
export const jiancart = goods => {
//   console.log(goods)
  const asdgetcart = getcart()
  asdgetcart[goods.goods_id] = goods.goods_number
  
  wx.setStorageSync(KEY,asdgetcart)
  // console.log(KEY)
  console.log(asdgetcart);
  
}
// 删除
export const deletedcart=goods_id=>{
    const asdgetcart = getcart()
    // ？？？？？？？
    console.log(goods_id); 
    delete asdgetcart[goods_id]
  wx.setStorageSync(KEY,asdgetcart)
}