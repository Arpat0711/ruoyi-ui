<template>
  <div class="app-container">
    <el-row
      :gutter="18"
      style="
        margin: 0 0 10px 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid #dcdfe6;
        background-color: #f8f8f9;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      "
    >
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          style="
            width: 110px;
            height: 30px;
            display: flex;
            font-size: 10px;
            align-items: center;
            justify-content: center;
          "
          @click="handleAdd"
          v-hasPermi="['md:md:client:add']"
          >新建组托计划</el-button
        >
      </el-col>
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-form
      :model="mainFormData"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="85px"
    >
      <!-- <el-col :span="8">
          <el-form-item label="单据类型" prop="clientCode">
            <el-select
              v-model="value"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="queryParams.clientCode"
              placeholder="请输入单据类型"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col> -->
      <el-row>
        <el-col :span="6">
          <el-form-item label="销售订单" prop="soDocno">
            <el-input
              v-model="mainFormData.soDocno"
              placeholder="请输入销售订单"
              clearable
              @keyup.enter.native="handleMainSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售子订单号" prop="soPono">
            <el-input
              v-model="mainFormData.soPono"
              placeholder="请输入销售子订单号"
              clearable
              @keyup.enter.native="handleMainSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="组托计划号" prop="packageNo">
            <el-input
              v-model="mainFormData.packageNo"
              placeholder="请输入组托计划号"
              clearable
              @keyup.enter.native="handleMainSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户" prop="custCode">
            <el-input
              v-model="mainFormData.custCode"
              placeholder="请输入客户号"
              clearable
              @keyup.enter.native="handleMainSearch"
            /> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="单据状态" prop="status">
            <el-select
              v-model="queryParams.status"
              filterable
              placeholder="请选择"
              clearable
              @keyup.enter.native="handleQuery"
            >
              <el-option
                v-for="item in mainFormData.options"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="display: flex; justify-content: flex-end">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleMainSearch"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="loading"
      :data="groupList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="客户编码" align="center" prop="clientCode">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:md:client:query']"
            >{{ scope.row.clientCode }}</el-button
          >
        </template>
      </el-table-column> -->
      <el-table-column
        label="组托计划ID"
        align="center"
        prop="packageId"
        width="150"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="Goto(scope.row, 'checkPallet')"
            >{{ scope.row.packageId }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="组托计划号"
        align="center"
        prop="packageNo"
        width="180"
      />

      <el-table-column
        label="客户编码"
        align="center"
        prop="custCode"
        width="100"
      />
      <el-table-column
        label="客户名称"
        align="center"
        prop="custName"
        width="190"
      />
      <el-table-column label="交期" align="center" prop="deadLine" width="160">
        <!-- <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_yes_no"
            :value="scope.row.shippingDeadline"
          />
        </template> -->
      </el-table-column>
      <el-table-column
        label="船期"
        align="center"
        prop="sailSchedule"
        width="160"
      />
      <el-table-column label="币种" align="center" prop="currency" />
      <el-table-column label="业务员" align="center" prop="seller" />
      <el-table-column label="部门" align="center" prop="saleDepartment" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="150"
      />
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="审核状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.orderstatus"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="150"
        fixed="right"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['md:md:client:edit']"
            >修改</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['md:md:client:remove']"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleCheck(scope.row)"
            v-hasPermi="['md:md:client:remove']"
            >审核</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="mainPageData.total > 0"
      :total="mainPageData.total"
      :page.sync="mainPageData.pageNum"
      :limit.sync="mainPageData.pageSize"
      @pagination="getList"
    />

    <!-- 添加组托计划对话框 -->
    <el-dialog
      title="选择销售订单"
      :visible.sync="open"
      width="1300px"
      append-to-body
    >
      <el-form
        ref="dialogFormData"
        :model="dialogFormData"
        :rules="rules"
        label-width="75px"
        :inline="true"
      >
        <el-row>
          <el-col :span="17.5">
            <el-form-item label="客户" prop="custCode">
              <el-input
                v-model="dialogFormData.custCode"
                placeholder="请输入客户关键字"
                @keyup.enter.native="handleDialogSearch"
              />
            </el-form-item>
            <el-form-item label="销售订单号" prop="soDocno">
              <el-input
                v-model="dialogFormData.soDocno"
                placeholder="请输入关键字"
                @keyup.enter.native="handleDialogSearch"
              />
            </el-form-item>
            <el-form-item label="交期" prop="deadline">
              <el-date-picker
                v-model="dialogFormData.deadline"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @keyup.enter.native="handleDialogSearch"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col
            :span="3.5"
            style="display: flex; justify-content: flex-end; margin-left: 20px"
          >
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleDialogSearch"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
          <el-col
            :span="2.5"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 7px;
            "
          >
            <el-switch
              v-model="fullBox"
              active-text="整数装箱"
              :active-value="false"
              :inactive-value="true"
              @change="handleChangePlan"
              style="
                display: flex;
                justify-content: flex-end;
                margin-left: 20px;
              "
            >
            </el-switch>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="客户类型" prop="attr4">
              <el-input
                v-model="dialogFormData.attr4"
                placeholder="请输入客户类型"
                @keyup.enter.native="handleDialogSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        :data="dialogData"
        @selection-change="dialogSelectionChange"
        height="400"
        ref="dialogTable"
        :row-key="getDialogDataRowKey"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :reserve-selection="true"
        />
        <el-table-column
          label="销售订单号"
          align="center"
          prop="soDocno"
          width="150px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="交期"
          width="100px"
          align="center"
          prop="deadline"
          fixed
        />
        <el-table-column
          label="销售子订单号"
          width="150px"
          align="center"
          prop="custPoNo"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column
          label="销售订单行ID"
          width="150px"
          align="center"
          prop="solineId"
          :show-overflow-tooltip="true"
        /> -->

        <el-table-column
          label="物料编码"
          width="100px"
          align="center"
          prop="itemCode"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="料号名称"
          width="150px"
          align="center"
          prop="itemName"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column
          label="客户料号ID"
          width="150px"
          align="center"
          prop="custItemId"
          :show-overflow-tooltip="true"
        /> -->
        <el-table-column
          label="物料总数"
          width="100px"
          align="center"
          prop="quantity"
        />
        <el-table-column label="可组托数量" align="center" prop="attr3" />
        <el-table-column
          label="本次组托数量"
          width="170px"
          align="center"
          prop="postnum"
        >
          <!-- <el-input size="mini"></el-input> -->
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-form-item
                prop="postnum"
                :rules="[
                  { validator: checkDialogInput, trigger: ['blur', 'change'] },
                ]"
              >
                <el-input
                  :error="scope.row.error"
                  size="mini"
                  ref="inputRef"
                  v-model="scope.row.postnum"
                  @input="dialogInputChange(scope.row)"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="箱容数"
          width="90px"
          align="center"
          prop="boxQty"
        />
        <el-table-column
          label="托容数"
          width="90px"
          align="center"
          prop="panelQty"
        />
        <el-table-column label="单位" align="center" prop="measure" />
        <el-table-column
          label="行号"
          align="center"
          prop="docLineno"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="客户编码"
          width="120px"
          align="center"
          prop="custCode"
        />
        <el-table-column
          label="客户名称"
          width="120px"
          align="center"
          prop="custName"
        />
        <el-table-column
          label="客户料号"
          width="120px"
          align="center"
          prop="custItemCode"
        />
        <el-table-column label="客户标识" align="center" prop="attr1" />
        <el-table-column label="客户类型" align="center" prop="attr4" />
        <el-table-column
          label="客户品名"
          width="90px"
          align="center"
          prop="custItemName"
        />
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'"
          >返回</el-button
        >
        <el-button type="primary" @click="submitForm" v-else :disabled="able"
          >组托</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
      <el-pagination
        @size-change="handleDialogSizeChange"
        @current-change="handleDialogCurrentChange"
        background
        :page.sync="dialogPageData.pageNum"
        :limit.sync="dialogPageData.pageSize"
        layout="prev, pager, next,total"
        :total="dialogPageData.total"
        :page-size="dialogPageData.pageSize"
      >
      </el-pagination>
    </el-dialog>

    <!-- 审核按钮弹窗-->
    <!-- <el-dialog title="进行审核" :visible.sync="checkDialogOpen">
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="checkDialogCancel"
          v-if="optType == 'view'"
          >返回</el-button
        >
        <el-button
          type="primary"
          @click="checkDialogSubmitForm"
          v-else
          :disabled="able"
          >审核</el-button
        >
        <el-button @click="checkDialogCancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import { checkDocument, handleDelete } from '@/api/SalesManagement/grouppallet'

var serverUrl = process.env.VUE_APP_BASE_API  //获取.env.配置文件的服务器路径
export default {
  name: "Client",
  dicts: ["orderstatus"],
  data () {
    return {

      //单据类型单选框
      options: [],
      value: [],
      list: [],
      /**选择销售订单组托按钮是否可用 */
      able: false,
      states: [],
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户表格数据
      clientList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orgId: '',                           //组织ID
        packageNo: 1,                       //组托计划号
        soDocno: 15,                         //销售订单号
        custCode: ''                         //客户编号
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      /**组托计划主页面搜索form表单数据 */

      mainFormData: {
        orgId: '',
        packageNo: '',
        soDocno: '',
        custCode: '',
        options: [],           /**状态查询下拉框选项 */
      },
      /**组托计划主页面分页器数据 */
      mainPageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      /**销售订单dialog搜索form表单数据 */
      dialogFormData: {
        custCode: '',
        soDocno: '',
        deadline: '',
      },
      /**销售订单dialog分页器数据 */
      dialogPageData: {
        total: 0,
        pageSize: 15,
        pageNum: 1,
      },
      /**销售订单dialog整数装箱开关 */
      fullBox: false,
      //table绑定数据
      groupList: [],
      //为空标识
      isNull: null,
      //弹框table数据
      dialogData: [],
      /**dialog选中行 */
      dialogSelectData: [],

      /**审核按钮弹窗标识 */
      checkDialogOpen: false,

      /**dialog input 暂存 */
      tempRow: '',
    }

  },
  created () {
    this.setGroupList(this.isNull)
    this.getDicts("orderstatus").then((res) => {
      console.log(res)
      this.mainFormData.options = JSON.parse(JSON.stringify(res.data))
      console.log(this.mainFormData.options)

    })
  },
  mounted () {
    // this.list = this.states.map(item => {
    //   return { value: `value:${item}`, label: `label:${item}` }
    // })
    this.getList()
  },
  methods: {
    /** 单据类型单选框调用函数 */
    // remoteMethod (query) {
    //   if (query !== '') {
    //     this.loading = true
    //     setTimeout(() => {
    //       this.loading = false
    //       this.options = this.list.filter(item => {
    //         return item.label.toLowerCase()
    //           .indexOf(query.toLowerCase()) > -1
    //       })
    //     }, 200)
    //   } else {
    //     this.options = []
    //   }
    // },

    /** 查询组托计划列表 */
    getList (soDocno, packageNo, custCode) {
      let that = this
      let token = getToken()
      let data = {}
      data.soDocno = soDocno,
        data.packageNo = packageNo,
        data.custCode = custCode,
        console.log(data)
      Vue.axios({
        method: 'post',
        url: serverUrl + 'system/pkgplan/lists',
        headers: {
          'authorization': token
        },
        data: { data }
      }).then(function (response) {
        console.log(response)
        that.setGroupList(response.data.rows)
      }).catch(function (error) {
        console.log(error)
      })
    },

    /**赋值组托计划列表 */
    setGroupList (res) {
      console.log(res)
      let that = this
      if (res != null) {
        that.groupList = res
      } else {
        // this.$message({
        //   type: 'error',
        //   message: '生成失败'
        // })
      }

    },

    /**主页面搜索按钮执行 */
    handleMainSearch () {
      this.getList(this.mainFormData.soDocno, this.mainFormData.packageNo, this.mainFormData.custCode)
    },
    /** */
    inputChange () {
      console.log()
    },

    /**点击组托计划号跳转函数 */
    Goto (res, name) {
      console.log(res, name)
      this.$router.push({ path: '/KeWenWMS/SalesManagement/grouppalletDetails', query: { res: res, from: name } })
    },
    // 取消按钮
    cancel () {
      this.open = false
    },
    // 表单重置
    reset () {
      this.form = {
        clientId: null,
        clientCode: null,
        clientName: null,
        clientNick: null,
        clientEn: null,
        clientDes: null,
        clientLogo: null,
        clientType: null,
        address: null,
        website: null,
        email: null,
        tel: null,
        contact1: null,
        contact1Tel: null,
        contact1Email: null,
        contact2: null,
        contact2Tel: null,
        contact2Email: null,
        creditCode: null,
        enableFlag: 'Y',
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      }
      this.autoGenFlag = false
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleDialogSearch () {
      this.getDialogData(this.dialogFormData.custCode, this.dialogFormData.soDocno, this.dialogFormData.deadline, this.dialogFormData.attr4)
    },
    /** 重置按钮操作 */
    resetQuery () {

    },
    // 多选框选中数据
    handleSelectionChange (selection) {

    },
    /** 新建组托计划按钮 */
    handleAdd () {
      this.open = true
      this.getDialogData()
    },
    // 查询明细按钮操作
    handleView (row) {

    },
    /** 修改按钮操作 */
    handleUpdate (row) {

    },

    /**审核按钮操作 */
    handleCheck (row) {
      // this.checkDialogOpen = true
      let that = this
      console.log(row)
      let params = {}
      params.packageId = row.packageId
      params.orgId = '1002106210000278'
      params.status = '审核'
      checkDocument(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '审核成功'
          })
          that.getList()
        } else {
          this.$message({
            type: 'error',
            message: '审核失败'
          })
        }
      })
    },

    /**审核dialog cancel按钮执行 */
    checkDialogCancel (row) {
      // this.checkDialogOpen = false

    },

    /**审核dialog 审核按钮执行 */
    checkDialogSubmitForm () {
      // console.log("checkDialogSubmitForm")
      let token = getToken()
      let pageNum = 1
      let pageSize = 10

      Vue.axios({
        method: 'GET',
        url: serverUrl + 'system/user/list' + "?" + pageNum + "&" + pageSize,
        headers: {
          'authorization': token
        },
        data: {}
      }).then(function (response) {
        console.log(response)
      }).catch(function (error) {
        console.log(error)
      })


      // let that = this
      // console.log(row)
      // let params = {}
      // params.packageId = row.packageId
      // params.orgId = '1002106210000278'
      // params.status = '审核'
      // checkDocument(params).then(res => {
      //   if (res.code == 200) {
      //     this.$message({
      //       type: 'success',
      //       message: '审核成功'
      //     })
      //     that.getList()
      //   } else {
      //     this.$message({
      //       type: 'error',
      //       message: '审核失败'
      //     })
      //   }
      // })
    },

    /**分配人员 */
    DistributePerson () { },

    /** 提交按钮 */
    submitForm () {
      let that = this

      if (that.dialogSelectData.length == 0) {
        that.$message({
          type: 'error',
          message: '没有选择销售订单,请选择'
        })
      } else {
        for (let i = 0; i < that.dialogSelectData.length; i++) {                        //判断组托时选择行的销售子订单是否相同，不相同报错
          console.log(that.dialogSelectData[i].postnum)
          if (that.dialogSelectData[0].attr1 != that.dialogSelectData[i].attr1) {
            that.$message({
              type: 'error',
              message: '选择销售订单客户标识不同，请选择相同客户标识的订单'
            })
            // that.$refs.dialogTable.clearSelection()
            return
          }
          if (that.dialogSelectData[i].postnum == 0) {
            that.$message({
              type: 'error',
              message: '选择销售订单本次组托数为0，请输入再组托'
            })
            // that.$refs.dialogTable.clearSelection()
            return
          }
        }

        if (that.fullBox == false) {
          console.log(that.fullBox)                                             //判断是否开启整数装箱按钮
          for (let i = 0; i < that.dialogSelectData.length; i++) {
            //console.log(JSON.parse(that.dialogSelectData[i].postnum) % JSON.parse(that.dialogSelectData[i].boxQty))                   //如果开启，校验是否能整数装箱
            if (JSON.parse(that.dialogSelectData[i].postnum) % JSON.parse(that.dialogSelectData[i].boxQty) != 0) {
              that.$message({
                type: 'error',
                message: '物料无法被整数装箱，请重新填写本次组托数量'
              })
              // that.$refs.dialogTable.clearSelection()
              return
            }
          }
          that.$message({
            type: 'success',
            message: '整数装箱成功'
          })
          that.open = false
          that.Goto(that.dialogSelectData, 'grouppallet')
        }
        else {                                                                         //没有开启整数装箱则多余的物料存入新的箱子
          that.open = false
          that.Goto(that.dialogSelectData, 'grouppallet')
        }
      }
      // console.log(that.dialogSelectData)
    },

    /** 删除按钮操作 */
    handleDelete (row) {
      let that = this
      let orgId = '1002106210000278'
      handleDelete(row.packageId, orgId).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          that.getList()
        } else {
          this.$message({
            type: 'success',
            message: '删除失败'
          })
        }
      })
    },

    /**主页面分页器选择是执行 */
    handleMainQuery (val) {
      console.log(val)
    },
    /** 导出按钮操作 */
    handleExport () {

    },
    //自动生成编码
    handleAutoGenChange (autoGenFlag) {

    },

    // 获取弹窗tableData
    // getDialogData () {
    //   let that = this
    //   let token = getToken()
    //   let u9SoHead = {}
    //   u9SoHead.orgId = "1002106210000278"
    //   // let pageNum = that.dialogPageData.pageNum
    //   // let pageSize = that.dialogPageData.pageSize
    //   // let data = {}
    //   // data.u9SoHead = JSON.stringify(u9SoHead)
    //   Vue.axios({
    //     method: 'POST',
    //     // url: 'http://kewen.fgimaxl2.vipnps.vip/u9/u9so/list',
    //     // url: 'http://192.168.1.10:8082/u9/u9so/list',
    //     // url: 'http://192.168.20.142:8082/u9/u9so/list',
    //      url: 'http://192.168.1.27:8082/u9/u9so/list',
    //     // url: 'http://192.168.1.204:8080/u9/u9so/list',
    //     // url: 'http://192.168.1.135:8082/u9/u9so/list',
    //     // headers: {
    //     //   'authorization': token
    //     // },
    //     data: { u9SoHead }
    //   }).then(function (response) {
    //     console.log(response)
    //     if (response.data.rows != null || response.data.rows != undefined || response.data.rows != '') {
    //       that.setDialogTableData(response.data.rows)
    //     } else {
    //       console.log("报错")
    //     }
    //   })
    // },

    getDialogData (custCode, soDocno, deadline, attr4) {
      console.log(attr4)
      let that = this
      let token = getToken()
      let u9SoLine = {}
      let deadLine = deadline
      u9SoLine.orgId = "1002106210000040"
      u9SoLine.pageNum1 = that.dialogPageData.pageNum
      u9SoLine.pageSize1 = that.dialogPageData.pageSize

      u9SoLine.soDocno = soDocno
      u9SoLine.custCode = custCode
      u9SoLine.attr4 = attr4
      console.log(u9SoLine)
      // let data = {}
      // data.u9SoHead = JSON.stringify(u9SoHead)
      Vue.axios({
        method: 'POST',
        url: serverUrl + 'u9/u9so/pagelist',
        data: { u9SoLine, deadLine }
      }).then(function (response) {
        console.log(response)
        if (response.data.subList != null || response.data.subList != undefined || response.data.subList != '') {
          that.setDialogTableData(response.data.subList)
          that.dialogPageData.total = response.data.total
        } else {
          console.log("报错")
        }
      })
      that.dialogPageData.pageNum = 1

    },

    //**获取弹窗row-key */
    getDialogDataRowKey (row) {
      return Number(row.soLineid)
    },


    //弹窗table赋值
    setDialogTableData (res) {
      console.log(res)
      let that = this
      that.dialogData = JSON.parse(JSON.stringify(res))
      this.$nextTick(() => {
        for (let i = 0; i < this.dialogSelectData.length; i++) {
          for (let j = 0; j < this.dialogData.length; j++) {
            if (this.dialogSelectData[i].soLineid == this.dialogData[j].soLineid) {
              console.log(this.dialogSelectData[i], this.dialogData[j])
              this.dialogData[j].postnum = this.dialogSelectData[i].postnum
            }
          }
        }
      })
      if (this.dialogSelectData.length == 0) {
        this.able = true
      } else {
        this.able = false
      }

      // Object.keys(res).forEach((index) => {
      //   tempData = {}
      //   tempData = JSON.parse(JSON.stringify(res))
      //   // Object.keys(res[index]).forEach((item) => {
      //   //   console.log(res[index][item])

      //   // })
      //   // console.log("----===--==-=-=-=-=-=-=-=-=-=-----")
      //   console.log(tempData)
      // })
    },

    /**dialog 选择行执行*/
    dialogSelectionChange (row) {
      console.log(row)
      this.dialogSelectData = row
      if (this.dialogSelectData.length == 0) {
        this.able = true
      } else {
        this.able = false
      }
    },

    /**选择销售订单dialog更改input进行校验 */
    dialogInputChange (row) {
      // console.log(this.$refs.inputRef)
      for (let i = 0; i < this.dialogSelectData.length; i++) {                                     //每次输入后刷新选择行本次组托数量
        if (row.soLineid == this.dialogSelectData[i].soLineid) {
          this.dialogSelectData[i].postnum = row.postnum
        }
      }

      this.tempRow = row

      // if (row.postnum === '' || row.postnum === null || row.postnum === undefined) {               //校验输入的本次组托数量
      //   this.able = true
      //   row.error = '请输入正确物料数'
      // } else if (Number(row.postnum) < 0) {
      //   this.able = true
      //   row.error = '装箱物料数不能小于0'
      // } else if (Number(row.postnum) > Number(row.attr3)) {
      //   this.able = true
      //   row.error = '输入数量不能大于物料总数'
      // } else if (isNaN(row.postnum)) {
      //   this.able = true
      //   row.error = '请输入数字'
      // } else {
      //   this.able = false
      //   row.error = ''
      // }
      // console.log(row)
    },

    /**dialog input校验 */
    checkDialogInput (rule, value, callback) {
      if (value === null || value === undefined) {               //校验dilog input 本次组托数量
        this.able = true
        callback(new Error('请输入正确物料数'))
      } else if (Number(value) < 0) {
        this.able = true
        callback(new Error('装箱物料数不能小于0'))
      } else if (Number(value) > Number(this.tempRow.attr3)) {
        this.able = true
        callback(new Error('输入数量不能大于物料总数'))
      } else if (isNaN(this.tempRow.postnum)) {
        this.able = true
        callback(new Error('请输入数字'))
      } else {
        this.able = false
      }
    },

    /**dialog输入框失去焦点执行 */
    dialogInputBlur (row) {

    },

    /**选择销售订单弹窗整数装箱按钮 */
    handleChangePlan () {
      console.log(this.fullBox)
    },

    /**选择销售订单弹窗分页器点击触发执行 */
    handleDialogCurrentChange (val) {
      console.log(val)
      this.dialogPageData.pageNum = val
      this.getDialogData()
      if (this.dialogSelectData.length == 0) {
        this.able = true
      } else {
        this.able = false
      }

    },

    /**选择分页器显示数据数量执行 */
    handleDialogSizeChange (val) { }
  }
};
</script>
<style>
.el-form-item__label {
  font-size: 10px;
}
.el-input {
  width: 155px;
}
.el-input__inner::-webkit-input-placeholder {
  width: 145px;
}
</style>
