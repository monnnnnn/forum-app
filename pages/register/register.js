Page({
    data:{
        userId: '',
        password: '',
        password1: '',
        email: '',
        tishi: ''
    },
    formUserId:function(e) {
        this.setData({
            userId:e.detail.value//在别处调用时this.data.userId即可
        })
    },
    formEmail:function(e) {
        this.setData({
            email:e.detail.value
        })
    },
    formPassword:function(e) {
        this.setData({
            password:e.detail.value
        })
    },
    formPassword1:function(e) {
        this.setData({
            password1:e.detail.value
        })
    },
    toRegister:function() {
        if(this.data.userId!=''&&this.data.password!=''&&this.data.email!=''){
            if(this.data.password == this.data.password1){
                wx.request({    
                    url: 'http://120.79.232.81:9000/user/register', //接口名称   
                    method:"POST",  //请求方式 
                    header: {      
                        'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                    },      
                    data:{
                        userId: this.data.userId,
                        password: this.data.password,
                        email: this.data.email
                    },
                    success(res) {     
                        if(res.data.code == 200){
                            wx.redirectTo({
                                url:'../login/login'
                            })
                        }else{
                            wx.showToast({
                                title: res.data.message,
                                icon: 'none',
                                mask: true,
                                duration: 1000
                            });
                        }  
                    } 
                });
            }else{
                wx.showToast({
                    title: '两次密码不同！',
                    icon: 'none',
                    mask: true,
                    duration: 1000
                  });
            }
            
        }else{
            wx.showToast({
                title: '账号或密码或邮箱不能为空！',
                icon: 'none',
                mask: true,
                duration: 1000
            });
        }
        
    },

})