<template>
    <el-row id="header">
        <el-col :span="16" id="logo"  style="-webkit-app-region: drag">

          <img src="../assets/img/logo.png" id="logo">
        </el-col>  
        <el-col :span="8" :offset="0">
            <p class="icon">
                <span v-if="teacher.privilege.role==0">{{teacher.tchName}} {{$t('m.H_admin')}}</span>
                <span v-if="teacher.privilege.role==1">{{teacher.tchName}} {{$t('m.L_teacher')}}</span>
                <span v-if="teacher.privilege.role>=2">{{teacher.tchName}} {{$t('m.H_teacher')}}</span>
                <i class="el-icon-minus" @click="minWindow"></i>
                <i :class="isMaxed == false?'icon-weibiaoti-' : 'icon-zuidahua'" @click="maxWindow" style=" font-family: 'iconfont' !important;font-style:normal;font-weight:700;"></i>
                <i class="el-icon-close" @click="closeWindow"></i>
            </p>
        </el-col>    
        
    </el-row>
</template>
<script>

const { ipcRenderer, remote, screen } = require('electron');
const BrowserWindow = require('electron').remote.BrowserWindow
const path =require('path')

export default {
    props:['teacher'],
    data(){
        return{
          
            isMaxed:false,

        }
    },
    methods:{
        //窗口最小化
        minWindow() {
            remote.getCurrentWindow().minimize();
        },
        // 窗口最大化
        maxWindow() {
            var ths = this;
            const browserWindow = remote.getCurrentWindow();
            // console.log(ths.isMaxed)
            if (ths.isMaxed) {
                browserWindow.unmaximize();
                ths.isMaxed = false;
                
            } else {
                browserWindow.maximize();
                ths.isMaxed = true;
                
            }
        },
        //关闭窗口
        closeWindow(){
            // remote.getCurrentWindow().close();
            const browserWindow = remote.getCurrentWindow(); 
            var child = null;  
                  
            // 右侧弹出小窗
            // if(browserWindow.getChildWindows().length<=0){
            //     const ipcRenderer = require('electron').ipcRenderer;
            //     ipcRenderer.send('newPage')
            // }else{
            //     child = browserWindow.getChildWindows()[0];
            //     child.show();
            // }            
            browserWindow.hide();
            
        }
    }
}
</script>

<style lang="scss" scoped>
// 头部
#header{
    position: relative;
    background: #27b5bd;
    height: 7%;  
    // 左侧logo        
    #logo{
        height:100%;
        overflow: hidden;
        img{
            height:80%;
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            margin: auto;
        }
    }
    // 右侧图标
    .el-col {
        height:100%;
        color: #fff;
        // font-size: 18px;
        .icon {
            margin-right:10px; 
            float: right;
            .el-icon-close,.el-icon-minus,i{
                margin: 0 5px;
            }                    
        }
    }
}
</style>
