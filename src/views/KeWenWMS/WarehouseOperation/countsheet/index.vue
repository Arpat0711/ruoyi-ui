<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="盘点计划号" prop="docNo">
            <el-input
              v-model="queryParams.docNo"
              placeholder="请输入盘点计划号"
              clearable
              @keyup.enter.native="handleQuery"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="盘点主题" prop="docTopic">
            <el-input
              v-model="queryParams.docTopic"
              placeholder="请输入盘点主题"
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
                  v-for="dict in dict.type.pandian_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="盘点类型" prop="docType">
            <el-select v-model="queryParams.docType" placeholder="请选择">
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
              <el-select v-model="queryParams.timeType" placeholder="请选择">
                <el-option label="创建时间" value="0" />
                <el-option label="盘点时间" value="1" />
              </el-select>
            </div>
            <el-date-picker
              v-model="businessDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              clearable
              @keyup.enter.native="handleQuery" >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="display: flex; justify-content: end">
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
      :data="planList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="盘点计划号"
        align="center"
        prop="docNo"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="Goto(scope.row)">
            {{ scope.row.docNo }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="盘点主题"
        align="center"
        prop="docTopic"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建人"
        align="center"
        prop="createName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="创建日期" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="盘点日期" align="center" prop="tel" />
      <el-table-column label="盘点类型" align="center" prop="docType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.pandian_type"
            :value="scope.row.docType"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.pandian_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="差异单" align="center" prop="status" />
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
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >生成差异单</el-button
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

    <!-- 添加或修改 -->
    <el-dialog :title="title" :visible.sync="open" width="660px" append-to-body :close-on-click-modal="false"	:show-close="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点主题" prop="docTopic">
              <el-input v-model="form.docTopic" placeholder="请输入盘点主题" clearable style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点日期" prop="planTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.planTime" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">{{form.storageAreaIds}}
            <el-form-item label="库区" prop="storageAreaIds">
             <el-cascader
             ref="cascader"
                v-model="form.storageAreaIds"
                :options="transOptions"
                :props="{ multiple: true, emitPath: false }"
                :show-all-levels="false" 
                style="width: 100%;"
                clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点人员" prop="operatorIds">
              <el-select v-model="form.operatorIds" multiple placeholder="请选择" style="width: 100%;">
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
        <el-row>
          <el-col :span="16">
            <el-form-item label="盘点类型" prop="docType">
              <el-radio-group v-model="form.docType">
                <el-radio label="0">暗盘</el-radio>
                <el-radio label="1">明盘</el-radio>
              </el-radio-group>
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
import { getList, listThread } from "@/api/WarehouseOperation/countsheet"

export default {
  name: "countsheet",
  dicts: ['pandian_status', 'pandian_type' ],
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
      businessDate: [],
      selection: [],
      title: '',
      open: false,
      form: {
        docType: '0'
      },
      rules: {
        docTopic: [
          {required: true, message: '请输入盘点主题', trigger: 'blur' }
        ],
        planTime: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        storageAreaIds: [
          { type: 'array', required: true, message: '请选择', trigger: 'change' }
        ],
        operatorIds: [
          { type: 'array', required: true, message: '请选择', trigger: 'change' }
        ]
      },
      transOptions: []
    }
  },
  created () {
    getDicts('org').then(res => {
      if (res.code == 200) {
        this.queryParams.orgCode = res.data[0].dictValue
        this.getList()
        this.getTrans()
        this.getUser()
      }
    })
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
      getList(this.queryParams).then(res => {
        if(res.code == 200) {
          this.planList = res.rows
          this.total = res.total
        }
      })
    },
    getTrans () {
      listThread().then(res => {
        this.transOptions = res
      })
    },
    getUser () {

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
      this.businessDate = []
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selection = selection
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.title = '新增盘点计划'
      this.open = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      console.log(row)
      this.title = '修改盘点计划'
      this.open = true

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
    //点击编号跳转详情页面
    Goto (row) {
      this.$router.push({ path: '/KeWenWMS/WarehouseOperation/countlist', query: { row: row.id } })
    },
  }
};
</script>
