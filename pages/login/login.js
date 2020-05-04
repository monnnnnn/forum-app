Page({
    data:{
        userId: '',
        password: '',
    },
    formUserId:function(e) {
        this.setData({
            userId:e.detail.value//在别处调用时this.data.userId即可
        })
    },
    formPassword:function(e) {
        this.setData({
            password:e.detail.value
        })
    },
    toLogin:function() {
        if(this.data.userId!=''&&this.data.password!=''){
            wx.request({    
                url: 'http://120.79.232.81:9000/user/login', //接口名称   
                method:"POST",  //请求方式 
                header: {      
                    'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                },      
                data:{
                    userId: this.data.userId,
                    password: this.data.password
                },
                success(res) {     
                    if(res.data.code == 200){
                        wx.switchTab({
                            url:'../home/home'
                        })
                        wx.setStorageSync('userId', res.data.data.userId); //将userId存入本地缓存
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
                title: '账号或密码不能为空!',
                icon: 'none',
                mask: true,
                duration: 1000
            });
        }
        
    },
    toRegister:function() {
        wx.redirectTo({
            url:'../register/register'
        })
    }
})