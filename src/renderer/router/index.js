import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue' //登陆页
import Header from '@/components/Header.vue' //头部
import Footer from '@/components/Footer.vue' //底部
import Class from '@/components/Class.vue' //班级列表页 能量站
import Stu from '@/components/Stu.vue' //学生列表页 
import Facts from '@/components/Facts.vue' //事件记录页 facts
import TimeLine from '@/components/TimeLine.vue' //时间轴页
import Attendance from '@/components/Attendance.vue' //考勤页
import Interest from '@/components/Interest.vue' //兴趣课页
import Chart from '@/components/Chart.vue' //报表统计页
import QueryTag from '@/components/QueryTag.vue'//标签查询页
import Elective from '@/components/Elective.vue'//选修课页

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      components:{
        mainContent:Login
      }
    },
    {
      path:'/class',
      name:'class',
      components:{
        header:Header,
        mainContent:Class,
        footer:Footer     
      }
    },
    {
      path:'/stu',
      name:'stu',
      components:{
        header:Header,
        mainContent:Stu, 
        footer:Footer       
      }
    },
    {
      path:'/facts',
      name:'facts',
      components:{
        header:Header,
        mainContent:Facts, 
        footer:Footer       
      }
    },
    {
      path:'/interest',
      name:'interest',
      components:{
        header:Header,
        mainContent:Interest, 
        footer:Footer       
      }
    },
    {
      path:'/chart',
      name:'chart',
      components:{
        header:Header,
        mainContent:Chart, 
        footer:Footer       
      }
    },
    {
      path:'/timeline',
      name:'timeline',
      components:{
        header:Header,
        mainContent:TimeLine, 
        footer:Footer       
      }
    },
    {
      path:'/querytag',
      name:'querytag',
      components:{
        header:Header,
        mainContent:QueryTag,
        footer:Footer
      }
    },
    {
      path:'/attendance',
      name:'attendance',
      components:{
        header:Header,
        mainContent:Attendance,
        footer:Footer
      }
    },
    {
      path:'/elective',
      name:'elective',
      components:{
        header:Header,
        mainContent:Elective, 
        footer:Footer       
      }
    },
  ],
})
