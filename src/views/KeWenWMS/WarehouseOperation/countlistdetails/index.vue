<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="title1">
        <el-row :gutter="20">
          <el-col :span="8">盘点主题：xxxxxxx</el-col>
          <el-col :span="8">盘点计划单号：xxxxxxx</el-col>
        </el-row>
      </div>
      <div class="el-divider el-divider--horizontal" style="background-color: #fff;"></div>
      <div>
        <el-button type="primary" @click="handleSubmit">重新盘点</el-button>
        <el-button type="danger" >结束盘点</el-button>
        <el-button>导出</el-button>
      </div>
      <div style="position: absolute;top: 40px;right: 80px;">
        <canvas width="120" height="120" id="myCanvas1"></canvas>
      </div>
    </el-card>
    <div style="padding: 20px;">
      <div class="title1">
       盘点信息
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" :inline="true">
        <el-row>
          <el-col :span="24" :xs="4">
            <el-row>
              <el-col :span="6">
                <el-form-item label="盘点单号" prop="docNo">
                <el-input v-model="form.docNo" :disabled="disabled" />
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建人" prop="docNo">
                <el-input v-model="form.docNo" :disabled="disabled" />
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间" prop="docNo">
                <el-input v-model="form.docNo" :disabled="disabled" />
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="盘点类型" prop="docNo">
                <el-input v-model="form.docNo" :disabled="disabled" />
              </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="执行人" prop="docNo">
                <el-input v-model="form.docNo" :disabled="disabled" />
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="开始时间" prop="docNo">
                <el-input v-model="form.docNo" :disabled="disabled" />
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="完成时间" prop="docNo">
                <el-input v-model="form.docNo" :disabled="disabled" />
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当前状态" prop="docNo">
                <el-input v-model="form.docNo" :disabled="disabled" />
              </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="padding: 20px;">
      <div class="title1">
       物品明细
      </div>
      <el-table
        v-loading="loading"
        :data="form.wmMiscShipLineList"
        >
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column label="库位信息" align="center" prop="itemCode">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="showDetail(scope.row)">{{
                scope.row.id
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="物料编码" align="center" prop="itemCode" />
          <el-table-column label="物品名称" align="center" prop="itemName" />
          <el-table-column label="批次号" align="center" prop="lotinfo" />
          <el-table-column label="规格型号" align="center" prop="code" />
          <el-table-column label="单位" align="center" prop="qty" />
          <el-table-column label="系统数量" align="center" prop="qty" />
          <el-table-column label="实盘数量" align="center" prop="qty" />
          <el-table-column label="盈亏数量" align="center" prop="isMfg" />
          <el-table-column label="盘点结果" align="center" prop="creattime" />
      </el-table>
      <pagination
        v-show="ipagination.total > 0"
        :total="ipagination.total"
        :page.sync="ipagination.pageNum"
        :limit.sync="ipagination.pageSize"
        @pagination="getList"
      />
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-table :data="gridData">
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column property="date" label="箱码" />
        <el-table-column property="name" label="物料编码" />
        <el-table-column property="address" label="系统数量" />
        <el-table-column property="date" label="实盘数量" />
        <el-table-column property="name" label="盈亏数量" />
        <el-table-column property="address" label="盘点结果" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getDicts } from "@/api/system/dict/data"
import { getDetail, miscRcvTrans, addtInsert } from '@/api/WarehouseOperation/otherout'
import { deepClone } from '@/utils/index'

export default {
  name: 'countlistdetails',
  components: { },
  data () {
    return {
      disabled: false,
      //form表单数据
      form: {},
      //表单验证规则
      rules: {
        docNo: [
          { required: true, message: '请输入单号', trigger: 'blur' }
        ],
        docType: [
          { required: true, message: '请输入单据类型编码', trigger: 'blur' }
        ],
        businessDate: [
          { type: 'string', required: true, message: '请选择业务日期', trigger: 'change' }
        ],
        benefitDpt: [
          { required: true, message: '请输入受益部门编码', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
        createBy: [
          { required: false, message: '请输入创建人', trigger: 'blur' }
        ]
      },
      //遮罩层开启关闭标识
      loading: false,
      //库位信息弹窗开启关闭标识、
      open: undefined,
      //分页参数
      ipagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      dialogTitle: '',
      dialogVisible: false,
      gridData: []
    }
  },

  created () {
    this.getQuery(this.$route.query.row)
  },

  methods: {
    getQuery (row) {
      let that = this
      Object.keys(row).forEach(function (key) {
        that.form[key] = row[key]
      })
      this.disabled = true
      this.getList()

    },
    /**表格数据赋值 */
    getList () {
      var params = {
        data: {
          id: this.form.id
        }
      }
      getDetail(params).then(res => {
        if(res.code == 200) {
          this.form = res.data
          this.form.wmMiscShipLineList = [{
            id: '111'
          }]
          this.showSignature('进行中', 'black')
        }
      })
    },
    /**保存 */
    handleSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**查看详情 */
    showDetail (row,$index) {
      this.dialogTitle = row.id
      this.dialogVisible = true
    },
    showSignature (text,color) {
      var canvas = document.getElementById('myCanvas1')
      console.log(canvas)
      var ctx = canvas.getContext('2d')
      ctx.globalAlpha = 0.8
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.arc(canvas.clientWidth / 2, canvas.clientWidth / 2, canvas.clientWidth / 2 - 10, 0, 2 * Math.PI, false)
      ctx.stroke()
      ctx.font = '20px 宋体'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.lineWidth = 1
      ctx.translate(canvas.clientWidth / 2, canvas.clientWidth / 2)
      ctx.rotate(Math.PI / 6)
      ctx.strokeText(text, 0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
  .title1 {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 16px;
  }
</style>
