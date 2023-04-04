<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="title1">
        <el-row :gutter="20">
          <el-col :span="8">盘点主题：{{ form.checkPlanDocTopic }}</el-col>
          <el-col :span="8">盘点计划单号：{{ form.checkPlanDocNo }}</el-col>
        </el-row>
      </div>
      <div class="el-divider el-divider--horizontal" style="background-color: #fff;"></div>
      <div>
        <el-button type="primary" @click="examine" v-if="form.status == 0">审核</el-button>
        <el-button type="danger" @click="closeOrderVisible = true" v-if="form.status == 0">作废</el-button>
        <el-button @click="exportTable" >导出</el-button>
      </div>
      <div style="position: absolute;top: 40px;right: 80px;">
        <canvas width="120" height="120" id="myCanvas1"></canvas>
      </div>
    </el-card>
    <div style="padding: 20px;">
      <div class="title1">
       盘点信息
      </div>
      <el-form ref="form" :model="form" label-width="110px" :inline="true">
        <el-row>
          <el-col :span="24" :xs="4">
            <el-row>
              <el-col :span="6">
                <el-form-item label="差异单号" prop="docNo">
                {{ form.docNo }}
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建人" prop="createName">
                {{ form.createName }}
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间" prop="createTime">
                {{ form.createTime }}
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="盘点类型" prop="docType">
                <dict-tag
                    :options="dict.type.pandian_type"
                    :value="form.docType"
                  />
              </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="审核人" prop="approveName">
                {{ form.approveName }}
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="执行时间" prop="executeTime">
                {{ form.executeTime }}
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核时间" prop="approveTime">
                {{ form.approveTime }}
              </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当前状态" prop="docNo">
                  <dict-tag
                    :options="dict.type.pandianchayi_status"
                    :value="form.status"
                  />
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
        :data="form.wmsCheckDiffLineList"
        >
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column label="物料编码" align="center" prop="itemCode" />
          <el-table-column label="物品名称" align="center" prop="itemName" />
          <el-table-column label="批次号" align="center" prop="batchNumber" />
          <el-table-column label="规格型号" align="center" prop="specification" />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column label="系统数量" align="center" prop="qtyIn" />
          <el-table-column label="实盘数量" align="center" prop="qtyCheck" />
          <el-table-column label="盈亏数量" align="center" prop="qtyDiff" />
          <el-table-column label="盘点结果" align="center" prop="checkResult" />
          <el-table-column label="库位信息" align="center" prop="areaName" />
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="closeOrderVisible"
      width="30%">
      <span>是否确认作废？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="disuse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDicts } from "@/api/system/dict/data"
import { getDetail, disuse } from '@/api/WarehouseOperation/countdifference'

export default {
  name: 'countlistdetails',
  dicts: ['pandianchayi_status', 'pandian_type' ],
  components: { },
  data () {
    return {
      //form表单数据
      form: {},
      //遮罩层开启关闭标识
      loading: false,
      id: '',
      closeOrderVisible: false
    }
  },

  created () {
    if(this.$route.query.row) {
      this.id = this.$route.query.row
      this.getDetailInfo()
    }
  },

  methods: {
    /**详情查询 */
    getDetailInfo () {
      getDetail(this.id).then(res => {
        if(res.code == 200) {
          this.form = res.data
          this.form.docType = this.form.checkPlan.docType
          this.form.approveName = this.form.checkPlan.approveName
          this.form.executeTime = this.form.checkPlan.executeTime
          this.form.approveTime = this.form.checkPlan.approveTime
          getDicts('pandianchayi_status').then(res => {
            if (res.code == 200) {
              res.data.forEach(item => {
                if (item.dictValue == this.form.status) {
                  this.showSignature(item.dictLabel, 'black')
                }
              })
            }
          })
        }
      })
    },
    examine () {
      
    },
    disuse () {
      this.closeOrderVisible = false
      var params = {
        forced: true
      }
      disuse(this.id, params).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.getDetailInfo()
        }
        else {
          this.$message.error(res.msg)
        }
      })
    },
    /**导出 */
    exportTable () {
      this.download('/system/WmsCheckDiff/export/' + this.id, {
        ...this.queryParams
      }, `盘点差异单.xlsx`)
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
