import request from "@/utils/request";
import { getRequestDTO } from "@masterModule/api/commonRequest";

/**
 * 获取字典列表
 */
export function listDict() {
  var data = {};
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-list-dict", data),
  });
}

/**
 * 更新字典列表
 */
export function updateDict(dictList) {
  var responseList = {
    responseList: {
      //强制全部更新
      updateType: 1,
      totalLength: dictList.length,
      list: dictList,
      currentPage: 0,
      pageSize: dictList.length,
    },

    lastUpdateTime: new Date().getTime(),
  };
  return request({
    url: "/business/custom",
    method: "post",
    data: getRequestDTO("req-update-dict", responseList),
  });
}
