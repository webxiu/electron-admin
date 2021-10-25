
/**
 * @readOnly {只读， 脚本更改}
 * @Message {来源} {npm run codec:service}
 * @Swagger 自动生成接口请求信息
 *
*/

import axiosInstance, { AxiosRequestConfig, InjectAbort } from '@/Render/axios';

import { BaseServeResponse } from '@/Types/BaseTypes';

/** ========================= **************** set ****************** ========================= */
/** 设置 请求参数 */
export interface set$$Request {
    /** 键 */
    key: string;
    /** 值 */
    Value: string;
}
/** 设置 响应参数*/
export interface set$$Response {}
/** 设置 */
export const set = (request: set$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<set$$Response>>('/v1/setting/set',  request, InjectAbort(set, config));
};

/** ========================= **************** get ****************** ========================= */
/** 获取设置 请求参数 */
export interface get$$Request {}
/** 获取设置 响应参数*/
export interface get$$Response {}
/** 获取设置 */
export const get = (request: get$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<get$$Response>>('/v1/setting/get', InjectAbort(get, request));
};

/** ========================= **************** list ****************** ========================= */
/** 列出设置 请求参数 */
export interface list$$Request {}
/** 列出设置 响应参数*/
export interface list$$Response {}
/** 列出设置 */
export const list = (request: list$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<list$$Response>>('/v1/setting/list', InjectAbort(list, request));
};

/** ========================= **************** addTask ****************** ========================= */
/** 新建任务 请求参数 */
export interface addTask$$Request {
    /** 任务类型，必填，PREPROC(预处理)/CLUSTER(聚类)/ONESTOP(一站式) */
    type: string;
    /** 任务名称，必填 */
    name: string;
    /** 文件总数 */
    file_count: number;
}
/** 新建任务 响应参数*/
export interface addTask$$Response {}
/** 新建任务 */
export const addTask = (request: addTask$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<addTask$$Response>>('/v1/task/addTask',  request, InjectAbort(addTask, config));
};

/** ========================= **************** editTask ****************** ========================= */
/** 编辑任务 请求参数 */
export interface editTask$$Request {
    /** 任务ID */
    id: number;
    /** 任务名称，必填 */
    name: string;
}
/** 编辑任务 响应参数*/
export interface editTask$$Response {}
/** 编辑任务 */
export const editTask = (request: editTask$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.put<BaseServeResponse<editTask$$Response>>('/v1/task/editTask',  request, InjectAbort(editTask, config));
};

/** ========================= **************** deleteTask ****************** ========================= */
/** 删除任务 请求参数 */
export interface deleteTask$$Request {}
/** 删除任务 响应参数*/
export interface deleteTask$$Response {}
/** 删除任务 */
export const deleteTask = (request: deleteTask$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.delete<BaseServeResponse<deleteTask$$Response>>('/v1/task/deleteTask', InjectAbort(deleteTask, request));
};

/** ========================= **************** listTask ****************** ========================= */
/** 任务列表 请求参数 */
export interface listTask$$Request {}
/** 任务列表 响应参数*/
export interface listTask$$Response {}
/** 任务列表 */
export const listTask = (request: listTask$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<listTask$$Response>>('/v1/task/listTask', InjectAbort(listTask, request));
};

/** ========================= **************** listVoice ****************** ========================= */
/** 音频列表 请求参数 */
export interface listVoice$$Request {}
/** 音频列表 响应参数*/
export interface listVoice$$Response {}
/** 音频列表 */
export const listVoice = (request: listVoice$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<listVoice$$Response>>('/v1/voice/listVoice', InjectAbort(listVoice, request));
};

/** ========================= **************** editVoice ****************** ========================= */
/** 编辑音频 请求参数 */
export interface editVoice$$Request {
    /** 任务类型，必填，PREPROC(预处理)/CLUSTER(聚类)/ONESTOP(一站式) */
    task_type: string;
    /** 音频ID，必填 */
    voice_id: number;
    /** 音频名称，必填 */
    name: string;
}
/** 编辑音频 响应参数*/
export interface editVoice$$Response {}
/** 编辑音频 */
export const editVoice = (request: editVoice$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.put<BaseServeResponse<editVoice$$Response>>('/v1/voice/editVoice',  request, InjectAbort(editVoice, config));
};

/** ========================= **************** deleteVoice ****************** ========================= */
/** 删除音频 请求参数 */
export interface deleteVoice$$Request {}
/** 删除音频 响应参数*/
export interface deleteVoice$$Response {}
/** 删除音频 */
export const deleteVoice = (request: deleteVoice$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.delete<BaseServeResponse<deleteVoice$$Response>>('/v1/voice/deleteVoice', InjectAbort(deleteVoice, request));
};

/** ========================= **************** listCombineVoice ****************** ========================= */
/** 合并音频列表 请求参数 */
export interface listCombineVoice$$Request {}
/** 合并音频列表 响应参数*/
export interface listCombineVoice$$Response {}
/** 合并音频列表 */
export const listCombineVoice = (request: listCombineVoice$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<listCombineVoice$$Response>>('/v1/voice/listCombineVoice', InjectAbort(listCombineVoice, request));
};

/** ========================= **************** listCombineVoiceOriginal ****************** ========================= */
/** 合并音频源音频列表 请求参数 */
export interface listCombineVoiceOriginal$$Request {}
/** 合并音频源音频列表 响应参数*/
export interface listCombineVoiceOriginal$$Response {}
/** 合并音频源音频列表 */
export const listCombineVoiceOriginal = (request: listCombineVoiceOriginal$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<listCombineVoiceOriginal$$Response>>('/v1/voice/listCombineVoiceOriginal', InjectAbort(listCombineVoiceOriginal, request));
};

/** ========================= **************** saveVoice ****************** ========================= */
/** 保存音频 请求参数 */
export interface saveVoice$$Request {
    /** 任务类型，必填，PREPROC(预处理)/CLUSTER(聚类)/ONESTOP(一站式) */
    task_type: string;
    /** 音频ID，必填 */
    voice_id: number;
    /** 文件ID，必填 */
    file_id: number;
    /** 标记列表 */
    tag_list: TagListItemTypes[];
}
/** 保存音频 响应参数*/
export interface saveVoice$$Response {}
/** 保存音频 */
export const saveVoice = (request: saveVoice$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<saveVoice$$Response>>('/v1/voice_clipping/saveVoice',  request, InjectAbort(saveVoice, config));
};

/** ========================= **************** listTag ****************** ========================= */
/** 标记列表 请求参数 */
export interface listTag$$Request {}
/** 标记列表 响应参数*/
export interface listTag$$Response {}
/** 标记列表 */
export const listTag = (request: listTag$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<listTag$$Response>>('/v1/voice_clipping/listTag', InjectAbort(listTag, request));
};

/** ========================= **************** combineGroup ****************** ========================= */
/** 分组合并 请求参数 */
export interface combineGroup$$Request {
    /** 任务ID，必填 */
    task_id: number;
}
/** 分组合并 响应参数*/
export interface combineGroup$$Response {}
/** 分组合并 */
export const combineGroup = (request: combineGroup$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<combineGroup$$Response>>('/v1/voice_cluster/combineGroup',  request, InjectAbort(combineGroup, config));
};

/** ========================= **************** editGroup ****************** ========================= */
/** 编辑分组 请求参数 */
export interface editGroup$$Request {
    /** 分组ID，必填 */
    group_id: number;
    /** 名称，必填 */
    name: string;
}
/** 编辑分组 响应参数*/
export interface editGroup$$Response {}
/** 编辑分组 */
export const editGroup = (request: editGroup$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.put<BaseServeResponse<editGroup$$Response>>('/v1/voice_cluster/editGroup',  request, InjectAbort(editGroup, config));
};

/** ========================= **************** listGroup ****************** ========================= */
/** 分组列表 请求参数 */
export interface listGroup$$Request {}
/** 分组列表 响应参数*/
export interface listGroup$$Response {}
/** 分组列表 */
export const listGroup = (request: listGroup$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<listGroup$$Response>>('/v1/voice_cluster/listGroup', InjectAbort(listGroup, request));
};

/** ========================= **************** listGroupVoice ****************** ========================= */
/** 分组音频列表 请求参数 */
export interface listGroupVoice$$Request {}
/** 分组音频列表 响应参数*/
export interface listGroupVoice$$Response {}
/** 分组音频列表 */
export const listGroupVoice = (request: listGroupVoice$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<listGroupVoice$$Response>>('/v1/voice_cluster/listGroupVoice', InjectAbort(listGroupVoice, request));
};

/** ========================= **************** moveGroup ****************** ========================= */
/** 移动分组 请求参数 */
export interface moveGroup$$Request {
    /** 音频ID列表，必填 */
    voice_id_list: number[];
    /** 分组ID，回收站为0 */
    group_id: number;
}
/** 移动分组 响应参数*/
export interface moveGroup$$Response {}
/** 移动分组 */
export const moveGroup = (request: moveGroup$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<moveGroup$$Response>>('/v1/voice_cluster/moveGroup',  request, InjectAbort(moveGroup, config));
};

/** ========================= **************** voiceCluster ****************** ========================= */
/** 声纹聚类 请求参数 */
export interface voiceCluster$$Request {
    /** 任务ID，必填 */
    task_id: number;
}
/** 声纹聚类 响应参数*/
export interface voiceCluster$$Response {}
/** 声纹聚类 */
export const voiceCluster = (request: voiceCluster$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<voiceCluster$$Response>>('/v1/voice_cluster/voiceCluster',  request, InjectAbort(voiceCluster, config));
};

/** ========================= **************** listProcess ****************** ========================= */
/** 执行流程列表 请求参数 */
export interface listProcess$$Request {}
/** 执行流程列表 响应参数*/
export interface listProcess$$Response {}
/** 执行流程列表 */
export const listProcess = (request: listProcess$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<listProcess$$Response>>('/v1/voice_onestop/listProcess', InjectAbort(listProcess, request));
};

/** ========================= **************** listResultVoice ****************** ========================= */
/** 结果音频列表 请求参数 */
export interface listResultVoice$$Request {}
/** 结果音频列表 响应参数*/
export interface listResultVoice$$Response {}
/** 结果音频列表 */
export const listResultVoice = (request: listResultVoice$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<listResultVoice$$Response>>('/v1/voice_onestop/listResultVoice', InjectAbort(listResultVoice, request));
};

/** ========================= **************** channelSeparation ****************** ========================= */
/** 声道分离 请求参数 */
export interface channelSeparation$$Request {
    /** 任务类型，必填，PREPROC(预处理)/CLUSTER(聚类)/ONESTOP(一站式) */
    task_type: string;
    /** 音频ID列表，必填 */
    voice_id_list: number[];
}
/** 声道分离 响应参数*/
export interface channelSeparation$$Response {}
/** 声道分离 */
export const channelSeparation = (request: channelSeparation$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<channelSeparation$$Response>>('/v1/voice_operate/channelSeparation',  request, InjectAbort(channelSeparation, config));
};

/** ========================= **************** exportVoice ****************** ========================= */
/** 导出音频 请求参数 */
export interface exportVoice$$Request {}
/** 导出音频 响应参数*/
export interface exportVoice$$Response {}
/** 导出音频 */
export const exportVoice = (request: exportVoice$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<exportVoice$$Response>>('/v1/voice_operate/exportVoice', InjectAbort(exportVoice, request));
};

/** ========================= **************** retryVoice ****************** ========================= */
/** 重试音频 请求参数 */
export interface retryVoice$$Request {
    /** 任务类型，必填，PREPROC(预处理)/CLUSTER(聚类)/ONESTOP(一站式) */
    task_type: string;
    /** 音频ID列表，必填 */
    voice_id_list: number[];
}
/** 重试音频 响应参数*/
export interface retryVoice$$Response {}
/** 重试音频 */
export const retryVoice = (request: retryVoice$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<retryVoice$$Response>>('/v1/voice_operate/retryVoice',  request, InjectAbort(retryVoice, config));
};

/** ========================= **************** validSound ****************** ========================= */
/** 有效音提取 请求参数 */
export interface validSound$$Request {
    /** 任务类型，必填，PREPROC(预处理)/CLUSTER(聚类)/ONESTOP(一站式) */
    task_type: string;
    /** 音频ID列表，必填 */
    voice_id_list: number[];
}
/** 有效音提取 响应参数*/
export interface validSound$$Response {}
/** 有效音提取 */
export const validSound = (request: validSound$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<validSound$$Response>>('/v1/voice_operate/validSound',  request, InjectAbort(validSound, config));
};

/** ========================= **************** voiceCombine ****************** ========================= */
/** 音频合并 请求参数 */
export interface voiceCombine$$Request {
    /** 任务类型，必填，PREPROC(预处理)/CLUSTER(聚类)/ONESTOP(一站式) */
    task_type: string;
    /** 音频ID列表，必填 */
    voice_id_list: number[];
}
/** 音频合并 响应参数*/
export interface voiceCombine$$Response {}
/** 音频合并 */
export const voiceCombine = (request: voiceCombine$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<voiceCombine$$Response>>('/v1/voice_operate/voiceCombine',  request, InjectAbort(voiceCombine, config));
};

/** ========================= **************** voiceSeparation ****************** ========================= */
/** 话者分离 请求参数 */
export interface voiceSeparation$$Request {
    /** 任务类型，必填，PREPROC(预处理)/CLUSTER(聚类)/ONESTOP(一站式) */
    task_type: string;
    /** 音频ID列表，必填 */
    voice_id_list: number[];
}
/** 话者分离 响应参数*/
export interface voiceSeparation$$Response {}
/** 话者分离 */
export const voiceSeparation = (request: voiceSeparation$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<voiceSeparation$$Response>>('/v1/voice_operate/voiceSeparation',  request, InjectAbort(voiceSeparation, config));
};

/** ========================= **************** upload ****************** ========================= */
/** 上传 请求参数 */
export interface upload$$Request {}
/** 上传 响应参数*/
export interface upload$$Response {}
/** 上传 */
export const upload = (request: upload$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<upload$$Response>>('/v1/file/upload',  request, InjectAbort(upload, config));
};

/** ========================= **************** download ****************** ========================= */
/** 下载 请求参数 */
export interface download$$Request {}
/** 下载 响应参数*/
export interface download$$Response {}
/** 下载 */
export const download = (request: download$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.get<BaseServeResponse<download$$Response>>('/v1/file/download', InjectAbort(download, request));
};


export interface TagListItemTypes {
  /** 开始时间 */
  begin: number;
  /** 结束时间 */
  end: number;
  /** 内容 */
  content: string;
}