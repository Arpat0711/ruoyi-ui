<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="mini"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-row>
        <el-col :span="18" :xs="4">
          <el-form-item label="临时托码" prop="tempPanelCode">
            <el-input
              v-model="queryParams.tempPanelCode"
              placeholder="请输入临时托码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="入库单编号" prop="recptCode">
            <el-input
              v-model="queryParams.recptCode"
              placeholder="请输入入库单编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="单据状态" prop="status">
            <el-select
              v-model="queryParams.status"
              filterable
              placeholder="请选择"
              clearable
              @keyup.enter.native="handleQuery"
            >
              <el-option
                v-for="item in queryParams.options"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" :xs="4" style="display: flex; justify-content: end">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="入库时间" prop="recptDate">
            <el-date-picker
              v-model="queryParams.recptDate"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="创建人" prop="createBy">
            <el-input
              v-model="queryParams.createBy"
              placeholder="请输入创建人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wm:productrecpt:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wm:productrecpt:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wm:productrecpt:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wm:productrecpt:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="productrecptList"
      @selection-change="handleSelectionChange"
      height="750"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="入库单ID"
        width="150px"
        align="center"
        prop="recptId"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <!--带权限的button点击按钮跳转时认证权限,在若依前台（后台管理->菜单管理）给这个按钮绑定权限,跳转至（test1/index.vue）,router里写动态路由跳转-->
          <!-- <el-button
            size="mini"
            type="text"
            @click="Goto(scope.row)"
            v-hasPermi="['KeWenWMS:ProductionManagement:productrecpt:list']"
            >{{ scope.row.recptId }}</el-button
          > -->
          <el-button size="mini" type="text" @click="Goto(scope.row)">{{
            scope.row.recptId
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="临时托码"
        width="180px"
        align="center"
        prop="tempPanelCode"
      >
      </el-table-column>
      <el-table-column
        label="入库单编码"
        width="210px"
        align="center"
        prop="recptCode"
      >
      </el-table-column>

      <el-table-column
        label="入库日期"
        align="center"
        prop="recptDate"
        width="160"
      >
        <!-- <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.recptDate, "{y}-{m}-{d} {hh}:{ii}:{ss}")
          }}</span>
        </template> -->
      </el-table-column>

      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.orderstatus"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>

      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="创建人" align="center" prop="createBy" />

      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="scope.row.status == 'PREPARE'"
            @click="handleExecute(scope.row)"
            v-hasPermi="['mes:wm:productrecpt:edit']"
            >详情</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import router from "@/router"
import Vue from "vue"
import { getToken } from "@/utils/auth"
import request from "@/utils/request"
var serverUrl = process.env.VUE_APP_BASE_API //获取.env.配置文件的服务器路径
export function addPart (data) {
  return request({
    url: serverUrl + "/system/part",
    method: "post",
    data: data,
  })
}
export default {
  name: "Productrecpt",
  dicts: ["orderstatus"],
  // components: { WorkorderSelect, Productrecptline },
  data () {
    return {
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: "pId",
        label: "pName",
      },

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
      // 产品入库录表格数据
      productrecptList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        createBy: '',
        recptDate: '', /**时间选择器绑定值 */
        recptCode: '',
        // status: '',
        tempPanelCode: '',
        options: [],   /**状态查询下拉框选项 */
      },
      // 表单参数
      dialogForm: {},
      // 表单校验
      rules: {
        recptCode: [
          { required: true, message: "入库单编号不能为空", trigger: "blur" },
        ],
        recptDate: [
          { required: true, message: "请选择入库日期", trigger: "blur" },
        ],
        workorderCode: [
          { required: true, message: "请选择生产工单", trigger: "blur" },
        ],
      },

    }
  },
  created () {
    this.getList()
    this.getDicts("orderstatus").then((res) => {
      console.log(res)
      this.queryParams.options = JSON.parse(JSON.stringify(res.data))
      console.log(this.queryParams.options)
    })
  },
  methods: {
    /**获取字典赋值selectoptions */
    // setSelectOptions (dicts) {
    //   console.log(dicts)
    // },

    /** 查询产品入库录列表 */
    getList (recptCode, status, createBy, recptDate, tempPanelCode,) {
      let that = this
      let data = {}
      let token = getToken()
      data.recptCode = recptCode
      data.status = status
      data.createBy = createBy
      //data.recptDate = recptDate
      data.tempPanelCode = tempPanelCode
      data.orgId = '1001712062695280'

      Vue.axios({
        method: "post",
        url: serverUrl + "system/recpt/list",
        headers: {
          authorization: token,
        },
        data: {
          data,
          recptDate
        },
      })
        .then(function (response) {
          console.log(response)
          if (response.data.code == 200) {
            that.setTableDate(response.data.rows)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    /**初始化TableData */
    setTableDate (res) {
      let that = this
      let tempData = {}
      console.log(res)
      this.productrecptList = res
    },

    getWarehouseList () { },
    // 取消按钮
    cancel () { },
    // 表单重置
    reset () { },
    /** 搜索按钮操作 */
    handleQuery () {
      // console.log(this.queryParams.recptCode, this.queryParams.status, this.queryParams.createBy, this.queryParams.dateValue, this.queryParams.tempPanelCode)
      this.getList(
        this.queryParams.recptCode,
        this.queryParams.status,
        this.queryParams.createBy,
        this.queryParams.recptDate,
        this.queryParams.tempPanelCode,
      )
    },
    /** 重置按钮操作 */
    resetQuery () { },
    // 多选框选中数据
    handleSelectionChange (selection) { },
    /** 新增按钮操作 */
    handleAdd () {
      // this.open = true
      // let data = 'aaa'
      // let str = addPart(data)
      // console.log(str)
      let token = getToken()
      console.log(token)
      Vue.axios({
        methods: "POST",
        url: serverUrl + "system/bcdconfig/list/",
        headers: {
          authorization: token,
        },
        params: {},
      }).then(function (response) {
        console.log(response)
      })
    },

    /** 修改按钮操作 */
    handleUpdate (row) { },
    /** 提交按钮 */
    submitForm () { },
    /** 删除按钮操作 */
    handleDelete (row) { },
    /** 导出按钮操作 */
    handleExport () { },
    //选择生产工单
    handleWorkorderSelect () { },
    onWorkorderSelected (row) { },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged (obj) { },
    //自动生成编码
    handleAutoGenChange (autoGenFlag) { },

    //点击入库单编号跳转详情页面
    Goto (row) {
      this.$router.push({
        path: "/KeWenWMS/ProductionManagement/productrecptdetails",
        query: { row: row },
      })
    },

    //点击入库单号弹窗生成详情
    handleView (row) {
      this.open = true
    },

    //点击完成
    doconfirm () { },
  },
};
</script>

<style>
.el-form-item__label {
  font-size: 10px;
}

.el-input {
  width: 140px;
}

.el-input__inner::-webkit-input-placeholder {
  width: 120px;
}
</style>
