<template>
  <div id="login" >
      <el-col :span="24">
        <el-col :span="18" style="-webkit-app-region: drag">
          <img src="~@/assets/img/logo.png" id="logo">
        </el-col>
        <el-col :span="5" >    
          <span class="language" @click="changeL('en')" :style="lg_=='en'?'color:#ccc':''">简体中文 </span>     
           <span class="language"  @click="changeL('zh')" :style="lg_=='zh'?'color:#ccc':''">&nbsp; English</span>         
        </el-col>
        <el-col :span="1">          
          <i class="el-icon-close" @click="closeWindow"></i>
        </el-col>
      </el-col>
      <aside>
        <img src = "~@/assets/img/login.png" />   
      </aside>
      <el-main v-loading="loading" :element-loading-text="$t('m.C_loading')">
        <el-form>
           <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('m.L_sign_in')" name="first">
              <el-form-item label="">
                <el-input :placeholder="$t('m.L_Account')" maxlength=11 required v-model="name" prefix-icon="icon-yonghuzhuzhanghaoguanli" class="name iconfont" id="userName" :suffix-icon="user_list==true?'el-icon-arrow-up':''" @focus="user_list=true" @blur="hidelist" @change="password=''"></el-input>   
                <ul v-show="user_list">
                  <li v-for="(item,index) in userArr" :key="index">
                    <span @click.prevent="check(item.name)">{{item.name}}</span>  <i class="el-icon-delete" @click="deleteUser(item.name)"></i>
                  </li>
                </ul>
              </el-form-item>

              <el-form-item label="">
                <el-input  :placeholder="$t('m.L_Password')" required v-model="password" type="password" prefix-icon="icon-icon-" class="iconfont"  @keyup.native.13="submit"></el-input>
              </el-form-item>
              <!-- 记住密码 -->
              <el-form-item>
                <el-checkbox v-model="checked">{{$t('m.L_Remember_password')}}</el-checkbox>
              </el-form-item>
              <el-button plain size="medium " @click="submit" @keyup.enter="submit">{{$t('m.L_sign_in')}}</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-main>

      <el-col :span="24" class="copyright">
       <!-- <el-row>{{$t('m.L_copyright')}}</el-row> -->
       <el-row style="margin:5px 0;">{{$t('m.L_info')}} &nbsp;V{{version}} &nbsp;&nbsp;{{updateMsg}}</el-row>
      </el-col>
      
    <el-dialog :title="$t('m.L_updatev')" :visible.sync="dialogVisible" class="dialog_login" center :modal=false>
      <span>{{$t('m.L_findv')}}{{version}}&nbsp;{{$t('m.L_downv')}}</span><br/>
      <span>{{$t('m.L_newFun')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('m.B_cancel')}}</el-button>
        <el-button type="primary" @click="downloadUpdate()">{{$t('m.B_ok')}}</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
const { ipcRenderer, remote, dialog } = require('electron');
export default {
  name: "zhuqiao",
  // props:['updateMsg'],
  data() {
    return {
      checked: true,
      activeName: 'first',
      //userType:false,//true班主任，false其他老师
      name: "",
      password: "",
      user_list:false,
      userArr:[],
      lg_:'',//语言标签,
      loading:false,
      options:'',//班主任班级列表
      classId:'',
      updateMsg:'',
      version:'',
      dialogVisible:false,
    };
  },
  methods: {
    //  切换语言
    changeL(lg){
      // console.log(lg);
      if(lg == 'en'){
        this.$i18n.locale = 'zh';
        this.lg_='zh';
      }else{
        this.$i18n.locale = 'en';
        this.lg_ = 'en';
      }
      localStorage.lg = this.lg_;
    },
    //登陆
    submit() {
      var ths = this;
      
      //验证网络连接
      if(!window.navigator.onLine){
        ths.$message.error(ths.$t('m.L_net'));
        ths.$emit('net',{network:false})
        return
      }else{
        ths.$emit('net',{network:true})
      }
      if (ths.name == "" || ths.password == "") {
        ths.$message.error(ths.$t('m.L_emptymsg'));
      }else{
        var obj = {'name':ths.name,'password':ths.password} 
                        
        //请求用户信息
        ths.loading = true;
        ths.$axios({ 
          method:'POST',
          url:`/clientLogin?username=${obj.name}&password=${obj.password}`//&cid=${teacher.classId}`/v2/teacher/username/${obj.name}/password/${obj.password}/preTeacherCheck`,        
        })
        .then(function(res){
          ths.loading = false;      
          res = res.data;
          if(res.msg  == 'success'){
            // 记住密码
            if(ths.checked == true){
              var has = true; 
              if(ths.userArr.length>0){               
                for(var i in ths.userArr){                  
                    var item = ths.userArr[i];
                    // 用户已存在      
                    if(obj.name == item.name){ 
                      has = true;    
                      ths.userArr.splice(i,1,obj);           
                      break
                    }else{
                      has = false;  
                      //  console.log('用户不存在')                                                           
                    }   
                    if(ths.userArr.length>7){
                      ths.userArr.splice(0,1,obj);
                    }                  
                }
              }else{
                 has = false;
              }
                //添加新用户
              if(has == false){
                  ths.userArr.unshift(obj);                                   
              }
              localStorage.user = JSON.stringify(ths.userArr);
            }
            var teacherInfo = res.data.teacher;
            teacherInfo.privilege = res.data.privilege;

            ths.$emit('user',{teacher:teacherInfo});//发送数据给父组件
            var stu = [];
            for(var i in res.data.grades){
              var gradeObj={};              
              var gradeItem = res.data.grades[i];
              for(var j in res.data.classStudent){
                var classItem = res.data.classStudent[j];
                if (classItem.grade == gradeItem.createDt){
                  gradeObj.grade = gradeItem;
                  gradeObj.classId = classItem;
                  stu.push(gradeObj);            
                }else{
                  continue 
                }
              }
            }
            ths.$emit('grade',{grade_data:stu})

            ths.$axios({
              url:`/v1/tag/1`,// /v1/tagItem/{type}/{tchId}/tagType 1-能量站评价项标签  2-事件标签
              method:'GET'
            })
            .then(function(res){
              res = res.data;
              // console.log(res)
              ths.$emit('pingjia',{pingjia_data:res.data});
              ths.resizeWindow();
              ths.$router.push('/class');
            })

          }else if(res.code === 6){
            ths.$message.error(ths.$t('m.L_erruser'));
          }else if(res.code === 4){
            ths.$message.error(ths.$t('m.L_loginmsg'));
          }else{
            ths.$message.error(ths.$t('m.Co_err'));            
          }                        
          })
          .catch(function(err){
            // console.log(res)
            ths.loading = false;
            ths.$message.error(ths.$t('m.L_servererr'));
          })
        }
    },
    //自动填充该用户密码
    check(name){
      var ths = this;
      ths.name = name;
      for(var item of ths.userArr){
        if(item.name == ths.name){
            ths.password = item.password;
        }
      }
      // ths.hidelist();
    },
    //关闭窗口
    closeWindow(){
        remote.getCurrentWindow().close(); 
    },
    //删除账号
    deleteUser(name){
      var ths = this;
      // console.log(name)
      for(var i in ths.userArr){
        if(ths.userArr[i].name == name){
            ths.userArr.splice(i, 1);
            localStorage.user = JSON.stringify(ths.userArr);
            break
        }
      }
    },
    //验证账号类型
    hidelist(){
      var ths = this;    
      setTimeout(()=>{
         ths.user_list = false;
        //验证网络连接
        if(!navigator.onLine){
          ths.$message.error(ths.$t('m.L_net'));
          ths.$emit('net',{network:false})
          return
        }else{
          ths.$emit('net',{network:true})
        }   

        //判断教师类型
        if(ths.name.trim() != ''){ 
          //console.log(ths.name)       
          ths.$axios({
            method:'GET',
            url:`/check?username=${ths.name}`
          })
          .then(function(res){
          console.log(res,'用户');
            res = res.data;
            if(res.msg == 'success'){
            }else if(res.msg == '无效用户名！'&&res.code == -1){
              ths.$message.error(ths.$t('m.L_erruser'));
            }  
          })
        }    
     },300)
    },
    //改变窗口大小
    resizeWindow() {
        remote.getCurrentWindow().setSize(1100,740)//重置大小 width，height
        remote.getCurrentWindow().center();//窗口居中
    },
    // downloadUpdate(){
    //   var ths = this;
    //   ths.$axios({
    //     method:'GET',
    //     url: `/download`,  //没心情还去实现一次服务端，直接用一个服务器上的静态文件给你做演示
    //     responseType: 'blob' //返回数据的格式指定为blob
    //   })
    //   .then(response => {
    //     let url = window.URL.createObjectURL(response.data); //创建一个新的 URL 对象
    //     console.log(url)
    //     //以下代码一句话解释，在页面上生成一个a标签并指定href为上面的url,然后模拟点击，以实现自动下载
    //     var a = document.createElement("a");
    //     document.body.appendChild(a);
    //     a.href = url;
    //     a.download = 'Facts.zip';
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //   })
    //   .catch(err => {
    //     ths.$message.error("download failed!");
    //     ths.$message.error(err);
    //   })
    //   ths.dialogVisible = false;
    // },
  },
  mounted(){
    var ths = this;
    //获取版本信息
    var info = require("../../../package.json");
    var name = info.name;
    ths.version = info.version;
    //console.log("version:"+ths.version)
    ths.$electron.ipcRenderer.on("message", (event, text) => {
        ths.tips = text;
        if(text == 'checking'){
          ths.updateMsg = ths.$t('m.L_checkv')//'正在检查更新……'
        }else if(text == 'updateAva'){
          ths.updateMsg = ths.$t('m.L_findv')//'发现新版本'
          ths.dialogVisible=false;
          
        }else if(text == 'updateNotAva'){
          ths.updateMsg = ths.$t('m.L_newv')//'已是最新版本'
        }else if(text == 'error'){
          ths.$message.error(ths.$t('m.L_errupdate'));
          ths.updateMsg = ths.$t('m.L_errupdate')//'检查更新出错'
        }            
        console.log(ths.updateMsg+":"+ths.version)
    });
    //初始化用户列表
    if(localStorage.user){
      this.userArr = JSON.parse(localStorage.user);
    }
    //初始化语言
    this.lg_ = this.$i18n.locale;
    
    },
  }
</script>
<style>
#login .el-dialog__header{
  background: #22a8af;
  height: 15px;
  box-shadow:2px 0 10px #399ea3;
}
#login .el-dialog--center .el-dialog__body{
  overflow: hidden;
  margin-top: -10px;
  padding-bottom: 70px;
}
/* .el-dialog__footer{
} */
</style>
<style lang="scss" scoped>
#login .dialog_login{
  overflow: hidden;
  margin:10% 0;
  //border: red 2px solid;
}
#login {
  background: #27b5bd;
  height: 100%;
  #logo{
    margin: 2% 0 0 0;
    height: 8%;
    width: 25%;
   
  }
  .el-col {
    color: #fff;
    font-size: 18px;
    padding: 0 10px 10px;
    .el-icon-close {
      float: right;
      font-size: 25px;
      line-height: 55px;
    }
    .language{     
        font-size: 14px;
        line-height: 55px;
        cursor: pointer;     
    }
  }
  //左侧图片
  aside {
    width: 50%;
    // border: 1px solid yellow;
    height: 75%;
    float: left;
    img{
      width: 84%;
      margin: 8%;
      opacity: 0.7;
    }
  }
  //右侧表单
  .el-main {     
    background: #e6f5fc;
    box-shadow: 0px 0px 10px #7F7F7F;
    height: 75%;
    text-align: left;
    padding: 4%;
    margin-right: 5%;
    .el-form{
      padding: 0;
    }
    .name{
      position: relative;
    }
    ul{
      margin: 0;
      padding: 0;
      width: 100%;
      position: absolute;
      z-index: 100;
      overflow: hidden;
      max-height: 123px;
      overflow-y: scroll;
      &::-webkit-scrollbar{  
           display:none;
      }
      li{
        cursor: pointer;
        background: #fff;
        list-style: none;
        border-bottom: 1px solid #dcdfe6;
        border-radius: 4px;
        padding-left: 15px;
        box-sizing: border-box;
       
        span{
          width: 240px;
          // border: 1px solid red;
          display:inline-block;
        }
      }
      li:hover{
        transform: scale(1.05) ;
        transition: all 0.5s;
        background: #27B5BD;
        color: #fff;
      }
    }
    .el-button {
      width: 50%;
      margin-left: 25%;
      background: #27b5bd;
      color: #fff;
    }
    #login_container{
      height: 317px;
      overflow: hidden;
  
    }
  
  }
  .copyright{
    margin-left: 10px;
    font-size: 14px;
    text-indent: 10px;
    position: relative;
    top: 10px;
    font-weight: 100;
  }
}


/* CSS */
</style>


