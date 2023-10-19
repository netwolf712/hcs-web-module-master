<template>
  <div class="app-container">
    <div class="cardTitle">
      <span>增援主机设置</span>
      <el-button
        type="success"
        plain
        @click="handleAddStepMaster"
        style="margin-left: 10px"
        >添加增援主机</el-button
      >
      <el-button
        type="primary"
        plain
        @click="handleSubmit"
        style="margin-left: 10px"
        >保存设置</el-button
      >
    </div>
    <el-row>
      <el-col
        :span="2"
        v-for="(stepMaster, index) in stepMasters"
        :key="index"
        class="reinforceMasterItem"
      >
        <span>增援主机编号：</span>
        <el-input
          style="width: 80px"
          type="number"
          v-model="stepMaster.masterNo"
          :class="stepMaster.border"
          max="1000"
          min="100"
          @blur="checkNumber(stepMaster, index)"
        />
        <el-button
          type="danger"
          style="float: right"
          icon="el-icon-delete"
          circle
          @click="handleDelete(index)"
        ></el-button>
      </el-col>
    </el-row>
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
              if (item.masterType === STEP_MASTER_TYPE_REINFORCE) {
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
    //提交前检查
    preCheck() {
      if (this.orgStepMasterList) {
        for (var o in this.stepMasters) {
          var stepMaster = this.stepMasters[o];
          if (!stepMaster.masterNo) {
            this.msgError("增援主机编号不能为空");
            stepMaster.border = "alarmBorder";
            return false;
          }
          //检查是否与自身号码重复
          if (parseInt(stepMaster.masterNo) === parseInt(this.masterSelf)) {
            this.msgError("增援主机不能是本机");
            stepMaster.border = "alarmBorder";
            return false;
          }
          //检查是否与托管主机或附加主机重复
          for (var i in this.stepMasters) {
            var thatStepMaster = this.stepMasters[i];
            if (
              i != o &&
              thatStepMaster.masterType === STEP_MASTER_TYPE_REINFORCE &&
              parseInt(thatStepMaster.masterNo) ===
                parseInt(stepMaster.masterNo)
            ) {
              this.msgError("主机编号已存在");
              stepMaster.border = "alarmBorder";
              return false;
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
      updateStepMaster(this.stepMasters, STEP_MASTER_TYPE_REINFORCE).then(
        (res) => {
          if (res.code === 200) {
            this.msgSuccess("增援主机设置成功");
          } else {
            this.msgError("增援主机设置失败");
          }
        }
      );
    },
    handleAddStepMaster() {
      let tmp = {
        masterType: STEP_MASTER_TYPE_REINFORCE,
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
.reinforceMasterItem {
  margin-top: 20px;
  border: 1px solid;
  padding: 10px;
  border-radius: 10px;
  width: 300px;
  margin-right: 10px;
}
</style>

