<template>
  <div>
    <div>
      <span>启 用：</span>
      <el-checkbox v-model="state" @change="handleStateChange"></el-checkbox>
      <el-button
        type="danger"
        style="float: right"
        icon="el-icon-delete"
        circle
        @click="handleDelete"
      ></el-button>
    </div>
    <div class="columnSpan">
      <span>时间范围：</span
      ><el-time-picker
        is-range
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
        v-model="timePicker"
        format="HH:mm:ss"
        @change="handleTimeSpanChange"
      >
      </el-time-picker>
    </div>
    <div class="columnSpan">
      <span>执行周期：</span>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="allPeriod"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <el-checkbox-group
        class="columnSpan"
        v-model="periodList"
        @change="handleCheckedPeriodsChange"
      >
        <el-checkbox
          v-for="dict in periodOptions"
          :label="dict.value"
          :key="dict.value"
          >{{ dict.label }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
/**
 * 一小时的毫秒数
 */
const HOUR_MILLISECOND = 3600000;
/**
 * 一分钟的毫秒数
 */
const MINUTE_MILLISECOND = 60000;
/**
 * 用固定的年月日来生成date
 */
const THE_YEAR = 2022;
const THE_MONTH = 9;
const THE_DAY = 6;
export default {
  name: "timeSlotSettings",
  components: {},
  props: {
    //时间段类型
    timeSlot: {
      type: Object,
      default: function () {
        return {
          startTime: 10810000,
          endTime: 10840000,
          period: "0,1,2,3,4,5,6,7",
          state: 1,
          type: 1,
        };
      },
    },
    cardIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      periodOptions: [
        { value: "0", label: "周日" },
        { value: "1", label: "周一" },
        { value: "2", label: "周二" },
        { value: "3", label: "周三" },
        { value: "4", label: "周四" },
        { value: "5", label: "周五" },
        { value: "6", label: "周六" },
      ],
      isIndeterminate: true,
      allPeriod: true,
      periodList: [],
      timePicker: [],
      state: 0,
    };
  },
  created() {
    this.convertTimeSlot();
  },
  watch: {
    timeSlot(newValue) {
      this.convertTimeSlot();
    },
  },
  methods: {
    /**
     * 将小时的时间段格式转换成date
     */
    timeFormater(timeStamp) {
      let hour = Math.trunc(timeStamp / HOUR_MILLISECOND);
      timeStamp %= HOUR_MILLISECOND;
      let minute = Math.trunc(timeStamp / MINUTE_MILLISECOND);
      return new Date(THE_YEAR, THE_MONTH, THE_DAY, hour, minute);
    },
    /**
     * 将timeSlot里的时间转换为timePicker
     */
    convertTimeSlot() {
      this.state = this.timeSlot.state === 1 ? true : false;
      let tmp = [
        this.timeFormater(this.timeSlot.startTime),
        this.timeFormater(this.timeSlot.endTime),
      ];
      this.timePicker = tmp;
      if (this.timeSlot.period) {
        this.periodList = this.timeSlot.period.split(",");
      } else {
        this.periodList = [];
      }
      if (this.timeSlot.period === "0,1,2,3,4,5,6,7") {
        this.allPeriod = true;
      } else {
        this.allPeriod = false;
      }
    },
    handleCheckAllChange(value) {
      if (value) {
        this.timeSlot.period = "0,1,2,3,4,5,6";
        this.periodList = ["0", "1", "2", "3", "4", "5", "6"];
      } else {
        this.timeSlot.period = "";
        this.periodList = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedPeriodsChange(value) {
      let checkedCount = value.length;
      this.allPeriod = checkedCount === this.periodOptions.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.periodOptions.length;
      let period = "";
      if (checkedCount > 0) {
        value.sort(function (a, b) {
          return a - b;
        });
        value.forEach((item, index) => {
          if (index > 0) {
            period += ",";
          }
          period += item;
        });
      }
      this.timeSlot.period = period;
    },
    handleStateChange(val) {
      this.timeSlot.state = val ? 1 : 0;
    },
    handleTimeSpanChange(val) {
      let startTime = val[0];
      let endTime = val[1];
      this.timeSlot.startTime =
        startTime.getHours() * HOUR_MILLISECOND +
        startTime.getMinutes() * MINUTE_MILLISECOND;
      this.timeSlot.endTime =
        endTime.getHours() * HOUR_MILLISECOND +
        endTime.getMinutes() * MINUTE_MILLISECOND;
    },
    handleDelete() {
      this.$emit("onDeleteTimeSlot", this.cardIndex);
    },
  },
};
</script>
<style scoped>
.columnSpan {
  margin: 5px 0;
}
</style>

