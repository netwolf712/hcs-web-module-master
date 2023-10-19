<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <time-info :readOnly="false" :autoLoad="true" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TimeInfo from "@maintainModule/components/timeInfo.vue";
export default {
  name: "baseInfo",
  components: {
    TimeInfo,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

