import { base as http } from "@/utils/http";
import { cloneDeep } from "@pureadmin/utils";

type Result = {
  success: boolean;
  data: Array<any>;
};

const handleMenu = (data: Array<any>, path: string) => {
  return data.map((item: any) => {
    const res: any = {
      path: `${path}/${item.uniqueCode}`,
      meta: {
        title: item.resourceName
      }
    };

    if (item.structureType === 2) {
      res.name = item.uniqueCode;
      res.component = `${res.path.substring("1")}/index`;
      res.meta.detailInfo = cloneDeep(item);

      if (data.length === 1) {
        res.meta.showParent = true;
      }
    }

    if (item.children && item.children.length) {
      res.children = handleMenu(item.children, res.path);
    }

    if (path === "") {
      res.meta.icon = "apps-line";
    }

    return res;
  });
};

export const getAsyncRoutes = () => {
  // return http.request<Result>("get", "/get-async-routes");

  const res = {
    module: null,
    system: "cdp",
    id: 173,
    resourceName: "全部",
    reportTypeCode: "1",
    reportTypeName: null,
    resourceUrl: "",
    structureType: 1,
    structureTypeName: null,
    permissionsAllocateType: null,
    isShow: 1,
    isApplyed: 1,
    isDelete: 0,
    isDetailedReport: 0,
    isSecretReport: 0,
    resourceIndexSort: null,
    parentId: null,
    note: null,
    createId: "guanwang@xdf.cn",
    createTime: 1617845005000,
    updateTime: 1622196890000,
    isShareAll: 1,
    uniqueCode: "root",
    orderNum: 173,
    children: [
      {
        module: null,
        system: "tessar",
        id: 396,
        resourceName: "事件管理",
        reportTypeCode: "",
        reportTypeName: null,
        resourceUrl: "",
        structureType: 1,
        structureTypeName: null,
        permissionsAllocateType: null,
        isShow: 1,
        isApplyed: 0,
        isDelete: 0,
        isDetailedReport: null,
        isSecretReport: null,
        resourceIndexSort: null,
        parentId: 173,
        note: "",
        createId: "lipeng219@xdf.cn",
        createTime: 1629774782000,
        updateTime: 1637821769000,
        isShareAll: 0,
        uniqueCode: "event",
        orderNum: 396,
        children: [
          {
            module: null,
            system: "tessar",
            id: 417,
            resourceName: "事件列表",
            reportTypeCode: "",
            reportTypeName: null,
            resourceUrl: "",
            structureType: 2,
            structureTypeName: null,
            permissionsAllocateType: null,
            isShow: 1,
            isApplyed: 0,
            isDelete: 0,
            isDetailedReport: null,
            isSecretReport: null,
            resourceIndexSort: null,
            parentId: 396,
            note: "",
            createId: "lipeng219@xdf.cn",
            createTime: 1629803120000,
            updateTime: 1673335026000,
            isShareAll: 0,
            uniqueCode: "eventList",
            orderNum: 417,
            children: [],
            userResourceId: null,
            roleResourceId: null,
            isNeedApply: null,
            isCollect: 0
          }
        ],
        userResourceId: null,
        roleResourceId: null,
        isNeedApply: null,
        isCollect: 0
      },
      {
        module: null,
        system: "tessar",
        id: 396,
        resourceName: "项目管理",
        reportTypeCode: "",
        reportTypeName: null,
        resourceUrl: "",
        structureType: 1,
        structureTypeName: null,
        permissionsAllocateType: null,
        isShow: 1,
        isApplyed: 0,
        isDelete: 0,
        isDetailedReport: null,
        isSecretReport: null,
        resourceIndexSort: null,
        parentId: 173,
        note: "",
        createId: "lipeng219@xdf.cn",
        createTime: 1629774782000,
        updateTime: 1637821769000,
        isShareAll: 0,
        uniqueCode: "project",
        orderNum: 396,
        children: [
          {
            module: null,
            system: "tessar",
            id: 417,
            resourceName: "项目列表",
            reportTypeCode: "",
            reportTypeName: null,
            resourceUrl: "",
            structureType: 2,
            structureTypeName: null,
            permissionsAllocateType: null,
            isShow: 1,
            isApplyed: 0,
            isDelete: 0,
            isDetailedReport: null,
            isSecretReport: null,
            resourceIndexSort: null,
            parentId: 396,
            note: "",
            createId: "lipeng219@xdf.cn",
            createTime: 1629803120000,
            updateTime: 1673335026000,
            isShareAll: 0,
            uniqueCode: "projectList",
            orderNum: 417,
            children: [],
            userResourceId: null,
            roleResourceId: null,
            isNeedApply: null,
            isCollect: 0
          }
        ],
        userResourceId: null,
        roleResourceId: null,
        isNeedApply: null,
        isCollect: 0
      }
    ],
    userResourceId: null,
    roleResourceId: null,
    isNeedApply: 0,
    isCollect: 0
  };
  return Promise.resolve({
    success: true,
    data: handleMenu(res.children, "")
  });
  return Promise.resolve({
    success: true,
    data: [
      {
        path: "/permission",
        meta: {
          title: "权限管理",
          icon: "ep:lollipop",
          rank: 10
        },
        children: [
          {
            path: "/permission/page/index",
            name: "PermissionPage",
            meta: {
              title: "页面权限"
              // roles: ["admin", "common"]
            }
          },
          {
            path: "/permission/button",
            meta: {
              title: "按钮权限"
              // roles: ["admin", "common"]
            },
            children: [
              {
                path: "/permission/button/router",
                component: "permission/button/index",
                name: "PermissionButtonRouter",
                meta: {
                  title: "路由返回按钮权限",
                  auths: [
                    "permission:btn:add",
                    "permission:btn:edit",
                    "permission:btn:delete"
                  ]
                }
              },
              {
                path: "/permission/button/login",
                component: "permission/button/perms",
                name: "PermissionButtonLogin",
                meta: {
                  title: "登录接口返回按钮权限"
                }
              }
            ]
          }
        ]
      }
    ]
  });
};
