<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="调出单号" prop="docNo">
        <el-input
          v-model="queryParams.docNo"
          placeholder="请输入搜索内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="调出日期" prop="transOutDatetime">
        <el-date-picker
          clearable
          v-model="queryParams.transOutDatetime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="调出人" prop="transOutOperator">
        <el-input
          v-model="queryParams.transOutOperator"
          placeholder="请输入搜索内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status">
          <el-option
            v-for="state in stateOptions"
            :key="state.val"
            :label="state.label"
            :value="state.val"
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
          type="warning"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          >导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="调出单号" prop="docNo">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="openDetails(scope.row)">
            {{ scope.row.docNo }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="单据类型" prop="docType" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="调出组织" prop="transOutOrgName" />
      <el-table-column label="调出存储地点" prop="transOutWarehouseName" />
      <el-table-column label="调入组织" prop="transInOrgName" />
      <el-table-column label="调入存储地点" prop="transInWarehouseName" />
      <el-table-column label="调出时间" prop="transOutDatetime" />
      <el-table-column label="调出人" prop="transOutOperator" />
      <el-table-column label="状态" prop="statusTxt" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除该行数据吗？"
            @confirm="handleDelete(scope.row)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="text"
              v-if="scope.row.status === 'TODO'"
              style="margin-right: 0.5rem"
              >删除</el-button
            >
          </el-popconfirm>
          <el-button
            slot="reference"
            size="mini"
            type="text"
            v-if="scope.row.status === 'TODO'"
            @click="handleSubmit(scope.row)"
            >提交</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.number"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: "ReworkIn",
  data () {
    return {
      loading: false,
      dataList: [],
      pagination: {
        total: 0,
        number: 1,
        size: 10
      },
      showSearch: true,
      queryParams: {
        docNo: null,
        transOutDatetime: null,
        transOutOperator: null,
        status: 'ALL'
      },
      stateOptions: [
        { label: '全部', val: 'ALL' },
        { label: '开立', val: 'TODO' },
        { label: '未审核', val: 'WIP' },
        { label: '已审核', val: 'APPROVED' }
      ]
    }
  },
  methods: {
    openDetails (row) {
      this.$router.push({ path: '/KeWenWMS/ProductionManagement/rework-out-details', query: { id: row.id } })
    },
    handleSizeChange (size) {
      this.pagination.number = 1
      this.pagination.size = size
      this.getList()
    },
    handleCurrentChange (number) {
      this.pagination.number = number
      this.getList()
    },
    getTxt (status) {
      for (let i of this.stateOptions) {
        if (i.val === status) {
          return i.label
        }
      }
      return ''
    },
    /** 查询列表 */
    getList () {
      let { docNo, transOutDatetime, transOutOperator, status } = this.queryParams
      let { number, size } = this.pagination
      request({
        url: '/system/TransferOut/find-by-condition',
        method: 'post',
        data: JSON.stringify({
          orgId: '1002106210000278', // TODO: should be replace
          docType: 'KWTO06', // 返工出库单
          docNo,
          transOutDatetime,
          transOutOperator,
          status: status !== 'ALL' ? status : null,
          pageNum: number,
          pageSize: size
        })
      }).then((resp) => {
        this.dataList = resp.data.map(i => ({ ...i, statusTxt: this.getTxt(i.status) }))
        this.pagination = resp.pagination
      })
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParams = {
        docNo: null,
        transOutDatetime: null,
        transOutOperator: null,
        status: 'ALL'
      }
      this.pagination = {
        total: 0,
        number: 1,
        size: 10
      }
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.$router.push({ path: '/KeWenWMS/ProductionManagement/rework-out-add' })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      request({
        url: '/system/TransferOut/delete-order',
        method: 'post',
        params: { id: row.id }
      }).then(() => {
        this.dataList = this.dataList.filter(i => i.id !== row.id)
        this.$message.success("删除成功!")
      })
    },
    handleSubmit (row) {
      request({
        url: '/system/TransferOut/trigger-todo-task',
        method: 'post',
        params: { id: row.id }
      }).then((resp) => {
        for (let i of this.dataList) {
          if (i.id === row.id) {
            i.status = 'WIP'
            i.statusTxt = '未审核'
            break
          }
        }
        this.$message.success("已提交")
      })
    },
    handleImport () {

    }
  },
  mounted () {
    this.getList()
  },
};
</script>

