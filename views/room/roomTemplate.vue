<template>
  <div class="app-container">
    <div class="cardTitle">
      <span>病房门口屏设置</span>
      <el-button
        type="primary"
        plain
        @click="handleSubmit"
        style="margin-left: 10px"
        >保存设置</el-button
      >
    </div>
    <el-tabs v-model="tabsActiveName" type="card">
      <el-tab-pane label="显示风格" name="tab1">
        <div style="margin-bottom: 10px">
          <el-radio-group
            v-model="templateConfig.themeId"
            @change="handleStyleChange"
          >
            <el-radio
              v-for="dict in themeOptions"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </div>
        <el-image
          style="width: 400px; height: 100%"
          :src="templateUrl"
        ></el-image>
      </el-tab-pane>      
      <el-tab-pane label="屏保" name="tab3">
        <div class="text item">
          <span>屏保内容：</span>
          <el-input
            style="width: 400px"
            v-model="templateConfig.screenSaver"
            placeholder="屏保显示内容"
          />
        </div>
        <div class="text item">
          <span>屏保时间：</span>
          <el-input
            style="width: 80px"
            type="number"
            v-model="templateConfig.screenSaverTime"
          /><span style="margin-left: 5px">秒</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="功能列表" name="tab4"
        ><el-row>
          <el-col style="width: 150px">
            <el-card class="box-card-room-template">
              <div slot="header" class="clearfix">
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="allFunction"
                  @change="handleCheckAllChange"
                  >全部功能</el-checkbox
                >
              </div>
              <el-checkbox-group
                class="columnSpan"
                v-model="rightCheckedValue"
                @change="handleCheckedFunctionChange"
              >
                <div
                  class="text item"
                  v-for="(functionBo, index) in orgFunctionList"
                  :key="index"
                >
                  <el-checkbox
                    :label="functionBo.functionId"
                    :key="functionBo.functionId"
                    >{{ functionBo.functionName }}</el-checkbox
                  >
                </div>
              </el-checkbox-group>
            </el-card>
          </el-col>
          <el-col style="width: 580px; margin-left: 10px">
            <el-card class="box-card-room-template">
              <div slot="header" class="clearfix">
                <span>已选功能</span>
              </div>
              <el-table :data="templateConfig.functionList" style="width: 100%">
                <el-table-column prop="orgName" label="功能名称" width="160" />
                <el-table-column
                  prop="functionName"
                  label="显示名称"
                  width="160"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.functionName" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button
                      @click="handleMoveUp(scope.row)"
                      type="text"
                      size="small"
                      >上移</el-button
                    >
                    <el-button
                      @click="handleMoveDown(scope.row)"
                      type="text"
                      size="small"
                      >下移</el-button
                    >
                    <el-button
                      type="text"
                      size="small"
                      @click="handleDelete(scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row></el-tab-pane
      >
    </el-tabs>
  </div>
</template>

<script>
import {
  listRoomFunction,
  getRoomTemplate,
  updateRoomTemplate,
} from "@masterModule/api/room/room";
/**
 * 无效功能
 */
const FUNCTION_NONE_ID = 999;
export default {
  name: "roomTemplate",
  data() {
    return {
      // 遮罩层
      loading: true,
      //模板id
      templateId: "0",
      templateUrl: require("@masterModule/assets/images/room_style_0.jpg"),
      //模板选项
      themeOptions: [
        { value: 0, label: "默认风格" },
        { value: 1, label: "风格二" },
      ],
      //模板配置
      templateConfig: {
        //模板id
        templateId: "",
        //屏保提示语
        screenSaver: "",
        //屏保触发时间
        screenSaverTime: null,
        //息屏时间
        screenShutTime: null,
        //功能列表
        functionList: [],
        //主题（风格）
        themeId: 0,
      },
      //原始功能列表
      orgFunctionList: [],
      //右侧选择的内容
      rightCheckedValue: [],
      isIndeterminate: false,
      //是否所以功能全选中
      allFunction: false,
      //tabs控件默认显示的tab
      tabsActiveName: "tab1",
    };
  },
  created() {
    this.getFunctionList();
  },
  methods: {
    renderFunc(h, option) {
      return <span>{option.label}</span>;
    },
    /**
     * 获取原始功能列表
     */
    getFunctionList() {
      listRoomFunction().then((res) => {
        if (res.code === 200) {
          this.orgFunctionList = res.data.list;
          this.transferLeftData = [];
          if (this.orgFunctionList) {
            this.orgFunctionList.forEach((item, index) => {
              if (parseInt(item.functionId) != FUNCTION_NONE_ID) {
                let tmp = { key: item.functionId, label: item.functionName };
                this.transferLeftData.push(tmp);
              } else {
                this.orgFunctionList.splice(index, 1);
              }
            });
          }
          this.getTemplate();
        }
      });
    },
    /**
     * 获取模板内容
     */
    getTemplate() {
      getRoomTemplate(this.templateId).then((res) => {
        if (res.code === 200) {
          this.templateConfig = res.data;
          if (this.templateId == null) {
            this.templateId = this.templateConfig.templateId;
          }
          this.rightCheckedValue = [];
          if (this.templateConfig.functionList) {
            this.templateConfig.functionList.forEach((item) => {
              this.rightCheckedValue.push(item.functionId);
              let orgItem = this.orgFunctionList.find((val) => {
                return val.functionId === item.functionId;
              });
              if (orgItem) {
                item.orgName = orgItem.functionName;
              } else {
                item.orgName = item.functionName;
              }
            });
            if (
              this.templateConfig.functionList.length ==
              this.orgFunctionList.length
            ) {
              this.allFunction = true;
              this.isIndeterminate = false;
            } else {
              this.allFunction = false;
              this.isIndeterminate = true;
            }
          } else {
            this.allFunction = false;
            this.isIndeterminate = false;
          }
        }
        this.handleStyleChange()
      });
    },
    /**
     * 风格改变
     */
    handleStyleChange() {
      if (this.templateConfig.themeId === 0) {
        this.templateUrl = require("@masterModule/assets/images/room_style_0.jpg");
      } else if (this.templateConfig.themeId === 1) {
        this.templateUrl = require("@masterModule/assets/images/room_style_1.jpg");
      } 
    },

    moveList(arr, index1, index2) {
      let data1 = arr[index1];
      let data2 = arr[index2];
      arr.splice(index2, 1, data1);
      arr.splice(index1, 1, data2);
      return arr;
    },
    upData(arr, index) {
      if (arr.length > 1 && index !== 0) {
        this.moveList(arr, index, index - 1);
      }
    },
    downData(arr, index) {
      if (arr.length > 1 && index !== arr.length - 1) {
        this.moveList(arr, index, index + 1);
      }
    },

    /**
     * 向上移动
     */
    handleMoveUp(row) {
      if (this.templateConfig.functionList) {
        for (let i in this.templateConfig.functionList) {
          if (
            this.templateConfig.functionList[i].functionId === row.functionId
          ) {
            this.upData(this.templateConfig.functionList, parseInt(i));
            break;
          }
        }
      }
    },
    /**
     * 向下移动
     */
    handleMoveDown(row) {
      if (this.templateConfig.functionList) {
        for (let i in this.templateConfig.functionList) {
          if (
            this.templateConfig.functionList[i].functionId === row.functionId
          ) {
            this.downData(this.templateConfig.functionList, parseInt(i));
            break;
          }
        }
      }
    },
    /**
     * 删除功能
     */
    handleDelete(row) {
      if (this.templateConfig.functionList) {
        for (let i in this.templateConfig.functionList) {
          if (
            this.templateConfig.functionList[i].functionId === row.functionId
          ) {
            this.templateConfig.functionList.splice(i, 1);
            break;
          }
        }
      }
      if (this.rightCheckedValue) {
        for (let i in this.rightCheckedValue) {
          if (this.rightCheckedValue[i] === row.functionId) {
            this.rightCheckedValue.splice(i, 1);
            this.allFunction = false;
            if (this.rightCheckedValue.length > 0) {
              this.isIndeterminate = true;
            }
            break;
          }
        }
      }
    },
    /**
     * 全选按钮
     */
    handleCheckAllChange(value) {
      if (value) {
        this.rightCheckedValue = [];
        this.templateConfig.functionList = [];
        for (let i in this.orgFunctionList) {
          this.rightCheckedValue.push(this.orgFunctionList[i].functionId);
          let tmp = {
            functionId: this.orgFunctionList[i].functionId,
            functionName: this.orgFunctionList[i].functionName,
            orgName: this.orgFunctionList[i].functionName,
          };
          this.templateConfig.functionList.push(tmp);
        }
      } else {
        this.rightCheckedValue = [];
        this.templateConfig.functionList = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedFunctionChange(values) {
      let checkedCount = values.length;
      this.allFunction = checkedCount === this.orgFunctionList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.orgFunctionList.length;
      let tmpList = [];
      if (checkedCount > 0) {
        if (this.templateConfig.functionList) {
          for (let i in this.templateConfig.functionList) {
            for (let j in values) {
              if (
                this.templateConfig.functionList[i].functionId === values[j]
              ) {
                tmpList.push(this.templateConfig.functionList[i]);
                break;
              }
            }
          }
        }
        for (let i in values) {
          let alreadyIn = false;
          for (let j in tmpList) {
            if (values[i] === tmpList[j].functionId) {
              alreadyIn = true;
              break;
            }
          }
          if (!alreadyIn) {
            for (let k in this.orgFunctionList) {
              if (this.orgFunctionList[k].functionId === values[i]) {
                let tmp = {
                  functionId: this.orgFunctionList[k].functionId,
                  functionName: this.orgFunctionList[k].functionName,
                  orgName: this.orgFunctionList[k].functionName,
                };
                tmpList.push(tmp);
                break;
              }
            }
          }
        }
      }
      this.templateConfig.functionList = tmpList;
    },
    handleSubmit() {
      updateRoomTemplate(this.templateConfig).then((res) => {
        if (res.code === 200) {
          this.msgSuccess("操作成功");
        } else {
          this.msgError("操作失败");
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
  margin-bottom: 10px;
  margin-top: 15px;
}
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
.box-card-room-template {
  width: 100%;
}
.card-title {
  font-size: 18px;
  font-weight: bold;
}
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
</style>
