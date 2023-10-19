import request from "@/utils/request";
import { getRequestDTO } from "@masterModule/api/commonRequest";

/**
 * 托管请求
 */
// export function requestTrust(beTrustNo, trunstNo, state) {
//   var data = {
//     beTrustNo: beTrustNo,
//     trunstNo: trunstNo,
//     state: state,
//   };
//   return request({
//     url: "/business/custom",
//     method: "post",
//     data: getRequestDTO("req-trust", data),
//   });
// }
export function requestTrust(params) {
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-trust", params),
  });
}
/**
 * 托管请求回复
 */
export function responseTrust(beTrustNo, trunstNo, state, isOk) {
  var data = {
    beTrustNo: beTrustNo,
    trunstNo: trunstNo,
    state: state,
    isOk: isOk,
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("rsp-trust", data),
  });
}
