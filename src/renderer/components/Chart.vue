<template>
  <div id="chart">
    <!-- 能量站 -->
    <div class="type" v-show="nl_btn==0">
        <!-- 选择学生表单 -->
        <el-form >
            <el-row>
                <!-- 选择年级 -->
                <el-select v-model="form.grade_" value-key="grade"  :placeholder="$t('m.Inp_g')" @change="sel_grade">
                <el-option v-for="(item,index) in grade" :key="index"  :value="item.classId.classStudentses" :label="item.grade.gradeName"></el-option>    
                </el-select>
                <!-- 选择班级 -->
                <el-select  value-key='classId' v-model="form.class_" :placeholder="$t('m.Inp_c')" :disabled="disClass" @change="sel_class">
                    <el-option v-for="item in classList" :key="item.classSid" :label="item.className" :value="item"></el-option>
                </el-select> 
                <!-- 选择学生 -->
                <el-button type="primary"  :disabled="disStu" @click="selectionStuPop=true;form.stu=''" class="red" style="width:15%;margin-right:5px;">{{form.stu==''?$t('m.Fa_dtitle1'):form.stu.stuNickname+" "+form.stu.stuName}}</el-button>
     
                <!-- 选择时间 -->
                <el-date-picker
                    v-show="nl_btn==2?false:true"
                    v-model="form.data"
                    :picker-options='picker_options'
                    type="daterange"
                    :clearable="false"
                    :start-placeholder="$t('m.Ca_start')"
                    :end-placeholder="$t('m.Ca_end')"
                    style="width:26%"
                    :disabled="disDate"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-select v-model="form.chart">
                    <el-option label="雷达图" value="雷达图"></el-option>
                    <el-option label="柱形图" value="柱形图"></el-option>
                </el-select>
                <el-button type="primary" @click="submit" :disabled="form.grade_!=''&&form.data!=''?false:true" class="red">{{$t('m.B_ok')}}</el-button> 
            </el-row>
        <!-- 所选学生信息 -->
            <el-col :span="24" class="stu_info">
                <P v-show="show_stu">
                    {{form.grade_==''?'':form.gradeName}} {{form.class_==''?'':form.class_.className}} {{form.stu==''?'':form.stu.stuNickname+" "+form.stu.stuName}} &nbsp;<span>{{form.data==''?'':form.data[0]+'~'+form.data[1]}}</span>
                </P>
            </el-col>
        </el-form>
        <!-- 图表 -->
        <div class="main">
            <div  id="chart_" ref="chart" v-loading="loading" :element-loading-text="$t('m.C_loading')">
                <p  class="tishi">{{$t('m.Ca_msg')}}</p>
            </div>   
        </div>  
    </div>
    <!-- 能量条 -->
    <div class="type" v-show="nl_btn==1">
        <!-- 选择学生表单 -->
        <el-form >
            <el-row>
     
                <!-- 选择年级 -->
                <el-select v-model="form.grade_" value-key="grade"  :placeholder="$t('m.Inp_g')" @change="sel_grade">
                <el-option v-for="(item,index) in grade" :key="index"  :value="item.classId.classStudentses" :label="item.grade.gradeName"></el-option>    
                </el-select>
                <!-- 选择班级 -->
                <el-select  value-key='classId' v-model="form.class_" :placeholder="$t('m.Inp_c')" :disabled="disClass" @change="sel_class">
                <el-option v-for="item in classList" :key="item.classSid" :label="item.className" :value="item"></el-option>
                </el-select> 
                <!-- 选择学生 -->
                <el-button type="primary" :disabled="disStu" @click="selectionStuPop=true;form.stu=''" class="red" style="width:15%;margin-right:5px;">{{form.stu==''?$t('m.Fa_dtitle1'):form.stu.stuNickname+" "+form.stu.stuName}}</el-button>

                <!-- 选择时间 -->
                <el-date-picker
                    v-model="form.data"
                    :picker-options='picker_options'
                    type="daterange"
                    :clearable="false"               
                    :start-placeholder="$t('m.Ca_start')"
                    :end-placeholder="$t('m.Ca_end')"
                    style="width:26%"
                    :disabled="disDate"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <!-- 选择精度 -->
                <el-select v-model="form.jd"  placeholder="">
                    <el-option v-for="(item,index) in jdArr" :key = index :label="item.name" :value="item.value" ></el-option>            
                </el-select>                
                <el-button type="primary" @click="submit" :disabled="form.grade_!=''&&form.data!=''?false:true" class="red">{{$t('m.B_ok')}}</el-button>
            </el-row>
        <!-- 所选学生信息 -->
            <el-col :span="24" class="stu_info">
                <P v-show="show_stu">
                    {{form.grade_==''?'':form.gradeName}} {{form.class_==''?'':form.class_.className}} {{form.stu==''?'':form.stu.stuNickname+" "+form.stu.stuName}} &nbsp;<span>{{form.data==''?'':form.data[0]+'~'+form.data[1]}}</span>
                </P>
            </el-col>
        </el-form>        
        <!-- 图表 -->
        <div class="main">
            <div id="chart_1" ref="chart" v-loading="loading"  :element-loading-text="$t('m.C_loading')">
                <p  class="tishi" v-if="noData1">{{$t('m.Ca_msg1')}}</p>
                <p  class="tishi" v-else>{{$t('m.Ca_msg')}}</p>               
            </div>   
        </div>  
    </div>
    <!-- 评价流水 -->
    <div class="type" v-show="nl_btn==2">
        <!-- 选择学生表单 -->
        <el-form >
            <el-row>
                <!-- 选择年级 -->
                <el-select v-model="form.grade_" value-key="grade"  :placeholder="$t('m.Inp_g')" @change="sel_grade">
                <el-option v-for="(item,index) in grade" :key="index"  :value="item.classId.classStudentses" :label="item.grade.gradeName"></el-option>    
                </el-select>
            
                <!-- 选择班级 -->
                <el-select  value-key='classId' v-model="form.class_" :placeholder="$t('m.Inp_c')" :disabled="disClass" @change="sel_class">
                <el-option v-for="item in classList" :key="item.classSid" :label="item.className" :value="item"></el-option>
                </el-select> 
                <!-- 选择学生 -->
                <el-button type="primary"  :disabled="disStu" @click="selectionStuPop=true;form.stu=''" class="red" style="width:15%;margin-right:5px;">{{form.stu==''?$t('m.Fa_dtitle1'):form.stu.stuNickname+" "+form.stu.stuName}}</el-button>
                <!-- <el-button type="primary" v-show="nl_btn==3?false:true" :disabled="disStu" @click="selectionStuPop=true;form.stu=''" class="red" style="width:15%;margin-right:5px;">{{form.stu==''?$t('m.Fa_dtitle1'):form.stu.stuNickname+" "+form.stu.stuName}}</el-button> -->
                <!-- 选择时间 -->
                <el-date-picker
                    v-model="form.data"
                    :picker-options='picker_options'
                    type="daterange"
                     :start-placeholder="$t('m.Ca_start')" :end-placeholder="$t('m.Ca_end')"
                    :clearable="false"   
                    style="width:25%"
                    :disabled="disDate"               
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-button  type="primary" @click="submit" :disabled="form.class_ == ''||form.data ==''?true:false" class="red">{{$t('m.B_ok')}}</el-button>
            </el-row>
        <!-- 所选学生信息 -->
            <el-col :span="24" class="stu_info">
                <P v-show="show_stu">
                    {{form.grade_==''?'':form.gradeName}} {{form.class_==''?'':form.class_.className}} {{form.stu==''?'':form.stu.stuNickname+" "+form.stu.stuName}} &nbsp;<span >{{form.data2==''?'':form.data2}}</span>
                </P>
            </el-col>
        </el-form>
        <!-- 图表 -->
        <div class="main">
            <!-- 流水 -->
            <ul class="record_ul scroll_0" v-show="nl_btn==2" >
                <p  class="tishi" v-if="!flowShow">{{$t('m.Ca_msg')}}</p>
                <p  class="tishi" v-if="noData">{{$t('m.Ca_msg1')}}</p>
                <div v-else >            
                    <li v-for="(item,index) in record" :key="index" class="record" :title="item.eventLocation?item.eventLocation+' '+item.eventNote:''">
                        <span>【{{item.time}}】</span>
                        <!-- <span> {{item.className}}</span> -->
                        <span> {{item.stuNickname+' '+item.stuName}}</span>
                        <span :title="item.itemName" :style="item.assessType==0?'color:#CC5952;font-weight:700;':'color:#27b5bd;font-weight:700;'"> {{item.itemName}}</span>
                        <span>
                            <i> {{item.assessType==0?'+':'-'}}</i>
                            <i :style="item.assessType==0?'color:#CC5952;font-weight:700;':'color:#27b5bd;font-weight:700;'"> {{item.assessScore}}</i>
                        </span>
                        <span>{{item.eventLocation}}</span>
                        <span>{{item.tchName}}</span>               
                        <!-- <span>{{item.eventNote}}</span> -->
                        <i class="el-icon-delete" @click="cancelFlow(item.id)"></i>
                    </li>
                </div>
            </ul>   
        </div>  
    </div>
    <!-- 排行榜 -->
    <div class="type" v-show="nl_btn==3">
        <!-- 选择学生表单 -->
        <el-form >
            <el-row>
                <!-- 选择年级 -->
                <el-select v-model="form.grade_" value-key="grade"  :placeholder="$t('m.Inp_g')" @change="sel_grade">
                <el-option v-for="(item,index) in grade" :key="index"  :value="item.classId.classStudentses" :label="item.grade.gradeName"></el-option>    
                </el-select>
                <!-- 选择班级 -->
                <el-select  value-key='classId' v-model="form.class_" :placeholder="$t('m.Inp_c')" :disabled="disClass" @change="sel_class">
                <el-option v-for="item in classList" :key="item.classSid" :label="item.className" :value="item"></el-option>
                </el-select> 
                <!-- 选择时间 -->
                <el-date-picker
                    v-model="form.data"
                    :picker-options='picker_options'
                    type="daterange"
                    :clearable="false"               
                    :start-placeholder="$t('m.Ca_start')"
                    :end-placeholder="$t('m.Ca_end')"
                    style="width:26%"
                    :disabled="disDate"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <!-- 选择精度 -->
                <el-select v-model="form.jd"  placeholder="" >
                    <el-option v-for="(item,index) in jdArr" :key = index :label="item.name" :value="item.value" ></el-option>            
                </el-select>
                
                <!-- 学生排序 -->
                <el-select v-model="form.rank"  placeholder=""   v-show="form.class_!=''?true:false">
                    <el-option :label="$t('m.Ca_class')" value="1" selected="selected"></el-option>
                    <el-option :label="$t('m.Ca_grade')" value="2"></el-option>
                </el-select>
                <el-button type="primary" @click="submit" :disabled="form.grade_!=''&&form.data!=''?false:true" class="red">{{$t('m.B_ok')}}</el-button>
            </el-row>
        <!-- 所选学生信息 -->
            <el-col :span="24" class="stu_info">
                <P v-show="show_stu">
                    {{form.grade_==''?'':form.gradeName}} {{form.class_==''?'':form.class_.className}} {{form.stu==''?'':form.stu.stuNickname+" "+form.stu.stuName}} &nbsp;<span >{{form.data==''?'':form.data[0]+'~'+form.data[1]}}</span>
                </P>
            </el-col>
        </el-form>
        
        <!-- 图表 -->
        <div class="main">                   
            <!-- 排行榜 -->
            <ul class="rank record_ul scroll_0">
                <p  class="tishi" v-if="!rakShow">{{$t('m.Ca_msg')}}</p>
                <div v-else>
                    <li >
                        <span>{{$t('m.Ca_no')}}</span>
                        <span>{{$t('m.Ca_name')}}</span>
                        <span>{{$t('m.Ca_jia')}}</span>
                        <span>{{$t('m.Ca_jian')}}</span>
                        <span>{{$t('m.Ca_ultima')}}</span>
                    </li>
                    <li v-for="(item,index) in rakArr" :key = index>
                        <span>{{index+1}}</span>
                        <span>{{item.stuName==null?item.className:item.className+"/"+item.stuNickname+" "+item.stuName}}</span>
                        <span>{{item.award}}</span>
                        <span>{{item.deduct==0?0:-item.deduct}}</span>
                        <span>{{item.total}}</span>                       
                    </li> 
                </div>      
            </ul>    
        </div>  
    </div>
    <!-- 签到 -->
    <div class="type" v-show="nl_btn==4">
        <!-- 选择学生表单 -->
        <el-form >
            <el-row>
                <div v-show="((teacher.privilege.role==1&&signStu==true)||(teacher.privilege.role==0&&signStu==true))?true:false" style="display:inline">
                    <!-- 选择年级 -->
                    <el-select v-model="form.grade_" value-key="grade"  :placeholder="$t('m.Inp_g')" @change="sel_grade">
                    <el-option v-for="(item,index) in grade" :key="index"  :value="item.classId.classStudentses" :label="item.grade.gradeName"></el-option>    
                    </el-select>
                    <!-- 选择班级 -->
                    <el-select  value-key='classId' v-model="form.class_" :placeholder="$t('m.Inp_c')" :disabled="disClass" @change="sel_class">
                    <el-option v-for="item in classList" :key="item.classSid" :label="item.className" :value="item"></el-option>
                    </el-select> 
                    <!-- 选择学生 -->
                    <el-button type="primary" :disabled="disStu" @click="selectionStuPop=true;form.stu=''" class="red" style="width:15%;margin-right:5px;">{{form.stu==''?$t('m.Fa_dtitle1'):form.stu.stuNickname+" "+form.stu.stuName}}</el-button>
                </div>
                <div v-show="(signCourse==true && teacher.privilege.role==0)||(teacher.privilege.role==1&&signCourse==true)?true:false" style="display:inline">
                    <!-- 选择兴趣课 -->
                    <el-select v-model="formD.inId" value-key="subId"  :placeholder="$t('m.Inp_s')+$t('m.F_Interest')" @change="selIn">
                        <el-option v-for="(item,index) in inClassList" :key="index"  :value="item" :label="item.subName" :disabled="item.subName==''?true:false"></el-option>    
                    </el-select>
                    <!-- 选择老师 -->
                    <el-select v-model="formD.Inteacher" value-key="id"  :placeholder="$t('m.Inp_s')+$t('m.H_teacher')">
                        <el-option v-for="(item,index) in Inteacher" :key="index"  :value="item" :label="item.tchName"></el-option>    
                    </el-select>
                </div>
                <!-- 选择时间 -->
                <el-date-picker
                    v-model="form.data"
                    :picker-options='picker_options'
                    type="daterange"
                    :clearable="false"               
                    :start-placeholder="$t('m.Ca_start')"
                    :end-placeholder="$t('m.Ca_end')"
                    style="width:26%"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>

                <el-button v-if="(teacher.privilege.role==0&&signStu==true)||(teacher.privilege.role==1&&signStu==true)" type="primary" @click="submit" :disabled="form.data != ''&&form.class_ != ''&&form.grade_ !=''?false:true" class="red">{{$t('m.B_ok')}}</el-button>
                <el-button v-if="(teacher.privilege.role==0&&signCourse==true)||(teacher.privilege.role==1&&signCourse==true)" type="primary" @click="submit" :disabled="form.data !=''&&formD.Inteacher!=''&&formD.inId!=''?false:true" class="red">{{$t('m.B_ok')}}</el-button>
                <el-button v-if="teacher.privilege.role==2" type="primary" @click="submit" :disabled="form.data !=''?false:true" class="red">{{$t('m.B_ok')}}</el-button>
            </el-row><br />
        
            <!-- 所选学生信息 -->
            <el-col :span="24" class="stu_info">
                <P v-show="show_stu">
                    {{form.grade_==''?'':form.gradeName}} {{form.class_==''?'':form.class_.className}} {{form.stu==''?'':form.stu.stuNickname+" "+form.stu.stuName}} &nbsp;<span>{{form.data==''?'':form.data[0]+'~'+form.data[1]}}</span>
                </P>
            </el-col>
        </el-form> 
        
        <!-- 图表 -->
        <div class="main">
            <div id="chart_4" ref="chart" v-loading="loading"  :element-loading-text="$t('m.C_loading')" >
                <p  class="tishi" v-show="form.data==''&&signStu || teacher.privilege.state != 0">{{$t('m.Ca_msg')}}</p>
            </div>
        </div>  

        <!-- 签到表格 -->
        <div width="100%" v-show="signCourse||teacher.privilege.role ==2?true:false" class="type">
            <el-table :data="tableList" v-loading="loading" border height="100%" :header-cell-style="{'text-align':'center'}">
                <el-table-column v-for="(item,index) in tableKey" 
                    :key="index"
                    :prop="item.value"
                    :label="item.label"></el-table-column>
            </el-table>
        </div>

    </div>
    <!-- 考勤报表 -->
    <div class="type" v-show="nl_btn==5 && dailyAtt">
        <el-row type="flex" style="margin:-1% 0 1% 0;">
            <el-col style="width:50%;">
                <el-date-picker style="width:42%;" v-model="formD.date" type="date" :placeholder="$t('m.Inp_d1')"
                    :picker-options='picker_options' :clearable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="showWeek(),getAttChart()"></el-date-picker>
                <el-tag v-show="disWeek">{{weekTag}}</el-tag>
            </el-col>
            <el-col><span style="font-size: 25px;font-weight: 600;">{{signTitle}}</span></el-col>
        </el-row>
        <el-table :data="attData" class="tb-edit" highlight-current-row border height="100%" :header-cell-style="{'text-align':'center'}" v-show="attKey!=null">
            <el-table-column v-for="(item,index) in attKey" align="center" :key="index" :prop="item.value" :label="item.label"></el-table-column>
        </el-table>
    </div>
    <!-- 成长报告 -->
    <div class="type" v-show="nl_btn==6">
        <el-form >
            <el-row>
                <!-- 选择年级 -->
                <!-- <el-select v-model="form.gradeYear" value-key="grade"  :placeholder="$t('m.Inp_g')">
                    <el-option v-for="(item,index) in grade" :key="index" :value="item.classId.grade" :label="item.grade.gradeName"></el-option>    
                </el-select> -->
                
                <div v-show="((teacher.privilege.role==1&&signStu==true)||(teacher.privilege.role==0&&signStu==true))?true:false" style="display:inline">
                    <!-- 选择年级 -->
                    <el-select v-model="form.grade_" value-key="grade"  :placeholder="$t('m.Inp_g')" @change="sel_grade">
                    <el-option v-for="(item,index) in grade" :key="index"  :value="item.classId.classStudentses" :label="item.grade.gradeName"></el-option>    
                    </el-select>
                    <!-- 选择班级 -->
                    <el-select  value-key='classId' v-model="form.class_" :placeholder="$t('m.Inp_c')" :disabled="disClass" @change="sel_class">
                    <el-option v-for="item in classList" :key="item.classSid" :label="item.className" :value="item"></el-option>
                    </el-select> 
                    <!-- 选择学生 -->
                    <el-button type="primary" :disabled="disStu" @click="selectionStuPop=true;form.stu=''" class="red" style="width:18%;margin-right:5px;">{{form.stu==''?$t('m.Fa_dtitle1'):form.stu.stuNickname+" "+form.stu.stuName}}</el-button>
                </div>
                <!-- 选择时间 -->
                <el-date-picker
                    v-model="form.data"
                    :picker-options='picker_options'
                    type="daterange"
                    :clearable="false"               
                    :start-placeholder="$t('m.Ca_start')"
                    :end-placeholder="$t('m.Ca_end')"
                    style="width:26%"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-button type="primary" @click="submit" :disabled="form.data!=''&&form.stu!=''?false:true" class="red">{{$t('m.B_ok')}}</el-button>
            </el-row>
        </el-form>
        <div class="main" v-show="nl_btn == 6">
            <div class="report record_ul scroll_0">
                <div v-html="reportContent"></div>
                <div id="chart_5" ref="chart" v-loading="loading" style="height:90%;" :element-loading-text="$t('m.C_loading')"></div>
            </div>
        </div>
    </div>

  <!-- 报表按钮 -->
  <el-row class="bottomBtn" type="flex" justify="center">   
    <el-button :class="nl_btn == 0?'nl_sel':' '"  @click="nl(0)" >{{$t('m.Ca_zhan')}}</el-button>
    <el-button :class="nl_btn == 1?'nl_sel':' '"   @click="nl(1)" >{{$t('m.Ca_tiao')}}</el-button>
    <el-button :class="nl_btn == 2?'nl_sel':' '"   @click="nl(2)">{{$t('m.Ca_flow')}}</el-button>
    <el-button :class="nl_btn == 3?'nl_sel':' '"   @click="nl(3)">{{$t('m.Ca_rank')}}</el-button>
    <el-button  ref="sign" :class="nl_btn == 4?'nl_sel':' '" @click="nl(4)" v-show="(teacher.privilege.role == 2&&teacher.privilege.state == 0)||(teacher.privilege.role == 1&&teacher.privilege.state != 0)">{{$t('m.Ca_sign')}}</el-button>
    <!--下拉菜单 -->
    <el-col :span="2" @click.native="check_menu=!check_menu" :class="check_menu==true?'clicked':''" v-show="teacher.privilege.role == 0||(teacher.privilege.role==1&&teacher.privilege.state == 0)">
        <el-dropdown @command="handleCommand" trigger="click" @visible-change="change_menu">
            <el-button :class="nl_btn == 4?'nl_sel':' '" @click="nl(4)">{{$t('m.Ca_sign')}}</el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="course">{{$t('m.Ca_course')}}</el-dropdown-item>
                <el-dropdown-item command="stu" divided>{{$t('m.Ca_student')}}</el-dropdown-item>
                <!-- divided 要放在下面，不然会多一个格子 -->
            </el-dropdown-menu>
        </el-dropdown>
    </el-col>
    <!-- <el-button :class="nl_btn == 6?'nl_sel':' '"   @click="nl(6)">{{$t('m.Ca_report')}}</el-button> -->
    <!-- <el-col :span="2" @click.native="check_menu=!check_menu">
        <el-dropdown @command="handleCommand" trigger="click" @visible-change="change_menu">
            <el-button :class="nl_btn == 5?'nl_sel':' '" @click="nl(5)">{{$t('m.Ca_Attendance')}}</el-button>
            <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item command="rank" divided>{{$t('m.Ca_rankAtt')}}</el-dropdown-item> -->
                <!-- <el-dropdown-item command="daily">{{$t('m.Ca_dayAtt')}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-col> -->
  </el-row>

    <!-- 选择学生弹框 -->
    <el-dialog
    title="点击选择学生姓名"
    :visible.sync="selectionStuPop"
    width="70%"
    center
    class="dialog_stu">
      <div class="selecte select_list" >
        <el-button v-for="(item,index) in form.class_.students" :key="index" @click="sel_stu(item)" :class="item == form.stu?'has':' '">{{item.stuNickname+" "+item.stuName}}</el-button>
      </div>   
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
import app from "electron";
import BrowserWindow from "electron";
import { setTimeout } from 'timers';
export default {
  name: "chart",
  props: ["grade", "teacher",'pingjia'],
  data() {
    return {
      myChart:'',
      classYear:'',//年级
      rakArr:[],//排行榜
      rakShow:false,//排行榜
      flowShow:false,//个人流水
      noData:false,//没有数据
      noData1:false,
      disClass: true, //选择班级
      disStu: true,//选择学生
      disDate: true,//时间
      selectionStuPop: false,//选择学生弹窗
      show_stu: false,
      classList: [],
      jdArr:[],
      loading: false,
      record:[],
      inClassList:[],//兴趣课
      signTitle:'',
      tableList:[],
      tableKey:[],
      attData:[],//考勤
      attKey:[],
      signCourse:false,
      signStu:true,
      dailyAtt:true,//日报表
      rankAtt:false,
      weekTag:'',//星期标签
      disWeek:false,
      check_menu:false,
      attData: [],//考勤表格数据
      attKey:[],
      stuCount:[],
      StuData:[],
      form: {
        grade_: "",
        class_: "",
        data: "",
        data2:`${new Date().toLocaleDateString().replace(/\//g,'-')}`,
        stu: "",
        jd:'',
        rank:'1', 
        chart:"雷达图", 
        gradeYear:"",    
      },
      Inteacher:[],//兴趣课老师
      formD:{//签到详情
        date:`${new Date().toLocaleDateString().replace(/\//g,'-')}`,
        inId:'',
        Inteacher:''
      },
      nl_btn: "0", //能量站0 能量条1 评价流水2 排行榜3 签到4 成长报告5
      picker_options: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      signArr:[],
      subId:'',//兴趣课老师，兴趣课id
      reportContent:'',//报告页面
      reportPie:[],
    };
  },
  methods: {
    getAttChart(){
        var ths = this;
        var date = new Date();
        var curYear = date.getFullYear();
        var mark = [];
        var temp = [];
        ths.$axios({
            url:`/v3/attendance/chart/daily/${ths.formD.date}`,
            method:'GET',
            }).then(function(res){
            if(res.data.code == 403&&res.data.msg == '未登录'){
                ths.$message.error(ths.$t('m.L_timeout'));
                ths.$emit('out','登陆超时');
                return
            }
            res = res.data.data;
            for(var m in res){
                var time = res[m].leaveTime;
                var type = res[m].leaveType;
                var clas = res[m].classId;
                var attStus = [];
                var perStus = [];
                var sickStus = [];
                var lateStus = [];
                if(type == 1){
                    for(var i in res[m].students){
                        attStus.push(res[m].students[i].stuName);
                    }
                }
                if(type == 2){
                    for(var i in res[m].students){
                        perStus.push(res[m].students[i].stuName);
                    }
                }
                if(type == 3){
                    for(var i in res[m].students){
                        sickStus.push(res[m].students[i].stuName);
                    }
                }
                if(type == 4){
                    for(var i in res[m].students){
                        lateStus.push(res[m].students[i].stuName);
                    }
                }
                var stuStr={
                    class:clas,
                    att:attStus,
                    per:perStus,
                    sick:sickStus,
                    time:time,
                    late:lateStus
                }
                ths.StuData.push(stuStr);
            }
        })
        ths.attKey = [
            //{value:"classId",label:''},
            {value:"classList",label:ths.$t('m.Inp_c')},
            {value:"stuCount",label:ths.$t('m.C_stu1')},
            {value:"dailyCount",label:ths.$t('m.Att_att')},
            {value:"attCount",label:ths.$t('m.Att_abs')},
            {value:"att",label:ths.$t('m.Att_abs1')},
            {value:"per",label:ths.$t('m.Att_abs2')},
            {value:"sick",label:ths.$t('m.Att_abs3')},
            {value:"time",label:ths.$t('m.Att_abs4')},
            {value:"lateCount",label:ths.$t('m.Att_late')},
            {value:"late",label:ths.$t('m.Att_name')},
        ];
        //填充表格必要数据
        for(let i in ths.grade){
            var item = ths.grade[i].classId.classStudentses;
            for(let j in item){
                var stuLen = item[j].students.length;
                var classYear = curYear - item[j].classYear + 1;
                var str = {};
                for(var m in ths.StuData){
                    if(ths.StuData[m].class==item[j].classId){
                        
                str = {
                    classList:ths.formatNum(classYear)+'('+item[j].classNo+')',
                    stuCount:item[j].students.length,
                    dailyCount:item[j].students.length-(ths.StuData[m].att.length+ths.StuData[m].per.length+ths.StuData[m].sick.length),
                    attCount:ths.StuData[m].att.length+ths.StuData[m].per.length+ths.StuData[m].sick.length,
                    att:ths.StuData[m].att,
                    per:ths.StuData[m].per,
                    sick:ths.StuData[m].sick,
                    time:ths.StuData[m].time,
                    lateCount:ths.StuData[m].late.length,
                    late:ths.StuData[m].late,
                };
                    }
                   // console.log(str)
                }
                mark.push(str);
                ths.stuCount.push(item[j].students.length);
                temp.push(item[j]);
            }
            ths.attData = mark;
        }
        //console.log(ths.attData)
    },
    formatNum(e){
        switch(e){
            case 0:return "日";break;
            case 1:return "一";break;
            case 2:return "二";break;
            case 3:return "三";break;
            case 4:return "四";break;
            case 5:return "五";break;
            case 6:return "六";break;
            default: this.disWeek = false;
        }
    },
    //根据日期显示星期
    showWeek(){
        var ths = this;
        if(ths.formD.date!=''&&ths.formD.date!=null){
            var date = new Date(ths.formD.date);
            if(localStorage.lg=='en'){
                switch(date.getDay()){
                    case 0:ths.weekTag = "Sunday";break;
                    case 1:ths.weekTag = "Monday";break;
                    case 2:ths.weekTag = "Tuesday";break;
                    case 3:ths.weekTag = "Wednesday";break;
                    case 4:ths.weekTag = "Thursday";break;
                    case 5:ths.weekTag = "Friday";break;
                    case 6:ths.weekTag = "Saturday";break;
                    default: ths.disWeek = false;
                }
            }else{
                var str = "星期";
                ths.weekTag = str + ths.formatNum(date.getDay());
            }
            ths.disWeek=true;
        }else{
            ths.disWeek = false
        }
    },
    checkNet(){//验证网络
         var ths =this;
        if(!navigator.onLine){                       
            ths.$message.error(ths.$t('m.L_net'));
            ths.$emit('net',{network:false})
            return
        }else{
            ths.$emit('net',{network:true})
        }
    }, 
    change_menu(res){
        var ths = this;
        ths.check_menu = res;
    },
    getInClass(){//获取兴趣课
      var ths = this;
      ths.$axios({
        method:'GET',
        url:`/v2/subject/lesson/${ths.teacher.id}`
      })
      .then(function(res){
        if(res.data.code == 403&&res.data.msg == '未登录'){        
            ths.$message.error(ths.$t('m.L_timeout'));              
            ths.$emit('out','登陆超时');
            return                  
        }
        res = res.data.data;
        ths.inClassList = res;
      })
      .catch(function(err){
      })
    },
    //选择兴趣课
    selIn(){
      var ths = this;
      ths.Inteacher=[];
      ths.Inteacher.push(...ths.formD.inId.teachers);
      ths.detailStu=[];
      ths.formD.Inteacher = '';
      // console.log(ths.formD)
    },
    handleCommand(command) {
        var ths = this;       
        if(command == 'course'){ //按课程查询
            ths.signCourse = true;
            ths.signStu = false;
        }else if(command == 'stu'){ //按学生查询
            ths.tableList = [];
            ths.signStu = true;
            ths.signCourse = false;
        }else if(command == 'daily'){
            ths.attData = [];
            ths.dailyAtt = true;
            ths.rankAtt = false;
        }else if(command == 'rank'){
            ths.dailyAtt = false;
            ths.rankAtt = true;
        }
        //console.log("att:"+ths.dailyAtt)
    },
    cancelFlow(id){//撤销评价
      var ths = this;
      ths.checkNet();
      ths.$axios({
        method:'GET',
        url: `/v1/assess/cancel/${id}`
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
            ths.submit();
        }else{
            ths.$message.error(ths.$t('m.Ca_delFai'));
        }
      })
      .catch(function(){
            ths.$message.error(ths.$t('m.L_servererr'));
        })
    },
    //选择年级
    sel_grade() {
      var ths = this;
      ths.classList= ths.form.grade_;
      ths.classYear = ths.classList[0].classYear;     
      ths.form.class_ = "";
      ths.form.stu = "";
      ths.disClass = false;
      ths.disStu = true;      
      ths.disDate = false;       
    },
    sel_class(){//选择班级
        var ths = this;
        ths.disStu=false;
        ths.disDate=false;
        ths.form.stu ='';
    },
    //选择学生
    sel_stu(stu) {
      var ths = this;
      ths.form.stu = stu;
      ths.selectionStuPop = false;
      ths.disDate = false;
    },
    //提交表单
    submit() {
      var ths = this;
        if(!navigator.onLine){
        ths.$message.error(ths.$t('m.L_net'));
        ths.$emit('net',{network:false})
        return
      }else{
        ths.$emit('net',{network:true})
      }
      ths.show_stu = true;
      ths.draw_chart();
    },
    //绘制图表
    draw_chart() {
        var ths = this;
        ths.checkNet();
        var module = "";
        var id = "";
        var url = "";
        var option = {};
        //不同模块提交id不同
        if (ths.form.stu != "") {
            module = 1;
            id = ths.form.stu.id;
        } else if (ths.form.class_ != "") {
            module = 2;
            id = ths.form.class_.classId;
        } else {
            module = 3;
            id = ths.teacher.schId;
        }     
        
        if (ths.nl_btn == 0) {
            ths.myChart = ths.$echarts.init(document.getElementById("chart_"));
            ths.myChart.clear();
            url = `/v1/assess/assessLog/${ths.teacher.schId}/${ths.teacher.id}/${module}/${ths.form.data[0]}/${ths.form.data[1]}/${id}/${ths.classYear}`//`/v1/event/assess-logs/${module}/${id}/${ths.form.data[0] } 00:00:00/${ths.form.data[1]} 23:59:59/${ths.form.grade_.createDT}`;               
            ths.$axios({
                url: url,
                method: "GET",            
            })
            .then(function(res) {
                if(res.data.code == 403&&res.data.msg == '未登录'){
                    ths.$message.error(ths.$t('m.L_timeout'));
                    ths.$emit('out','登陆超时');
                    return
                }
                res = res.data.data;
                var award = [];
                var warn = [];
                var Xname = [];
                var awardMark = [];                
                var warnMark = [];                
                var awardTotal = 0;
                var warnTotal = 0;
                var max = 0;
                var max1 = 0;
                for (let i in res) {
                    var item = res[i];
                    awardTotal = awardTotal+item.award;
                    warnTotal = warnTotal+item.deduct;
                    Xname.push(item.tagName);
                    award.push(item.award);
                    if(item.award>max){
                        max=item.award;
                    }
                    warn.push(item.deduct);
                    if(item.deduct>max1){
                        max1=item.deduct;
                    }
                    var awardMarkObj = {
                        value: item.award,
                        xAxis: i*1,
                        yAxis: item.award
                    };
                    var warnMarkObj = {
                        value: item.deduct,
                        xAxis: i*1,
                        yAxis: item.deduct
                    };
                    awardMark.push(awardMarkObj);
                    warnMark.push(warnMarkObj);
                }
                console.log("max1:"+Xname)
                if(ths.form.chart==="雷达图"){
                    option = {
                        tooltip : {
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                saveAsImage : {show: true}
                            }
                        },
                        legend: {
                            orient : 'vertical',
                            x : '3%',
                            y : 'top',
                            data:[ths.$t('m.Ca_plus')+`(`+ths.$t('m.Ca_jia')+` ${awardTotal})`,ths.$t('m.Ca_minus')+`(`+ths.$t('m.Ca_jian')+` ${warnTotal})`]
                        },
                        radar: [
                            {
                            indicator: [
                                {name: Xname[0], max: max,color:'#ED1C24'},
                                {name: Xname[1], max: max, color:'#FF7F27'},
                                {name: Xname[2], max: max, color:'#FFC90E'},
                                {name: Xname[3], max: max, color:'#22B14C'},
                                {name: Xname[4], max: max, color:'#00A2E8'},
                                {name: Xname[5], max: max, color:'#3F48CC'},
                                {name: Xname[6], max: max, color:'#A349A4'}
                            ],
                            center: ['35%', '50%'],
                            //雷达图背景的颜色，在这儿随便设置了一个颜色，完全不透明度为0，就实现了透明背景
                            splitArea : {
                                show : false,
                                areaStyle : {
                                    color: 'rgba(255,0,0,0)', // 图表背景的颜色
                                },
                            }
                        },
                        {
                            indicator: [
                                {name: Xname[0], max: max1,color:'#ED1C24'},
                                {name: Xname[1], max: max1, color:'#FF7F27'},
                                {name: Xname[2], max: max1, color:'#FFC90E'},
                                {name: Xname[3], max: max1, color:'#22B14C'},
                                {name: Xname[4], max: max1, color:'#00A2E8'},
                                {name: Xname[5], max: max1, color:'#3F48CC'},
                                {name: Xname[6], max: max1, color:'#A349A4'}
                            ],
                            center: ['75%', '50%'],
                            //雷达图背景的颜色，在这儿随便设置了一个颜色，完全不透明度为0，就实现了透明背景
                            splitArea : {
                                show : false,
                                areaStyle : {
                                    color: 'rgba(255,0,0,0)', // 图表背景的颜色
                                },
                            },
                            radius: 80,//半径，可放大放小雷达图
                        }],
                        series: [
                            {
                                name: '能量站报表（PowerStation Report）',
                                type: 'radar',
                                data : [
                                    {
                                        value : award,
                                        name : ths.$t('m.Ca_plus')+`(`+ths.$t('m.Ca_jia')+` ${awardTotal})`,
                                        //这里的配置显示数值
                                        label: {
                                            normal: {
                                                show: true,
                                                formatter:function(params) {
                                                    return params.value;
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                        {
                            name: '能量站报表（PowerStation Report）',
                            type: 'radar',
                            radarIndex: 1,
                            // 设置雷达图中间射线的颜色
                            // axisLine: {
                            //     lineStyle: {
                            //         color: 'rgba(131,141,158,.1)',
                            //     },
                            // },
                            data : [
                                {
                                    value : warn,
                                    name : ths.$t('m.Ca_minus')+`(`+ths.$t('m.Ca_jian')+` ${warnTotal})`,
                                    //这里的配置显示数值
                                    label: {
                                        normal: {
                                            show: true,
                                            formatter:function(params) {
                                                return params.value;
                                            }
                                        }
                                    }
                                }
                            ]
                        }]
                    };
                }
                if(ths.form.chart==="柱形图"){
                    option = {
                        color:['#CC5952','#27B5BD'],
                        grid: {
                            top:'20%',
                            bottom:'5%',
                            containLabel: true
                        },
                        title: {
                            text: "",
                            subtext: ""
                        },
                        tooltip: {
                            trigger: "axis",
                            // formatter: '{b0}: {c0}<br />{b1}: {c1}',
                            axisPointer: {
                            type: "shadow"
                            }
                        },
                        legend: {
                            //data: [`得分（总分${awardTotal}）`, `扣分（总分${warnTotal}）`,]
                            data: [ths.$t('m.Ca_plus')+`(`+ths.$t('m.Ca_jia')+` ${awardTotal})`,ths.$t('m.Ca_minus')+`(`+ths.$t('m.Ca_jian')+` ${warnTotal})`]
                        },
                        calculable: true,
                        xAxis: [
                            {
                            type: "category",                        
                            data: Xname
                            }
                        ],
                        yAxis: [
                            {
                            type: "value"
                            }
                        ],
                        dataZoom:[
                            {
                            type: 'inside',
                            start: 0,
                            end: 100
                            }
                        ],
                        series: [
                            {
                            //name: `得分（总分${awardTotal}）`,
                            name: ths.$t('m.Ca_plus')+`(`+ths.$t('m.Ca_jia')+` ${awardTotal})`,
                            type: "bar",
                            data: award,
                            markPoint: {
                                data: awardMark
                            }
                            },
                            {
                            //name: `扣分（总分${warnTotal}）`,
                            name: ths.$t('m.Ca_minus')+`(`+ths.$t('m.Ca_jian')+` ${warnTotal})`,
                            type: "bar",
                            data: warn,
                            markPoint: {
                                data: warnMark
                            }
                            }
                        ]
                    };
                }
                ths.myChart.setOption(option);
            });
        } else if(ths.nl_btn == 1) {
            //setTimeout(function(){
            url = `/v1/assess/assessLog/${ths.teacher.schId}/${ths.teacher.id}/${module}/${ths.form.data[0]}/${ths.form.data[1]}/${id}/${ths.classYear}/${ ths.form.jd}/time`;          
            ths
            .$axios({
                url: url,
                method: "GET",
            })
            .then(function(res) {
                   
                if(res.data.code == 403&&res.data.msg == '未登录'){
                    ths.$message.error(ths.$t('m.L_timeout'));
                    ths.$emit('out','登陆超时');
                    return
                }
                if(res.data.code == 403&&res.data.msg == '返回结果超额'){
                    ths.$message.error(ths.$t('m.Ca_timeerr'));
                    return
                }
                res = res.data.data;
                if(res.length===0){
                    ths.noData1 = true;
                    return
                }else{
                    ths.noData1 = false;
                    ths.myChart = ths.$echarts.init(document.getElementById("chart_1"));
                    ths.myChart.clear(); 
                }              
                var dataArr = [];
                var Xtime = [];
                for(var i in res){  
                    var item = res[i];
                    // console.log(item)
                    var dataObj = {};
                    dataObj.name = item.tagName;
                    dataObj.type = "line";
                    dataObj.data = []; 
                    dataObj.label={
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    }                     
                    var Xtime = [];                      
                    for(var itemSub of item.itemStatisticsList){ 
                        Xtime.push(itemSub.time)
                        var total = 0;
                        for(var num of itemSub.itemTimeStatisticsFollowTimes){
                            total+=num.total;
                        }                                                                                  
                        dataObj.data.push(total);
                    }
                    dataArr.push(dataObj)
                }
                option = {
                color: ['#ED1C24','#FF7F27','#FFC90E','#22B14C','#00A2E8','#3F48CC','#A349A4'],
                title: {
                    text: ""
                },
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    data: '',
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: [
                    {
                    type: "category",
                    boundaryGap: false,
                    data: Xtime
                    }
                ],
                yAxis: [
                    {
                    type: "value"
                    }
                ],
                 dataZoom:[
                     {
                    type: 'inside',
                    start: 0,
                    end: 100
                    }
                ],
                series: dataArr,
                };                
                ths.myChart.setOption(option);
            });
            //},0)
        }else if(ths.nl_btn == 2){  
            ths.flowShow = true;
            var url = '';  
            if(ths.form.stu==''){
                url = `/v1/assess/flow/2/${ths.teacher.id}/${ths.form.class_.classId}/0/${ths.form.data[0]}/${ths.form.data[1]}`
            }else{
                url = `/v1/assess/flow/1/${ths.teacher.id}/${ths.form.class_.classId}/${ths.form.stu.id}/${ths.form.data[0]}/${ths.form.data[1]}`
            }              
            ths.$axios({
                method:'GET',
                url:url
            })
            .then(function(res){     
                 console.log(res,'流水') 
                ths.record = [];     
                res = res.data.data;
                if(res.length==0){
                    ths.noData = true;
                }else{
                    ths.noData = false;
                    ths.record = res;
                }
            })  
        }else if(ths.nl_btn == 3){
            ths.rakShow = true;
            var url = ''; 
            if(ths.form.class_ == ''){
                url = `/v1/assess/classRank/${ths.classYear}/${ths.form.data[0]}/${ths.form.data[1]}/${ths.form.jd}`;
            }else{              
                url = `/v1/assess/stuRank/${ths.form.rank}/${id}/${ths.classYear}/${ths.form.data[0]}/${ths.form.data[1]}/${ ths.form.jd}`;
            }
            //console.log(url)
            ths.$axios({
                method:'GET',
                url:url
            })
            .then(function(res){
                if(res.data.code == 403&&res.data.msg == '未登录'){
                    ths.$message.error(ths.$t('m.L_timeout'));
                    ths.$emit('out','登陆超时');
                    return
                }
                 res = res.data.data;
                 ths.rakArr =res;
                // console.log(url,res);
            })

        }else if(ths.nl_btn == 4){
            ths.$axios({
                method:'GET',
                url:`/v2/subject/lesson/${ths.teacher.id}`
            })
            .then(function(res0){
                if(res0.data.code == 403&&res0.data.msg == '未登录'){        
                    ths.$message.error(ths.$t('m.L_timeout'));              
                    ths.$emit('out','登陆超时');
                    return                  
                }
                //console.log(res0,'0000000');         
                res0 = res0.data.data;
                var arr = [];
                if(res0){
                    for(var item of res0){
                        var obj = {
                            name:item.subName,
                            value:item.subId
                        }
                        arr.push(obj)
                    }
                    //ths.inClassList = arr;
                    ths.subId = arr[0].value;
                    ths.subName = arr[0].name;
                }

                ths.myChart = ths.$echarts.init(document.getElementById("chart_4"));
                ths.myChart.clear(); 
                if(ths.teacher.privilege.role==0 && ths.signStu==true||(ths.teacher.privilege.role==1 && ths.signStu==true)){//班主任 管理员  学生、班级主体
                    console.log("班主任tch："+ths.teacher.id+"，sub："+ths.subId)
                    if(ths.form.stu==''){
                        url = `/v2/subject/chart/2/${ths.form.class_.classId}/0/${ths.form.data[0]}/${ths.form.data[1]}`
                    }else{
                        url = `/v2/subject/chart/1/${ths.form.class_.classId}/${ths.form.stu.id}/${ths.form.data[0]}/${ths.form.data[1]}`
                    }
                }else if(ths.teacher.privilege.state == 0 && ths.teacher.privilege.role != 0 && ths.teacher.privilege.role != 1){//普通老师  课程主体
                    console.log("老师tch："+ths.teacher.id+"，sub："+ths.subId)  
                    url = `/v2/subject/chart/${ths.teacher.id}/${ths.subId}/${ths.form.data[0]}/${ths.form.data[1]}`
                }else if(ths.teacher.privilege.role==0 && ths.signCourse==true||(ths.teacher.privilege.role==1 && ths.signCourse==true && ths.teacher.privilege.state == 0)){//管理员  课程主体
                    console.log("管理员tch："+ths.formD.Inteacher.id+"，sub："+ths.formD.inId.subId)
                    url = `/v2/subject/chart/${ths.formD.Inteacher.id}/${ths.formD.inId.subId}/${ths.form.data[0]}/${ths.form.data[1]}`
                }
                    
                ths.$axios({
                    url: url,
                    method: "GET",            
                })
                .then(function(res) {
                    res = res.data.data;
                    //console.log("签到");
                    var dataArr = [];
                    var Xname = [];
                    var mark = [];
                    for (let i in res) {
                        var item = res[i];
                        var obj
                        if(ths.teacher.privilege.role==0||ths.teacher.privilege.role==1){
                            obj = {value:item.count,name:item.subName};
                            dataArr.push(obj)
                        }else if(ths.teacher.privilege.state == 0){
                            dataArr.push(item.count);
                            Xname.push(item.stuNickname+" "+item.stuName);
                            var MarkObj = {
                                value: item.count,
                                xAxis: i*1,
                                yAxis: item.count
                            };
                            mark.push(MarkObj)
                        }
                    }
                    ths.signArr = dataArr
                    if((ths.teacher.privilege.role==0 && ths.signStu==true)||(ths.teacher.privilege.role==1 && ths.signStu==true)){//班主任管理员
                        console.log("班主任管理员饼图stu："+ths.signStu);
                        option = {     
                            // color: ['#ED1C24','#FF7F27','#FFC90E','#22B14C','#00A2E8','#3F48CC','#A349A4'],     
                            grid: {
                                top:'20%',
                                bottom:'5%',
                                containLabel: true
                            },
                            title: {
                                text: "",
                                subtext: ""
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}"
                            },
                            legend: {
                                orient: 'vertical',
                                left: '8%',
                            },
                            calculable: true,                        
                            series: [{
                                name:'兴趣课签到',
                                type:'pie',
                                data:dataArr,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }]
                        };
                        
                        ths.myChart.setOption(option);
                    }else if(ths.teacher.privilege.state == 0 || (ths.teacher.privilege.role == 0 && ths.signCourse == true)|| (ths.teacher.privilege.role == 1 && ths.signCourse == true&&ths.teacher.privilege.state == 0)){//兴趣课老师 班主任 管理员
                        //res = res.data.data;
                        var num = 0;
                        var mark = [];
                        ths.tableKey = [
                            {value:"no",label:ths.$t('m.Ca_no')},
                            {value:"class",label:ths.$t('m.Ca_class')},
                            {value:"stuname",label:ths.$t('m.Ca_stuname')},
                            {value:"count",label:ths.$t('m.Ca_count')}
                        ];
                        for(let i in res){
                            var item = res[i];
                            num = num + 1;
                            //var str = num+','+item.className+','+(item.stuNickname+" "+item.stuName)+','+item.count;
                            var str = {
                                no:num,
                                class:item.className,
                                stuname:item.stuNickname+" "+item.stuName,
                                count:item.count
                            };
                            mark.push(str);
                            ths.tableList = mark;
                        }
                        console.log("签到表格course："+ths.signCourse);
                    }
                });
            })
            .catch(function(err){
                //console.log(err)
            })
            ths.tableList = [];
        }else if(ths.nl_btn == 5){
        }else if(ths.nl_btn == 6){
            if(ths.form.stu!=''&&ths.form.data[0]!=''&&ths.form.data[1]!=''){
                console.log(ths.form.stu.stuNo)
                var postData = {
                    stuNo:ths.form.stu.stuNo,
                    start:ths.form.data[0],
                    end:ths.form.data[1]
                }
                ths.$axios({
                    method: "Post", 
                    url: `/v3/reports/`,
                    data:postData,
                    headers: {'signature': 'powerStation7a1ad4cc5116437'},      
                })
                .then(function(res){
                    if(res.data.code == 403&&res.data.msg == '未登录'){        
                        ths.$message.error(ths.$t('m.L_timeout'));              
                        ths.$emit('out','登陆超时');
                        return   
                    }
                    res = res.data.data;
                    var powerData = res.powerData;
                    ths.reportContent = powerData.replace(powerData ? /&(?!#?\w+;)/g : /&/g, '&amp;')
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, "\"")
                    .replace(/&#39;/g, "\'");
                    ths.reportPie=res.signData;
                    console.log(ths.reportPie.length)
                    ths.myChart = ths.$echarts.init(document.getElementById("chart_5"));
                    ths.myChart.clear();
                    if(res.signData!=null&&res.signData.length>0){
                        var dataArr = [];
                        for (let i in ths.reportPie) {
                            var item = ths.reportPie[i];
                            var obj = {value:item.count,name:item.subName};
                            dataArr.push(obj)
                        }
                        option = {
                            title: {
                                text: '兴趣选课',
                                x: 'left'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}"
                            },
                            calculable: true,                        
                            series: [{
                                name:'兴趣课签到',
                                type:'pie',
                                data:dataArr,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }]
                        };
                        ths.myChart.setOption(option);
                    }
                })
            }
        }
     
        window.onresize = function() {
            if(ths.myChart){
                ths.myChart.resize();
            } 
        };
    },
    //能量选择按钮
    nl(num) {
        var ths = this;
        ths.nl_btn = num;       
        ths.noData = false;
        if (num == 0) {//能量站
            if(ths.form.grade_ != ""&&ths.form.data !='') {
                ths.draw_chart();
                console.log('能量站')
            }
        }else if(num == 1){//能量条
            ths.jdArr=[{value:1,name:ths.$t('m.Ca_day')},{value:2,name:ths.$t('m.Ca_week')},{value:3,name:ths.$t('m.Ca_month')}]
            ths.form.jd = ths.jdArr[0].value;
            if(ths.form.grade_ != ""&&ths.form.data !='') {
                ths.draw_chart();
                console.log('能量条')
            }
        }else if(num == 2){//个人流水
            if(ths.form.grade_ != ""&&ths.form.class_ != ''&&ths.form.data2 !=''){           
                ths.draw_chart();
                console.log('评价流水')
            }else{
                ths.flowShow = false;
                ths.record = [];
            }                               
        }else if(num == 3){//排行榜
            ths.form.stu = '';
            ths.jdArr=[{value:1,name:ths.$t('m.Ca_plus')},{value:2,name:ths.$t('m.Ca_minus')},{value:3,name:ths.$t('m.Ca_final')}];                        
            ths.form.jd = ths.jdArr[0].value; 
            console.log(ths.form.grade_,'班级')
            if(ths.form.grade_ != ""&&ths.form.data !='') {            
                ths.draw_chart();
                console.log(ths.form.grade_,'排行榜')
            }else{
                ths.rakShow = false;
                ths.rakArr = [];
            }
        }else if(num == 4){  
            if((ths.signStu==true||ths.teacher.privilege.role==1)&&ths.form.grade_ !=''&&ths.form.class_ !=''&&ths.form.stu !=''&&ths.form.data !='') { //班主任，管理员       
                console.log('班主任兴趣课')
                ths.draw_chart();
            }else if(ths.teacher.privilege.role==2&&ths.teacher.privilege.state==0){//兴趣课老师
                ths.signStu = false;
                console.log('兴趣课老师');
            }else{
                if(ths.myChart!=''){
                    ths.myChart.dispose();
                    //document.getElementById('chart_4').innerHTML = `<p  class="tishi" style="color: #777777;font-size: 40px;font-weight: 700;text-align: center;position: relative;top: 50%;transform: translateY(-100%);">${ths.$t('m.Ca_msg')}</p>`
                }
            }
        }else if(num == 5){
            if(ths.dailyAtt=true){
                var date = new Date();
                var curYear = date.getFullYear();
                var curMonth = date.getMonth();
                if(curMonth >= 8){
                    if(localStorage.lg=='en'){
                        ths.signTitle = "Attendance Record of 1st Semester, "+curYear;
                    }else{
                        ths.signTitle = curYear + "学年第一学期学生考勤情况";
                    }
                }else if(curMonth < 8){
                    if(localStorage.lg=='en'){
                        ths.signTitle = "Attendance Record of 2st Semester, "+(curYear-1);
                    }else{
                        ths.signTitle = (curYear-1) + "学年第二学期学生考勤情况";
                    }
                }
                ths.showWeek();
                ths.getAttChart();
            }
        }else if(num == 6){
            if(ths.form.grade_ != ""&&ths.form.stu!=''&&ths.form.data !='') {
                ths.draw_chart();
                console.log('报告')
            }
        }           
    }
  },
  mounted() {
    this.getInClass();
    this.form.chart = "雷达图";
    // console.log(this.teacher,'teacher')
    if(this.teacher.privilege.role==3||(this.teacher.privilege.role==2&&this.teacher.privilege.state==1)){//普通员工
        this.$refs.sign.$el.style.display = "none";
    }else if(this.teacher.privilege.role==0||this.teacher.privilege.role==1){//班主任，管理员   
        // console.log('饼图')
    }else if(this.teacher.privilege.state==0){//兴趣课老师
        // console.log('柱图')
    } 
  }
};
</script>

<style lang="scss" scoped>
#chart {
  box-sizing: border-box;
  padding: 2% 3% 1%;
  height: 84%;
  overflow: hidden;
    .type{
        display: flex;
        flex-direction: column;
        height: 92%;
    }

  // 选择学生条件
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner,
  .el-select {
    width: 15%;
  }
  .el-form {
    padding: 0 3%;
    background: #fff;
    padding-top: 1%;
  }
  .stu_info {
    P {
      margin: 0;
    }
    color: #606266;
    height: 40px;
    line-height: 40px;
  }
  // 无图表时提示
  .tishi {
    color: #777777;
    font-size: 40px;
    font-weight: 700;
    text-align: center;
    position: relative;
    top: 50%;
    transform: translateY(-100%);
  }
  .record_ul{//流水，排行榜
      padding: 0;
      margin: 0;
      font-weight: 700;
      overflow: auto;
      height: 100%;
      width: 100%;
      >div{padding: 5px 0;}
      li{
          line-height: 60px;
          height: 60px;
          text-indent: 1%;
          border-top:1px solid #EAE9E9;
          &:hover{
              background: #f5f5f5;
          }
          &:nth-child(odd){
              border-top:1px solid  #EAE9E9;
          }
          span{
              margin:0 1%;
          }
          .el-icon-delete{
              line-height: 60px;
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
  .rank{//排行榜
      background: #fff;
      li{          
          margin: 0;
          border-left:1px solid  #EAE9E9; 
        //   overflow: hidden;
          span{
              line-height: 60px;
              margin: 0;
              text-align: center;
              float: left;
              width: 15%;
              border-right:1px solid  #EAE9E9;
              border-bottom:1px solid  #EAE9E9;
              box-sizing: border-box;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              &:nth-of-type(2){
                  width: 40%;
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
        line-height: 60px;
        //border: #CC5952 2px solid;
        &:nth-child(1){
            width: 17%;
        }
        &:nth-child(2){
            width: 14%;
        }
        &:nth-child(3){
            width:32%;
        }
        &:nth-child(4){
            width: 4%;
        }
        &:nth-child(5){
            width: 7%;
        }
        &:nth-child(6){
            width: 17%;
        }
        &:nth-child(7){
            width: 14%;
        }
    }
}

.clicked{
    //border: #CC5952 1px solid;
    background: #2AC2CB;
}

  // 图表
  .main {
    background: #fff;
    flex: 1;
    display: flex;
    //border: rgb(44, 116, 248) 1px solid;
    #chart_,#chart_1,#chart_4{
        flex: 1;
    }
  }
  //能量报表按钮
  .bottomBtn {
    margin-top: 1%;
    button {
      margin: 0 0;
      margin-left: -10px;
      border-radius: 0;
      padding: 10px 20px;
      &.nl_sel {
        background: #27b5bd;
        color: #fff;
        border: 1px solid #27b5bd;
      }
    }
  }
  .lineblock {
    display: inline-block;
    div {
      margin-left: 0 !important;
    }
  }
  .selected {
    margin: 0 10% 2%;
    padding: 2% 0 0 2%;
    background: #7dd3d7;
  }
  .report{
      margin:0.2% 2% 0 3%;
      height: 99%;
      overflow-x: hidden;
      //border: #CC5952 1px solid;
  }

}

/* CSS */
</style>