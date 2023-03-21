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
      <el-form-item label="调入单号" prop="docNo">
        <el-input
          v-model="queryParams.docNo"
          placeholder="请输入搜索内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="调入日期" prop="transInDatetime">
        <el-date-picker
          clearable
          v-model="queryParams.transInDatetime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="调入人" prop="transInOperator">
        <el-input
          v-model="queryParams.transInOperator"
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

    <el-table
      v-loading="loading"
      :data="dataList"
    >
      <el-table-column label="调入单号" prop="docNo">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="openDetails(scope.row)"
            >{{ scope.row.docNo }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="单据类型" prop="docType" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="调出组织" prop="transOutOrgName" />
      <el-table-column label="调入组织" prop="transInOrgName" />
      <el-table-column label="调入存储地点" prop="transInWarehouseName" />
      <el-table-column label="调入时间" prop="transInDatetime" />
      <el-table-column label="调入人" prop="transInOperator" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm title="确定删除该行数据吗？" @confirm="handleDelete(scope.row)">
            <el-button
              slot="reference"
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="scope.row.status == 'WIP'"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.number"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: "CrossOrgTransferIn",
  data () {
    return {
      loading: false,
      dataList: [
        {
          id: '1',
          docNo: '123223',
          docType: '类型1',
          createTime: '2023-01-01 10:15',
          transOutOrgName: '调出组织1',
          transInOrgName: '调入组织1',
          transInWarehouseName: '调入地点2',
          transInDatetime: '2023-01-02 10:15',
          transInOperator: '张三',
          status: 'WIP'
        }
      ],
      showSearch: true,
      pagination: {
        total: 0,
        number: 1,
        size: 10
      },
      queryParams: {
        docNo: null,
        transInDatetime: null,
        transInOperator: null,
        status: 'ALL'
      },
      stateOptions: [
        { label: '全部', val: 'ALL' },
        { label: '开立', val: 'WIP' },
        { label: '已审核', val: 'APPROVED' }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // workorderCode: [
        //   { required: true, message: "工单编码不能为空", trigger: "blur" }
        // ],
      }
    }
  },
  methods: {
    openDetails(row) {
      this.$router.push({ path: '/KeWenWMS/ProductionManagement/transfer-in-details', query: { id: row.id } })
    },
    handleSizeChange(size) {
      this.pagination.number = 1;
      this.pagination.size = size;
      this.getList();
    },
    handleCurrentChange(number) {
      this.pagination.number = number;
      this.getList();
    },

    /** 查询列表 */
    getList () {
      let { docNo, transInDatetime, transInOperator, status } = this.queryParams;
      request({
        url: '/system/TransferIn/find-by-condition',
        method: 'post',
        data: JSON.stringify({
          "orgId": "123", // TODO: should be modify
          "docType": 'docType', // TODO: 跨组织调拨单，should be replace
          docNo,
          transInDatetime,
          transInOperator,
          status,        // TODO: should be mapping to db value
          "pageNum": this.pagination.number,
          "pageSize": this.pagination.size
        })
      }).then((resp) => {
        this.dataList = resp.data;
        this.pagination = resp.pagination;
      });
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParams = {
        docNo: null,
        transInDatetime: null,
        transInOperator: null,
        status: 'ALL'
      };
      this.pagination = {
        total: 0,
        number: 1,
        size: 10
      };
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd (row) {

    },
    /** 删除按钮操作 */
    handleDelete (row) {
      request({
        url: '/system/TransferIn/delete-one',
        method: 'post',
        params: { id: row.id }
      }).then((resp) => {
        this.$message.success('删除成功!');
        this.getList();
      });
    },
    handleImport () {

    }
  },
  mounted() {
    // this.getList();
  },
};
</script>

