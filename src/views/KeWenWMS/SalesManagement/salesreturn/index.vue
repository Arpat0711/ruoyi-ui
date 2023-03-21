<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="退货单编号" prop="rtCode">
        <el-input
          v-model="queryParams.rtCode"
          placeholder="请输入退货单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="销售订单编号" prop="soCode">
        <el-input
          v-model="queryParams.soCode"
          placeholder="请输入销售订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="客户名称" prop="clientName">
        <el-input
          v-model="queryParams.clientName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入仓库名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="单据状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择单据状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.mes_order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mes:wm:rtsalse:add']"
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
          v-hasPermi="['mes:wm:rtsalse:edit']"
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
          v-hasPermi="['mes:wm:rtsalse:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="rtsalseList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="退货单编号"
        width="140px"
        align="center"
        prop="rtCode"
      />
      <el-table-column
        label="退货单名称"
        width="150px"
        align="center"
        prop="rtName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="销售订单编号"
        width="120px"
        align="center"
        prop="soCode"
      />
      <el-table-column
        label="客户名称"
        width="150px"
        align="center"
        prop="clientName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="仓库" align="center" prop="warehouseName" />
      <el-table-column label="库区" align="center" prop="locationName" />
      <el-table-column label="库位" align="center" prop="areaName" />
      <el-table-column
        label="退货日期"
        align="center"
        prop="rtDate"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rtDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.mes_order_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.status == 'PREPARE'"
            v-hasPermi="['mes:wm:rtsalse:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.status == 'PREPARE'"
            v-hasPermi="['mes:wm:rtsalse:remove']"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleExecute(scope.row)"
            v-if="scope.row.status == 'PREPARE'"
            v-hasPermi="['mes:wm:productsalse:edit']"
            >执行入库</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改产品销售退货单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="退货单编号" prop="rtCode">
              <el-input v-model="form.rtCode" placeholder="请输入退货单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch
                v-model="autoGenFlag"
                active-color="#13ce66"
                active-text="自动生成"
                @change="handleAutoGenChange(autoGenFlag)"
                v-if="optType != 'view' && form.status == 'PREPARE'"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货单名称" prop="rtName">
              <el-input v-model="form.rtName" placeholder="请输入退货单名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="销售订单编号" prop="soCode">
              <el-input
                v-model="form.soCode"
                placeholder="请输入销售订单编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户编号" prop="clientCode">
              <el-input
                v-model="form.clientCode"
                readonly="readonly"
                placeholder="请输入客户编码"
              >
                <el-button
                  slot="append"
                  @click="handleSelectClient"
                  icon="el-icon-search"
                ></el-button>
              </el-input>
            </el-form-item>
            <ClientSelectSingle
              ref="clientSelect"
              @onSelected="handleClientSelect"
            ></ClientSelectSingle>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称" prop="clientName">
              <el-input
                v-model="form.clientName"
                readonly="readonly"
                placeholder="请输入客户名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="退货日期" prop="rtDate">
              <el-date-picker
                clearable
                v-model="form.rtDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择退货日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退货仓库">
              <el-cascader
                v-model="warehouseInfo"
                :options="warehouseOptions"
                :props="warehouseProps"
                @change="handleWarehouseChanged"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select
                v-model="form.status"
                disabled
                placeholder="请选择单据状态"
              >
                <el-option
                  v-for="dict in dict.type.mes_order_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="退货原因" prop="rtReason">
              <el-input
                v-model="form.rtReason"
                type="textarea"
                placeholder="请输入退货原因"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="cancel"
          v-if="optType == 'view' || form.status != 'PREPARE'"
          >返回</el-button
        >
        <el-button
          type="primary"
          @click="submitForm"
          v-if="form.status == 'PREPARE' && optType != 'view'"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "Rtsalse",
  dicts: ['mes_order_status'],
  // components: {
  //   ClientSelectSingle
  // },
  data () {
    return {
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
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
      // 产品销售退货单表格数据
      rtsalseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        rtCode: null,
        rtName: null,
        soCode: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        clientNick: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        rtDate: null,
        rtReason: null,
        status: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        rtCode: [
          { required: true, message: "退货单编号不能为空", trigger: "blur" }
        ],
        rtName: [
          { required: true, message: "退货单名称不能为空", trigger: "blur" }
        ],
        rtDate: [
          { required: true, message: "请选择退货日期", trigger: "blur" }
        ],
        clientName: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        rtReason: [
          { required: true, message: "请填写退货原因", trigger: "blur" }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    /** 查询产品销售退货单列表 */
    getList () {

    },
    getWarehouseList () {

    },
    //选择默认的仓库、库区、库位
    handleWarehouseChanged (obj) {

    },
    // 取消按钮
    cancel () {

    },
    // 表单重置
    reset () {

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
    //客户选择事件
    handleSelectClient () {

    },
    //客户选择
    handleClientSelect (obj) {

    },
    /** 新增按钮操作 */
    handleAdd () {

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

    }
  }
};
</script>
