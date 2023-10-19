<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5" style="margin-right: 12px">
        <device-base-info :autoLoad="true" />
      </el-col>
      <el-col :span="8" style="margin-right: 12px">
        <network-info :readOnly="false" :autoLoad="true" />
      </el-col>
      <el-col :span="9">
        <base-settings :readOnly="false" :autoLoad="true" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BaseSettings from "@masterModule/components/baseSettings";
import DeviceBaseInfo from "@maintainModule/components/deviceBaseInfo.vue";
import NetworkInfo from "@maintainModule/components/networkInfo.vue";
import TimeInfo from "@maintainModule/components/timeInfo.vue";
export default {
  name: "baseInfo",
  components: {
    BaseSettings,
    DeviceBaseInfo,
    NetworkInfo,
    TimeInfo,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

