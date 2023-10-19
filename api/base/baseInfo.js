import request from "@/utils/request";
import { getRequestDTO } from "@masterModule/api/commonRequest";
//获取设备基本信息
export function getDeviceInfo() {
  var data = {};
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-get-device-info", data),
  });
}
//更新设备基本信息
export function updateDeviceInfo(deviceInfo) {
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-change-device-info", deviceInfo),
  });
}

//获取设备状态
export function getDeviceStatus() {
  var data = {};
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-get-status", data),
  });
}
