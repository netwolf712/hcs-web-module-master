<template>
  <div>
    <el-card class="box-card-network">
      <div slot="header" class="clearfix">
        <span class="card-title">{{ cardName }}</span>
        <el-button
          v-if="!readOnly"
          style="float: right; padding: 3px 0"
          type="text"
          @click="dialogVisible = true"
          >修改</el-button
        >
      </div>
      <div class="text item">
        本机编号：<el-input
          style="width: 80px"
          type="number"
          v-model="deviceInfo.device.phoneNo"
          :disabled="readOnly"
          placeholder="本机编号"
          max="1000"
          min="100"
          @input="checkNumber"
        />
      </div>
      <div class="text item">
        交互服务器地址：<ip-address
          ref="ipAddress"
          :canInput="!readOnly"
          :ipAddressStr="deviceInfo.serviceAddress"
          :onAddressChange="changeServerAddress"
        />
      </div>
      <div class="text item">
        一键呼叫的号码：<el-input
          v-model="deviceInfo.directCallNo"
          :disabled="readOnly"
          placeholder="一键呼叫的号码"
          style="width: 180px"
        />
      </div>
    </el-card>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" center>
      <span>修改基本配置需要重启应用才能正式生效。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import IpAddress from "@maintainModule/components/ipAddress.vue";
import {
  getDeviceInfo,
  updateDeviceInfo,
} from "@masterModule/api/base/baseInfo";
export default {
  name: "BaseSetttings",
  components: {
    IpAddress,
  },
  props: {
    cardName: {
      type: String,
      default: "基础设置",
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
    //是否自动装载
    autoLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      deviceInfo: {
        //本机号码
        device: {
          phoneNo: "",
        },
        //交互服务器地址
        serviceAddress: "",
        //一键呼叫号码
        directCallNo: "",
      },
      //是否弹出提示框
      dialogVisible: false,
    };
  },
  watch: {
    autoLoad(isAutoLoad) {
      if (isAutoLoad) {
        this.getInfo();
      }
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getDeviceInfo().then((res) => {
        if (res.code === 200) {
          this.deviceInfo = res.data;
        } else {
          this.msgError(res.msg);
        }
      });
    },
    changeServerAddress(ipAddress) {
      this.msgSuccess("交互服务器地址改变 ==> " + ipAddress);
      this.deviceInfo.serviceAddress = ipAddress;
    },
    checkNumber(val) {
      if (isNaN(val)) {
        val = "";
      } else {
        val = val <= 100 ? 100 : val;
        val = val >= 1000 ? 999 : val;
      }
      this.deviceInfo.device.phoneNo = val;
    },
    doSubmit() {
      this.deviceInfo.serviceAddress = this.$refs.ipAddress.convertIPToStr();
      updateDeviceInfo(this.deviceInfo)
        .then((res) => {
          this.dialogVisible = false;
          if (res.code == 200) {
            this.msgSuccess("修改成功");
            // this.$modal.loading("应用重启中，请稍候！");
            // //5秒后跳转到新修改的地址
            // setTimeout(() => {
            //   this.$modal.closeLoading();
            //   window.location.href = "";
            // }, 5000);
          } else {
            this.msgError(res.msg ? res.msg : "修改失败");
          }
        })
        .catch((error) => {
          this.dialogVisible = false;
          //this.msgError(error);
        });
    },
  },
};
</script>
<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card-network {
  width: 100%;
}
.card-title {
  font-size: 18px;
  font-weight: bold;
}
</style>

