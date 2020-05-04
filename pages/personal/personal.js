
Page({
    data:{
        imgAddress: '',
        userName: ''
    },
    onLoad: function() {
        var that=this;
        var userId = wx.getStorageSync('userId');
        if(userId == ''){
            wx.showModal({
              title: '提示',
              content: '未登录，请先登录！',
              success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                        url:'../login/login'
                    })
                  }else{
                     console.log('用户点击取消')
                  } 
              }
            });
          }else{
            wx.request({    
                url: 'http://120.79.232.81:9000/user/personalPageApp', //接口名称   
                method:"POST",  //请求方式 
                header: {      
                    'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                },
                data: {
                    userId:userId
                },      
                success(res) {     
                    if(res.data.code == 200){
                      that.setData({
                          userName: res.data.data.userName,
                          imgAddress: res.data.data.imgAddress
                      })
                    }
                } 
              });
          }
      },
    toLogin: function() {
        wx.clearStorage('userId');
        wx.redirectTo({
            url:'../login/login'
        })
    },
    toCollect: function() {
        var userId = wx.getStorageSync('userId');
        if(userId == ''){
            wx.showModal({
              title: '提示',
              content: '未登录，请先登录！',
              success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                        url:'../login/login'
                    })
                  }else{
                     console.log('用户点击取消')
                  } 
              }
            });
          }else{
            wx.redirectTo({
                url:'../collect/collect'
            })
          }
    },
    toMy: function() {
        var userId = wx.getStorageSync('userId');
        if(userId == ''){
            wx.showModal({
              title: '提示',
              content: '未登录，请先登录！',
              success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                        url:'../login/login'
                    })
                  }else{
                     console.log('用户点击取消')
                  } 
              }
            });
          }else{
            wx.redirectTo({
                url:'../my/my'
            })
          }
    },

    toSet: function() {
      var userId = wx.getStorageSync('userId');
      if(userId == ''){
          wx.showModal({
            title: '提示',
            content: '未登录，请先登录！',
            success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                      url:'../login/login'
                  })
                }else{
                   console.log('用户点击取消')
                } 
            }
          });
        }else{
          wx.redirectTo({
              url:'../set/set'
          })
        }
      
  },
})