import request from "@/utils/request";
import { getRequestDTO } from "@masterModule/api/commonRequest";
//获取位置列表
export function listAttachment(currentPage, pageSize, use) {
  var data = {
    currentPage: currentPage,
    pageSize: pageSize,
    use: use,
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-list-attachment", data),
  });
}

export function updateAttachment(attachment) {
  var responseList = {
    updateType: 0,
    totalLength: 1,
    list: [],
  };
  responseList.list.push(attachment);
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-update-attachment", responseList),
  });
}
