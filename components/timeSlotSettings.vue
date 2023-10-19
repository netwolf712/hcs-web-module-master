<template>
  <div>
    <div class="cardTitle">
      <span>{{ cardName }}</span>
      <el-button
        type="success"
        plain
        @click="handleAddTimeSlot"
        style="margin-left: 10px"
        >添加时段</el-button
      >
      <el-button
        v-if="saveBySelf"
        type="primary"
        plain
        @click="handleSubmit"
        style="margin-left: 10px"
        >保存设置</el-button
      >
    </div>
    <div
      v-for="(timeSlot, index) in timeSlotList"
      :key="index"
      class="timeSlotItem"
    >
      <time-slot-card
        :timeSlot="timeSlot"
        :cardIndex="index"
        @onDeleteTimeSlot="handleDelTimeSlot"
      />
    </div>
  </div>
</template>

<script>
import {
  listTimeSlot,
  updateTimeSlot,
} from "@masterModule/api/stepMaster/timeSlot";
import TimeSlotCard from "./timeSlotCard.vue";

export default {
  name: "timeSlotSettings",
  components: { TimeSlotCard },
  props: {
    //卡片名称
    cardName: {
      type: String,
      default: "卡片名称",
    },
    //时间段类型
    timeSlotType: {
      type: Number,
      default: 0,
    },
    //自己提供保存功能
    saveBySelf: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      timeSlotList: [
        // {
        //   startTime: 7200000,
        //   endTime: 10800000,
        //   period: "1,2,3",
        //   state: 1,
        // },
        // {
        //   startTime: 11400000,
        //   endTime: 12000000,
        //   period: "0,1,2,3,4,5,6,7",
        //   state: 1,
        // },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 100,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      listTimeSlot(
        this.queryParams.pageNum,
        this.queryParams.pageSize,
        this.timeSlotType
      ).then((res) => {
        if (res.code === 200) {
          this.timeSlotList = res.data.list;
        }
      });
    },
    handleAddTimeSlot() {
      let timeSlot = {
        startTime: 32400000,
        endTime: 36000000,
        period: "0,1,2,3,4,5,6,7",
        state: 1,
        type: this.timeSlotType,
      };
      this.timeSlotList.push(timeSlot);
    },
    handleDelTimeSlot(cardIndex) {
      this.timeSlotList.splice(cardIndex, 1);
    },
    handleSubmit() {
      updateTimeSlot(this.timeSlotList, this.timeSlotType).then((res) => {
        if (this.saveBySelf) {
          if (res.code === 200) {
            this.msgSuccess("时间段修改成功");
          } else {
            this.msgError("时间段修改失败");
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.cardTitle {
  font-size: 18px;
  font-weight: bold;
}
.timeSlotItem {
  margin-top: 20px;
  border: 1px solid;
  padding: 10px;
  border-radius: 10px;
  width: 600px;
}
</style>

