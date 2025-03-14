import { base as http } from "@/utils/http";

const api = {
  /** 项目列表查询 */
  getList(data: any) {
    // return http.request("post", "/getProjectList", { data });
    return Promise.resolve({
      status: "1",
      data: {
        total: 1,
        rows: [
          {
            id: "1",
            name: "项目1",
            description: "项目1描述"
          }
        ]
      }
    });
  },
  /** 新增项目 */
  addProject(data: any) {
    return Promise.resolve({
      status: "1"
    });
  },
  /** 编辑项目 */
  editProject(data: any) {
    return Promise.resolve({
      status: "1"
    });
  },
  /** 删除项目 */
  deleteProject(data: any) {
    return Promise.resolve({
      status: "1"
    });
  },
  /** 下线 */
  offLineProject(data: any) {
    return Promise.resolve({
      status: "1"
    });
  }
};

export default api;
