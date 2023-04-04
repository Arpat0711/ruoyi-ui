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
          <el-form-item label="盘点计划号" prop="planDocNo">
            <el-input
              v-model="queryParams.planDocNo"
              placeholder="请输入盘点计划号"
              clearable
              @keyup.enter.native="handleQuery"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="盘点单号" prop="orderDocNo">
            <el-input
              v-model="queryParams.orderDocNo"
              placeholder="请输入盘点单号"
              clearable
              @keyup.enter.native="handleQuery"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="执行人" prop="operatorName">
            <el-input
              v-model="queryParams.operatorName"
              placeholder="请输入执行人"
              clearable
              @keyup.enter.native="handleQuery"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.pandiandan_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="盘点类型" prop="docType">
            <el-select
              v-model="queryParams.docType"
              placeholder="请选择"
              size="medium"
            >
              <el-option
                v-for="dict in dict.type.pandian_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <div slot="label">
              <el-select v-model="queryParams.timeType" placeholder="请选择">
                <el-option label="盘点时间" value="0" />
                <el-option label="执行时间" value="1" />
                <el-option label="完成时间" value="2" />
              </el-select>
            </div>
            <el-date-picker
              v-model="businessDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              clearable
              @keyup.enter.native="handleQuery"
            >
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
        prop="pcode"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="盘点主题"
        align="center"
        prop="plan.docTopic"
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
          <el-button type="text" @click="Goto(scope.row.id)">{{
            scope.row.docNo
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="盘点日期" align="center" prop="plan.planTime" />
      <el-table-column label="盘点类型" align="center" prop="docType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.pandian_type"
            :value="scope.row.docType"
          />
        </template>
      </el-table-column>
      <el-table-column label="执行人" align="center" prop="operatorName" />
      <el-table-column label="执行时间" align="center" prop="executeTime" />
      <el-table-column label="完成时间" align="center" prop="finishedTime" />
      <el-table-column
        label="差异单号"
        align="center"
        prop="plan.checkDiffDocNo"
      />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.pandiandan_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否首盘" align="center" prop="first">
        <template slot-scope="scope">
          <div v-if="scope.row.first == true">是</div>
          <div v-else>否</div>
        </template>
      </el-table-column>
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
            @click="handleUpdate(scope.row.id)"
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

    <el-dialog
      title="盘点单修改"
      :visible.sync="open"
      width="660px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
    >
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
              {{ form.pcode }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点单号" prop="code">
              {{ form.docNo }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点时间" prop="time">
              {{ form.docNo }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="执行人" prop="operatorId">
              <el-select
                v-model="form.operatorId"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                >
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
import { getDicts } from "@/api/system/dict/data"
import { getList, getDetail, getUser, updateOrder } from "@/api/WarehouseOperation/countlist"

export default {
  name: "countlist",
  dicts: ['pandiandan_status', 'pandian_type'],
  data () {
    return {
      checkPlanId: '',
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
      businessDate: [],
      selection: [],
      open: false,
      form: {},
      rules: {
        operatorId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      userList: []
    }
  },
  created () {
    if (this.$route.query.row) {
      this.checkPlanId = this.$route.query.row
      getDicts('org').then(res => {
        if (res.code == 200) {
          console.log(res)
          this.queryParams.orgCode = res.data[1].dictValue
          this.getList()
        }
      })
    }
  },
  mounted () {
  },
  methods: {
    /** 查询客户列表 */
    getList () {
      if (this.businessDate) {
        this.queryParams.startTime = this.businessDate[0]
        this.queryParams.endTime = this.businessDate[1]
      }
      this.queryParams.checkPlanId = this.checkPlanId
      getList(this.queryParams).then(res => {
        if (res.code == 200) {
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
        orgCode: this.queryParams.orgCode
      }
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selection = selection
    },
    //点击编号跳转详情页面
    Goto (id) {
      this.$router.push({ path: '/KeWenWMS/WarehouseOperation/countlistdetails', query: { row: id } })
    },
    /** 修改按钮操作 */
    handleUpdate (id) {
      this.open = true
      this.getUser()
      getDetail(id).then(res => {
        if (res.code == 200) {
          this.form = {
            id: res.data.id,
            docTopic: res.data.docTopic,
            pcode: res.data.pcode,
            docNo: res.data.docNo,
            planTime: res.data.planTime,
            operatorId: parseInt(res.data.nominatorId)
          }
        }
      })
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateOrder(this.form.id, this.form.operatorId).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.open = false
              this.getList()
            }
            else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    /** 取消按钮 */
    cancel () {
      this.open = false
      this.$refs.form.resetFields()
    },
    getUser () {
      var params = {
        pageNum: 1,
        pageSize: 100,
        roleId: 102
      }
      getUser(params).then(res => {
        if (res.code == 200) {
          this.userList = res.rows
        }
      })
    },
  }
};
</script>
