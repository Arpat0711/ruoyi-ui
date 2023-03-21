<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据中文名称" prop="ordername">
        <el-input
          v-model="queryParams.ordername"
          placeholder="请输入单据中文名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单据头英文实体名称" prop="ordercode">
        <el-input
          v-model="queryParams.ordercode"
          placeholder="请输入单据头英文实体名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="启用状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择启用状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['system:backlogauthor:add']"
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
          v-hasPermi="['system:backlogauthor:edit']"
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
          v-hasPermi="['system:backlogauthor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:backlogauthor:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="backlogauthorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="单据中文名称" align="center" prop="ordername" />
      <el-table-column label="单据头英文实体名称" align="center" prop="ordercode" />
      <el-table-column label="启用状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="动作" align="center" prop="action" />
      <el-table-column label="档案类型" align="center" prop="doctype" />
      <el-table-column label="档案值" align="center" prop="docvalue" />
      <el-table-column label="等级" align="center" prop="grade" />
      <el-table-column label="待办类型" align="center" prop="logtype" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:backlogauthor:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:backlogauthor:remove']"
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

    <!-- 添加或修改待办信息配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单据中文名称" prop="ordername">
          <el-input v-model="form.ordername" placeholder="请输入单据中文名称" />
        </el-form-item>
        <el-form-item label="单据头英文实体名称" prop="ordercode">
          <el-input v-model="form.ordercode" placeholder="请输入单据头英文实体名称" />
        </el-form-item>
        <el-form-item label="启用状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择启用状态">
            <el-option
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="动作" prop="action">
          <el-input v-model="form.action" placeholder="请输入动作" />
        </el-form-item>
        <el-form-item label="档案类型" prop="doctype">
          <el-input v-model="form.doctype" placeholder="请输入档案类型" />
        </el-form-item>
        <el-form-item label="档案值" prop="docvalue">
          <el-input v-model="form.docvalue" placeholder="请输入档案值" />
        </el-form-item>
        <el-form-item label="等级" prop="grade">
          <el-input v-model="form.grade" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="待办类型" prop="logtype">
          <el-input v-model="form.logtype" placeholder="请输入待办类型" />
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
import { listBacklogauthor, getBacklogauthor, delBacklogauthor, addBacklogauthor, updateBacklogauthor } from "@/api/system/backlogauthor";

export default {
  name: "Backlogauthor",
  dicts: ['sys_normal_disable'],
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
      // 待办信息配置表格数据
      backlogauthorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ordername: null,
        ordercode: null,
        state: null,
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
    /** 查询待办信息配置列表 */
    getList() {
      this.loading = true;
      listBacklogauthor(this.queryParams).then(response => {
        this.backlogauthorList = response.rows;
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
        ordername: null,
        ordercode: null,
        state: null,
        action: null,
        doctype: null,
        docvalue: null,
        grade: null,
        logtype: null
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
      this.title = "添加待办信息配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBacklogauthor(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改待办信息配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBacklogauthor(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBacklogauthor(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除待办信息配置编号为"' + ids + '"的数据项？').then(function() {
        return delBacklogauthor(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/backlogauthor/export', {
        ...this.queryParams
      }, `backlogauthor_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
