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
    localArray: ['中山市', '广州市', '佛山市'],
    objectLocalArray: [
      {
        id: 0,
        name: '中山市'
      },
      {
        id: 1,
        name: '广州市'
      },
      {
        id: 2,
        name: '佛山市'
      }
    ],
    localIndex: 0,
    tempFilePaths:[],
    formats: {},
    readOnly: false,
    editorHeight: 200,
    keyboardHeight: 0,
    isIOS: false,
    imgUrl: '',
    classify: 0,
    title:'',	
    introduce:'',
    file:'',
    context:''			
  },
  bindSectionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sectionIndex: e.detail.value,
      classify: e.detail.value
    })
  },
  bindLocalChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      localIndex: e.detail.value
    })
  },
  formTitle: function(e) {
    this.setData({
      title: e.detail.value
    });
  },
  formIntroduce:function(e) {
    this.setData({
      introduce: e.detail.value
    });
  },
  formContext:function(e) {
    this.setData({
      context: e.detail.html
    });
    console.log(this.data.context);
  },


  toSubmit: function() {
    var that = this;
    var userId = wx.getStorageSync('userId');
    var regoin = this.data.objectLocalArray[this.data.localIndex].name;
    console.log(that.data.imgUrl);
    if(userId != ''){
      if(that.data.title !='' && that.data.introduce !='' && that.data.context !=''){
        wx.request({
          url: 'http://120.79.232.81:9000/invitation/appWrite',   
          method:"POST",  //请求方式 
          header: {      
              'content-type': 'application/x-www-form-urlencoded' // 默认值（固定）   
          },
          data: {
              userId:userId,
              classify: that.data.classify,
              regoin: regoin,
              title: that.data.title,
              introduce: that.data.introduce,
              imgUrl: that.data.imgUrl,
              context: that.data.context
          },
          success:function (res){
            if(res.data.code == 200){
              wx.redirectTo({
                url:'../my/my'
            })
            }else{
                wx.showModal({
                    title: '提示',
                    content: res.data.message,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }else{
                          console.log('用户点击取消')
                        }
        
                    }
                });
            }
          }
        })
        
      }else{
        wx.showModal({
            title: '提示',
            content: '标题或简介或正文不能为空!',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }else{
                  console.log('用户点击取消')
                }

            }
        });
      }
    }else{
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
    }
  },


  
  chooseImage() {
    let that = this
    wx.chooseImage({
      count: 2,
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
        let tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths: tempFilePaths
        });
        wx.uploadFile({
          url: 'http://120.79.232.81:9000/invitation/upload',
          filePath: that.data.tempFilePaths[0],
          name: 'file',
          
          success:function (res){
            var data = JSON.parse(res.data);
            if(data.code == 200){
              that.setData({
                imgUrl: data.data
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

  // 图片预览
  previewImage: function (e) {
    let index = e.target.dataset.index;//预览图片的编号
    let that = this;
    wx.previewImage({
      current: that.data.tempFilePaths[index],//预览图片链接
      urls: that.data.tempFilePaths,//图片预览list列表
      success: function (res) {
        //console.log(res);
      },
      fail: function () {
        //console.log('fail')
      }
    })
  },

  //富文本
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  }
})