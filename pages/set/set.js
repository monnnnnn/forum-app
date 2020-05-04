Page({
    data:{
        tempFilePaths: [],
        userName: '',
        email: '',
        password: '',
        imgAddress: ''
    },
    onLoad: function() {
      var that=this;
      var userId = wx.getStorageSync('userId');
      wx.request({    
        url: 'http://120.79.232.81:9000/user/ShowPersonalInformation', //接口名称   
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
                  imgAddress: res.data.data.imgAddress,
                  email: res.data.data.email
              })
            }
        } 
      });
    },
    formUserName:function (e){
      this.setData({
        userName: e.detail.value
      })
    },
    formEmail:function (e){
      this.setData({
        email: e.detail.value
      })
    },
    formPassword:function (e){
      this.setData({
        password: e.detail.value
      })
    },

    chooseImage() {
        let that = this;
        var userId = wx.getStorageSync('userId');
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function(res) {
            wx.showToast({
              title: '正在上传...',
              icon: 'loading',
              mask: true,
              duration: 1000
            })
            //console.log(res);  
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            //var tempFilePaths = res.tempFilePaths;
            that.setData({
              tempFilePaths: res.tempFilePaths
            });
            
            wx.uploadFile({
              url: 'http://120.79.232.81:9000/user/uploadImg',
              filePath: that.data.tempFilePaths[0],
              name: 'file',
              formData:{
                'userId': userId
              },
              success:function (res){
                var data = JSON.parse(res.data);
                if(data.code == 200){
                  that.setData({
                    imgAddress: that.data.tempFilePaths[0]
                  });
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    mask: true,
                    duration: 1000
                  });
                }else{
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none',
                    mask: true,
                    duration: 1000
                  });
                }
                console.log(res)
                console.log(data)
              },
              
            });
          }
        })
      },

      onSubmit:function() {
        var that=this;
        var userId = wx.getStorageSync('userId');
        console.log(that.data.password)
        if(that.data.userName !='' && that.data.email !=''){
          if(that.data.password == ''){
            wx.request({    
              url: 'http://120.79.232.81:9000/user/modifyPersonalInformationApp', //接口名称   
              method:"POST",  //请求方式 
              header: {      
                  'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
              },
              data: {
                  userId:userId,
                  userName: that.data.userName,
                  email: that.data.email,
                  password: that.data.password
              },      
              success(res) {     
                  if(res.data.code == 200){
                    wx.showToast({
                      title: '修改成功',
                      icon: 'success',
                      duration: 1000
                     });
                    wx.switchTab({
                      url:'/pages/personal/personal'
                    })
                  }
              } 
            });
          }else{
            wx.request({    
              url: 'http://120.79.232.81:9000/user/modifyPersonalInformationApp', //接口名称   
              method:"POST",  //请求方式 
              header: {      
                  'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
              },
              data: {
                  userId:userId,
                  userName: that.data.userName,
                  email: that.data.email,
                  password: that.data.password
              },      
              success(res) {     
                  if(res.data.code == 200){
                    wx.showToast({
                      title: '修改成功',
                      icon: 'success',
                      duration: 1000
                    });
                    wx.redirectTo({
                      url:'../login/login'
                    })
                  }
              } 
            });
          }
        }else{
          wx.showToast({
            title: '昵称和邮箱不能为空！',
            icon: 'none',
            mask: true,
            duration: 1000
          });
        }
        
      },

      toPersonal:function() {
        wx.switchTab({
            url:'/pages/personal/personal'
          })
    },
})