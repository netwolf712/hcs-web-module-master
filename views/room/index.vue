<template>
  <div class="app-container">
    <el-row>
      <el-col
        :span="2"
        style="margin: 1px"
        v-for="(o, index) in list"
        :key="index"
        :offset="0"
      >
        <el-card
          :body-style="{ padding: '1px', height: '80px', color: '#757679' }"
        >
          <div>
            <span>{{ o.place.placeSn }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleView(o)"
              icon="el-icon-edit"
            ></el-button>
            <div class="bottom clearfix">
              <span>{{ o.place.placeNo }}号病房</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  
  </div>
</template>

<script>
import { list } from "@masterModule/api/place/place";
export default {
  name: "roomList",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: { prop: "operTime", order: "descending" },
      // 表单参数
      form: {
        place: {
          placeSn: 0,
          placeNo: 0,
        },
      
      },
     
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 120,
        placeType: 2,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 病床列表 */
    getList() {
      list(
        this.queryParams.pageNum,
        this.queryParams.pageSize,
        this.queryParams.placeType
      ).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.list = res.data.list;
        } else {
          this.msgError(res.msg);
        }
        this.loading = false;
      });

    },
    deviceInfoFormat(row, column) {
      if (row.deviceModelList) {
        var deviceModel = row.deviceModelList[0];
        if (deviceModel) {
          return deviceModel.device.deviceId;
        }
      }
      return "";
    },
    deviceStateFormat(row) {
      if (row.deviceModelList) {
        var deviceModel = row.deviceModelList[0];
        if (deviceModel) {
          if ("UNKNOWN" === deviceModel.state || !deviceModel.state) {
            return "未知";
          } else if ("OFFLINE" === deviceModel.state) {
            return "离线";
          } else if ("ONLINE" === deviceModel.state) {
            return "在线";
          } else if ("TALKING" === deviceModel.state) {
            return "通话中";
          } else if ("CALLING" === deviceModel.state) {
            return "呼叫中";
          } else if ("CALL_END" === deviceModel.state) {
            return "呼叫结束";
          } else if ("REQ_CONFIG" === deviceModel.state) {
            return "请求配置";
          } else if ("INIT" === deviceModel.state) {
            return "初始化中";
          }
        }
      }
      return "";
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.operId);
      this.multiple = !selection.length;
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form.place = row.place;
    },

 
    /**
     * 将选中的id转换为字符串形式
     */
    convertCheckedIdToStr(checkedIds) {
      let str = "";
      if (checkedIds) {
        checkedIds.forEach((id, index) => {
          if (index > 0) {
            str += ",";
          }
          str += id;
        });
      }
      return str;
    },
    /**
     * 将字符串转换为选中的id
     */
    convertStrToCheckedId(str) {
      let checkedId = [];
      if (str) {
        let ids = str.split(",");
        ids.forEach((id) => {
          checkedId.push(parseInt(id));
        });
      }
      return checkedId;
    },
  },
};
</script>

