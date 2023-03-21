<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-07-21 13:52:06
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-21 13:43:48
 * @FilePath: \RuoYi-Vue-master\ruoyi-ui\src\views\tool\swagger\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index"
export default {
  name: "Swagger",
  components: { iFrame },
  data () {
    return {
      url: process.env.VUE_APP_BASE_API + "/doc.html"
    }
  },
};
</script>
