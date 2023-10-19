import request from "@/utils/request";
import { getRequestDTO } from "@masterModule/api/commonRequest";
//获取位置列表
export function list(currentPage, pageSize, placeType) {
  var data = {
    currentPage: currentPage,
    pageSize: pageSize,
    placeType: placeType,
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-list-place", data),
  });
}

export function update(place) {
  var responseList = {
    updateType: 0,
    totalLength: 1,
    list: [],
  };
  responseList.list.push(place);
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-update-place-info", responseList),
  });
}
