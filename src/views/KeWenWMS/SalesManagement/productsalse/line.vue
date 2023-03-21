<template>
  <div class="app-container">
    <el-row v-if="optType != 'view'" :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mes:wm:productsalseline:add']"
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
          v-hasPermi="['mes:wm:productsalseline:edit']"
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
          v-hasPermi="['mes:wm:productsalseline:remove']"
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
      :data="productsalselineList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="产品编码"
        width="120px"
        align="center"
        prop="itemCode"
      />
      <el-table-column
        label="产品名称"
        width="150px"
        align="center"
        prop="itemName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="规格型号"
        align="center"
        prop="specification"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="出库数量" align="center" prop="quantitySalse" />
      <el-table-column
        label="批次号"
        width="120px"
        align="center"
        prop="batchCode"
      />
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="库区名称" align="center" prop="locationName" />
      <el-table-column label="库位名称" align="center" prop="areaName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="optType != 'view'"
            v-hasPermi="['mes:wm:productsalseline:remove']"
            >删除</el-button
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

    <!-- 添加或修改产品销售出库行对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编码" prop="itemCode">
              <el-input v-model="form.itemCode" placeholder="请选择库存物资">
                <el-button
                  slot="append"
                  @click="handleSelectStock"
                  icon="el-icon-search"
                ></el-button>
              </el-input>
            </el-form-item>
            <StockSelect
              ref="stockSelect"
              @onSelected="onStockSelected"
            ></StockSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="itemName">
              <el-input
                v-model="form.itemName"
                placeholder="请输入产品物料名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unitOfMeasure">
              <el-input v-model="form.unitOfMeasure" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规格型号" prop="specification">
              <el-input
                v-model="form.specification"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseName">
              <el-input v-model="form.warehouseName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库区" prop="locationName">
              <el-input v-model="form.locationName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库位" prop="areaName">
              <el-input v-model="form.areaName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="批次号" prop="batchCode">
              <el-input v-model="form.batchCode" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input v-model="form.workorderCode" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库数量" prop="quantitySalse">
              <el-input
                :max="form.quantityMax"
                :min="0"
                v-model="form.quantitySalse"
                placeholder="请输入出库数量"
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "Productsalseline",
  // components: { StockSelect },
  props: {
    salseId: null,
    optType: null,
    warehouseId: null,
    locationId: null,
    areaId: null
  },
  data () {
    return {
      // 遮罩层
      loading: true,
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
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
      // 产品销售出库行表格数据
      productsalselineList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        salseId: this.salseId,
        materialStockId: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        quantitySalse: null,
        batchCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemCode: [
          { required: true, message: "出库物资不能为空", trigger: "blur" }
        ],
        warehouseInfo: [
          { required: true, message: "仓库不能为空", trigger: "blur" }
        ],
        quantitySalse: [
          { required: true, message: "出库数量不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created () {

  },
  methods: {
    /** 查询产品销售出库行列表 */
    getList () {

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
    //物料选择弹出框
    onStockSelected (obj) {

    },
  }
};
</script>
