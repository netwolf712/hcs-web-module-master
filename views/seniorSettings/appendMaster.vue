<template>
  <div class="app-container">
    <div class="cardTitle">
      <span>附加主机设置</span>
      <el-button
        type="success"
        plain
        @click="handleAddStepMaster"
        style="margin-left: 10px"
        >添加附加主机</el-button
      >
      <el-button
        type="primary"
        plain
        @click="handleSubmit"
        style="margin-left: 10px"
        >保存设置</el-button
      >
    </div>
    <div>
      在设定的附加呼叫时间内，本机的直属分机呼叫未被接听，则会呼叫到附加主机上。开启呼叫上传后洗手间报警也会上传。
    </div>
    <div
      v-for="(stepMaster, index) in stepMasters"
      :key="index"
      class="appendMasterItem"
    >
      <span>附加主机编号：</span>
      <el-input
        style="width: 80px"
        type="number"
        v-model="stepMaster.masterNo"
        :class="stepMaster.border"
        max="1000"
        min="100"
        @blur="checkNumber(stepMaster, index)"
      />
      <span style="margin-left: 20px">附加呼叫时间：</span>
      <el-input
        style="width: 80px"
        type="number"
        v-model="stepMaster.callWaitTime"
        @blur="checkCallWaitTime(stepMaster)"
      /><span style="margin-left: 5px">秒（范围：0-240秒）</span>
      <el-button
        type="danger"
        style="float: right"
        icon="el-icon-delete"
        circle
        @click="handleDelete(index)"
      ></el-button>
    </div>
  </div>
</template>

<script>
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

export default {
  name: "appendMaster",
  data() {
    return {
      masterSelf: "",
      queryParams: {
        pageNum: 1,
        pageSize: 100,
      },
      orgStepMasterList: [],
      stepMasters: [],
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
              if (item.masterType === STEP_MASTER_TYPE_APPEND) {
                item.border = "normalBorder";
                this.stepMasters.push(item);
              }
            });
          }
        }
      });
    },
    checkNumber(stepMaster, index) {
      let val = "";
      if (!isNaN(stepMaster.masterNo)) {
        val = parseInt(stepMaster.masterNo);
        val = val <= 100 ? 100 : val;
        val = val >= 1000 ? 999 : val;
      }
      stepMaster.masterNo = val;
    },
    checkCallWaitTime(stepMaster) {
      let val = "";
      if (!isNaN(stepMaster.callWaitTime)) {
        val = parseInt(stepMaster.callWaitTime);
        val = val <= 0 ? 0 : val;
        val = val >= 240 ? 240 : val;
      }
      stepMaster.callWaitTime = val;
    },
    //提交前检查
    preCheck() {
      if (this.orgStepMasterList) {
        for (var o in this.stepMasters) {
          var stepMaster = this.stepMasters[o];
          if (!stepMaster.masterNo) {
            this.msgError("附加主机编号不能为空");
            stepMaster.border = "alarmBorder";
            return false;
          }
          //检查是否与自身号码重复
          if (parseInt(stepMaster.masterNo) === parseInt(this.masterSelf)) {
            this.msgError("附加主机不能是本机");
            stepMaster.border = "alarmBorder";
            return false;
          }
          //检查是否与托管主机或附加主机重复
          for (var i in this.orgStepMasterList) {
            var thatStepMaster = this.orgStepMasterList[i];
            if (
              thatStepMaster.masterType == STEP_MASTER_TYPE_SUPERIOR ||
              thatStepMaster.masterType == STEP_MASTER_TYPE_TRUST
            ) {
              if (
                parseInt(stepMaster.masterNo) ===
                parseInt(thatStepMaster.masterNo)
              ) {
                if (thatStepMaster.masterType == STEP_MASTER_TYPE_SUPERIOR) {
                  this.msgError("附加主机不能是上级主机");
                  stepMaster.border = "alarmBorder";
                  return false;
                } else {
                  this.msgError("附加主机不能是托管主机");
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
        this.$forceUpdate();
        return;
      }
      this.$forceUpdate();
      updateStepMaster(this.stepMasters, STEP_MASTER_TYPE_APPEND).then(
        (res) => {
          if (res.code === 200) {
            this.msgSuccess("附加主机设置成功");
          } else {
            this.msgError("附加主机设置失败");
          }
        }
      );
    },
    handleAddStepMaster() {
      let tmp = {
        masterType: STEP_MASTER_TYPE_APPEND,
        masterNo: "",
        callWaitTime: 30,
        masterLevel: 0,
      };
      this.stepMasters.push(tmp);
    },
    handleDelete(index) {
      this.stepMasters.splice(index, 1);
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
.appendMasterItem {
  margin-top: 20px;
  border: 1px solid;
  padding: 10px;
  border-radius: 10px;
  width: 700px;
}
</style>

