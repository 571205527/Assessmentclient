<template>
    <div id="footer">
        <el-row class="bar" justify="space-between"  type="flex" align="center">
            <!-- 底部下拉菜单 -->
            <el-col :span="3" id="menu" @click.native="check_menu=!check_menu" :class="check_menu==true?'clicked':''" >    
                <el-dropdown @command="handleCommand" trigger="click" @visible-change="change_menu" class="bar">
                    <div>
                        <i class="iconfont icon-caidan1"></i>
                        <span >{{$t('m.F_Menu')}}</span>
                    </div>
                    <el-dropdown-menu slot="dropdown" style="width:12%;left:0;">
                        <!-- <el-dropdown-item command="update" >下载更新</el-dropdown-item> -->
                        <el-dropdown-item command="yh" >{{$t('m.F_Menu_yh')}}</el-dropdown-item>
                        <el-dropdown-item command="quit" divided>{{$t('m.F_Menu_out')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>                    
            </el-col>

            <el-col :span="10">
                <!-- 能量站 -->
                <el-col :span="6" @click.native ="$router.push('/class');index=0;check_chart=false;"  :class="index==0?'clicked': ''">               
                    <i class="icon-nengliang iconfont"  style="font-weight:100;"></i>
                    <span>{{$t('m.F_Energy_station')}}</span>                
                </el-col>  
                <!-- facts -->
                <el-col :span="6" @click.native="$router.push('/facts');index=1;check_chart=false;" :class="index==1?'clicked': ''">   
                    <i class="icon-wenbenbianji iconfont"></i>
                    <span >{{$t('m.F_Facts')}}</span>
                </el-col>
                <!-- 考勤 -->
                <el-col :span="6" @click.native="$router.push('/attendance');index=3;check_chart=false;" :class="index==3?'clicked': ''">   
                    <i class="icon-qiandao iconfont"></i>
                    <span >{{$t('m.F_Attendance')}}</span>
                </el-col>
                <!-- 兴趣课 -->
                <el-col id="InClass" :span="6" @click.native="$router.push('/interest');index=4;check_chart=false;" :class="index==4?'clicked': ''">   
                    <i class="icon-xiaolianchenggong iconfont"></i>
                    <span >{{$t('m.F_Interest')}}</span>
                </el-col> 
            </el-col>           
            <!-- 报表 -->
            <el-col id="chart" :span="2" @click.native="toChart" :class="check_chart==true?'clicked':''">   
                <i class="icon-baobiaoguanli iconfont" ></i>
                <span>{{check_chart==true?$t('m.F_chart_out'):$t('m.F_chart_in')}}</span>
            </el-col> 
            <el-col :span="3">
                <div class="net">
                    <span :style="network?'':'color:red;'">{{network?$t('m.F_net_good'):$t('m.F_net_bad')}}</span>
                    <i :class="network?'icon-wangluoxinhao iconfont': 'icon-wangluoguzhang iconfont'" :style="network?'':'color:red;'"></i>                    
                </div>
            </el-col>                                                                                                  
        </el-row>

        <!-- 退出 -->
        <el-dialog
        :title="$t('m.F_message')"
        :visible.sync="signoutPop"
        width="50%"
        style="margin-top: 20vh;"
        center
        >
        {{ $t('m.F_dtitle')}}
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="medium" @click="signOut">{{$t('m.B_ok')}}</el-button>
            <el-button type="primary" size="medium" @click="signoutPop = false">{{$t('m.B_cancel')}}</el-button>
        </span>

        </el-dialog>
    </div>
</template>
<script>

import {shell} from 'electron'
const { ipcRenderer, remote } = require('electron');

export default {
    props:['network','teacher'],
    data(){
      return{
          signoutPop:false,//退出弹窗
          centerDialogVisible: false,//意见反馈
          value: null,
          feedback:'',
          phone:'',
          index_:false,
          index:'0',
          check_menu:false,
          check_chart:false,
      }
    },
    methods:{
        change_menu(res){
            var ths = this;
            ths.check_menu = res;
        },
        toChart(){
            var ths = this;
            ths.$router.push('/chart');
            ths.check_chart=!ths.check_chart;
            if(ths.check_chart == false){
                ths.$router.go(-1);
            }
        },
        signOut(){
            var ths = this;
            ths.signoutPop = false;
             //验证网络连接
            if(!navigator.onLine){                       
                ths.$message.error(ths.$t('m.L_net'));
                ths.$emit('net',{network:false})                
                return
            }else{
                ths.$emit('net',{network:true})
            }
            ths.$axios({//退出登录
                method: "GET",
                url: "/logOut"
            })
            .then(function(res) {                            
                // console.log(res);
                if(res.data.code == 403&&res.data.msg == '未登录'){
                    ths.$message.error(ths.$t('m.L_timeout'));
                    ths.$router.push('/');
                    remote.getCurrentWindow().setSize(800,600);  
                    remote.getCurrentWindow().center()
                    return
                }
                if(res.data == 'login'){
                    ths.$router.push('/');
                    remote.getCurrentWindow().setSize(800,600);  
                    remote.getCurrentWindow().center()
                }                         
            })
            .catch(function(){
                ths.$message.error(ths.$t('m.L_servererr'));
            })
        },
        handleCommand(command) {
            var ths = this;       
            if(command == 'quit'){ //退出确认框
                ths.signoutPop = true;
            }else if(command == 'yh'){ //筑桥教育
                shell.openExternal('http://www.thelittlebridge.cn/')
            }else if(command == 'update'){ //意见反馈
                shell.openExternal('http://henkel.cn-bj.ufileos.com/unpack.zip?UCloudPublicKey=ucloudzuotiehua%40qq.com13941468161750674794&Signature=z23fgQbWI77pcKkqRgo%2FrHg5%2BOo%3D&Expires=1543913109')
                //ths.centerDialogVisible = true;          
            }
        },
        submit(){//意见反馈提交
            var ths = this;
            ths.centerDialogVisible = false;
            // console.log(ths.phone,ths.feedback,ths.value)
        },
  },
  mounted(){
      if(this.teacher.privilege.state === 1&&this.teacher.privilege.role!=0){          
            document.getElementById('InClass').style.display = 'none';
        }
  }
}
</script>

<style lang="scss" scoped>

#footer{
    position: relative;
    background: #27b5bd;
    height: 9%;
    // z-index: 1000;
    color: #fff;
    #chart,#menu>div,.el-col-6{//.el-col-10, 当:span为10时添加此样式
        cursor:pointer;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        flex-direction:  column;
        height: 100%;
    }
    #menu{
        border-right: 1px solid #26A6AE;
        border-radius: 0;
        
    }
    #chart{
        border-right: 1px solid #26A6AE;
        border-left: 1px solid #26A6AE;
    }
    .clicked{
        background: #2AC2CB;
    }
    
    .bar{    
        color: #fff;
        text-align: center;
        font-size: 14px;
        height: 98%;        
        i{
            display: block;
            font-size: 22px;
            margin: 3px 0;
            font-weight: 900;
        }
    }    
    .el-rate{
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    .el-button--primary{
        background: #27b5bd;
        border: 0;
    }
    .net{//网络情况
        text-align: right;
        position: absolute;
        right: 10px;
        bottom: 25%;
        font-size: 16px;
        i{
            display: inline;
            font-weight: normal;
            font-size: 20px;
        }
    }
}
</style>
