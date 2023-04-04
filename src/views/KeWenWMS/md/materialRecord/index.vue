<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--物料数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="物料编码" prop="itemCode">
            <el-input
              v-model="queryParams.itemCode"
              placeholder="请输入物料编码"
              clearable
              :filterable="true"
              :remote="true"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="物料名称" prop="itemName">
            <el-input
              v-model="queryParams.itemName"
              placeholder="请输入物料名称"
              :filterable="true"
              :remote="true"
              clearable
              @keyup.enter.native="handleQuery"
            />
            <!-- <el-select
              v-model="selectValue"
              :filterable="true"
              :remote="true"
              clearable
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            > -->
          </el-form-item>
          <!-- <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar> -->
        </el-form>

        <el-table
          v-loading="loading"
          :data="itemList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" fixed />
          <el-table-column
            label="物料ID"
            width="120"
            align="center"
            key="itemId"
            prop="itemId"
            :show-overflow-tooltip="true"
            v-if="show"
          />
          <el-table-column
            label="组织名"
            width="120"
            align="center"
            prop="orgId"
            fixed
          >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.org" :value="scope.row.orgId" />
            </template>
          </el-table-column>
          <el-table-column
            label="物料编码"
            width="120"
            align="center"
            key="itemCode"
            prop="itemCode"
            fixed
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleViewDialog(scope.row)"
                v-hasPermi="['mes:md:mditem:query']"
                >{{ scope.row.itemCode }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            label="物料名称"
            width="160"
            align="center"
            key="itemName"
            prop="itemName"
          />
          <el-table-column
            label="规格型号"
            align="center"
            width="120"
            key="specification"
            prop="specification"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="单位"
            width="120"
            align="center"
            key="unitOfMeasure"
            prop="unitOfMeasure"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="物料类型名称"
            width="120"
            align="center"
            key="itemTypeName"
            prop="itemTypeName"
            v-if="columns[5].visible"
          />
          <el-table-column
            label="是否启用"
            width="120"
            align="center"
            key="enableFlag"
            prop="enableFlag"
          >
          </el-table-column>
          <el-table-column
            label="设置安全库存"
            width="120"
            align="center"
            key="safeStockFlag"
            prop="safeStockFlag"
          >
          </el-table-column>
          <el-table-column
            label="箱型名称"
            width="120"
            align="center"
            key="boxName"
            prop="boxName"
          />
          <el-table-column
            v-if="show == true"
            label="箱型"
            width="120"
            align="center"
            key="boxId"
            prop="boxId"
          />
          <el-table-column
            label="箱容数(个数)"
            width="120"
            align="center"
            key="boxQty"
            prop="boxQty"
          />
          <el-table-column
            label="托板名称"
            width="120"
            align="center"
            key="panelName"
            prop="panelName"
          />
          <el-table-column
            label="托容数(箱)"
            width="120"
            align="center"
            key="panelQty"
            prop="panelQty"
          />
          <el-table-column
            label="净重(g)"
            width="120"
            align="center"
            key="netWeight"
            prop="netWeight"
          />
          <el-table-column
            label="最低库存量"
            width="120"
            align="center"
            key="minStock"
            prop="minStock"
          />
          <el-table-column
            label="最高库存量"
            width="120"
            align="center"
            key="maxStock"
            prop="maxStock"
          />
          <el-table-column
            label="备注"
            width="120"
            align="center"
            key="remark"
            prop="remark"
          />
          <el-table-column
            label="创建时间"
            width="100"
            align="center"
            prop="createTime"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['mes:md:item:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['mes:md:item:remove']"
                >删除</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>

        <!-- <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->
      </el-col>
    </el-row>

    <!-- 添加或修改物料产品编码对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form
        ref="form"
        :model="dialogForm"
        :rules="rules"
        label-width="120px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="物料ID" prop="itemId">
              <el-input
                v-model="dialogForm.itemId"
                maxlength="255"
                readonly="readonly"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料编码" prop="itemCode">
              <el-input
                v-model="dialogForm.itemCode"
                readonly="readonly"
                maxlength="64"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称" prop="itemName">
              <el-input
                v-model="dialogForm.itemName"
                maxlength="255"
                readonly="readonly"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="箱型选择" prop="boxName">
              <el-select
                v-model="dialogForm.boxId"
                placeholder="请选择箱型"
                filterable
                allow-create
                default-first-option
              >
                <el-option
                  ref="selectValue"
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="箱容数(个)"
              prop="boxQty"
              :rules="[{ validator: checkBoxQty, trigger: ['blur', 'change'] }]"
            >
              <el-input
                v-model="dialogForm.boxQty"
                maxlength="255"
                @input="dialogFormInput(dialogForm)"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'"
          >返回</el-button
        >
        <el-button
          :disabled="able"
          type="primary"
          @click="submitForm(dialogForm)"
          v-else
          >确定</el-button
        >
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      layout="prev, pager, next,total"
      :total="total"
      :page-size="pageSize"
    >
    </el-pagination>
    <!-- 物料导入对话框 -->
    <!-- <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
var serverUrl = process.env.VUE_APP_BASE_API //获取.env.配置文件的服务器路径

export default {
  name: "MdItem",
  dicts: ['org'],
  // components: { Treeselect,ItemBom,SOPTab },
  data () {
    return {
      /**dialog确定可用标识 */
      able: false,
      /**table表头字段显示标识 */
      show: false,
      /**搜索框绑定数据 */
      selectValue: [],
      /**搜索框选项数据 */
      selectOptions: [],
      /**显示table字段标识符 */
      show: false,
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
      // 物料产品表格数据
      itemList: [],
      // 弹出层标题
      title: "",
      /**箱型下拉框选项 */
      options: [],
      // 部门树选项
      itemTypeOptions: undefined,
      // 是否显示弹出层
      open: false,
      //弹框的操作类型 view add edit
      optType: undefined,
      // 部门名称
      itemTypeName: undefined,
      //自动生成物料编码标识
      autoGenFlag: false,
      // 日期范围
      dateRange: [],
      //单位列表
      measureOptions: [],
      // 表单参数
      form: {},
      /**弹窗表单参数 */
      dialogForm: {
        boxName: '',
        boxQty: null,
        createTime: '',
        enableFlag: true,
        itemCode: new Number,
        itemName: '',
        itemTypeName: '',
        maxStock: null,
        minStock: null,
        netWeight: null,
        panelName: '',
        panelQty: null,
        remark: '',
        safeStockFlag: true,
        specification: '',
        unitOfMeasure: '',
      },
      queryParams: {
        itemCode: undefined,
        itemName: undefined
      },

      // defaultProps: {
      //   children: "children",
      //   label: "label"
      // },
      // 用户导入参数
      // upload: {
      //   // 是否显示弹出层（用户导入）
      //   open: false,
      //   // 弹出层标题（用户导入）
      //   title: "",
      //   // 是否禁用上传
      //   isUploading: false,
      //   // 是否更新已经存在的用户数据
      //   updateSupport: 0,
      //   // 设置上传的请求头部
      //   // headers: { Authorization: "Bearer " + getToken() },
      //   // 上传的地址
      //   url: process.env.VUE_APP_BASE_API + "/mes/md/mditem/importData"
      // },
      // 查询参数
      /**分页器当前页 */
      pageNum: 1,
      /**分页器一页有多少条数据 */
      pageSize: 15,

      // 列信息
      columns: [
        { key: 0, label: `物料/产品编码`, visible: true },
        { key: 1, label: `物料/产品名称`, visible: true },
        { key: 2, label: `规格型号`, visible: true },
        { key: 3, label: `单位`, visible: true },
        { key: 4, label: `物料/产品`, visible: true },
        { key: 5, label: `物料分类`, visible: true },
        { key: 6, label: `是否启用`, visible: true },
        { key: 7, label: `是否设置安全库存`, visible: true },
        { key: 8, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        itemCode: [
          { required: true, message: "物料/产品编码不能为空", trigger: "blur" },
          { max: 64, message: '物料/产品编码长度必须小于64个字符', trigger: 'blur' }
        ],
        itemName: [
          { required: true, message: "物料/产品名称不能为空", trigger: "blur" }
        ],
        unitOfMeasure: [
          { required: true, message: "单位不能为空", trigger: "blur" }
        ],
        itemTypeId: [
          { required: true, message: "物料分类不能为空", trigger: "blur" },
        ],
        itemId: [
          { required: true, message: "物料ID不能为空", trigger: "blur" },
        ],

      }
    }
  },
  watch: {
    // 根据名称筛选分类树
    itemTypeName (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getDicts("org").then((res) => {
      console.log(res)
      this.form.options = JSON.parse(JSON.stringify(res.data))
      console.log(this.form.options)
    })
  },
  mounted () {
    this.getList()
    this.getBoxData()
  },
  methods: {
    /** 查询物料编码列表 */
    getList (itemName, itemCode) {
      let that = this
      let token = getToken()
      // let data = {}
      let data = {}
      data.itemName = itemName
      data.itemCode = itemCode
      data.pageNum = JSON.stringify(that.pageNum)
      data.pageSize = JSON.stringify(that.pageSize)
      console.log(data.pageNum)
      // console.log(data)
      // console.log(token)

      Vue.axios({
        method: 'post',
        // url: 'http://192.168.1.27:8082/system/item/list',
        url: serverUrl + 'system/item/list',
        // url: 'http://kewen.fgimaxl2.vipnps.vip/system/item/list',
        headers: {
          'authorization': token,
          'pageNum': JSON.stringify(data.pageNum),
          'pageSum': JSON.stringify(data.pageSize),
          "Content-Type": 'application/json'
        },
        data: { data },
      }).then(function (response) {
        console.log(response)
        that.setItemList(response.data.rows)
        that.total = response.data.total
      }).catch(function (error) {
        console.log(error)
      })
    },

    /**获取箱型数据用于绑定物料 */
    getBoxData () {
      let that = this
      let token = getToken()
      // console.log(token)
      let data = {}
      Vue.axios({
        method: 'POST',
        // url: 'http://192.168.1.27:8082/system/box/list',
        url: serverUrl + 'system/box/list',
        // url: 'http://kewen.fgimaxl2.vipnps.vip/system/box/list',
        headers: {
          'authorization': token
        },
        data: { data }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.setBoxSelectOptions(response.data.rows)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },

    /**赋值itemList */
    setItemList (res) {
      //  console.log(res)
      this.itemList = []
      this.itemList = res
      console.log(this.itemList)

    },

    getUnits () { },

    /**绑定箱型选择下拉框的选项 */
    setBoxSelectOptions (res) {
      console.log(res)
      let that = this
      let tempData = {}
      that.options = []
      Object.keys(res).forEach((index) => {
        tempData.value = res[index].boxId
        tempData.label = res[index].boxName
        that.options.push(tempData)
        tempData = {}
      })
      console.log(that.options)
    },

    /**点击物料编码弹窗 */
    handleViewDialog (row) {
      console.log(row)
      let that = this
      that.reset()
      that.open = true
      Object.keys(row).forEach((index) => {
        that.dialogForm[index] = row[index]
      })
      console.log(that.dialogForm)
    },

    /** 查询分类下拉树结构 */
    getTreeselect () {

    },
    // 筛选节点
    filterNode (value, data) {

    },
    // 节点单击事件
    handleNodeClick (data) {

    },
    // 取消按钮
    cancel () {
      this.open = false
    },
    // 表单重置
    reset () {
      this.dialogForm = {
        boxId: '',
        boxName: '',
        boxQty: '',
        createTime: '',
        enableFlag: true,
        itemCode: new Number,
        itemName: '',
        itemTypeName: '',
        maxStock: null,
        minStock: null,
        netWeight: null,
        panelName: '',
        panelQty: null,
        remark: '',
        safeStockFlag: true,
        specification: '',
        unitOfMeasure: '',
      }
    },

    /** 搜索按钮操作 */
    handleQuery () {
      this.getList(this.queryParams.itemName, this.queryParams.itemCode)

    },
    /** 重置按钮操作 */
    resetQuery () {

    },
    // 多选框选中数据
    handleSelectionChange (selection) {

    },
    // 查询明细按钮操作
    handleView (row) {

    },
    /** 新增按钮操作 */
    handleAdd () {

    },
    /** 修改按钮操作 */
    handleUpdate (row) {

    },
    /** 提交按钮 */
    submitForm (formData) {
      console.log(formData)
      let that = this
      let token = getToken()
      let data = {}
      data = formData

      Vue.axios({
        method: 'POST',
        url: serverUrl + 'system/contrast',
        // url: 'http://kewen.fgimaxl2.vipnps.vip/system/contrast',
        // url: 'http://192.168.1.27:8082/system/contrast',
        headers: {
          'authorization': token
        },
        data: { data }
      }).then(function (response) {
        console.log(response)
        if (response.data.code == 200) {
          that.getList()
        }
      }).catch(function (error) {
        console.log(error)
      })
      that.open = false
    },

    /**校验弹窗input */
    dialogFormInput (form) {
      console.log(form)

    },

    /**校验弹窗input */
    checkBoxQty (rule, value, callback) {
      if (isNaN(value)) {               //校验输入箱容数
        this.able = true
        callback(new Error('箱容数必须为数字'))
      } else if (value === '' || value === undefined) {
        this.able = true
        callback(new Error('请输入箱容数'))
      } else if (Number(value) < 0 || Number(value) == 0) {
        this.able = true
        callback(new Error('请输入大于0的数字'))
      }
      else {
        this.able = false
      }
      //type: 'number', message: '箱容数必须为数字'
      // if (value < 18) {
      //   callback(new Error('Age must be greater than 18'))
      // } else {
      //   callback()
      // }
    },

    /** 页码大小变化触发函数 */
    handleSizeChange (val) {
      console.log(val)
    },

    /**当前页面变化出发函数 */
    handleCurrentChange (val) {

      this.pageNum = val
      console.log(this.pageNum)
      this.getList()
    },
    /** 删除按钮操作 */
    handleDelete (row) {

    },
    /** 导出按钮操作 */
    handleExport () {

    },
    /** 导入按钮操作 */
    handleImport () {

    },
    /** 下载模板操作 */
    importTemplate () {

    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {

    },
    // 文件上传成功处理
    handleFileSuccess (response, file, fileList) {

    },
    // 提交上传文件
    submitFileForm () {

    },
    //自动生成物料编码
    handleAutoGenChange (autoGenFlag) {

    },
    /**远程搜索操作 */
    remoteMethod () {

    },
  }
};
</script>
