import request from "@/utils/request";
import { getRequestDTO } from "@masterModule/api/commonRequest";
//获取位置列表
export function listStepMaster(currentPage, pageSize, stepMasterType) {
  var data = {
    currentPage: currentPage,
    pageSize: pageSize,
    stepMasterType: stepMasterType,
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-list-step-master", data),
  });
}

export function updateStepMaster(stepMasterList, stepMasterType) {
  var responseList = {
    updateType: 0,
    totalLength: stepMasterList.length,
    list: stepMasterList,
  };
  var data = {
    responseList: responseList,
    stepMasterType: stepMasterType,
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-update-step-master", data),
  });
}
