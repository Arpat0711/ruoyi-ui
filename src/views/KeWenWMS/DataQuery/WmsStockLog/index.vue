<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="mini"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="来源单据号" prop="orgName">
        <el-input
          v-model="queryParams.orgName"
          placeholder="请输入来源单据号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源单据名称" prop="sourceDocumentName">
        <el-input
          v-model="queryParams.sourceDocumentName"
          placeholder="请输入来源单据名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="移位时间" prop="createTime">
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="移位人" prop="operatorName">
        <el-input
          v-model="queryParams.operatorName"
          placeholder="请输入移位人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="源库位名称" prop="oldAreaName">
        <el-input
          v-model="queryParams.oldAreaName"
          placeholder="请输入源库位名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="目标库位名称" prop="newAreaName">
        <el-input
          v-model="queryParams.newAreaName"
          placeholder="请输入目标库位名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号" prop="boxCode">
        <el-input
          v-model="queryParams.boxCode"
          placeholder="请输入箱号"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:WmsStockLog:add']"
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
          v-hasPermi="['system:WmsStockLog:edit']"
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
          v-hasPermi="['system:WmsStockLog:remove']"
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
          v-hasPermi="['system:WmsStockLog:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="WmsStockLogList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="主键"
        align="center"
        prop="stocklogId"
        width="180"
      />
      <el-table-column label="组织编码" align="center" prop="orgCode" />
      <el-table-column label="组织名称" align="center" prop="orgName" />
      <el-table-column label="创建人名称" align="center" prop="createName" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="130"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="箱号" align="center" prop="boxCode" width="130" />
      <el-table-column
        label="新仓库编码"
        align="center"
        prop="newWarehouseCode"
      />
      <el-table-column
        label="新库区编码"
        align="center"
        prop="newLocationCode"
      />
      <el-table-column label="新库位编码" align="center" prop="newAreaCode" />
      <el-table-column
        label="原仓库编码"
        align="center"
        prop="oldWarehouseCode"
      />
      <el-table-column
        label="原库区编码"
        align="center"
        prop="oldLocationCode"
      />
      <el-table-column label="原库位编码" align="center" prop="oldAreaCode" />
      <el-table-column label="操作员名称" align="center" prop="operatorName" />
      <el-table-column label="来源单据号" align="center" prop="resDocNo" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:WmsStockLog:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:WmsStockLog:remove']"
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

    <!-- 添加或修改移位记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="组织id" prop="orgId">
          <el-input v-model="form.orgId" placeholder="请输入组织id" />
        </el-form-item>
        <el-form-item label="组织编码" prop="orgCode">
          <el-input v-model="form.orgCode" placeholder="请输入组织编码" />
        </el-form-item>
        <el-form-item label="组织名称" prop="orgName">
          <el-input v-model="form.orgName" placeholder="请输入组织名称" />
        </el-form-item>
        <el-form-item label="创建人id" prop="createId">
          <el-input v-model="form.createId" placeholder="请输入创建人id" />
        </el-form-item>
        <el-form-item label="创建人编码" prop="createCode">
          <el-input v-model="form.createCode" placeholder="请输入创建人编码" />
        </el-form-item>
        <el-form-item label="创建人名称" prop="createName">
          <el-input v-model="form.createName" placeholder="请输入创建人名称" />
        </el-form-item>
        <el-form-item label="箱号" prop="boxCode">
          <el-input v-model="form.boxCode" placeholder="请输入箱号" />
        </el-form-item>
        <el-form-item label="条码主档id" prop="barcodeId">
          <el-input v-model="form.barcodeId" placeholder="请输入条码主档id" />
        </el-form-item>
        <el-form-item label="新仓库id" prop="newWarehouseId">
          <el-input
            v-model="form.newWarehouseId"
            placeholder="请输入新仓库id"
          />
        </el-form-item>
        <el-form-item label="新仓库编码" prop="newWarehouseCode">
          <el-input
            v-model="form.newWarehouseCode"
            placeholder="请输入新仓库编码"
          />
        </el-form-item>
        <el-form-item label="新仓库名称" prop="newWarehouseName">
          <el-input
            v-model="form.newWarehouseName"
            placeholder="请输入新仓库名称"
          />
        </el-form-item>
        <el-form-item label="新库区id" prop="newLocationId">
          <el-input v-model="form.newLocationId" placeholder="请输入新库区id" />
        </el-form-item>
        <el-form-item label="新库区编码" prop="newLocationCode">
          <el-input
            v-model="form.newLocationCode"
            placeholder="请输入新库区编码"
          />
        </el-form-item>
        <el-form-item label="新库区名称" prop="newLocationName">
          <el-input
            v-model="form.newLocationName"
            placeholder="请输入新库区名称"
          />
        </el-form-item>
        <el-form-item label="新库位id" prop="newAreaId">
          <el-input v-model="form.newAreaId" placeholder="请输入新库位id" />
        </el-form-item>
        <el-form-item label="新库位编码" prop="newAreaCode">
          <el-input v-model="form.newAreaCode" placeholder="请输入新库位编码" />
        </el-form-item>
        <el-form-item label="新库位名称" prop="newAreaName">
          <el-input v-model="form.newAreaName" placeholder="请输入新库位名称" />
        </el-form-item>
        <el-form-item label="原仓库id" prop="oldWarehouseId">
          <el-input
            v-model="form.oldWarehouseId"
            placeholder="请输入原仓库id"
          />
        </el-form-item>
        <el-form-item label="原仓库编码" prop="oldWarehouseCode">
          <el-input
            v-model="form.oldWarehouseCode"
            placeholder="请输入原仓库编码"
          />
        </el-form-item>
        <el-form-item label="原仓库名称" prop="oldWarehouseName">
          <el-input
            v-model="form.oldWarehouseName"
            placeholder="请输入原仓库名称"
          />
        </el-form-item>
        <el-form-item label="原库区id" prop="oldLocationId">
          <el-input v-model="form.oldLocationId" placeholder="请输入原库区id" />
        </el-form-item>
        <el-form-item label="原库区编码" prop="oldLocationCode">
          <el-input
            v-model="form.oldLocationCode"
            placeholder="请输入原库区编码"
          />
        </el-form-item>
        <el-form-item label="原库区名称" prop="oldLocationName">
          <el-input
            v-model="form.oldLocationName"
            placeholder="请输入原库区名称"
          />
        </el-form-item>
        <el-form-item label="原库位id" prop="oldAreaId">
          <el-input v-model="form.oldAreaId" placeholder="请输入原库位id" />
        </el-form-item>
        <el-form-item label="原库位编码" prop="oldAreaCode">
          <el-input v-model="form.oldAreaCode" placeholder="请输入原库位编码" />
        </el-form-item>
        <el-form-item label="原库位名称" prop="oldAreaName">
          <el-input v-model="form.oldAreaName" placeholder="请输入原库位名称" />
        </el-form-item>
        <el-form-item label="操作员id" prop="operatorId">
          <el-input v-model="form.operatorId" placeholder="请输入操作员id" />
        </el-form-item>
        <el-form-item label="操作员编码" prop="operatorCode">
          <el-input
            v-model="form.operatorCode"
            placeholder="请输入操作员编码"
          />
        </el-form-item>
        <el-form-item label="操作员名称" prop="operatorName">
          <el-input
            v-model="form.operatorName"
            placeholder="请输入操作员名称"
          />
        </el-form-item>
        <el-form-item label="来源单据行id" prop="resLineid">
          <el-input v-model="form.resLineid" placeholder="请输入来源单据行id" />
        </el-form-item>
        <el-form-item label="来源单据id" prop="resId">
          <el-input v-model="form.resId" placeholder="请输入来源单据id" />
        </el-form-item>
        <el-form-item label="来源单据号" prop="resDocNo">
          <el-input v-model="form.resDocNo" placeholder="请输入来源单据号" />
        </el-form-item>
        <el-form-item label="来源单据名称" prop="resDocName">
          <el-input
            v-model="form.resDocName"
            placeholder="请输入来源单据名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWmsStockLog, getWmsStockLog, delWmsStockLog, addWmsStockLog, updateWmsStockLog } from "@/api/system/WmsStockLog"

export default {
  name: "WmsStockLog",
  data () {
    return {
      // 遮罩层
      loading: true,
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
      // 移位记录表格数据
      WmsStockLogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgName: null,
        createTime: null,
        boxCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /** 查询移位记录列表 */
    getList () {
      this.loading = true
      listWmsStockLog(this.queryParams).then(response => {
        this.WmsStockLogList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = {
        stocklogId: null,
        orgId: null,
        orgCode: null,
        orgName: null,
        createId: null,
        createCode: null,
        createName: null,
        createTime: null,
        boxCode: null,
        barcodeId: null,
        newWarehouseId: null,
        newWarehouseCode: null,
        newWarehouseName: null,
        newLocationId: null,
        newLocationCode: null,
        newLocationName: null,
        newAreaId: null,
        newAreaCode: null,
        newAreaName: null,
        oldWarehouseId: null,
        oldWarehouseCode: null,
        oldWarehouseName: null,
        oldLocationId: null,
        oldLocationCode: null,
        oldLocationName: null,
        oldAreaId: null,
        oldAreaCode: null,
        oldAreaName: null,
        operatorId: null,
        operatorCode: null,
        operatorName: null,
        resLineid: null,
        resId: null,
        resDocNo: null,
        resDocName: null
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.stocklogId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.title = "添加移位记录"
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      const stocklogId = row.stocklogId || this.ids
      getWmsStockLog(stocklogId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改移位记录"
      })
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.stocklogId != null) {
            updateWmsStockLog(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addWmsStockLog(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const stocklogIds = row.stocklogId || this.ids
      this.$modal.confirm('是否确认删除移位记录编号为"' + stocklogIds + '"的数据项？').then(function () {
        return delWmsStockLog(stocklogIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => { })
    },
    /** 导出按钮操作 */
    handleExport () {
      this.download('system/WmsStockLog/export', {
        ...this.queryParams
      }, `WmsStockLog_${new Date().getTime()}.xlsx`)
    }
  }
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
