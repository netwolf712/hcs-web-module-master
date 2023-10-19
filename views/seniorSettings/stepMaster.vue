<template>
  <div class="app-container">
    <div class="cardTitle">
      <span>主机级别设置</span>
      <el-button
        type="primary"
        plain
        @click="handleSubmit"
        style="margin-left: 10px"
        >保存设置</el-button
      >
    </div>
    <div style="display: flex; margin-top: 20px">
      <div class="masterMainItem">
        <div class="masterItem">
          <el-input
            style="width: 80px"
            type="number"
            v-model="masterSelf"
            :disabled="true"
            max="1000"
            min="100"
            @input="checkNumber"
          />
          <div class="masterTitle">本机</div>
        </div>
      </div>
      <div
        class="masterMainItem"
        v-for="(stepMaster, index) in stepMasters"
        :key="index"
      >
        <div class="masterSpan">→</div>
        <div class="masterItem">
          <el-input
            style="width: 80px"
            type="number"
            v-model="stepMaster.phoneNo"
            :class="stepMaster.border"
            max="1000"
            min="100"
            @blur="checkNumber(stepMaster, index)"
          />
          <div class="masterTitle">{{ stepMaster.title }}</div>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 20px">
      <span>上传时间限制为：</span>
      <el-select
        v-model="callWaitTime"
        style="width: 150px"
        placeholder="请选择"
      >
        <el-option
          v-for="item in callWaitTimeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <span style="color: red">提示：</span
    ><span>通过输入上级主机编号，可形成级别管理</span>

    <time-slot-settings
      ref="timeSlotSettingsRef"
      :cardName="timeSlotCardName"
      :timeSlotType="timeSlotType"
      style="margin-top: 20px"
    />
  </div>
</template>

<script>
import TimeSlotSettings from "../../components/timeSlotSettings.vue";
import {
  listStepMaster,
  updateStepMaster,
} from "@masterModule/api/stepMaster/stepMaster";
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
 * 上级主机禁止上传呼叫的时间段
 */
const TIME_SLOT_TYPE = 1;
export default {
  name: "stepMaster",
  components: { TimeSlotSettings },
  data() {
    return {
      timeSlotType: TIME_SLOT_TYPE,
      timeSlotCardName: "指定时间段禁止呼叫上传设置",
      masterSelf: "",
      stepMasters: [
        { title: "二级主机", phoneNo: null, level: 2, border: "normalBorder" },
        { title: "三级主机", phoneNo: null, level: 3, border: "normalBorder" },
        { title: "四级主机", phoneNo: null, level: 4, border: "normalBorder" },
        { title: "五级主机", phoneNo: null, level: 5, border: "normalBorder" },
        { title: "六级主机", phoneNo: null, level: 6, border: "normalBorder" },
      ],
      callWaitTime: 20,
      callWaitTimeOption: [
        { value: 0, label: "0秒" },
        { value: 10, label: "10秒" },
        { value: 20, label: "20秒（默认）" },
        { value: 30, label: "30秒" },
        { value: 40, label: "40秒" },
        { value: 50, label: "50秒" },
        { value: 60, label: "60秒" },
        { value: 70, label: "70秒" },
        { value: 80, label: "80秒" },
        { value: 90, label: "90秒" },
        { value: 100, label: "100秒" },
        { value: 110, label: "110秒" },
        { value: 120, label: "120秒" },
        { value: 130, label: "130秒" },
        { value: 140, label: "140秒" },
        { value: 150, label: "150秒" },
        { value: 160, label: "160秒" },
        { value: 170, label: "170秒" },
        { value: 180, label: "180秒" },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 100,
      },
      orgStepMasterList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
              if (item.masterType === STEP_MASTER_TYPE_SUPERIOR) {
                this.stepMasters[item.masterLevel - 2].phoneNo = item.masterNo;
                this.callWaitTime = item.callWaitTime;
              }
            });
          }
        }
      });
    },
    checkNumber(stepMaster, index) {
      let val = "";
      if (!isNaN(stepMaster.phoneNo)) {
        val = parseInt(stepMaster.phoneNo);
        val = val <= 100 ? 100 : val;
        val = val >= 1000 ? 999 : val;
      }
      stepMaster.phoneNo = val;
    },
    //提交前检查
    preCheck() {
      if (this.orgStepMasterList) {
        for (var o in this.stepMasters) {
          var stepMaster = this.stepMasters[o];
          if (!stepMaster.phoneNo) {
            stepMaster.border = "normalBorder";
            continue;
          }
          //检查是否与自身号码重复
          if (parseInt(stepMaster.phoneNo) === parseInt(this.masterSelf)) {
            this.msgError("上级主机不能是本机");
            stepMaster.border = "alarmBorder";
            return false;
          }
          //检查是否与托管主机或附加主机重复
          for (var i in this.orgStepMasterList) {
            var thatStepMaster = this.orgStepMasterList[i];
            if (
              thatStepMaster.masterType == STEP_MASTER_TYPE_APPEND ||
              thatStepMaster.masterType == STEP_MASTER_TYPE_TRUST
            ) {
              if (
                parseInt(stepMaster.phoneNo) ===
                parseInt(thatStepMaster.masterNo)
              ) {
                if (thatStepMaster.masterType == STEP_MASTER_TYPE_APPEND) {
                  this.msgError("上级主机不能是附加主机");
                  stepMaster.border = "alarmBorder";
                  return false;
                } else {
                  this.msgError("上级主机不能是托管主机");
                  stepMaster.border = "alarmBorder";
                  return false;
                }
              }
            }
          }
          stepMaster.border = "normalBorder";
        }
      }
      return true;
    },
    handleSubmit() {
      if (!this.preCheck()) {
        return;
      }
      let stepMasterList = [];
      this.stepMasters.forEach((item) => {
        if (item.phoneNo) {
          let tmp = {
            masterNo: item.phoneNo,
            masterLevel: item.level,
            callWaitTime: this.callWaitTime,
            masterType: STEP_MASTER_TYPE_SUPERIOR,
          };
          stepMasterList.push(tmp);
        }
      });
      updateStepMaster(stepMasterList, STEP_MASTER_TYPE_SUPERIOR).then(
        (res) => {
          if (res.code === 200) {
            this.msgSuccess("主机级别设置成功");
          } else {
            this.msgError("主机级别设置失败");
          }
        }
      );
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

