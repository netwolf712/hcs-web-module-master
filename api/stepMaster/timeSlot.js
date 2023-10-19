import request from "@/utils/request";
import { getRequestDTO } from "@masterModule/api/commonRequest";
//获取位置列表
export function listTimeSlot(currentPage, pageSize, timeSlotType) {
  var data = {
    currentPage: currentPage,
    pageSize: pageSize,
    timeSlotType: timeSlotType,
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-list-time-slot", data),
  });
}

export function updateTimeSlot(timeSlotList, timeSlotType) {
  var responseList = {
    updateType: 0,
    totalLength: timeSlotList.length,
    list: timeSlotList,
  };
  var data = {
    responseList: responseList,
    timeSlotType: timeSlotType,
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-update-time-slot", data),
  });
}
