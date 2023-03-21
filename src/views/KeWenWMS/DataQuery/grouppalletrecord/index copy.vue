
<template>
  <div class="app-container">
    <el-row style="margin: 5px 0 10px 0" :gutter="20">
      <el-col :span="1.5" style="display: flex; align-items: center">
        <span style="margin: 10px 0">选择类型:</span>
      </el-col>
      <el-col :span="5">
        <el-input
          placeholder="请选择类型"
          v-model="inputType"
          class="input-with-select"
        >
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="销售订单号" value="salesCode"></el-option>
            <el-option label="托码" value="palletCode"></el-option>
            <el-option label="组托计划" value="palletPlan"></el-option>
          </el-select> </el-input
      ></el-col>
      <el-col :span="1.5" style="display: flex; align-items: center">
        <span style="margin: 10px 0">编码:</span>
      </el-col>
      <el-col :span="4">
        <el-input
          placeholder="请输入内容"
          v-model="inputType"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button> </el-input
      ></el-col>
    </el-row>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['md:md:client:add']"
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
          v-hasPermi="['md:md:client:edit']"
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
          v-hasPermi="['md:md:client:remove']"
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
          v-hasPermi="['md:md:client:export']"
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
      :data="palletList"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="托码" align="center" prop="palletPlanCode">
      </el-table-column>
      <el-table-column
        label="销售单号"
        width="150px"
        align="center"
        prop="salesCode"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="净重" align="center" prop="netWeight" />
      <el-table-column label="毛重" align="center" prop="grossWeight">
      </el-table-column>
      <el-table-column label="体积" align="center" prop="volume" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-table :data="tableDataDetail">
        <el-table-column label="箱码" align="center" prop="boxCode">
        </el-table-column>
        <el-table-column label="物料编码" align="center" prop="materialCode">
        </el-table-column>
        <el-table-column label="数量" align="center" prop="sum">
        </el-table-column>
        <el-table-column label="批号" align="center" prop="batchNumber">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "palletrecord",
  dicts: ['mes_client_type', 'sys_yes_no'],
  data () {
    return {
      //主体的tableData->palletList
      palletList: [
        {
          palletPlanCode: '123123',        /**组托计划单号 */
          salesCode: 111222333,            /**销售订单号 */
          netWeight: 10,                   /**净重 */
          grossWeight: 12,                 /**毛重 */
          volume: 200,                     /**体积 */
        }
      ],

      //弹窗的tableData->tableDataDetail
      tableDataDetail: [
        {
          boxCode: 12221,           /**箱号 */
          materialCode: 333,        /**物料编码 */
          sum: 100,                 /**数量 */
          batchNumber: 444,         /**批号 */
        }
      ],

      //搜索输入类型
      inputType: '',
      //搜索输入框前类型选择
      select: '',

      //单据类型单选框
      options: [],
      value: [],
      list: [],
      loading: false,
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
        pageNum: 1,
        pageSize: 10,
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
        enableFlag: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        clientCode: [
          { required: true, message: "客户编码不能为空", trigger: "blur" }
        ],
        clientName: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        contact1Email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        contact2Email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        enableFlag: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    this.list = this.states.map(item => {
      return { value: `value:${item}`, label: `label:${item}` }
    })
  },
  methods: {
    /** 单据类型单选框调用函数 */
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    /** 查询客户列表 */
    getList () {

    },
    // 取消按钮
    cancel () {

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
    handleQuery () {

    },
    /** 重置按钮操作 */
    resetQuery () {

    },
    // 多选框选中数据
    handleSelectionChange (selection) {

    },
    /** 新增按钮操作 */
    handleAdd () {

    },
    // 查询明细按钮操作
    handleView (row) {

    },
    /** 修改按钮操作 */
    handleUpdate (row) {

    },
    /** 提交按钮 */
    submitForm () {

    },
    /** 删除按钮操作 */
    handleDelete (row) {

    },
    /** 导出按钮操作 */
    handleExport () {

    },
    //自动生成编码
    handleAutoGenChange (autoGenFlag) {

    },

    //点击展示区某行数据触发函数
    handleRowClick (row, column, event) {
      this.open = true
      console.log(row)
    }
  }
};
</script>

