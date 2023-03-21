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
          <el-form-item label="盘点计划号" prop="clientCode">
            <el-input
              v-model="queryParams.clientCode"
              placeholder="请输入盘点计划号"
              clearable
              @keyup.enter.native="handleQuery"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="差异单号" prop="clientCode">
            <el-input
              v-model="queryParams.clientCode"
              placeholder="请输入差异单号"
              clearable
              @keyup.enter.native="handleQuery"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建人" prop="clientCode">
            <el-input
              v-model="queryParams.clientCode"
              placeholder="请输入创建人"
              clearable
              @keyup.enter.native="handleQuery"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="clientCode">
            <el-select v-model="queryParams.status" placeholder="请选择">
              <el-option
                  v-for="dict in dict.type.pandianchayi_status"
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
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="planList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column label="盘点计划号" align="center" prop="clientType" />
      <el-table-column label="盘点主题" align="center" prop="clientType" />
      <el-table-column
        label="差异单号"
        align="center"
        prop="docNo"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="Goto(scope.row)">{{
            scope.row.id
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        align="center"
        prop="clientName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="创建时间" align="center" prop="tel" />
      <el-table-column label="状态" align="center" prop="clientType" />
      <el-table-column label="是否重建盘点计划" align="center" prop="clientNick" />
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
import { getList } from "@/api/WarehouseOperation/countsheet"

export default {
  name: "countdifference",
  dicts: ['pandianchayi_status'],
  data () {
    return {
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户表格数据
      planList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      selection: [],
      form: {}
    }
  },
  created () {
    this.getList()
  },
  mounted () {
  },
  methods: {
    /** 查询客户列表 */
    getList () {
      getList(this.queryParams).then(res => {
        if(res.code == 200) {
          this.planList = res.rows
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
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selection = selection
    },
    //点击编号跳转详情页面
    Goto (row) {
      row.type = 'detail'
      this.$router.push({ path: '/KeWenWMS/WarehouseOperation/countdifferencedetails', query: { row: row } })
    }
  }
};
</script>

