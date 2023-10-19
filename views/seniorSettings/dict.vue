<template>
  <div class="app-container">
    <div>
      <el-button type="success" plain @click="handleAdd"
        >添加字典元素</el-button
      >
      <el-button
        type="primary"
        plain
        @click="handleSubmit"
        style="margin-righ: 10px"
        >保存设置</el-button
      >
      <el-tabs v-model="tabsActiveName" type="card" style="margin-top: 10px">
        <el-tab-pane
          :label="tabItem.label"
          :name="tabItem.key"
          v-for="(tabItem, index) in tabOptions"
          :key="index"
        >
          <el-table :data="tabItem.dicts" style="width: 100%">
            <el-table-column prop="dictValue" label="字典值" width="180">
              <template slot-scope="scope">
                <el-input
                  style="width: 60px"
                  type="number"
                  v-model="scope.row.dictValue"
                  :class="{ dictAlarmBorder: scope.row.dictValueBorder }"
                />
              </template>
            </el-table-column>
            <el-table-column prop="displayName" label="显示名称">
              <template slot-scope="scope">
                <el-input
                  style="width: 180px"
                  v-model="scope.row.displayName"
                  :class="{ dictAlarmBorder: scope.row.displayNameBorder }"
                />
              </template>
            </el-table-column>
            <el-table-column prop="backgroundColor" label="背景颜色">
              <template slot-scope="scope">
                <el-color-picker
                  :show-alpha="colorPickerShowAlpha"
                  v-model="scope.row.backgroundColorHex"
                  @change="changeBackgroundColor(scope.row)"
                />
              </template>
            </el-table-column>

            <el-table-column prop="textColor" label="字体颜色">
              <template slot-scope="scope">
                <el-color-picker
                  :show-alpha="colorPickerShowAlpha"
                  v-model="scope.row.textColorHex"
                  @change="changeTextColor(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序"> </el-table-column>
            <el-table-column label="样例">
              <template slot-scope="scope">
                <el-tag
                  :color="scope.row.backgroundColorHex"
                  effect="dark"
                  :style="{ color: scope.row.textColorHex }"
                >
                  {{ scope.row.displayName }}
                </el-tag>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { listDict, updateDict } from "@masterModule/api/dict/dict";
/**
 * 字典键值
 * 性别
 */
const DICT_KEY_SEX = "sex";

/**
 * 字典键值
 * 计量
 */
const DICT_KEY_METERING = "metering";

/**
 * 字典键值
 * 护理等级
 */
const DICT_KEY_NURSING_LEVEL = "nursing_level";

/**
 * 字典键值
 * 危重类型
 */
const DICT_KEY_CRITICAL_TYPE = "critical_type";

/**
 * 字典键值
 * 饮食
 */
const DICT_KEY_DIET = "diet";

/**
 * 字典键值
 * 过敏
 */
const DICT_KEY_ALLERGY = "allergy";

/**
 * 字典键值
 * 保险类型
 */
const DICT_KEY_MEDICAL_INSURANCE_TYPE = "medical_insurance_type";

/**
 * 字典键值
 * 血型
 */
const DICT_KEY_BLOOD_TYPE = "blood_type";

/**
 * 字典键值
 * 防护类型
 */
const DICT_KEY_PROTECTION = "protection";

/**
 * 字典键值
 * 分机位置
 */
const DICT_KEY_SLAVE_PLACE = "slave_place";

export default {
  name: "Config",
  data() {
    return {
      //字典列表
      //字典数据
      dictData: {
        //性别
        sexDictList: [],
        //计量
        meteringDictList: [],
        //护理级别
        nursingLevelDictList: [],
        //危重类型
        criticalTypeDictList: [],
        //饮食类型
        dietDictList: [],
        //过敏类型
        allergyDictList: [],
        //医保类型
        medicalInsuranceTypeDictList: [],
        //防护类型字典
        protectionDictList: [],
        //血型字典
        bloodTypeDictList: [],
        //位置
        placeDictList: [],
      },
      //tabs控件默认显示的tab
      tabsActiveName: DICT_KEY_SEX,
      //标签页枚举
      tabOptions: [
        { key: DICT_KEY_SEX, label: "性别", dicts: [] },
        { key: DICT_KEY_METERING, label: "计量", dicts: [] },
        { key: DICT_KEY_NURSING_LEVEL, label: "护理等级", dicts: [] },
        { key: DICT_KEY_CRITICAL_TYPE, label: "危重类型", dicts: [] },
        { key: DICT_KEY_DIET, label: "饮食", dicts: [] },
        { key: DICT_KEY_ALLERGY, label: "过敏", dicts: [] },
        { key: DICT_KEY_MEDICAL_INSURANCE_TYPE, label: "保险类型", dicts: [] },
        { key: DICT_KEY_BLOOD_TYPE, label: "血型", dicts: [] },
        { key: DICT_KEY_PROTECTION, label: "防护类型", dicts: [] },
        { key: DICT_KEY_SLAVE_PLACE, label: "分机位置", dicts: [] },
      ],
      //是否显示透明通道
      colorPickerShowAlpha: true,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      listDict().then((res) => {
        if (res.code === 200) {
          this.dictData = res.data;
          this.tabOptions.forEach((item) => {
            item.dicts = this.getDictsByKey(item.key);
            item.dicts.forEach((item2) => {
              item2.dictValueBorder = false;
              item2.displayNameBorder = false;
              item2.textColorHex = this.formatHexToRgba(
                this.formatColorToHex(item2.textColor)
              );
              item2.backgroundColorHex = this.formatHexToRgba(
                this.formatColorToHex(item2.backgroundColor)
              );
            });
          });
        }
      });
    },
    /**
     * 根据键值获取字典集
     */
    getDictsByKey(key) {
      switch (key) {
        case DICT_KEY_SEX:
          return this.dictData.sexDictList;
        case DICT_KEY_METERING:
          return this.dictData.meteringDictList;
        case DICT_KEY_NURSING_LEVEL:
          return this.dictData.nursingLevelDictList;
        case DICT_KEY_CRITICAL_TYPE:
          return this.dictData.criticalTypeDictList;
        case DICT_KEY_DIET:
          return this.dictData.dietDictList;
        case DICT_KEY_ALLERGY:
          return this.dictData.allergyDictList;
        case DICT_KEY_MEDICAL_INSURANCE_TYPE:
          return this.dictData.medicalInsuranceTypeDictList;
        case DICT_KEY_BLOOD_TYPE:
          return this.dictData.bloodTypeDictList;
        case DICT_KEY_PROTECTION:
          return this.dictData.protectionDictList;
        case DICT_KEY_SLAVE_PLACE:
          return this.dictData.placeDictList;
      }
    },
    /**
     * 提交前预检查
     */
    preCheck() {
      let tmpList = [];
      for (let i in this.tabOptions) {
        let tabItem = this.tabOptions[i];
        for (let j in tabItem.dicts) {
          let dict = tabItem.dicts[j];
          if (!dict.dictValue && dict.dictValue != 0) {
            dict.dictValueBorder = true;
            this.myUpdateForce(dict);
            this.msgError("字典值不能为空");
            return false;
          } else {
            if (dict.dictValueBorder) {
              //如果之前是告警，后面又切换回来了，需要强制刷新一下
              dict.dictValueBorder = false;
              this.myUpdateForce(dict);
            }
          }
          if (!dict.displayName) {
            dict.displayNameBorder = true;
            this.myUpdateForce(dict);
            this.msgError("字典名称不能为空");
            return false;
          } else {
            if (dict.dictValueBorder) {
              //如果之前是告警，后面又切换回来了，需要强制刷新一下
              dict.displayNameBorder = false;
              this.myUpdateForce(dict);
            }
          }
          let tmp = {
            uid: dict.uid,
            dictType: dict.dictType,
            dictValue: dict.dictValue,
            displayName: dict.displayName,
            sort: dict.sort,
            backgroundColor: this.formatHexToColor(
              this.formatRGBAToHex(dict.backgroundColorHex)
            ),
            textColor: this.formatHexToColor(
              this.formatRGBAToHex(dict.textColorHex)
            ),
            icon: dict.icon,
          };
          tmpList.push(tmp);
        }
      }
      return tmpList;
    },
    handleSubmit() {
      let dictList = this.preCheck();
      //this.$forceUpdate();
      if (dictList) {
        updateDict(dictList).then((res) => {
          if (res.code === 200) {
            this.msgSuccess("更新成功");
          } else {
            this.msgError("更新失败");
          }
        });
      }
    },
    /**
     * 将RGBA格式的数据转为16进制
     */
    formatRGBAToHex(color) {
      let values = color
        .replace(/rgba?\(/, "")
        .replace(/\)/, "")
        .replace(/[\s+]/g, "")
        .split(",");
      let a = parseFloat(values[3] || 1) * 255;
      let r = parseInt(values[0] || 255);
      let g = parseInt(values[1] || 255);
      let b = parseInt(values[2] || 255);
      return (
        "#" +
        ("0" + a.toString(16)).slice(-2) +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2)
      );
    },
    /**
     * 将16进制转为RGBA格式
     */
    formatHexToRgba(hStr) {
      let hex = hStr.split("");
      let a = parseInt(hex.slice(1, 3).toString().replace(",", ""), 16);
      a = isNaN(a) ? 255 : a;
      let r = parseInt(hex.slice(3, 5).toString().replace(",", ""), 16);
      r = isNaN(r) ? 255 : r;
      let g = parseInt(hex.slice(5, 7).toString().replace(",", ""), 16);
      g = isNaN(g) ? 255 : g;
      let b = parseInt(hex.slice(7, 9).toString().replace(",", ""), 16);
      b = isNaN(b) ? 255 : b;
      let opacity = parseFloat(parseFloat(a) / parseFloat(255)).toFixed(2);
      return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
    },
    /**
     * 将10进制的ARGB转换为16进制的
     */
    formatColorToHex(color) {
      let v = "#" + parseInt(color).toString(16);
      return v;
    },
    /**
     *将16进制的ARGB转换为10进制的
     */
    formatHexToColor(hex) {
      let color = hex.replace("#", "");
      if (color.length <= 6) {
        //只有6位表示没有加上alpha通道
        color = "FF" + color;
      }
      return parseInt(color, 16);
    },
    /**
     * 改变背景颜色
     */
    changeBackgroundColor(row) {
      row.backgroundColor = this.formatHexToColor(
        this.formatRGBAToHex(row.backgroundColorHex)
      );
      this.myUpdateForce(row);
    },
    /**
     * 改变字体颜色
     */
    changeTextColor(row) {
      row.textColor = this.formatHexToColor(
        this.formatRGBAToHex(row.textColorHex)
      );
      this.myUpdateForce(row);
    },
    myUpdateForce(row) {
      let dictList = this.getDictsByKey(row.dictType);
      let index = 0;
      for (let i in dictList) {
        if (dictList[i].dictValue === row.dictValue) {
          index = i;
          break;
        }
      }
      switch (row.dictType) {
        case DICT_KEY_SEX:
          this.$set(this.dictData.sexDictList, index, row);
          break;
        case DICT_KEY_METERING:
          this.$set(this.dictData.meteringDictList, index, row);
          break;
        case DICT_KEY_NURSING_LEVEL:
          this.$set(this.dictData.nursingLevelDictList, index, row);
          break;
        case DICT_KEY_CRITICAL_TYPE:
          this.$set(this.dictData.criticalTypeDictList, index, row);
          break;
        case DICT_KEY_DIET:
          this.$set(this.dictData.dietDictList, index, row);
          break;
        case DICT_KEY_ALLERGY:
          this.$set(this.dictData.allergyDictList, index, row);
          break;
        case DICT_KEY_MEDICAL_INSURANCE_TYPE:
          this.$set(this.dictData.medicalInsuranceTypeDictList, index, row);
          break;
        case DICT_KEY_BLOOD_TYPE:
          this.$set(this.dictData.bloodTypeDictList, index, row);
          break;
        case DICT_KEY_PROTECTION:
          this.$set(this.dictData.protectionDictList, index, row);
          break;
        case DICT_KEY_SLAVE_PLACE:
          this.$set(this.dictData.placeDictList, index, row);
          break;
      }
    },
    moveList(arr, index1, index2) {
      let data1 = arr[index1];
      let data2 = arr[index2];
      arr.splice(index2, 1, data1);
      arr.splice(index1, 1, data2);
      let tmp = data1.sort;
      data1.sort = data2.sort;
      data2.sort = tmp;
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
      let dictList = this.getDictsByKey(row.dictType);
      if (dictList) {
        for (let i in dictList) {
          if (dictList[i].dictValue === row.dictValue) {
            this.upData(dictList, parseInt(i));
            break;
          }
        }
      }
    },
    /**
     * 向下移动
     */
    handleMoveDown(row) {
      let dictList = this.getDictsByKey(row.dictType);
      if (dictList) {
        for (let i in dictList) {
          if (dictList[i].dictValue === row.dictValue) {
            this.downData(dictList, parseInt(i));
            break;
          }
        }
      }
    },
    /**
     * 删除
     */
    handleDelete(row) {
      let dictList = this.getDictsByKey(row.dictType);
      if (dictList) {
        for (let i in dictList) {
          if (dictList[i].dictValue === row.dictValue) {
            dictList.splice(i, 1);
            break;
          }
        }
      }
    },
    /**
     * 添加字典元素
     */
    handleAdd() {
      let dictList = this.getDictsByKey(this.tabsActiveName);
      let tmp = {
        dictType: this.tabsActiveName,
        sort: dictList.length,
        backgroundColor: 4294901760,
        backgroundColorHex: "#ffff0000",
        textColor: 4294967295,
        textColorHex: "#ffffffff",
        displayNameBorder: false,
        dictValueBorder: false,
        icon: "",
      };
      dictList.push(tmp);
    },
  },
};
</script>
<style scoped>
.dictAlarmBorder {
  border: 1px solid red;
  border-radius: 5px;
}
.dictNormalBorder {
  border: 0px solid red;
  border-radius: 5px;
}
</style>