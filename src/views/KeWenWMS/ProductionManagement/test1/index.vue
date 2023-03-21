<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-12-09 13:53:35
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-14 09:57:24
 * @FilePath: \RuoYi-Vue-master\ruoyi-ui\src\views\KeWenWMS\ProductionManagement\test1\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>详情</div>
</template>

<script>
export default {
  name: 'productdetails',
  data () {
    return {
      dataList: []
    }
  },

  create () {
    this.getQuery()
  },

  methods: {
    getQuery () {
      console.log(this.$route.query.testrow)
    }
  }
}
</script>

<style>
</style>
