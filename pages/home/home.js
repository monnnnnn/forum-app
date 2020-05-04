Page({
    data: {
        sectionArray: ['人文风景', '美食文化', '风俗习惯', '语言魅力', '娱乐活动'],
        objecSectionArray: [
          {
            id: 0,
            name: '人文风景'
          },
          {
            id: 1,
            name: '美食文化'
          },
          {
            id: 2,
            name: '风俗习惯'
          },
          {
            id: 3,
            name: '语言魅力'
          },
          {
            id: 4,
            name: '娱乐活动'
          }
        ],
        sectionIndex: 0,
        invitation: [],
        title:''
    },
    onLoad: function() {
      var that=this;
      wx.request({    
        url: 'http://120.79.232.81:9000/InvitationAppVO/selectPartInvitationApp', //接口名称   
        method:"POST",  //请求方式 
        header: {      
            'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
        },      
        success(res) {     
            if(res.data.code == 200){
              that.setData({
                invitation: res.data.data
              })
              console.log(res)
            }
        } 
      });
    },
    bindSectionChange: function(e) {
        var that = this;
        //console.log('picker发送选择改变，携带值为', e.detail.value)
        that.setData({
            sectionIndex: e.detail.value
        });
        //console.log(this.data.objecSectionArray[this.data.sectionIndex].name);
        var classify = e.detail.value;
        wx.request({    
          url: 'http://120.79.232.81:9000/InvitationAppVO/selectInvitationAppByClassify', //接口名称   
          method:"POST",  //请求方式 
          header: {      
              'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
          },
          data: {
            classify: classify
          },   
          success(res) {     
              if(res.data.code == 200){
                that.setData({
                  invitation: res.data.data
                })
              }
          } 
        });
    },

    toRecommend: function() {
      var that=this;
      wx.request({    
        url: 'http://120.79.232.81:9000/InvitationAppVO/selectPartInvitationApp', //接口名称   
        method:"POST",  //请求方式 
        header: {      
            'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
        },      
        success(res) {     
            if(res.data.code == 200){
              that.setData({
                invitation: res.data.data
              })
            }
        } 
      });
    },

    toAttention: function() {
      var that=this;
      var userId = wx.getStorageSync('userId');
      console.log(userId);
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
          url: 'http://120.79.232.81:9000/InvitationAppVO/selectMyAttentionInvitationAppByUserId', //接口名称   
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
              }
          } 
        });
      }
    },

    formTitle:function(e) {
      this.setData({
        title:e.detail.value//在别处调用时this.data.title即可
      })
    },
    toSearch: function() {
      var that=this;
      wx.request({    
        url: 'http://120.79.232.81:9000/InvitationAppVO/selectInvitationAppByTitle', //接口名称   
        method:"POST",  //请求方式 
        header: {      
            'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
        },
        data: {
          title: that.data.title
        },      
        success(res) {     
            if(res.data.code == 200){
              that.setData({
                invitation: res.data.data
              })
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
})