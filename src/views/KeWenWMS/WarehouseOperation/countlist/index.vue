<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
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
          <el-form-item label="盘点单号" prop="clientCode">
            <el-input
              v-model="queryParams.clientCode"
              placeholder="请输入盘点单号"
              clearable
              @keyup.enter.native="handleQuery"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="执行人" prop="clientCode">
            <el-input
              v-model="queryParams.clientCode"
              placeholder="请输入执行人"
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
                  v-for="dict in dict.type.pandiandan_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="盘点类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择" size="medium">
              <el-option
                  v-for="dict in dict.type.pandian_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <div slot="label">
              <el-select v-model="queryParams.time" placeholder="请选择">
                <el-option label="创建时间" value="creattime" />
                <el-option label="盘点时间" value="pandiantime" />
              </el-select>
            </div>
            <el-date-picker
              v-model="queryParams.businessDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              @keyup.enter.native="handleQuery" >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="display: flex; justify-content: end">
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
      <el-table-column
        label="盘点计划号"
        align="center"
        prop="docNo"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="盘点主题"
        align="center"
        prop="docNo"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="盘点单号"
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
      <el-table-column label="盘点日期" align="center" prop="tel" />
      <el-table-column label="盘点类型" align="center" prop="clientType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.pandian_type"
            value="0"
          />
        </template>
      </el-table-column>
      <el-table-column label="执行人" align="center" prop="docNo" />
      <el-table-column label="执行时间" align="center" prop="tel" />
      <el-table-column label="完成时间" align="center" prop="clientNick" />
      <el-table-column label="差异单号" align="center" prop="clientType" />
      <el-table-column label="状态" align="center" prop="tel" />
      <el-table-column label="是否首盘" align="center" prop="clientNick" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
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

    <el-dialog title="盘点单修改" :visible.sync="open" width="660px" append-to-body :close-on-click-modal="false"	:show-close="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点主题" prop="name">
               {{ form.name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点计划号" prop="plan">
              {{ form.plan }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点单号" prop="code">
              {{ form.code }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点时间" prop="time">
              {{ form.time }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="执行人" prop="clientName">
              <el-select v-model="form.clientName" filterable placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="dict in dict.type.org"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api/WarehouseOperation/countsheet"

export default {
  name: "countlist",
  dicts: ['pandiandan_status', 'pandian_type' ],
  data () {
    return {
      id: '',
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
      open: false,
      form: {},
      rules: {
        clientName: [
          { type: 'array', required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    if(this.$route.query.row) {
      this.id = this.$route.query.row
      this.getQuery()
    }
  },
  mounted () {
  },
  methods: {
    getQuery () {
      let that = this
      that.queryParams.id = this.id
      that.queryParams = Object.assign(that.queryParams, that.form)
      
      console.log(that.queryParams)
      that.getList()
    },
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
        pageSize: 10,
        id: this.id
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
      this.$router.push({ path: '/KeWenWMS/WarehouseOperation/countlistdetails', query: { row: row } })
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.open = true
      console.log(row)
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
        }
      })
    },
    /** 取消按钮 */
    cancel () {
      this.open = false
      this.$refs.form.resetFields()
    },
    /** 删除按钮操作 */
    handleDelete (row) {

    },
    /** 导出按钮操作 */
    handleExport () {

    },
    //审核
    handleExamine () {

    }
  }
};
</script>
