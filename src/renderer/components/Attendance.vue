<template>
    <div id="attendance">
        <el-row type="flex" justify="center">
            <span style="font-size: 25px;font-weight: 600;margin:10px 0;">{{signTitle}}</span>
        </el-row>
        <el-form :inline="true" class="lineblock">
            <el-form-item :label="$t('m.Inp_d1')" required>
                <el-date-picker style="float:left;width:60%;" v-model="form.data" :picker-options='picker_options' type="date"
                :clearable="false" :placeholder="$t('m.Inp_d1')" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="initCount()"></el-date-picker>
                <!-- <el-tag v-show="disWeek">{{weekTag}}</el-tag> -->
            </el-form-item>
            <el-form-item :label="$t('m.Att_abs4')" style="margin-left:-4%;" required>
                <el-select v-model="form.time" :placeholder="$t('m.Att_abs4')" style="width:70%;" allow-create filterable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="submitAttendance()" class="red">{{$t('m.Fa_record')}}</el-button>
            <el-button type="primary" @click="divShow()" class="red">{{$t('m.Fa_flow')}}</el-button>
        </el-form>

        <!-- 考勤流水 -->
        <el-dialog :title="$t('m.Att_msg1')" :visible.sync="attDetailPop" width="70%" center class="dialog_stu dialog_flow">
            <!-- 选择学生表单 -->
            <el-form>
                <el-row>
                    <!-- 选择班级 -->
                    <el-select  value-key='classId' v-model="formD.class_" :placeholder="$t('m.Inp_c')" :clearable="true" @change="showStu($event)">
                        <el-option v-for="(item,index) in tableData" :key="index" :label="item.classList" :value="item"></el-option>
                    </el-select> 
                    <!-- 选择学生 -->
                    <el-select value-key='id' v-model="form.stu" filterable :placeholder="$t('m.Fa_dtitle1')" :clearable="true" >
                        <el-option v-for="(item,index) in stuList1" :key="index" :label="item.stuName+'('+item.stuNickname+')'" :value="item"></el-option>
                    </el-select>
                    <!-- 选择时间 -->
                    <el-date-picker v-model="formD.data" :picker-options='picker_options' type="daterange" :start-placeholder="$t('m.Ca_start')" :end-placeholder="$t('m.Ca_end')"
                        :clearable="false" style="width:39%" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <el-button type="primary" @click="getFlow()" :disabled="formD.data ==''?true:false" class="red">{{$t('m.B_ok')}}</el-button>
                </el-row>
            </el-form>
            <!-- 图表 -->
            <div class="main">
                <!-- 流水 -->
                <ul class="record_ul scroll_0" v-show="flowShow=true" >
                    <p  class="tishi" v-if="record==null" style="text-align:center;">{{$t('m.Ca_msg1')}}</p>
                    <div v-else >            
                        <li v-for="(item,index) in record" :key="index" class="record">
                            <span>【{{item.leaveDt}}】</span>
                            <span v-show="formD.class_==''">{{formatNum(new Date().getFullYear()-item.classYear+1)+" ("+item.classNo+")"}}</span>
                            <span>{{item.stuName}}</span>
                            <span style="color:#CC5952;font-weight:700;" v-if="item.leaveType==1">{{$t('m.Att_abs1')}}</span>
                            <span style="color:#CC5952;font-weight:700;" v-else-if="item.leaveType==2">{{$t('m.Att_abs2')}}</span>
                            <span style="color:#CC5952;font-weight:700;" v-else-if="item.leaveType==3">{{$t('m.Att_abs3')}}</span>
                            <span style="color:#27b5bd;font-weight:700" v-else-if="item.leaveType==4">{{$t('m.Att_late1')}}</span>
                            <!-- <span style="color:#CC5952;font-weight:700">{{$t('m.Att_late1')}}</span> -->
                            <span v-if="item.leaveTime==1">半天(Morning)</span>
                            <span v-else-if="item.leaveTime==2">半天(Afternoon)</span>
                            <span v-else-if="item.leaveTime==3">一天(One Day)</span>
                            <span v-else-if="item.leaveTime!=1&&item.leaveTime!=2&&item.leaveTime!=3&&item.leaveTime!=0">{{item.leaveTime}}</span>
                            <!-- <span>{{item.eventNote}}</span> -->
                            <i class="el-icon-delete" @click="cancelFlow(item.id)"></i>
                        </li>
                    </div>
                </ul>   
            </div>  
        </el-dialog>

        <div class="type">
            <el-table :data="tableData" class="tb-edit" highlight-current-row border height="100%" :header-cell-style="{'text-align':'center'}" >
                <!-- 班级 v-if="item.label==''?false:true" -->
                <el-table-column v-for="(item,index) in tableKey" :key="index+1" :label="item.label" width="55px" :prop="item.value" v-if="item.label==''?false:true"></el-table-column>
                <!-- 今日考勤 -->
                <el-table-column :label="$t('m.Att_att')" width="50px">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.att" :placeholder="stuCount[scope.$index]-attCount[scope.$index]" readonly></el-input>
                    </template>
                </el-table-column>
                <!-- 缺勤人数 -->
                <el-table-column :label="$t('m.Att_abs')" width="50px" height="30px;">
                    <template slot-scope="scope"> <!-- @input="changeAtt(scope.$index, scope.row)" -->
                        <el-input size="mini" v-model="scope.row.abs" :placeholder="attCount[scope.$index]"></el-input>
                    </template>
                </el-table-column>
                <!-- 名单 -->
                <el-table-column :label="$t('m.Att_abs1')" height="30px;">
                    <template slot-scope="scope">
                        <el-select value-key='id' v-model="scope.row.attIds" filterable multiple size="mini" style="width:100%" :placeholder="$t('m.Fa_dtitle1')" 
                         @change="sel_Students(scope.$index,scope.row)">
                            <!-- <el-option label="全班" value="全班"></el-option> -->
                            <el-option v-for="(item,index) in stuList[scope.$index].students" :key="index" :label="item.stuName+'('+item.stuNickname+')'" :value="item"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!-- 事假 -->
                <el-table-column :label="$t('m.Att_abs2')" height="30px;">
                    <template slot-scope="scope">
                        <el-select value-key='id' v-model="scope.row.perIds" filterable multiple size="mini" style="width:100%" :placeholder="$t('m.Fa_dtitle1')" 
                         @change="sel_Students(scope.$index,scope.row)">
                            <el-option v-for="(item,index) in stuList[scope.$index].students" :key="index" :label="item.stuName+'('+item.stuNickname+')'" :value="item"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!-- 病假 -->
                <el-table-column :label="$t('m.Att_abs3')" height="30px;">
                    <template slot-scope="scope">
                        <el-select value-key='id' v-model="scope.row.sickIds" filterable multiple size="mini" style="width:100%" :placeholder="$t('m.Fa_dtitle1')" 
                         @change="sel_Students(scope.$index,scope.row)">
                            <el-option v-for="(item,index) in stuList[scope.$index].students" :key="index" :label="item.stuName+'('+item.stuNickname+')'" :value="item"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!-- 迟到人数 -->
                <el-table-column :label="$t('m.Att_late')" width="50px">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.late" :placeholder="lateCount[scope.$index]"></el-input> 
                    </template>
                </el-table-column>
                <!-- 迟到名单 -->
                <el-table-column :label="$t('m.Att_name')">
                    <template slot-scope="scope">
                        <el-select value-key='id' v-model="scope.row.lateIds" filterable multiple size="mini" style="width:100%" :placeholder="$t('m.Fa_dtitle1')" 
                         @change="sel_Students(scope.$index,scope.row)">
                            <el-option v-for="(item,index) in stuList[scope.$index].students" :key="index" :label="item.stuName+'('+item.stuNickname+')'" :value="item"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    export default {
        name: "attendance",
        props: ["grade", "teacher"],
        data() {
            return {
                attDetailPop:false,//弹窗
                flowShow:false,
                noData:false,//没有数据
                signTitle:'',//考勤标题
                stuCount:[],//学生人数
                stuList:[],//所有学生名单
                stuList1:[],
                attCount:[],//缺勤人数
                lateCount:[],//迟到人数
                classIds:[],
                absIds:[],//缺勤学生id
                perIds:[],//事假学生
                sickIds:[],//病假学生
                lateIds:[],//迟到学生id
                tableData: [],//表格数据
                tableKey:[],
                record:[],//签到流水
                form: {
                    grade_: "",//年级
                    class_: "",//班级
                    stu:"",
                    data:`${new Date().toLocaleDateString().replace(/\//g,'-')}`,//日期
                    time:'',//缺勤课时
                },
                classList:[],
                formD: {
                    data:"",
                    class_:"",
                },
                picker_options:{//可选时间限制
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                options: [{
                    value: '半天(Morning)',
                    label: '半天(Morning)',
                }, {
                    value: '半天(Afternoon)',
                    label: '半天(Afternoon)',
                }, {
                    value: '一天(One Day)',
                    label: '一天(One Day)',
                }, {
                    value: '停课(Suspension)',
                    label: '停课(Suspension)',
                }],
            }
        },
        methods: {
            //流水学生
            showStu: function (event) {
                if(event.length<=0){
                    this.form.stu="";
                    this.stuList1="";
                }
                for (var i = 0;i<this.tableData.length;i++) {
                    if (this.stuList[i].classId == this.formD.class_.classId){
                         this.stuList1=this.stuList[i].students;
                         break;
                    }
                }
            },
            divShow(){
                this.tableShow=false;
                this.attDetailPop=true;
                //console.log(this.tableShow)
            },
            //提交考勤数据
            submitAttendance(){
                var ths=this;
                var postdata = [];
                if(ths.classIds.length>0){
                    for(var i=0;i<ths.classIds.length;i++){
                        var classId = ths.classIds[i];
                        var stuSidsArr = [];
                        var leaveType = [];
                        if(classId!=undefined&&classId!=null&&classId!=''){
                            if(ths.absIds[i].length>0&&ths.absIds[i]!=null&&ths.absIds[i]!=undefined){
                                for(var j=0;j<ths.absIds[i].length;j++){
                                    //absArr.push(ths.absIds[i][j].id);
                                    stuSidsArr.push(ths.absIds[i][j].id);
                                    leaveType.push(1)
                                }
                            }
                            if(ths.perIds[i].length>0&&ths.perIds[i]!=null&&ths.perIds[i]!=undefined){
                                for(var m=0;m<ths.perIds[i].length;m++){
                                    stuSidsArr.push(ths.perIds[i][m].id);
                                    leaveType.push(2)
                                }
                            }
                            if(ths.sickIds[i].length>0&&ths.sickIds[i]!=null&&ths.sickIds[i]!=undefined){
                                for(var n=0;n<ths.sickIds[i].length;n++){
                                    stuSidsArr.push(ths.sickIds[i][n].id);
                                    leaveType.push(3)
                                }
                            }
                            if(ths.lateIds[i].length>0&&ths.lateIds[i]!=null&&ths.lateIds[i]!=undefined){
                                for(var p=0;p<ths.lateIds[i].length;p++){
                                    stuSidsArr.push(ths.lateIds[i][p].id);
                                    leaveType.push(4)
                                }
                            }
                            //console.log(stuSidsArr);
                            //考勤
                            var postdata1 = {
                                classId:classId,//
                                stuIds:stuSidsArr,//学生
                                tchId:ths.teacher.id,//老师
                                leaveType:leaveType,//请假类型
                                leaveTime:ths.form.time,//请假课时
                                leaveDt:ths.form.data,//记录日期
                            }
                            postdata.push(postdata1);
                        } 
                        //console.log(i+",class:"+classId)
                    }
                    //console.log(ths.classIds)
                    ths.$axios({
                        url:`/v3/attendance/log`,
                        method:'POST',
                        data:postdata
                        }).then(function(res){
                        if(res.data.code == 403&&res.data.msg == '未登录'){
                            ths.$message.error(ths.$t('m.L_timeout'));
                            ths.$emit('out','登陆超时');
                            return
                        }
                        res = res.data;
                        //记录成功提示
                        if(res.msg == 'success'){
                            var success_msg = null;       
                            ths.$message({
                                message: ths.$t('m.Fa_msg0'),
                                type: 'success', 
                                showClose:true
                            })
                            ths.attIds=[];
                            ths.perIds=[];
                            ths.sickIds=[];
                            ths.lateIds=[];
                            ths.classIds=[];
                        }else{
                            ths.$message.error(ths.$t('m.Co_err'));
                        } 
                    }).catch(function(){
                        ths.$message.error(ths.$t('m.L_servererr'));
                    })
                }
        //         ths.absIds.forEach((item,key)=>{
        // 　　　　　　 for(var i=0;i<item.length;i++){
        //                 console.log(key+"："+item[i].id)
        //             }
        // 　　　　});
        
            },
            //格式化
            formatNum(e){
                switch(e){
                    case 0:return "日";break;
                    case 1:return "一";break;
                    case 2:return "二";break;
                    case 3:return "三";break;
                    case 4:return "四";break;
                    case 5:return "五";break;
                    case 6:return "六";break;
                    default: return e;
                }
            },
            //下拉框多选
            sel_Students(index,row){
                var ths = this;
                ths.classIds[index]=row.classId;
                row.abs = row.attIds.length+row.perIds.length+row.sickIds.length+ths.attCount[index];//缺勤
                row.late = row.lateIds.length+ths.lateCount[index];//迟到
                row.att = ths.stuCount[index] - row.abs;//今日考勤
                ths.absIds[index]=row.attIds;
                ths.perIds[index]=row.perIds;
                ths.sickIds[index]=row.sickIds;
                ths.lateIds[index]=row.lateIds;
                console.log(ths.classIds)
            },
            //下拉框填充数据
            fillStudents(index,row){
                var ths = this;
                if(row.classId == ths.stuList[index].classId){
                    ths.stu1 = ths.stuList[index].students;
                    var temp1 = [];
                    //for-in 循环遍历的是对象的属性，而不是数组的索引。因此，for-in 遍历的对象便不局限于数组，还可以遍历对象。且遍历属性的顺序并不确定
                    //for(var j in item){
                    for(let j=0;j<ths.stu1.length;j++){
                        //var str = {value:item[j],label:item[j].stuName+'('+item[j].stuNickname+')'};
                        temp1.push(ths.stu1[j]);
                    }
                }
                ths.stus = temp1;
                //选中之后别的下拉框也会选中所有数据？？？  v-model的数据绑定有问题
            },
            cancelFlow(id){
                var ths = this;
                //ths.checkNet();
                ths.$axios({
                    method:'GET',
                    url: `/v3/attendance/cancel/${id}`
                })
                .then(function(res){
                    if(res.data.code == 403&&res.data.msg == '未登录'){
                        ths.$message.error(ths.$t('m.L_timeout'));
                        ths.$emit('out','登陆超时');
                        return
                    }
                    res = res.data;        
                    // console.log(res);
                    if(res.code === 0){
                        ths.$message.success(ths.$t('m.Ca_delSuc'));
                        ths.getFlow();
                    }else{
                        ths.$message.error(ths.$t('m.Ca_delFai'));
                    }
                })
                .catch(function(){
                    ths.$message.error(ths.$t('m.L_servererr'));
                })
            },
            getFlow(){
                var ths = this;
                if(ths.formD.class_==""&&ths.form.stu==""){//3-所有记录  2-班级 1-个人
                    var url = `/v3/attendance/flow/3/5/${ths.formD.data[0]}/${ths.formD.data[1]}`;
                }else if(ths.formD.class_!=""&&ths.form.stu==""){
                    url = `/v3/attendance/flow/2/${ths.formD.class_.classId}/${ths.formD.data[0]}/${ths.formD.data[1]}`;
                }else if(ths.formD.class_!=""&&ths.form.stu!=""){
                    url = `/v3/attendance/flow/1/${ths.form.stu.id}/${ths.formD.data[0]}/${ths.formD.data[1]}`;
                }
                ths.$axios({
                    url:url,
                    method:'GET',
                    }).then(function(res){
                    if(res.data.code == 403&&res.data.msg == '未登录'){
                        ths.$message.error(ths.$t('m.L_timeout'));
                        ths.$emit('out','登陆超时');
                        return
                    }
                    res = res.data;
                    if(res.msg == 'success'){
                        ths.record = res.data;
                        ths.flowShow = true;
                    }else{
                        ths.$message.error(ths.$t('m.Co_err'));
                    } 
                }).catch(function(){
                    ths.$message.error(ths.$t('m.L_servererr'));
                })
            },
            initCount(){
                var ths = this;
                ths.$axios({
                    url:`/v3/attendance/count/${ths.form.data}/${ths.form.data}`,
                    method:'GET',
                    }).then(function(res){
                    if(res.data.code == 403&&res.data.msg == '未登录'){
                        ths.$message.error(ths.$t('m.L_timeout'));
                        ths.$emit('out','登陆超时');
                        return
                    }
                    res = res.data;
                    if(res.msg == 'success'){
                        for(var i=0;i<res.data.length;i++){
                            ths.attCount.push(res.data[i].attCount);
                            ths.lateCount.push(res.data[i].lateCount);
                        }
                    }else{
                        ths.$message.error(ths.$t('m.Co_err'));
                    } 
                }).catch(function(){
                    ths.$message.error(ths.$t('m.L_servererr'));
                })
            },
            initData(){
                var ths = this;
                var date = new Date();
                var curYear = date.getFullYear();
                var curMonth = date.getMonth()+1;
                    console.log(curMonth)
                if(curMonth >= 8||curMonth<=12){
                    if(localStorage.lg=='en'){
                        ths.signTitle = "Attendance Record of 1st Semester, "+curYear;
                    }else{
                        ths.signTitle = curYear + "学年第一学期学生考勤情况";
                    }
                }
                if(curMonth>=1&&curMonth<=2){
                    if(localStorage.lg=='en'){
                        ths.signTitle = "Attendance Record of 1st Semester, "+(curYear-1);
                    }else{
                        ths.signTitle = (curYear-1) + "学年第一学期学生考勤情况";
                    }
                }
                if(curMonth < 8 && curMonth >= 2){
                    if(localStorage.lg=='en'){
                        ths.signTitle = "Attendance Record of 2st Semester, "+(curYear-1);
                    }else{
                        ths.signTitle = (curYear-1) + "学年第二学期学生考勤情况";
                    }
                }
                var mark = [];
                var temp = [];
                ths.tableKey = [
                    {value:"classId",label:''},
                    {value:"classList",label:ths.$t('m.Inp_c')},
                    {value:"stuCount",label:ths.$t('m.C_stu1')},
                ];
                ths.initCount();
                //填充表格必要数据
                for(let i in ths.grade){
                    var item = ths.grade[i].classId.classStudentses;
                    //console.log(item)
                    for(let j in item){
                        if(curMonth >= 8){
                            var classYear = (curYear-item[j].classYear<0)?item[j].classYear:curYear-item[j].classYear+1;
                        }else{
                            classYear = (curYear-item[j].classYear<=0)?item[j].classYear:curYear-item[j].classYear;
                        }
                        ths.classList.push(ths.formatNum(classYear)+'('+item[j].classNo+')');
                        var str = {
                            classId:item[j].classId,
                            classList:ths.formatNum(classYear)+'('+item[j].classNo+')',
                            stuCount:item[j].students.length,
                        };
                        ths.stuCount.push(item[j].students.length);
                        mark.push(str);
                        temp.push(item[j]);
                    }
                    ths.tableData = mark;
                    ths.stuList = temp;
                }
            }
        },
        mounted() {
            //this.initCount();
            this.initData();
        }
    };
</script>
<style lang="scss" scoped>
#attendance {
    box-sizing: border-box;
    height: 84%;
    display: flex;
    flex-direction: column;
    //border: 2px solid black;
    .lineblock{
        margin-left: -4%;
        // .el-form-item{
        //     //margin-right: -3%;
        // }
    }
    .type{
        flex-direction: column;
        width: 98%;
        height:80%;
        margin: 0 1%;
        margin-top: -20px;
        //border: 1px solid blue;
        position: relative;
        .el-table{
            position: absolute;
            height: 100%;
            font-size: 12px;
        }
        .el-input{
            position: relative;
        }
        .el-select{
            font-size: 10px;
        }
    }
    .dialog_flow{
        width: 104%;
        margin: 1% -1%; 
        .el-form{
            //border: #CC5952 2px solid;
            margin: -2.5% 0 0 0;
        }
    }
    // 图表
  .main {
    background: #fff;
    flex: 1;
    display: flex;
    height: 86%;
    //border: #CC5952 2px solid;
    #chart_,#chart_1,#chart_4{
        flex: 1;
    }
  }
.record_ul{//流水，排行榜
      padding: 0;
      margin: 0;
      font-weight: 700;
      overflow: auto;
      height: 100%;
      width: 100%;
    //   />div{padding: 5px 0;}
      li{
          line-height: 50px;
          height: 50px;
          text-indent: 1%;
          border-top:1px solid  #EAE9E9;
          &:hover{
              background: #f5f5f5;
          }
          &:nth-child(odd){
              border-top:1px solid  #EAE9E9;
          }
          .el-icon-delete{
              line-height: 50px;
              float: right;
              margin-right: 2%;
              cursor: pointer;
              font-weight: 500;
              &:hover{
                  color: #CC5952;
              }

          }
      }
  }
  .record{//评价流水 li
    span{
        margin: 0!important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        display: inline-block;
        line-height: 50px;
        &:nth-child(1){
            width: 17%;
        }
        &:nth-child(2){
            width: 8%;
        }
        &:nth-child(3){
            width:22%;
        }
        &:nth-child(4){
            width: 10%;
        }
        &:nth-child(5){
            width: 25%;
        }
        &:nth-child(6){
            width: 12%;
            //border: #CC5952 2px solid;
        }
        &:nth-child(7){
            width: 14%;
        }
    }
}
}
</style>
<style lang="scss">
    #attendance .el-table .el-input__inner,.el-input{
        position: relative;
        border-radius: 0;
        padding:0 0.5%;
        //border:none;
    }
    #attendance input::-webkit-input-placeholder {
        /* placeholder颜色  */
        /* placeholder字体大小  */
        font-size: 14px;
    }
</style>


