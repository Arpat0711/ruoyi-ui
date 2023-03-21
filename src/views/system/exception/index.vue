<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据中文名称" prop="docName">
        <el-input
          v-model="queryParams.docName"
          placeholder="请输入单据中文名称"
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
          v-hasPermi="['system:exception:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:exception:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:exception:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:exception:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="exceptionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="单据类型[英文名称]" align="center" prop="docType" />
      <el-table-column label="单据中文名称" align="center" prop="docName" />
      <el-table-column label="单据头id" align="center" prop="pkHead" />
      <el-table-column label="单据行id" align="center" prop="pkLine" />
      <el-table-column label="异常信息" align="center" prop="data" />
      <el-table-column label="异常类型" align="center" prop="type" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:exception:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:exception:remove']"
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

    <!-- 添加或修改异常信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单据中文名称" prop="docName">
          <el-input v-model="form.docName" placeholder="请输入单据中文名称" />
        </el-form-item>
        <el-form-item label="单据头id" prop="pkHead">
          <el-input v-model="form.pkHead" placeholder="请输入单据头id" />
        </el-form-item>
        <el-form-item label="单据行id" prop="pkLine">
          <el-input v-model="form.pkLine" placeholder="请输入单据行id" />
        </el-form-item>
        <el-form-item label="异常信息" prop="data">
          <el-input v-model="form.data" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="自定义项0" prop="attr0">
          <el-input v-model="form.attr0" placeholder="请输入自定义项0" />
        </el-form-item>
        <el-form-item label="自定义项1" prop="attr1">
          <el-input v-model="form.attr1" placeholder="请输入自定义项1" />
        </el-form-item>
        <el-form-item label="自定义项2" prop="attr2">
          <el-input v-model="form.attr2" placeholder="请输入自定义项2" />
        </el-form-item>
        <el-form-item label="自定义项3" prop="attr3">
          <el-input v-model="form.attr3" placeholder="请输入自定义项3" />
        </el-form-item>
        <el-form-item label="自定义项4" prop="attr4">
          <el-input v-model="form.attr4" placeholder="请输入自定义项4" />
        </el-form-item>
        <el-form-item label="自定义项5" prop="attr5">
          <el-input v-model="form.attr5" placeholder="请输入自定义项5" />
        </el-form-item>
        <el-form-item label="自定义项6" prop="attr6">
          <el-input v-model="form.attr6" placeholder="请输入自定义项6" />
        </el-form-item>
        <el-form-item label="自定义项7" prop="attr7">
          <el-input v-model="form.attr7" placeholder="请输入自定义项7" />
        </el-form-item>
        <el-form-item label="自定义项8" prop="attr8">
          <el-input v-model="form.attr8" placeholder="请输入自定义项8" />
        </el-form-item>
        <el-form-item label="自定义项9" prop="attr9">
          <el-input v-model="form.attr9" placeholder="请输入自定义项9" />
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
import { listException, getException, delException, addException, updateException } from "@/api/system/exception";

export default {
  name: "Exception",
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
      // 异常信息表格数据
      exceptionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        docName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询异常信息列表 */
    getList() {
      this.loading = true;
      listException(this.queryParams).then(response => {
        this.exceptionList = response.rows;
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
        docType: null,
        docName: null,
        pkHead: null,
        pkLine: null,
        data: null,
        type: null,
        remark: null,
        createTime: null,
        attr0: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        attr5: null,
        attr6: null,
        attr7: null,
        attr8: null,
        attr9: null
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
      this.title = "添加异常信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getException(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改异常信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateException(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addException(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除异常信息编号为"' + ids + '"的数据项？').then(function() {
        return delException(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/exception/export', {
        ...this.queryParams
      }, `exception_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
