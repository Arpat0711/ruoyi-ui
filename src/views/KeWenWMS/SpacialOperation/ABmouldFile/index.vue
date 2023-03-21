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
      <el-form-item label="物料编码" prop="itemCode">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户编码" prop="clientCode">
        <el-input
          v-model="queryParams.clientCode"
          placeholder="请输入客户编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模具号" prop="mouldCode">
        <el-input
          v-model="queryParams.mouldCode"
          placeholder="请输入模具号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['system:abmouldfile:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:abmouldfile:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:abmouldfile:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="abmouldfileList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="组织ID" align="center" prop="orgId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.org" :value="scope.row.orgId"/>
        </template>
      </el-table-column>
      <el-table-column label="组织名" align="center" prop="orgName">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.org" :value="scope.row.orgName"/>
        </template>
      </el-table-column>
      <el-table-column label="物料编码" align="center" prop="itemCode" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="客户ID" align="center" prop="clientId" />
      <el-table-column label="客户编码" align="center" prop="clientCode" />
      <el-table-column label="客户名称" align="center" prop="clientName" />
      <el-table-column label="模具号" align="center" prop="mouldCode" />
      <el-table-column label="限制失效时间" align="center" prop="expiryDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expiryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:abmouldfile:edit']">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:abmouldfile:remove']">删除</el-button>
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

    <!-- 添加或修改AB品对照对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="组织ID" prop="orgId">
          <el-select v-model="form.orgId" placeholder="请选择组织ID">
            <el-option
              v-for="dict in dict.type.org"
              :key="dict.value"
              :label="dict.label" :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织名" prop="orgName">
          <el-select v-model="form.orgName" placeholder="请选择组织名">
            <el-option
              v-for="dict in dict.type.org"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="客户ID" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="客户编码" prop="clientCode">
          <el-input v-model="form.clientCode" placeholder="请输入客户编码" />
        </el-form-item>
        <el-form-item label="客户名称" prop="clientName">
          <el-input v-model="form.clientName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="模具号" prop="mouldCode">
          <el-input v-model="form.mouldCode" placeholder="请输入模具号" />
        </el-form-item>
        <el-form-item label="限制失效时间" prop="expiryDate">
          <el-date-picker clearable
            v-model="form.expiryDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择限制失效时间">
          </el-date-picker>
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
import { listAbmouldfile, getAbmouldfile, delAbmouldfile, addAbmouldfile, updateAbmouldfile } from "@/api/SpacialOperation/abmouldfile";

export default {
  name: "Abmouldfile",
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
      // AB品对照表格数据
      abmouldfileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgId: null,
        itemCode: null,
        clientCode: null,
        mouldCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orgId: [
          { required: true, message: "组织ID不能为空", trigger: "blur" }
        ],
        orgName: [
          { required: true, message: "组织名不能为空", trigger: "blur" }
        ],
        itemCode: [
          { required: true, message: "物料编码不能为空", trigger: "blur" }
        ],
        itemName: [
          { required: true, message: "物料名称不能为空", trigger: "blur" }
        ],
        clientId: [
          { required: true, message: "客户ID不能为空", trigger: "blur" }
        ],
        clientCode: [
          { required: true, message: "客户编码不能为空", trigger: "blur" }
        ],
        clientName: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        mouldCode: [
          { required: true, message: "模具号不能为空", trigger: "blur" }
        ],
        expiryDate: [
          { required: true, message: "限制失效时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询AB品对照列表 */
    getList() {
      this.loading = true;
      listAbmouldfile(this.queryParams).then(response => {
        this.abmouldfileList = response.rows;
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
        id: null,
        orgId: null,
        orgName: null,
        itemCode: null,
        itemName: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        mouldCode: null,
        expiryDate: null,
        attr1: null,
        attr2: null,
        attr3: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加AB品对照";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAbmouldfile(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改AB品对照";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAbmouldfile(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAbmouldfile(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除AB品对照编号为"' + ids + '"的数据项？').then(function() {
        return delAbmouldfile(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('SpacialOperation/abmouldfile/export', {
        ...this.queryParams
      }, `abmouldfile_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
