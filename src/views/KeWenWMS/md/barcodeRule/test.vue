<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-28 16:37:35
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-28 16:41:36
 * @FilePath: \RuoYi-Vue-master\ruoyi-ui\src\views\KeWenWMS\md\barcodeRule\test.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="margin-bottom: 20px">
    <el-button size="small" @click="addTab(editableTabsValue)">
      add tab
    </el-button>
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        {{ item.content }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editableTabsValue: '2',
      editableTabs: [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content'
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content'
      }],
      tabIndex: 2
    }
  },

  methods: {
    addTab (targetName) {
      let newTabName = ++this.tabIndex + ''
      this.editableTabs.push({
        title: 'New Tab',
        name: newTabName,
        content: 'New Tab content'
      })
      this.editableTabsValue = newTabName
    },
    removeTab (targetName) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    }
  }
}

</script>
