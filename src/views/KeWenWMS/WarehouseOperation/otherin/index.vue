<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="110px"
    >
      <el-row>
        <el-col :span="8" >
          <el-form-item label="杂收单号" prop="docNo">
            <el-input
              v-model="queryParams.docNo"
              placeholder="请输入"
              style="width: 100%"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="杂收日期" prop="createTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="queryParams.createTime"
              style="width: 100%"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="杂收人" prop="createName">
            <el-input
              v-model="queryParams.createName"
              placeholder="请输入"
              style="width: 100%"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择">
              <el-option
                  v-for="dict in dict.type.zashou_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="display: flex; justify-content: end">
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
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="handleDelete" :disabled="selection.length <= 0">删除</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    
    <el-table
      v-loading="loading"
      :data="otherinList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column label="杂收单号" align="center" prop="docNo">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="Goto(scope.row)">{{
            scope.row.docNo
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="单据类型" align="center" prop="docType" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="杂收组织" align="center" prop="orgName" />
      <!-- <el-table-column label="杂收存储地点" align="center" prop="remark" /> -->
      <el-table-column label="杂收时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="杂收人" align="center" prop="createName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.zashou_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-popconfirm
            icon="el-icon-warning-outline"
            icon-color="red"
            title="确定删除吗？"
            @confirm="handleDelete(scope.row.id)"
          >
            <el-button slot="reference" type="text" icon="el-icon-delete" style="color: #f56c6c;">删除</el-button>
          </el-popconfirm>
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
  </div>
</template>

<script>
import { getList, MiscRcvTransDelete } from "@/api/WarehouseOperation/otherin"

export default {
  name: "otherin",
  dicts: ['zashou_status'],
  data () {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 产品入库录表格数据
      otherinList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      selection: [],
      dialogVisible: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      getList(this.queryParams).then(res => {
        if (res.code == 200) {
          this.otherinList = res.rows
          this.total = res.total
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10
      }
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.$router.push({ path: '/KeWenWMS/WarehouseOperation/otherindetails', query: { row: { type: 'add' } } })
    },
    //点击编号跳转详情页面
    Goto (row) {
      row.type = 'detail'
      this.$router.push({ path: '/KeWenWMS/WarehouseOperation/otherindetails', query: { row: row } })
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selection = selection
    },
    handleDelete (id) {
      var params = {
        data: {
          id: [id]
        }
      }
      MiscRcvTransDelete(params).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.getList()
        }
        else {
          this.$message.error(res.msg)
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
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