import request from "@/utils/request";
import { getRequestDTO } from "@masterModule/api/commonRequest";
//获取病床列表
export function list(currentPage, pageSize) {
  var data = {
    currentPage: currentPage,
    pageSize: pageSize,
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-list-bed", data),
  });
}

/**
 *  获取病床原始功能列表
 */
export function listBedFunction() {
  var data = {};
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-list-bed-function", data),
  });
}

/**
 *  获取病床模板
 */
export function getBedTemplate(templateId) {
  var data = {
    templateId: templateId,
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-get-bed-template", data),
  });
}
/**
 *  更新病床模板
 */
export function updateBedTemplate(params) {
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-update-bed-template", params),
  });
}
