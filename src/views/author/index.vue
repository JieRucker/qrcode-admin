<template>
  <Tabs :animated="false" :value="tabs.selectValue" @on-click="changePanelTab" style="height: 100%">
    <TabPane :label="item.label" :name="item.name" v-for="(item,index) in tabList" :key="index">
      <component v-if="item.name === 'name1'" :is="tabs.currentPrimary"></component>
      <component v-if="item.name === 'name2'" :is="tabs.currentSecond"></component>
    </TabPane>
  </Tabs>
</template>

<script>
  import authList from './components/auth-list.vue';
  import applyList from './components/apply-list.vue';

  export default {
    name: "index",
    components: {
      authList,
      applyList
    },
    data() {
      return {
        tabs: {
          currentPrimary: 'authList',
          currentSecond: '',
          selectValue: 'name1',
        },
        tabList: [
          {
            label: '人员列表',
            name: 'name1'
          },
          {
            label: '申请列表',
            name: 'name2'
          }
        ]
      }
    },
    methods: {
      changePanelTab(value) {
        this.tabs.currentPrimary = '';
        this.tabs.currentSecond = '';
        switch (value) {
          case 'name1':
            this.tabs.currentPrimary = 'authList';
            break;
          case 'name2':
            this.tabs.currentSecond = 'applyList';
            break;
        }
      }
    }
  }
</script>
