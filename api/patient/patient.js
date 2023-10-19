import request from "@/utils/request";
import { getRequestDTO } from "@masterModule/api/commonRequest";
//获取病床列表
export function updatePatientInfo(patientInfo) {
  var responseList = {
    updateType: 0,
    totalLength: 1,
    list: [],
  };
  responseList.list.push(patientInfo);
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-update-patient-info", responseList),
  });
}
