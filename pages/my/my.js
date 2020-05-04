Page({
    data: {
        invitation: [],
    },
    onLoad: function() {
      var that=this;
      var userId = wx.getStorageSync('userId');
      wx.request({    
        url: 'http://120.79.232.81:9000/InvitationAppVO/selectInvitationAppByUserId', //接口名称   
        method:"POST",  //请求方式 
        header: {      
            'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
        },
        data: {
            userId: userId
        },      
        success(res) {     
            if(res.data.code == 200){
              that.setData({
                invitation: res.data.data
              })
              console.log(that.data.invitation)
            }
        } 
      });
    },

    toDetail: function(e) {
      var invitationId = e.currentTarget.dataset['index'];
      console.log(invitationId)
        wx.redirectTo({
            url:'../detail/detail?invitationId=' + invitationId,
        })
    },

    toPersonal:function() {
        wx.switchTab({
            url:'/pages/personal/personal'
          })
    },
})