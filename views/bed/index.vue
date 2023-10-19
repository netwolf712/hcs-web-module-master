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
              <span>{{ o.place.placeNo }}床</span>
            </div>
            <div class="bottom clearfix">
              <span>{{ patientInfoFormat(o) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 日志详细 -->
    <el-dialog
      title="病床配置"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="120px" size="medium">
        <el-row>
          <el-col :span="10">
            <el-form-item label="病床编号：">
              <el-input v-model="form.place.placeNo" placeholder="病床编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="姓名：">
              <el-input v-model="form.patient.name" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="年龄：">
              <el-input v-model="form.patient.age" placeholder="年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="编号：">
              <el-input
                v-model="form.patient.serialNumber"
                placeholder="编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别：">
              <el-radio-group v-model="form.patient.sex">
                <el-radio
                  v-for="dict in dict.sexDictList"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.displayName }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入院时间：">
              <el-date-picker
                v-model="inHospitalTimeDate"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="血型：">
              <el-select v-model="form.patient.bloodType" placeholder="请选择">
                <el-option
                  v-for="dict in dict.bloodTypeDictList"
                  :key="dict.dictValue"
                  :label="dict.displayName"
                  :value="dict.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="病情：">
              <el-input v-model="form.patient.illness" placeholder="病情" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="医嘱：">
              <el-input
                v-model="form.patient.doctorAdvice"
                placeholder="医嘱"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="护理级别：">
              <el-select
                v-model="form.patient.nursingLevel"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in dict.nursingLevelDictList"
                  :key="dict.dictValue"
                  :label="dict.displayName"
                  :value="dict.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="危重类型：">
              <el-select
                v-model="form.patient.criticalType"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in dict.criticalTypeDictList"
                  :key="dict.dictValue"
                  :label="dict.displayName"
                  :value="dict.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="计量：">
              <el-select v-model="form.patient.metering" placeholder="请选择">
                <el-option
                  v-for="dict in dict.meteringDictList"
                  :key="dict.dictValue"
                  :label="dict.displayName"
                  :value="dict.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="饮食：">
              <el-select v-model="form.patient.diet" placeholder="请选择">
                <el-option
                  v-for="dict in dict.dietDictList"
                  :key="dict.dictValue"
                  :label="dict.displayName"
                  :value="dict.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="隔离：">
              <el-radio-group v-model="form.patient.isolate">
                <el-radio
                  v-for="dict in isolateOptions"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="医保类型：">
              <el-select
                v-model="form.patient.medicalInsuranceType"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in dict.medicalInsuranceTypeDictList"
                  :key="dict.dictValue"
                  :label="dict.displayName"
                  :value="dict.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="过敏：">
              <el-checkbox
                v-model="hasNoAllergy"
                @change="handleCheckAllergyChange"
                :disabled="hasNoAllergy"
                >无过敏</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="checkedAllergys"
                @change="handleCheckedAllergysChange"
              >
                <el-checkbox
                  v-for="dict in dict.allergyDictList"
                  :label="dict.dictValue"
                  :key="dict.dictValue"
                  >{{ dict.displayName }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="防护：">
              <el-checkbox
                v-model="hasNoProtection"
                @change="handleCheckProtectionChange"
                :disabled="hasNoProtection"
                >无需防护</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="checkedProtections"
                @change="handleCheckedProtectionsChange"
              >
                <el-checkbox
                  v-for="dict in dict.protectionDictList"
                  :label="dict.dictValue"
                  :key="dict.dictValye"
                  >{{ dict.displayName }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, update } from "@masterModule/api/place/place";
import { listDict } from "@masterModule/api/dict/dict";
import { updatePatientInfo } from "@masterModule/api/patient/patient";
export default {
  name: "bedList",
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
        patient: {
          //姓名
          name: "",
          //年龄
          age: 0,
          //编号
          serialNumber: "",
          //性别
          sex: 0,
          //入院时间
          inHospitalTime: 0,
          //病情
          illness: "",
          //医嘱
          doctorAdvice: "",
          //护理级别
          nursingLevel: 0,
          //危重类型
          criticalType: 0,
          //计量
          metering: 0,
          //饮食
          diet: 0,
          //是否隔离
          isolate: false,
          //过敏
          allergy: 0,
          //医保类型
          medicalInsuranceType: 0,
          //防护内容
          protection: "",
          //血型
          bloodType: 0,
        },
      },
      //date类型的住院时间
      inHospitalTimeDate: null,
      //无过敏
      hasNoAllergy: true,
      //被选中的过敏源
      checkedAllergys: [],
      //无需防护
      hasNoProtection: true,
      //被选中的防护类型
      checkedProtections: [],
      //字典数据
      dict: {
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 120,
        placeType: 2,
      },
      isolateOptions: [
        {
          value: false,
          label: "无隔离",
        },
        {
          value: true,
          label: "隔离",
        },
      ],
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
      //获取字典列表
      listDict().then((res) => {
        this.dict = res.data;
      });
    },
    patientInfoFormat(row) {
      if (row.patientModelList) {
        var patientModel = row.patientModelList[0];
        if (patientModel) {
          return patientModel.patient.name;
        }
      }
      return "";
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
      if (row.patientModelList) {
        let patientModel = row.patientModelList[0];
        if (patientModel) {
          let patient = patientModel.patient;
          this.form.patient = patient;
          this.checkedAllergys = this.convertStrToCheckedId(patient.allergy);
          if (this.checkedAllergys.length > 0) {
            this.hasNoAllergy = false;
          } else {
            this.hasNoAllergy = true;
          }

          this.checkedProtections = this.convertStrToCheckedId(
            patient.protection
          );
          if (this.checkedProtections.length > 0) {
            this.hasNoProtection = false;
          } else {
            this.hasNoProtection = true;
          }

          this.inHospitalTimeDate = new Date();
          if (patient.inHospitalTime) {
            this.inHospitalTimeDate.setTime(patient.inHospitalTime);
          }
        }
      }
    },

    /** 提交按钮 */
    submitForm: function () {
      // this.$refs["form"].validate((valid) => {
      //   if (valid) {
      if (!this.checkPatientInfo()) {
        return;
      }
      update(this.form.place).then((response) => {
        if (response.code === 200) {
          if (!this.form.patient.serialNumber) {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          } else {
            this.savePatientInfo();
          }
        } else {
          this.msgError(response.msg);
        }
      });
      //   }
      // });
    },
    /**
     * 检查病员信息是否可以执行保存操作
     */
    checkPatientInfo() {
      if (this.form.patient.name) {
        if (!this.form.patient.serialNumber) {
          this.msgError("病员编号不能为空");
          return false;
        }
      }
      if (this.form.patient.serialNumber) {
        if (!this.form.patient.name) {
          this.msgError("病员姓名不能为空");
          return false;
        }
      }
      return true;
    },
    /**
     * 保存病员信息
     */
    savePatientInfo() {
      if (this.checkPatientInfo()) {
        this.form.patient.allergy = this.convertCheckedIdToStr(
          this.checkedAllergys
        );
        this.form.patient.protection = this.convertCheckedIdToStr(
          this.checkedProtections
        );
        if (this.inHospitalTimeDate) {
          this.form.patient.inHospitalTime = this.inHospitalTimeDate.getTime();
        }
        this.form.patient.bedSn = this.form.place.placeSn;
        updatePatientInfo(this.form.patient).then((response) => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /**
     * 无过敏选项
     * 选中后，所有过敏全部清空
     * 不需要取消选中操作，选择其它过敏项时自动会取消的
     */
    handleCheckAllergyChange(val) {
      if (val === true) {
        this.checkedAllergys = [];
      }
    },
    /**
     * 选中其中某个过敏原
     * 无过敏选项就要取消了
     */
    handleCheckedAllergysChange(value) {
      let checkedCount = value.length;
      if (checkedCount > 0) {
        this.hasNoAllergy = false;
      } else {
        this.hasNoAllergy = true;
      }
    },
    /**
     * 无需防护选项
     * 选中后，所有防护类型全部清空
     * 不需要取消选中操作，选择其它防护项时自动会取消的
     */
    handleCheckProtectionChange(val) {
      if (val === true) {
        this.checkedProtections = [];
      }
    },
    /**
     * 选中其中某个防护
     * 无防护选项就要取消了
     */
    handleCheckedProtectionsChange(value) {
      let checkedCount = value.length;
      if (checkedCount > 0) {
        this.hasNoProtection = false;
      } else {
        this.hasNoProtection = true;
      }
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

