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
        <el-col :span="8">
          <el-form-item label="单号" prop="docNo">
            <el-input
              v-model="queryParams.docNo"
              placeholder="请输入"
              style="width: 100%"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务日期" prop="businessDate">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="queryParams.businessDate"
              style="width: 100%"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
      <el-col :span="1.5">
        <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="handleDelete" :disabled="selection.length <= 0">删除</el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <el-table
      v-loading="loading"
      :data="otheroutList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="单号" align="center" prop="docNo">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="Goto(scope.row)">{{
            scope.row.docNo
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="单据类型编码" align="center" prop="docType" />
      <el-table-column label="业务日期" align="center" prop="businessDate" />
      <el-table-column label="受益部门编码" align="center" prop="benefitDpt" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="创建人" align="center" prop="createBy" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pagination.pageNum"
      :limit.sync="pagination.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getDicts } from "@/api/system/dict/data"
import { getList, MiscRcvTransDelete } from "@/api/WarehouseOperation/otherout"

export default {
  name: "otherout",
  data () {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 表格数据
      otheroutList: [],
      // 查询参数
      queryParams: {},
      pagination: {
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      selection: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      getDicts('org').then(res => {
        if (res.code == 200) {
          res.data.forEach(item => {
            this.queryParams.orgId = item.dictValue
            this.queryParams.orgName = item.dictLabel
          })
          var params = {}
          params.data = this.queryParams
          getList(params, this.pagination).then(res => {
            if (res.code == 200) {
              this.otheroutList = res.rows
              this.total = res.total
            }
          })
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParams = {}
      this.pagination = {
        pageNum: 1,
        pageSize: 10
      }
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.$router.push({ path: '/KeWenWMS/WarehouseOperation/otheroutdetails', query: { row: { type: 'add' } } })
    },
    //点击编号跳转详情页面
    Goto (row) {
      row.type = 'detail'
      this.$router.push({ path: '/KeWenWMS/WarehouseOperation/otheroutdetails', query: { row: row } })
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selection = selection
    },
    handleDelete () {
      var ids = []
      this.selection.forEach(item => {
        ids.push(item.id)
      })
      var params = {
        data: {
          id: ids
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
