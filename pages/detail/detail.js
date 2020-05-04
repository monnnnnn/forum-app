Page({
    data: {
        userId:'',
        invitationId: '',
        imgAddress:'',
        userName:'',
        createTime:'',
        title:'',
        context:'',
        collectNum:'',
        likesNum:'',
        commentList:[],
        collectColor: '',
        likeColor:'',
        inputShow: false,	
        comment:'',
        toCommentId: '',
        over: 'none',
        replay: 'block',
        hiddenmodalput: true,
        replayContext: ''
    },
    onLoad: function(options) {
        var that=this;
        var userId = wx.getStorageSync('userId');
        that.setData({
            invitationId:options.invitationId
        })
        wx.request({    
          url: 'http://120.79.232.81:9000/invitation/invitation', //接口名称   
          method:"POST",  //请求方式 
          header: {      
              'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
          },
          data: {
            userId: userId,
            invitationId: that.data.invitationId
          },      
          success(res) {     
              if(res.data.code == 200){
                    if(res.data.data.collect){
                        that.setData({
                            collectColor: 'red'
                        })
                    }else{
                        that.setData({
                            collectColor: 'black'
                        })
                    }
                    if(res.data.data.like){
                        that.setData({
                          likeColor: 'red'
                        })
                    }else{
                        that.setData({
                            likeColor: 'black'
                        })
                    }
                    that.setData({
                        userId: res.data.data.UserInfo.userId,
                        invitationId: res.data.data.invitationInfo.invitationId,
                        imgAddress: res.data.data.UserInfo.imgAddress,
                        userName: res.data.data.UserInfo.userName,
                        createTime: res.data.data.invitationInfo.createTime,
                        title: res.data.data.invitationInfo.title,
                        //富文本图片宽度自适应
                        context: res.data.data.invitationInfo.context.replace(/\<img/gi, '<img style="max-width:100%;height:auto"'),
                        collectNum: res.data.data.collectNum,
                        likesNum: res.data.data.likesNum,
                        commentList: res.data.data.commentList
                    })

                    //判断是否是本人帖子
                    if(userId == res.data.data.UserInfo.userId){
                        that.setData({
                            over: 'block',
                            replay: 'none'
                        })
                    }
              }
          } 
        });
    },
    toHome:function() {
        wx.switchTab({
            url:'/pages/home/home'
          })
    },
    toAttention:function(){
        var that=this;
        var userId = wx.getStorageSync('userId');
        var targetId = that.data.userId;
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
                url: 'http://120.79.232.81:9000/attention/addAttentionInfo', //接口名称   
                method:"POST",  //请求方式 
                header: {      
                    'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                },
                data: {
                  userId: userId,
                  targetId: targetId
                },      
                success(res) {     
                    if(res.data.code == 200){
                        wx.showToast({
                            title: '关注成功',
                            icon: 'success',
                            duration: 1000
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
          }
    },
    toCollect:function(){
        var that=this;
        var userId = wx.getStorageSync('userId');
        var invitationId = that.data.invitationId;
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
            if(that.data.collectColor == 'black'){
                wx.request({    
                    url: 'http://120.79.232.81:9000/collect/addCollectInfo', //接口名称   
                    method:"POST",  //请求方式 
                    header: {      
                        'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                    },
                    data: {
                      userId: userId,
                      invitationId: invitationId
                    },      
                    success(res) {     
                        if(res.data.code == 200){
                            wx.showToast({
                                title: '收藏成功',
                                icon: 'success',
                                duration: 1000
                               })
                               that.setData({
                                collectColor: 'red'
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
                wx.request({    
                    url: 'http://120.79.232.81:9000/collect/deleteCollectInfo', //接口名称   
                    method:"POST",  //请求方式 
                    header: {      
                        'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                    },
                    data: {
                      userId: userId,
                      invitationId: invitationId
                    },      
                    success(res) {     
                        if(res.data.code == 200){
                            wx.showToast({
                                title: '取消收藏成功',
                                icon: 'success',
                                duration: 1000
                               })
                               that.setData({
                                collectColor: 'black'
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
            }
        }       
    },
    toLike:function(){
        var that=this;
        var userId = wx.getStorageSync('userId');
        var invitationId = that.data.invitationId;
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
            if(that.data.likeColor == 'black'){
                wx.request({    
                    url: 'http://120.79.232.81:9000/likes/addLikesInfo', //接口名称   
                    method:"POST",  //请求方式 
                    header: {      
                        'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                    },
                    data: {
                      userId: userId,
                      invitationId: invitationId
                    },      
                    success(res) {     
                        if(res.data.code == 200){
                            wx.showToast({
                                title: '点赞成功',
                                icon: 'success',
                                duration: 1000
                               })
                            that.setData({
                                likeColor: 'red'
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
                wx.request({    
                    url: 'http://120.79.232.81:9000/likes/deleteLikesInfo', //接口名称   
                    method:"POST",  //请求方式 
                    header: {      
                        'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                    },
                    data: {
                      userId: userId,
                      invitationId: invitationId
                    },      
                    success(res) {     
                        if(res.data.code == 200){
                            wx.showToast({
                                title: '取消点赞成功',
                                icon: 'success',
                                duration: 1000
                               })
                            that.setData({
                                likeColor: 'black'
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
            }
        } 
    },

    formComment:function(e) {
        this.setData({
            comment: e.detail.value
        })
    },
    formContext:function(e) {
        this.setData({
            replayContext: e.detail.value
        })
    },

    toComment:function() {
        this.setData({
            toCommentId: '',
            inputShow: true
        })
    },
    toReplay:function(e) {
        this.setData({
            toCommentId: e.currentTarget.dataset['index'],
            inputShow: true
        }) 
    },

    toSubmit:function() {
        var that=this;
        var userId = wx.getStorageSync('userId');
        console.log(that.data.toCommentId)
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
                if(that.data.toCommentId != '' ){
                    wx.request({    
                        url: 'http://120.79.232.81:9000/comment/replyCommentInfo', //接口名称   
                        method:"POST",  //请求方式 
                        header: {      
                            'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                        },
                        data: {
                            commentId: that.data.toCommentId,
                            commentatorId: userId,
                            context: that.data.comment
                        },      
                        success(res) {     
                            if(res.data.code == 200){
                                wx.showToast({
                                    title: '回复成功',
                                    icon: 'success',
                                    duration: 1000
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
                    wx.request({    
                        url: 'http://120.79.232.81:9000/comment/addCommentInfo', //接口名称   
                        method:"POST",  //请求方式 
                        header: {      
                            'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                        },
                        data: {
                            invitationId: that.data.invitationId,
                            commentatorId: userId,
                            context: that.data.comment
                        },      
                        success(res) {     
                            if(res.data.code == 200){
                                wx.showToast({
                                    title: '评论成功',
                                    icon: 'success',
                                    duration: 1000
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
                }
          }
    },

    //点击举报
    btnReplay:function() {
        this.setData({
            //这里直接取反hiddenmodalput
          hiddenmodalput: !this.data.hiddenmodalput
        })
    },

    //举报取消
    modalinput: function () {
        this.setData({
            //这里直接取反hiddenmodalput
          hiddenmodalput: !this.data.hiddenmodalput
        })
    },

    //提交举报
    toReplay:function() {
        var that=this;
        var userId = wx.getStorageSync('userId');
        console.log(that.data.toCommentId)
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
                if(that.data.replayContext != '' ){
                    wx.request({    
                        url: 'http://120.79.232.81:9000/Accuse/addAccuseInvitationInfo', //接口名称   
                        method:"POST",  //请求方式 
                        header: {      
                            'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                        },
                        data: {
                            userId: userId,
                            targetId: that.data.invitationId,
                            context: that.data.replayContext
                        },      
                        success(res) {     
                            if(res.data.code == 200){
                                wx.showToast({
                                    title: '举报成功',
                                    icon: 'success',
                                    duration: 1000
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
                        title: '举报内容不能为空！',
                        icon: 'none',
                        mask: true,
                        duration: 1000
                    }); 
                }
          }
        that.setData({
            //这里直接取反hiddenmodalput
          hiddenmodalput: !that.data.hiddenmodalput
        })
    },

    //删除
    toDelete:function() {
        var that=this;
        var userId = wx.getStorageSync('userId');
        wx.showModal({
            title: '提示',
            content: '确定删除帖子吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({    
                        url: 'http://120.79.232.81:9000/invitation/deleteInvitation', //接口名称   
                        method:"POST",  //请求方式 
                        header: {      
                            'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
                        },
                        data: {
                            userId: userId,
                            invitationId: that.data.invitationId,
                        },      
                        success(res) {     
                            if(res.data.code == 200){
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1000
                                })
                                wx.redirectTo({
                                    url:'../my/my'
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
                console.log('用户点击取消')
                }

            }
        })
    }
})