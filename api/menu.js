// 获取路由
import { filterRouters } from "@/utils/filterRouters";
/**
 * 基础设置菜单
 */
export function getBaseSettings() {
  var menu = [
    {
      name: "BaseInfo",
      path: "",
      hidden: false,
      redirect: "index",
      component: "Layout",
      alwaysShow: true,
      meta: {
        title: "基本信息",
        icon: "dashboard",
        noCache: false,
        link: null,
      },
      children: [
        {
          name: "BaseDeviceInfo",
          path: "index",
          hidden: false,
          component: "base/baseInfo",
          meta: {
            title: "设备基本信息",
            icon: "clipboard",
            noCache: false,
            link: null,
          },
        },
        {
          name: "TimeSettings",
          path: "timeSettings",
          hidden: false,
          component: "base/timeSettings",
          meta: {
            title: "时间设置",
            icon: "time",
            noCache: false,
            link: null,
          },
        },
      ],
    },
  ];
  return filterRouters(menu, loadView);
}
/**
 * 分机设置菜单
 */
export function getBedSettings() {
  var menu = [
    {
      name: "bedSettings",
      path: "/bedSettings",
      hidden: false,
      redirect: "noRedirect",
      component: "Layout",
      alwaysShow: true,
      meta: {
        title: "分机设置",
        icon: "phone",
        noCache: false,
        link: null,
      },
      children: [
        {
          name: "bedTemplate",
          path: "bedTemplate",
          hidden: false,
          component: "bed/bedTemplate",
          meta: {
            title: "分机模板设置",
            icon: "list",
            noCache: false,
            link: null,
          },
        },
        {
          name: "bedList",
          path: "bedList",
          hidden: false,
          component: "bed/index",
          meta: {
            title: "分机详细信息",
            icon: "table",
            noCache: false,
            link: null,
          },
        },
      ],
    },
  ];
  return filterRouters(menu, loadView);
}

/**
 * 病房门口屏设置菜单
 */
 export function getRoomSettings() {
  var menu = [
    {
      name: "roomSettings",
      path: "/roomSettings",
      hidden: false,
      redirect: "noRedirect",
      component: "Layout",
      alwaysShow: true,
      meta: {
        title: "病房门口屏设置",
        icon: "phone",
        noCache: false,
        link: null,
      },
      children: [
        {
          name: "roomTemplate",
          path: "roomTemplate",
          hidden: false,
          component: "room/roomTemplate",
          meta: {
            title: "病房门口屏模板设置",
            icon: "list",
            noCache: false,
            link: null,
          },
        },
        {
          name: "roomList",
          path: "roomList",
          hidden: false,
          component: "room/index",
          meta: {
            title: "病房门口屏详细信息",
            icon: "table",
            noCache: false,
            link: null,
          },
        },
      ],
    },
  ];
  return filterRouters(menu, loadView);
}

/**
 * 高级设置菜单
 */
export function getSeniorSettings() {
  var menu = [
    {
      name: "seniorSettings",
      path: "/seniorSettings",
      hidden: false,
      redirect: "noRedirect",
      component: "Layout",
      alwaysShow: true,
      meta: {
        title: "高级设置",
        icon: "nested",
        noCache: false,
        link: null,
      },
      children: [
        {
          name: "dict",
          path: "dict",
          hidden: false,
          component: "seniorSettings/dict",
          meta: {
            title: "字典管理",
            icon: "dict",
            noCache: false,
            link: null,
          },
        },
        {
          name: "multicastFile",
          path: "multicastFile",
          hidden: false,
          component: "seniorSettings/attachmentFile",
          meta: {
            title: "附件管理",
            icon: "peoples",
            noCache: false,
            link: null,
          },
        },
        {
          name: "stepMaster",
          path: "stepMaster",
          hidden: false,
          component: "seniorSettings/stepMaster",
          meta: {
            title: "备用主机",
            icon: "skill",
            noCache: false,
            link: null,
          },
        },
        {
          name: "appendMaster",
          path: "appendMaster",
          hidden: false,
          component: "seniorSettings/appendMaster",
          meta: {
            title: "附加主机",
            icon: "rate",
            noCache: false,
            link: null,
          },
        },
        {
          name: "reinforceMaster",
          path: "reinforceMaster",
          hidden: false,
          component: "seniorSettings/reinforceMaster",
          meta: {
            title: "增援主机",
            icon: "eye",
            noCache: false,
            link: null,
          },
        },
        {
          name: "trustMaster",
          path: "trustMaster",
          hidden: false,
          component: "seniorSettings/trustMaster",
          meta: {
            title: "托管主机",
            icon: "guide",
            noCache: false,
            link: null,
          },
        },
      ],
    },
  ];
  return filterRouters(menu, loadView);
}

function loadView(view) {
  if (process.env.NODE_ENV === "development") {
    return (resolve) => require([`@masterModule/views/${view}`], resolve);
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@masterModule/views/${view}`);
  }
}
