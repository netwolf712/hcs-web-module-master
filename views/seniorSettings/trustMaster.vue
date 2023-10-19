<template>
  <div class="app-container">
    <div class="cardTitle">
      <span>托管主机设置</span>
      <el-button
        type="primary"
        plain
        v-if="deviceStatus.trustState == 0"
        @click="handleSubmit"
        style="margin-left: 10px"
        >保存设置</el-button
      >
      <el-button
        type="success"
        plain
        v-if="deviceStatus.trustState == 2"
        @click="handleRequestTrust(true)"
        style="margin-left: 10px"
        >停止托管</el-button
      >
    </div>
    <span v-if="deviceStatus.trustState == 1 || deviceStatus.trustState == 3"
      >（当前正在进行托管请求，不可进行配置更改操作）</span
    >
    <div style="display: flex; margin-top: 20px">
      <span class="masterTitle">托管主机编号：</span>
      <el-input
        style="width: 80px"
        type="number"
        v-model="trustNo"
        :disabled="deviceStatus.trustState == 2"
        max="1000"
        min="100"
        @blur="checkNumber"
      />
    </div>
    <div
      style="display: flex; margin-top: 20px"
      v-if="deviceStatus.trustState == 0"
    >
      <span>启用指定时间段自动托管：</span>
      <el-checkbox v-model="autoTrust"></el-checkbox>
    </div>
    <time-slot-settings
      ref="timeSlotSettingsRef"
      v-if="autoTrust && deviceStatus.trustState == 0"
      :cardName="timeSlotCardName"
      :timeSlotType="timeSlotType"
      :saveBySelf="timeSlotSaveBySelf"
      style="margin-top: 20px"
    />
  </div>
</template>

<script>
import TimeSlotSettings from "@masterModule/components/timeSlotSettings.vue";
import {
  listStepMaster,
  updateStepMaster,
} from "@masterModule/api/stepMaster/stepMaster";
import { getDeviceStatus } from "@masterModule/api/base/baseInfo";
import {
  requestTrust,
  responseTrust,
} from "@masterModule/api/stepMaster/trust";
/**
 * 上级主机
 */
const STEP_MASTER_TYPE_SUPERIOR = 1;
/**
 * 附加主机
 */
const STEP_MASTER_TYPE_APPEND = 2;

/**
 * 增援主机
 */
const STEP_MASTER_TYPE_REINFORCE = 3;

/**
 * 托管主机
 */
const STEP_MASTER_TYPE_TRUST = 4;
/**
 * 自动托管的时间段
 */
const TIME_SLOT_TYPE_AUTO_TRUST = 2;

/**
 * 状态-未托管
 */
const TRUST_STATE_NONE = 0;
/**
 * 状态-请求开始托管
 */
const TRUST_STATE_REQUEST_START = 1;
/**
 * 状态-托管中
 */
const TRUST_STATE_ING = 2;
/**
 * 状态-请求结束托管
 */
const TRUST_STATE_REQUEST_STOP = 3;

/**
 * 动作-请求开始托管
 */
const TRUST_START = 1;
/**
 * 动作-请求结束托管
 */
const TRUST_STOP = 0;

export default {
  name: "trustMaster",
  components: { TimeSlotSettings },
  data() {
    return {
      timeSlotType: TIME_SLOT_TYPE_AUTO_TRUST,
      timeSlotCardName: "自动托管时段设置",
      //本机号码
      masterSelf: "",
      //托管主机编号
      trustNo: "",
      queryParams: {
        pageNum: 1,
        pageSize: 100,
      },
      orgStepMasterList: [],
      timeSlotSaveBySelf: false,
      //心跳时间
      //每10秒钟获取一次设备状态
      intervalTime: 10000,
      //心跳定时器
      timerInterval: null,
      //设备状态
      deviceStatus: {
        trustState: 1,
        workState: 0,
      },
      //是否自动托管
      autoTrust: null,
      //是否有配置改动
      changedSomething: false,
      //控制按钮名称
      controlBtnName: "开启托管功能",
    };
  },
  created() {
    this.getStatus();
    this.startTimer();
    this.getList();
  },
  methods: {
    startTimer() {
      if (!this.timerInterval) {
        this.timerInterval = setInterval(() => {
          this.getStatus();
        }, this.intervalTime);
      }
    },
    getStatus() {
      getDeviceStatus().then((res) => {
        if (res.code === 200) {
          this.deviceStatus.trustState = res.data.trustState;
          this.deviceStatus.workState = res.data.workState;
          if (this.autoTrust == null) {
            this.autoTrust = res.data.autoTrust;
          }
        }
      });
    },
    handleRequestTrust(showNotice) {
      if (!this.trustNo) {
        this.msgError("托管主机号不能为空");
        return;
      }

      let params = {
        beTrustNo: this.masterSelf,
        trustNo: this.trustNo,
        state: TRUST_START,
        autoTrust: this.autoTrust,
      };
      if (this.deviceStatus.trustState === TRUST_STATE_NONE) {
        params.state = TRUST_START;
        if (!this.autoTrust) {
          this.deviceStatus.trustState = TRUST_STATE_REQUEST_START;
        }
      } else if (this.deviceStatus.trustState === TRUST_STATE_ING) {
        params.state = TRUST_STOP;
        if (!this.autoTrust) {
          this.deviceStatus.trustState = TRUST_STATE_REQUEST_STOP;
        }
      }

      requestTrust(params).then((res) => {
        if (res.code == 200) {
          if (showNotice) {
            this.msgSuccess("操作成功");
          }
        } else {
          if (showNotice) {
            this.msgSuccess("操作失败");
          }
        }
      });
    },
    getList() {
      listStepMaster(
        this.queryParams.pageNum,
        this.queryParams.pageSize,
        null
      ).then((res) => {
        if (res.code === 200) {
          this.masterSelf = res.data.masterNo;

          this.orgStepMasterList = res.data.list;
          if (this.orgStepMasterList) {
            this.orgStepMasterList.forEach((item) => {
              if (item.masterType === STEP_MASTER_TYPE_TRUST) {
                this.trustNo = item.masterNo;
              }
            });
          }
        }
      });
    },
    checkNumber() {
      if (this.trustNo) {
        let val = parseInt(this.trustNo);
        val = val <= 100 ? 100 : val;
        val = val >= 1000 ? 999 : val;
      }
      this.changedSomething = true;
      this.trustNo = toString(val);
    },
    //提交前检查
    preCheck() {
      if (this.trustNo) {
        //检查是否与自身号码重复
        if (parseInt(this.trustNo) === parseInt(this.masterSelf)) {
          this.msgError("托管主机不能是本机");
          return false;
        }
        //检查是否与托管主机或附加主机重复
        for (var i in this.orgStepMasterList) {
          var thatStepMaster = this.orgStepMasterList[i];
          if (
            thatStepMaster.masterType == STEP_MASTER_TYPE_APPEND ||
            thatStepMaster.masterType == STEP_MASTER_TYPE_SUPERIOR
          ) {
            if (parseInt(this.trustNo) === parseInt(thatStepMaster.masterNo)) {
              if (thatStepMaster.masterType == STEP_MASTER_TYPE_APPEND) {
                this.msgError("托管主机不能是附加主机");
                return false;
              } else {
                this.msgError("托管主机不能是备用主机");
                return false;
              }
            }
          }
        }
      }
      return true;
    },
    handleSubmit() {
      if (!this.preCheck()) {
        return;
      }
      let stepMasterList = [];

      let tmp = {
        masterNo: this.trustNo,
        masterLevel: 0,
        callWaitTime: 0,
        masterType: STEP_MASTER_TYPE_TRUST,
      };
      stepMasterList.push(tmp);
      if (this.autoTrust) {
        this.$refs.timeSlotSettingsRef.handleSubmit();
      }
      updateStepMaster(stepMasterList, STEP_MASTER_TYPE_TRUST).then((res) => {
        if (res.code === 200) {
          this.handleRequestTrust(false);
          this.msgSuccess("托管主机设置成功");
        } else {
          this.msgError("托管主机设置失败");
        }
      });
    },
  },
};
</script>
<style>
.cardTitle {
  font-size: 18px;
  font-weight: bold;
}
.masterItem {
  width: 80px;
  height: 80px;
}
.masterSpan {
  width: 60px;
  margin-top: 20p;
  text-align: center;
  height: 80px;
}
.masterTitle {
  text-align: center;
  align-self: center;
}
.masterMainItem {
  display: inline-flex;
}
.alarmBorder {
  border: 1px solid red;
  border-radius: 5px;
}
.normalBorder {
  border: 0px solid red;
  border-radius: 5px;
}
</style>

