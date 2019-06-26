import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = "http://127.0.0.1:8899/api/public/v1"

//拦截器
axios.interceptors.request.use(function(config){
  if(wx.getStorageSync('token')){
    config.headers.Authorization=wx.getStorageSync('token')
  }
  return config
})

// 适配器 替换到底层发送网络请求的方式
axios.defaults.adapter = function (config) {
  
  return new Promise((resolve,reject) => {
    // 发送请求前打开加载页面
    mpvue.showLoading({
      title: '拼命加载中.....',
      mask: true
    })
    // 发送请求
    mpvue.request({
      url: config.url, //开发者服务器接口地址",
      data: config.data, //请求的参数",
      method: config.method,
      header: config.headers,  // 设置请求的 header
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      },
      complete() {
        // 当页面加载完成后关闭
        mpvue.hideLoading()
      }
    })
  })
}

Vue.prototype.$axios = axios
