<template>
  <div id="app">    
    <router-view name="header" :teacher = 'teacher'></router-view>
    <router-view name="mainContent" v-on:out="out" v-on:net="check_network"  v-on:user="save_teacher" v-on:grade="save_grade" v-on:pingjia="save_pingjia" :pingjia='pingjia' :teacher = 'teacher' :grade = 'grade' ></router-view>
    <router-view name="footer" :network="network" :teacher = 'teacher'></router-view>
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/> -->
  </div>
</template>

<script>
const { ipcRenderer, remote } = require('electron');
  export default {
    name: 'zhuqiao',
    data(){
      return{
        teacher: '',//教师
        grade:'',//年级
        pingjia:'',//评价项
        network:true,//网络
      } 
    },
    mounted(){      
        //检查更新
        const ths = this
        ths.$electron.ipcRenderer.send("checkForUpdate");
    },
    created(){
      const ths = this ;
      var timer = setInterval(function(){//检查网络
        ths.$axios({
              method: "GET", 
              url: `http://www.baidu.com`,     
          }).then(function(res){
            ths.network=true;
            //console.log(res);
          }).catch(function(){
            ths.network=false;
              console.log("offLine");
          })
      },1000000)    
    },
    methods: {
      out(){//登陆超时
        this.$router.push('/');
        remote.getCurrentWindow().setSize(800,600);  
        remote.getCurrentWindow().center()
      },
      check_network(payload){
        var ths = this;
        ths.network = payload.network
      },
      save_teacher: function (payload) {
        var ths = this;
         ths.teacher = payload.teacher;
        //  console.log('teacher',ths.teacher)
      },
      save_grade(payload){
        var ths = this;
        ths.grade = payload.grade_data;
        // console.log('grad',ths.grade)
      },
      save_pingjia(payload){
        var ths = this;
        ths.pingjia = payload.pingjia_data;
        // console.log('pingjia',ths.pingjia)
      }
    },
    //组件错误监听
    errorCaptured(err){
      this.$router.push('/');
      remote.getCurrentWindow().setSize(800,600);  
      remote.getCurrentWindow().center()
      this.$message.error(this.$t('m.IN_system'));     
      //改变窗口大小      
      setTimeout(function(){
        window.location.reload();
      },2500)
      // console.log(err,'err')
    }
  }
</script>

<style lang="scss">
#app{
  height: 100%;
  overflow: hidden;
  &>div{
    background: #f5f5f5;
  }
  &>div#min{
    background-image: url('../renderer/assets/img/login.png');
    background-color: rgba(0,0,0,0)!important;
  }
}

/* 文本不能选中 */
body{
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    font-size: 16px!important;
    color: #606266;
}
//滚动条
.scroll_0{
  &::-webkit-scrollbar-track {
    //滚动条的轨道
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
    border-radius: 10px; /*滚动条的背景区域的圆角*/
    background-color: #fcfafa; /*滚动条的背景颜色*/
  }
  &::-webkit-scrollbar-thumb {
    // 滚动条里面的小方块
    background: #d2d2d2;
    border-radius: 5px;
  }
  &::-webkit-scrollbar {
    width: 8px; /*滚动条宽度*/
    height: 20px; /*滚动条高度*/
  }
}
.scroll_1{
    margin-right: 10px;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
    border-radius: 10px; /*滚动条的背景区域的圆角*/
    background-color: #91dadd; /*滚动条的背景颜色*/
  }
  &::-webkit-scrollbar-thumb {
    background: #7bb9bc;
    border-radius: 5px;
  }
  &::-webkit-scrollbar {
    width: 8px; /*滚动条宽度*/
    height: 20px; /*滚动条高度*/
  }
}

/* 弹窗头部 */
.el-dialog__header{background: #27b5bd;}
.el-dialog__title,.el-message-box__title,.el-message-box__headerbtn .el-message-box__close,.el-dialog__headerbtn .el-dialog__close{color:#fff;}

.el-message-box__header{background: #27b5bd;}
.el-message-box{border:0;}
.el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close,.el-message-box__headerbtn:hover .el-message-box__close{
  color: #fff;
}
.el-dialog--center .el-dialog__body{
  height:80%;
  overflow: hidden;
  padding-bottom: 10px;
}
input, textarea, select, button,.el-dialog__body,.el-tag,.el-form-item__content,  .el-message-box__content, .el-dropdown-menu__item, .el-message,.el-message__content,.el-select-dropdown__item{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 16px !important;
}
.el-form-item__label{
  font-size: 16px!important;
  text-align: left;
}

.el-form{
    padding: 1% 6%;
    .el-date-editor.el-input, .el-date-editor.el-input__inner,.el-select{        
        width: 16.5%;
        margin-right: 5px;
        min-width: 145px;
    }   
    .el-input__inner,.el-range-editor input{
      box-sizing: border-box;
      height: 100%!important;
      padding-top:10px;
      padding-bottom: 11px; 
    }      
    .el-date-editor.el-range-editor.el-input__inner{
      padding-top: 0;
      padding-bottom: 0;
    }   
}

/* 普通按钮 */
.el-button{
  overflow: hidden;
  text-overflow: ellipsis; 
  white-space: nowrap;
  min-width: 9%;
}
.el-button--primary:focus, .el-button--primary:hover,.el-button--primary{background: #27b5bd;border: 0; }
.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #2AC2CB;
    color: #fff;
}
.el-button:focus,.el-button.is-plain:focus,.el-button:hover,.el-button.is-plain:hover{
  border-color:#2AC2CB;
  background-color: #2AC2CB;
  color: #fff;
}
#stu .tags .el-button:focus,.el-button.is-plain:focus{
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}
    

/* 按钮禁用 */
.el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover{
  background-color: #73DFE6;
  border-color: #73DFE6;
}
/* 输入框活动状态 */
.el-input__inner:focus,.el-textarea__inner:focus,.el-range-editor.is-active, .el-range-editor.is-active:hover,.el-select .el-input.is-focus .el-input__inner{
  border-color: #27b5bd !important;
}
/* 红色按钮 */
.red,.red:focus{
  background:#CC5952 !important;
  border: 0!important;
  color: #fff!important;
  overflow: hidden;
  text-overflow: ellipsis; 
  white-space: nowrap;
}
.red.is-disabled,.red.is-disabled:hover,.red.is-disabled:focus{
  background: #E79C97!important;
}
.red:hover{
  background: #DB6A63!important;
}
/* 选择时间控件 */
.el-date-table td.current:not(.disabled) span,.el-date-table td.end-date span, .el-date-table td.start-date span{
  background: #2AC2CB;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected,.el-loading-spinner .el-loading-text,.el-date-table td.available:hover,.el-date-table td.today span,.el-button--text,.el-checkbox__input.is-checked+.el-checkbox__label{
  color: #2AC2CB;
}
.el-loading-spinner .path{stroke: #2AC2CB;}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: #2AC2CB;
  border-color: #2AC2CB;
}
/* input中icon图标 */
.el-input__icon{
  font-style: normal;
}

.el-tabs__active-bar{
  background-color: #27b5bd;
}
.el-tabs__item:hover,.el-tabs__item.is-active,.el-tabs__item{
  color:#303133;
  font-size: 16px;
}
// login
#login{
   .el-tabs__header{
      margin-bottom: 30px;
    }
    .el-input__suffix{margin-right: 10px;}
}
/* facts页选择学生 */
.select_list .el-button:focus{
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}
#facts{  
  .el-form .el-form-item__label{
    font-size:20px!important;
    font-weight: 700;
    text-align: left;
  }
  /* 下拉框 */
  .el-form-item{
    width: 100%;
  }
  .el-select,.el-date-editor{
    min-width: 23%;
  }
  .el-input--suffix .el-input__inner{
    padding-right:0; 
  }
}
.unrequired .el-form-item__label:before{
    visibility: hidden;
}
.el-select-dropdown__item.selected{
  color: #27b5bd;
}
//选择图片弹窗
.dialog_pic{
  height: 80%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
// 选择页面弹窗
.dialog_stu .el-dialog.el-dialog--center,{
  height: 75%;
  display: flex;
  flex-direction: column;
  .el-dialog__body{
    flex: 1;
    overflow: hidden;
    .select_list{
      overflow: auto;
      height: 100%;
    }
    .selecte{
      padding:1%;
      .has{
        border-color:#2AC2CB;
        background-color: #2AC2CB;
        color: #fff;
      }
      button{
        margin:0 1% 1% 0;
        width: 19%;
        padding: 0;
        height: 40px;
      }        
      &::-webkit-scrollbar-track{  //滚动条的轨道
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.05);  
        border-radius: 10px;  /*滚动条的背景区域的圆角*/
        background-color: #FCFAFA;/*滚动条的背景颜色*/  
      }  
      &::-webkit-scrollbar-thumb{// 滚动条里面的小方块
        background: #D2D2D2;
        border-radius: 5px;
      }
      &::-webkit-scrollbar{  
          width: 8px;  /*滚动条宽度*/
          height: 20px;  /*滚动条高度*/
      }
    }
  }    
}

//媒体查询
@media screen and (min-width:1200px){
  body{
    font-size: 20px!important;
  }
  input, textarea, select, button{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 20px !important;
  }
  #footer{
    .bar {
      font-size: 22px!important;
      i{
         font-size: 27px!important;
      }
    }
  }
  .el-dialog__title,.el-message-box__title,.el-message-box__headerbtn .el-message-box__close,.el-dialog__headerbtn .el-dialog__close,.el-form-item__label,.el-form-item__content, .el-message-box__content, .el-dropdown-menu__item, .el-message,.el-message__content,.el-select-dropdown__item,.el-dialog__body{
    font-size: 20px!important;
  }
  .redfont{
    font-size: 20px!important;
  }
  .el-checkbox__label{
    font-size: 16px;
  }
  .confirm span{
    font-size: 20px!important;
  }
}
  /* CSS */
</style>
