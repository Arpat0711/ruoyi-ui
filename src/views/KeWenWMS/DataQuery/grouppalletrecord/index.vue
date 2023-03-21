<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="组织" prop="orgId">
        <el-select v-model="queryParams.orgId" placeholder="请选择组织" clearable>
          <el-option
            v-for="dict in dict.type.org"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单号" prop="soDocno">
        <el-input
          v-model="queryParams.soDocno"
          placeholder="U9销售订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-form>

    <el-table v-loading="loading" :data="grouppalletrecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="实际组托行ID" align="center" prop="panelLineid" />
      <el-table-column label="销售订单号" align="center" prop="soDocno" />
      <el-table-column label="装箱数" align="center" prop="quantityPackage" />
      <el-table-column label="托盘条码" align="center" prop="panelCode" />
      <el-table-column label="产品编码" align="center" prop="itemCode" />
      <el-table-column label="产品名称" align="center" prop="itemName" />
      <el-table-column label="批次编号" align="center" prop="batchCode" />
      <el-table-column label="物料总数" align="center" prop="quantity" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['DataQuery:grouppalletrecord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['DataQuery:grouppalletrecord:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改实际组托明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGrouppalletrecord, getGrouppalletrecord, delGrouppalletrecord, addGrouppalletrecord, updateGrouppalletrecord } from "@/api/DataQuery/grouppalletrecord";

export default {
  name: "Grouppalletrecord",
  dicts: ['org'],
  data() {
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
      // 实际组托明细表格数据
      grouppalletrecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgId: null,
        soDocno: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orgId: [
          { required: true, message: "组织ID，对应U9组织ID不能为空", trigger: "change" }
        ],
        panelWeight: [
          { required: true, message: "托板重量不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询实际组托明细列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listGrouppalletrecord(this.queryParams).then(response => {
        this.grouppalletrecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        orgId: null,
        panelLineid: null,
        packageId: null,
        packsgeLineid: null,
        soDocno: null,
        soId: null,
        soLineid: null,
        quantityPackage: null,
        itemId: null,
        panelCode: null,
        itemCode: null,
        itemName: null,
        specification: null,
        unitOfMeasure: null,
        batchCode: null,
        workorderId: null,
        workorderCode: null,
        packageNet: null,
        packageRough: null,
        boxType: null,
        quantity: null,
        volume: null,
        panelQty: null,
        panelType: null,
        panelWeight: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        expireDate: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        attr5: null,
        attr6: null,
        attr7: null,
        attr8: null,
        attr9: null,
        attr10: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.panelLineid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加实际组托明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const panelLineid = row.panelLineid || this.ids
      getGrouppalletrecord(panelLineid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改实际组托明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.panelLineid != null) {
            updateGrouppalletrecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGrouppalletrecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const panelLineids = row.panelLineid || this.ids;
      this.$modal.confirm('是否确认删除实际组托明细编号为"' + panelLineids + '"的数据项？').then(function() {
        return delGrouppalletrecord(panelLineids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('DataQuery/grouppalletrecord/export', {
        ...this.queryParams
      }, `grouppalletrecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
