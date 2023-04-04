<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="title1">
        <el-row :gutter="20">
          <el-col :span="8">盘点主题：{{ form.docTopic }}</el-col>
          <el-col :span="8">盘点计划单号：{{ form.pcode}}</el-col>
        </el-row>
      </div>
      <div class="el-divider el-divider--horizontal" style="background-color: #fff;"></div>
      <div>
        <el-button type="primary" @click="afresh" v-if="form.status == '2'">重新盘点</el-button>
        <el-button type="danger" @click="closeOrderVisible = true" v-if="form.status != '3'">结束盘点</el-button>
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
                <el-form-item label="盘点单号" prop="docNo">
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
                <el-form-item label="执行人" prop="operatorName">
                  {{ form.operatorName }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="执行时间" prop="executeTime">
                  {{ form.executeTime }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="完成时间" prop="finishedTime">
                  {{ form.finishedTime }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当前状态" prop="status">
                  <dict-tag
                    :options="dict.type.pandiandan_status"
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
        :data="form.wmsCheckLineList"
        >
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column label="库位信息" align="center" prop="areaName">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row)">{{
                scope.row.areaName
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="物料编码" align="center" prop="itemCode" />
          <el-table-column label="物品名称" align="center" prop="itemName" />
          <el-table-column label="批次号" align="center" prop="batchNumber" />
          <el-table-column label="规格型号" align="center" prop="specification" />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column label="系统数量" align="center" prop="qtyIn" />
          <el-table-column label="实盘数量" align="center" prop="qtyCheck" />
          <el-table-column label="盈亏数量" align="center" prop="qtyDiff">
            <template slot-scope="scope">
              {{ parseInt(scope.row.qtyIn - scope.row.qtyCheck) }}
            </template>
          </el-table-column>
          <el-table-column label="盘点结果" align="center" prop="checkResult" />
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-table :data="gridData">
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column property="boxCode" label="箱码" />
        <el-table-column property="itemCode" label="物料编码" />
        <el-table-column property="qtyIn" label="系统数量" />
        <el-table-column property="qtyCheck" label="实盘数量" />
        <el-table-column property="qtyDiff" label="盈亏数量" />
        <el-table-column property="checkResult" label="盘点结果" />
      </el-table>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="closeOrderVisible"
      width="30%">
      <span v-if="form.status == '2'">是否结束盘点？</span>
      <span v-else>盘点尚未完成，是否强制结束?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="stop">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDicts } from "@/api/system/dict/data"
import { getDetail, getLineDetail, redo, close } from "@/api/WarehouseOperation/countlist"


export default {
  name: 'countlistdetails',
  dicts: ['pandiandan_status', 'pandian_type' ],
  components: { },
  data () {
    return {
      disabled: false,
      //form表单数据
      form: {},
      //遮罩层开启关闭标识
      loading: false,
      //库位信息弹窗开启关闭标识、
      open: undefined,
      dialogTitle: '',
      dialogVisible: false,
      gridData: [],
      orderId: '',
      closeOrderVisible: false
    }
  },

  created () {
    if(this.$route.query.row) {
      this.orderId = this.$route.query.row
      this.getDetailInfo()
    }
  },

  methods: {
    getDetailInfo () {
      getDetail(this.orderId).then(res => {
        if(res.code == 200) {
          this.form = res.data
          this.form.docTopic = this.form.plan.docTopic
          this.form.docType = this.form.plan.docType
          getDicts('pandiandan_status').then(res => {
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

    /**重新盘点 */
    afresh () {
      redo(this.form.id).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.getDetailInfo()
        }
        else {
          this.$message.error(res.msg)
        }
      })
      
    },
    /**结束盘点 */
    stop () {
      this.closeOrderVisible = false
      var params = {}
      if (this.form.status == '2') {
        params.forced = false
      }
      else {
        params.forced = true
      }
      close(this.form.id, params).then(res => {
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
      this.download('/system/WmsCheckOrder/export/' + this.form.id, {
        ...this.queryParams
      }, `盘点单.xlsx`)
    },
    /**查看详情 */
    showDetail (row,$index) {
      this.dialogTitle = row.areaName
      this.dialogVisible = true
      getLineDetail(row.id).then(res => {
        if (res.code == 200) {
          this.gridData = res.data
        }
      })
    },
    showSignature (text,color) {
      var canvas = document.getElementById('myCanvas1')
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
