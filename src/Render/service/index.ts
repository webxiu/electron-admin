
/**
 * @readOnly {只读， 脚本更改}
 * @Message {来源} {npm run codec:service}
 * @Swagger 自动生成接口请求信息
 *
*/

import axiosInstance, { AxiosRequestConfig, InjectAbort } from '@/Render/axios';

import { BaseServeResponse } from '@/Types/BaseTypes';

/** ========================= **************** AddTaskApi ****************** ========================= */
/** 新增布控任务 请求参数 */
export interface AddTaskApi$$Request {
    /** 任务名称 */
    task_name: string;
    /** 布控范围，ALL(全部)/SAMPLE(样本库)/MATERIAL(检材库) */
    library: string;
    /** 是否语种识别 enum: YES/NO */
    is_language_identify: string;
    /** 布控音频id */
    file_id: number;
}
/** 新增布控任务 响应参数*/
export interface AddTaskApi$$Response {
    /** 布控任务id */
    task_id: number;
}
/** 新增布控任务 */
export const AddTaskApi = (request: AddTaskApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<AddTaskApi$$Response>>('/v1/AddTaskApi',  request, InjectAbort(AddTaskApi, config));
};

/** ========================= **************** DeleteTaskApi ****************** ========================= */
/** 删除布控任务 请求参数 */
export interface DeleteTaskApi$$Request {
    /** 布控任务id列表 */
    task_id_list: number[];
}
/** 删除布控任务 响应参数*/
export interface DeleteTaskApi$$Response {}
/** 删除布控任务 */
export const DeleteTaskApi = (request: DeleteTaskApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<DeleteTaskApi$$Response>>('/v1/DeleteTaskApi',  request, InjectAbort(DeleteTaskApi, config));
};

/** ========================= **************** RevokeTaskApi ****************** ========================= */
/** 撤销布控任务 请求参数 */
export interface RevokeTaskApi$$Request {
    /** 布控任务id */
    task_id: number;
}
/** 撤销布控任务 响应参数*/
export interface RevokeTaskApi$$Response {}
/** 撤销布控任务 */
export const RevokeTaskApi = (request: RevokeTaskApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<RevokeTaskApi$$Response>>('/v1/RevokeTaskApi',  request, InjectAbort(RevokeTaskApi, config));
};

/** ========================= **************** TaskDetailsApi ****************** ========================= */
/** 布控任务详情 请求参数 */
export interface TaskDetailsApi$$Request {
    /** 布控任务id */
    task_id: number;
}
/** 布控任务详情 响应参数*/
export interface TaskDetailsApi$$Response {
    /** 任务编号 */
    task_id: number;
    /** 任务名称 */
    task_name: string;
    /** 布控状态 enum:DEPLOY_CONTROL_ING:布控中,DEPLOY_CONTROL_REVOKE:已撤销 */
    task_status: string;
    /** 是否语种识别 enum: YES/NO */
    is_language_identify: string;
    /** 布控音频id */
    file_id: number;
    /** 布控音频名称 */
    file_name: string;
    /** 语种识别 */
    language: string;
    /** 布控范围，ALL(全部)/SAMPLE(样本库)/MATERIAL(检材库) */
    library: string;
}
/** 布控任务详情 */
export const TaskDetailsApi = (request: TaskDetailsApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<TaskDetailsApi$$Response>>('/v1/TaskDetailsApi',  request, InjectAbort(TaskDetailsApi, config));
};

/** ========================= **************** ListTaskApi ****************** ========================= */
/** 布控任务列表 请求参数 */
export interface ListTaskApi$$Request {
    /** 任务名称筛选 */
    task_name: string;
    /** 布控状态筛选 enum:DEPLOY_CONTROL_ALL:全部,DEPLOY_CONTROL_ING:布控中,DEPLOY_CONTROL_REVOKE:已撤销 */
    task_status: string;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 布控任务列表 响应参数*/
export interface ListTaskApi$$Response {
    /** 任务列表 */
    task_info_list: TaskInfoListItemTypes[];
    /** 总数 */
    total_count: number;
}
/** 布控任务列表 */
export const ListTaskApi = (request: ListTaskApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<ListTaskApi$$Response>>('/v1/ListTaskApi',  request, InjectAbort(ListTaskApi, config));
};

/** ========================= **************** ListAlarmApi ****************** ========================= */
/** 布控告警列表 请求参数 */
export interface ListAlarmApi$$Request {
    /** 任务名称 */
    task_name: string;
    /** 告警音频名称 */
    file_name: string;
    /** 告警时间-开始 */
    begin_time: number;
    /** 告警时间-结束 */
    end_time: number;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 布控告警列表 响应参数*/
export interface ListAlarmApi$$Response {
    /** 告警信息 */
    alarm_info_list: AlarmInfoListItemTypes[];
    /** 总数 */
    total_count: number;
}
/** 布控告警列表 */
export const ListAlarmApi = (request: ListAlarmApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<ListAlarmApi$$Response>>('/v1/ListAlarmApi',  request, InjectAbort(ListAlarmApi, config));
};

/** ========================= **************** AlarmDetailsApi ****************** ========================= */
/** 告警详情 请求参数 */
export interface AlarmDetailsApi$$Request {
    /** 告警编号 */
    alarm_id: number;
}
/** 告警详情 响应参数*/
export interface AlarmDetailsApi$$Response {
    /** 声纹相似度 */
    score: number;
    /** 布控任务名称 */
    task_name: string;
    /** 告警时间 */
    alarm_time: number;
    /** 告警编号 */
    alarm_id: number;
    /** 告警音频id */
    alarm_file_id: number;
    /** 告警音频名称 */
    alarm_file_name: string;
    /** 告警音频语种 */
    alarm_language: string;
    /** 所属样本库名称 */
    alarm_sample_library_name: string;
    /** 布控音频id */
    task_file_id: number;
    /** 布控音频名称 */
    task_file_name: string;
    /** 布控音频语种 */
    task_language: string;
    /** 布控状态 enum:DEPLOY_CONTROL_ING:布控中,DEPLOY_CONTROL_REVOKE:已撤销 */
    task_status: string;
    /** 所属声纹库，MATERIAL(检材)/SAMPLE(样本) */
    library: string;
}
/** 告警详情 */
export const AlarmDetailsApi = (request: AlarmDetailsApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<AlarmDetailsApi$$Response>>('/v1/AlarmDetailsApi',  request, InjectAbort(AlarmDetailsApi, config));
};

/** ========================= **************** SearchVoiceApi ****************** ========================= */
/** 以音搜音 请求参数 */
export interface SearchVoiceApi$$Request {
    /** 检索音频id列表 */
    search_file_id_list: number[];
    /** 比对音频id */
    compare_file_id: number;
    /** 是否语种识别 enum: YES/NO */
    is_language_identify: string;
}
/** 以音搜音 响应参数*/
export interface SearchVoiceApi$$Response {
    /** 检索音频信息列表 */
    search_file_info_list: SearchFileInfoListItemTypes[];
    /** 比对音频语种 */
    compare_language: string;
    /** 文件名称 */
    compare_file_name: string;
}
/** 以音搜音 */
export const SearchVoiceApi = (request: SearchVoiceApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<SearchVoiceApi$$Response>>('/v1/SearchVoiceApi',  request, InjectAbort(SearchVoiceApi, config));
};

/** ========================= **************** VoiceCompareMoreApi ****************** ========================= */
/** 声纹比对1比N 请求参数 */
export interface VoiceCompareMoreApi$$Request {
    /** 任务名称 */
    task_name: string;
    /** 是否语种识别 enum:YES/NO */
    is_language_identify: string;
    /** 是否性别识别 enum: YES/NO */
    is_gender_identify: string;
    /** 比对音频id */
    compare_file_id: number;
    /** 比对库，ALL(全部)/SAMPLE(样本库)/MATERIAL(检材库) */
    library: string;
}
/** 声纹比对1比N 响应参数*/
export interface VoiceCompareMoreApi$$Response {
    /** 比对结果列表 */
    compare_result_list: CompareResultListItemTypes[];
    /** 比对音频ID */
    file_id: number;
    /** 比对音频名称 */
    file_name: string;
    /** 比对音频语种 */
    language: string;
    /** 比对音频性别，male(男)/female(女) */
    gender: string;
}
/** 声纹比对1比N */
export const VoiceCompareMoreApi = (request: VoiceCompareMoreApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<VoiceCompareMoreApi$$Response>>('/v1/VoiceCompareMoreApi',  request, InjectAbort(VoiceCompareMoreApi, config));
};

/** ========================= **************** VoiceCompareMoreThanMoreApi ****************** ========================= */
/** 声纹比对N比N 请求参数 */
export interface VoiceCompareMoreThanMoreApi$$Request {
    /** 任务名称 */
    task_name: string;
    /** 是否语种识别 enum:YES/NO */
    is_language_identify: string;
    /** 是否性别识别 enum: YES/NO */
    is_gender_identify: string;
    /** 比对音频id列表 */
    compare_file_id_list: number[];
    /** 比对库，ALL(全部)/SAMPLE(样本库)/MATERIAL(检材库) */
    library: string;
}
/** 声纹比对N比N 响应参数*/
export interface VoiceCompareMoreThanMoreApi$$Response {
    /** 比对音频列表 */
    compare_voice_list: CompareVoiceListItemTypes[];
}
/** 声纹比对N比N */
export const VoiceCompareMoreThanMoreApi = (request: VoiceCompareMoreThanMoreApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<VoiceCompareMoreThanMoreApi$$Response>>('/v1/VoiceCompareMoreThanMoreApi',  request, InjectAbort(VoiceCompareMoreThanMoreApi, config));
};

/** ========================= **************** VoiceCompareOneApi ****************** ========================= */
/** 声纹比对1比1 请求参数 */
export interface VoiceCompareOneApi$$Request {
    /** 任务名称 */
    task_name: string;
    /** 是否语种识别 enum: YES/NO */
    is_language_identify: string;
    /** 是否性别识别 enum: YES/NO */
    is_gender_identify: string;
    /** 检材音频id */
    material_file_id: number;
    /** 样本音频id */
    sample_file_id: number;
}
/** 声纹比对1比1 响应参数*/
export interface VoiceCompareOneApi$$Response {
    /** 检材音频名称 */
    material_file_name: string;
    /** 检材语种 */
    material_language: string;
    /** 检材性别，male(男)/female(女) */
    material_gender: string;
    /** 样本音频名称 */
    sample_file_name: string;
    /** 样本语种 */
    sample_language: string;
    /** 样本性别，male(男)/female(女) */
    sample_gender: string;
    /** 算法得分 */
    score: number;
}
/** 声纹比对1比1 */
export const VoiceCompareOneApi = (request: VoiceCompareOneApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<VoiceCompareOneApi$$Response>>('/v1/VoiceCompareOneApi',  request, InjectAbort(VoiceCompareOneApi, config));
};

/** ========================= **************** ListSampleLibraryFileApi ****************** ========================= */
/** 列出样本库音频 请求参数 */
export interface ListSampleLibraryFileApi$$Request {
    /** 音频id搜索 */
    file_id: number;
    /** 样本库id筛选 */
    sample_library_id: number;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 列出样本库音频 响应参数*/
export interface ListSampleLibraryFileApi$$Response {
    /** 音频信息列表 */
    sample_file_list: SampleFileListItemTypes[];
    /** 总数 */
    total_count: number;
}
/** 列出样本库音频 */
export const ListSampleLibraryFileApi = (request: ListSampleLibraryFileApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<ListSampleLibraryFileApi$$Response>>('/v1/ListSampleLibraryFileApi',  request, InjectAbort(ListSampleLibraryFileApi, config));
};

/** ========================= **************** SampleRegisterApi ****************** ========================= */
/** 样本注册 请求参数 */
export interface SampleRegisterApi$$Request {
    /** 人员姓名 */
    person_name: string;
    /** 性别：男性(male)/女性(female) */
    gender: string;
    /** 音频文件id */
    file_id: number;
}
/** 样本注册 响应参数*/
export interface SampleRegisterApi$$Response {
    /** 样本id */
    id: number;
}
/** 样本注册 */
export const SampleRegisterApi = (request: SampleRegisterApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<SampleRegisterApi$$Response>>('/v1/SampleRegisterApi',  request, InjectAbort(SampleRegisterApi, config));
};

/** ========================= **************** BatchSampleRegisterApi ****************** ========================= */
/** 批量样本注册 请求参数 */
export interface BatchSampleRegisterApi$$Request {
    /** 样本列表 */
    sample_list: SampleListItemTypes[];
}
/** 批量样本注册 响应参数*/
export interface BatchSampleRegisterApi$$Response {
    /** 样本id */
    id: number;
}
/** 批量样本注册 */
export const BatchSampleRegisterApi = (request: BatchSampleRegisterApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<BatchSampleRegisterApi$$Response>>('/v1/BatchSampleRegisterApi',  request, InjectAbort(BatchSampleRegisterApi, config));
};

/** ========================= **************** GetSampleDetailsApi ****************** ========================= */
/** 查看样本详情 请求参数 */
export interface GetSampleDetailsApi$$Request {
    /** 样本id */
    sample_id: number;
}
/** 查看样本详情 响应参数*/
export interface GetSampleDetailsApi$$Response {
    /** 样本id */
    sample_id: number;
    /** 编号 */
    code: string;
    /** 姓名 */
    name: string;
    /** 性别，男(male)/女(female) */
    gender: string;
    /** 入库时间 */
    create_time: number;
    /** 文件名 */
    file_name: string;
    /** 文件id */
    file_id: number;
    /** 文件路径 */
    src: string;
}
/** 查看样本详情 */
export const GetSampleDetailsApi = (request: GetSampleDetailsApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<GetSampleDetailsApi$$Response>>('/v1/GetSampleDetailsApi',  request, InjectAbort(GetSampleDetailsApi, config));
};

/** ========================= **************** DeleteSampleApi ****************** ========================= */
/** 删除样本 请求参数 */
export interface DeleteSampleApi$$Request {
    /** 样本id列表 */
    id_list: number[];
}
/** 删除样本 响应参数*/
export interface DeleteSampleApi$$Response {}
/** 删除样本 */
export const DeleteSampleApi = (request: DeleteSampleApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<DeleteSampleApi$$Response>>('/v1/DeleteSampleApi',  request, InjectAbort(DeleteSampleApi, config));
};

/** ========================= **************** ListSample ****************** ========================= */
/** 样本列表 请求参数 */
export interface ListSample$$Request {
    /** 编号 */
    code: string;
    /** 姓名 */
    name: string;
    /** 性别，男(male)/女(female) */
    gender: string;
    /** 入库时间-开始 */
    create_begin: number;
    /** 入库时间-结束 */
    create_end: number;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 样本列表 响应参数*/
export interface ListSample$$Response {
    /** 声纹列表 */
    voice_list: VoiceListItemTypes[];
    /** 总数 */
    totalCount: number;
}
/** 样本列表 */
export const ListSample = (request: ListSample$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<ListSample$$Response>>('/v1/ListSample',  request, InjectAbort(ListSample, config));
};

/** ========================= **************** viewMaterial ****************** ========================= */
/** 查看检材 请求参数 */
export interface viewMaterial$$Request {
    /** 检材ID */
    id: number;
}
/** 查看检材 响应参数*/
export interface viewMaterial$$Response {
    /** 编号 */
    code: string;
    /** 是否聚类 */
    is_cluster: boolean;
    /** 音频文件id */
    file_id: number;
    /** 文件路径 */
    src: string;
    /** 创建时间 */
    create_time: number;
    /** 聚类音频信息列表 */
    voice_info_list: VoiceInfoListItemTypes[];
}
/** 查看检材 */
export const viewMaterial = (request: viewMaterial$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<viewMaterial$$Response>>('/v1/viewMaterial',  request, InjectAbort(viewMaterial, config));
};

/** ========================= **************** addMaterials ****************** ========================= */
/** 新增检材 请求参数 */
export interface addMaterials$$Request {
    /** 文件ID列表 */
    file_id_list: number[];
}
/** 新增检材 响应参数*/
export interface addMaterials$$Response {}
/** 新增检材 */
export const addMaterials = (request: addMaterials$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<addMaterials$$Response>>('/v1/addMaterials',  request, InjectAbort(addMaterials, config));
};

/** ========================= **************** ListMaterial ****************** ========================= */
/** 检材列表 请求参数 */
export interface ListMaterial$$Request {
    /** 编号 */
    code: string;
    /** 是否聚类 */
    is_cluster: boolean;
    /** 入库时间-开始 */
    create_begin: number;
    /** 入库时间-结束 */
    create_end: number;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 检材列表 响应参数*/
export interface ListMaterial$$Response {
    /** 声纹列表 */
    material_list: MaterialListItemTypes[];
    /** 总数 */
    totalCount: number;
}
/** 检材列表 */
export const ListMaterial = (request: ListMaterial$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<ListMaterial$$Response>>('/v1/ListMaterial',  request, InjectAbort(ListMaterial, config));
};

/** ========================= **************** clusterUpload ****************** ========================= */
/** 聚类上传 请求参数 */
export interface clusterUpload$$Request {
    /** 分组 */
    group: GroupItemTypes[];
}
/** 聚类上传 响应参数*/
export interface clusterUpload$$Response {}
/** 聚类上传 */
export const clusterUpload = (request: clusterUpload$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<clusterUpload$$Response>>('/v1/clusterUpload',  request, InjectAbort(clusterUpload, config));
};

/** ========================= **************** DeleteMaterialApi ****************** ========================= */
/** 删除检材 请求参数 */
export interface DeleteMaterialApi$$Request {
    /** 检材id列表 */
    id_list: number[];
}
/** 删除检材 响应参数*/
export interface DeleteMaterialApi$$Response {}
/** 删除检材 */
export const DeleteMaterialApi = (request: DeleteMaterialApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<DeleteMaterialApi$$Response>>('/v1/DeleteMaterialApi',  request, InjectAbort(DeleteMaterialApi, config));
};

/** ========================= **************** ListHistoryRecordApi ****************** ========================= */
/** 历史记录列表 请求参数 */
export interface ListHistoryRecordApi$$Request {
    /** 历史记录类型 enum:HSTR_ALL:全部,HSTR_SEARCH_VOICE:以音搜音,HSTR_VOICE_COMPARE_ONE:1比1,HSTR_VOICE_COMPARE_MORE:1比N */
    record_type: string;
    /** 开始时间 */
    begin_time: number;
    /** 结束时间 */
    end_time: number;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 历史记录列表 响应参数*/
export interface ListHistoryRecordApi$$Response {
    /** 历史纪录列表 */
    history_record_info_list: HistoryRecordInfoListItemTypes[];
    /** 历史纪录总数目 */
    total_count: number;
}
/** 历史记录列表 */
export const ListHistoryRecordApi = (request: ListHistoryRecordApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<ListHistoryRecordApi$$Response>>('/v1/ListHistoryRecordApi',  request, InjectAbort(ListHistoryRecordApi, config));
};

/** ========================= **************** RecordDetailsApi ****************** ========================= */
/** 历史记录详情 请求参数 */
export interface RecordDetailsApi$$Request {
    /** 历史记录id */
    id: number;
}
/** 历史记录详情 响应参数*/
export interface RecordDetailsApi$$Response {
    /** 记录类型 enum: VOICE_ANALYSIS(语音分析),SEARCH_VOICE(以音搜音),VPR(声纹检索) */
    record_type: string;
    /** json数据 */
    record_data: string;
}
/** 历史记录详情 */
export const RecordDetailsApi = (request: RecordDetailsApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<RecordDetailsApi$$Response>>('/v1/RecordDetailsApi',  request, InjectAbort(RecordDetailsApi, config));
};

/** ========================= **************** DeleteHistoryRecordApi ****************** ========================= */
/** 删除历史记录 请求参数 */
export interface DeleteHistoryRecordApi$$Request {
    /** 历史记录id列表 */
    id_list: number[];
}
/** 删除历史记录 响应参数*/
export interface DeleteHistoryRecordApi$$Response {}
/** 删除历史记录 */
export const DeleteHistoryRecordApi = (request: DeleteHistoryRecordApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<DeleteHistoryRecordApi$$Response>>('/v1/DeleteHistoryRecordApi',  request, InjectAbort(DeleteHistoryRecordApi, config));
};

/** ========================= **************** AudioCondenseApi ****************** ========================= */
/** 音频浓缩 请求参数 */
export interface AudioCondenseApi$$Request {
    /** 音频id */
    file_id: number;
    /** 是否选中全文 enum: YES/NO */
    is_all_content: string;
    /** 开始时间(ms) */
    begin_time: number;
    /** 结束时间(ms) */
    end_time: number;
}
/** 音频浓缩 响应参数*/
export interface AudioCondenseApi$$Response {}
/** 音频浓缩 */
export const AudioCondenseApi = (request: AudioCondenseApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<AudioCondenseApi$$Response>>('/v1/AudioCondenseApi',  request, InjectAbort(AudioCondenseApi, config));
};

/** ========================= **************** AudioCondenseResultApi ****************** ========================= */
/** 音频浓缩异步结果获取 请求参数 */
export interface AudioCondenseResultApi$$Request {
    /** 音频id */
    file_id: number;
}
/** 音频浓缩异步结果获取 响应参数*/
export interface AudioCondenseResultApi$$Response {
    /** 结果音频id */
    result_file_id: number;
    /** 结果音频路径 */
    result_path: string;
    /** 结果音频名称 */
    result_File_name: string;
    /** 原始音频名称 */
    origin_file_name: string;
    /** 任务状态,是否完成 enum: finish/doing */
    task_status: string;
    /** 智能标记分片 */
    condense_slice: CondenseSliceItemTypes[];
}
/** 音频浓缩异步结果获取 */
export const AudioCondenseResultApi = (request: AudioCondenseResultApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<AudioCondenseResultApi$$Response>>('/v1/AudioCondenseResultApi',  request, InjectAbort(AudioCondenseResultApi, config));
};

/** ========================= **************** AudioDenoiseApi ****************** ========================= */
/** 音频降噪 请求参数 */
export interface AudioDenoiseApi$$Request {
    /** 音频id */
    file_id: number;
    /** 是否选中全文 enum: YES/NO */
    is_all_content: string;
    /** 开始时间(ms) */
    begin_time: number;
    /** 结束时间(ms) */
    end_time: number;
    /** 功能，DENOISE(降噪)/TONEUP(增益) */
    function: string;
    /** 降噪类型，NEURAL(神经网络)/WIENER(维纳滤波) */
    denoise_type: string;
    /** 降噪级别，维纳滤波降噪有效，0-100 */
    denoise_level: number;
    /** 增益比率，增益有效，0-100 */
    toneup_ratio: number;
}
/** 音频降噪 响应参数*/
export interface AudioDenoiseApi$$Response {}
/** 音频降噪 */
export const AudioDenoiseApi = (request: AudioDenoiseApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<AudioDenoiseApi$$Response>>('/v1/AudioDenoiseApi',  request, InjectAbort(AudioDenoiseApi, config));
};

/** ========================= **************** AudioDenoiseResultApi ****************** ========================= */
/** 音频降噪异步结果获取 请求参数 */
export interface AudioDenoiseResultApi$$Request {
    /** 音频id */
    file_id: number;
}
/** 音频降噪异步结果获取 响应参数*/
export interface AudioDenoiseResultApi$$Response {
    /** 结果音频id */
    result_file_id: number;
    /** 结果音频路径 */
    result_path: string;
    /** 结果音频名称 */
    result_File_name: string;
    /** 原始音频名称 */
    origin_file_name: string;
    /** 任务状态,是否完成 enum: finish/doing */
    task_status: string;
    /** 智能标记分片 */
    condense_slice: CondenseSliceItemTypes[];
}
/** 音频降噪异步结果获取 */
export const AudioDenoiseResultApi = (request: AudioDenoiseResultApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<AudioDenoiseResultApi$$Response>>('/v1/AudioDenoiseResultApi',  request, InjectAbort(AudioDenoiseResultApi, config));
};

/** ========================= **************** VoiceSeparationApi ****************** ========================= */
/** 人声分离 请求参数 */
export interface VoiceSeparationApi$$Request {
    /** 音频id */
    file_id: number;
    /** 功能，INTELLIGENT(智能分离)/CUSTOM(自定义分离) */
    function: string;
    /** 人数 */
    number: number;
    /** 类型，0(电话)/1(其它) */
    type: number;
}
/** 人声分离 响应参数*/
export interface VoiceSeparationApi$$Response {}
/** 人声分离 */
export const VoiceSeparationApi = (request: VoiceSeparationApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<VoiceSeparationApi$$Response>>('/v1/VoiceSeparationApi',  request, InjectAbort(VoiceSeparationApi, config));
};

/** ========================= **************** VoiceSeparationResultApi ****************** ========================= */
/** 人声分离异步结果获取 请求参数 */
export interface VoiceSeparationResultApi$$Request {
    /** 音频id */
    file_id: number;
}
/** 人声分离异步结果获取 响应参数*/
export interface VoiceSeparationResultApi$$Response {
    /** 分离音频列表 */
    result_file_list: ResultFileListItemTypes[];
    /** 原始音频名称 */
    origin_file_name: string;
    /** 任务状态,是否完成 enum: finish/doing */
    task_status: string;
}
/** 人声分离异步结果获取 */
export const VoiceSeparationResultApi = (request: VoiceSeparationResultApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<VoiceSeparationResultApi$$Response>>('/v1/VoiceSeparationResultApi',  request, InjectAbort(VoiceSeparationResultApi, config));
};

/** ========================= **************** AudioClusterApi ****************** ========================= */
/** 音频聚类 请求参数 */
export interface AudioClusterApi$$Request {
    /** 文件ID列表 */
    file_id_list: number[];
}
/** 音频聚类 响应参数*/
export interface AudioClusterApi$$Response {}
/** 音频聚类 */
export const AudioClusterApi = (request: AudioClusterApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<AudioClusterApi$$Response>>('/v1/AudioClusterApi',  request, InjectAbort(AudioClusterApi, config));
};

/** ========================= **************** AudioClusterResultApi ****************** ========================= */
/** 音频聚类异步结果获取 请求参数 */
export interface AudioClusterResultApi$$Request {
    /** 文件ID列表 */
    file_id_list: number[];
}
/** 音频聚类异步结果获取 响应参数*/
export interface AudioClusterResultApi$$Response {
    /** 分组 */
    group: GroupItemTypes[];
    /** 任务状态,是否完成 enum: finish/doing */
    task_status: string;
}
/** 音频聚类异步结果获取 */
export const AudioClusterResultApi = (request: AudioClusterResultApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<AudioClusterResultApi$$Response>>('/v1/AudioClusterResultApi',  request, InjectAbort(AudioClusterResultApi, config));
};

/** ========================= **************** GetVoiceWaveformApi ****************** ========================= */
/** 获取音频波形图 请求参数 */
export interface GetVoiceWaveformApi$$Request {
    /** 音频id */
    file_id: number;
}
/** 获取音频波形图 响应参数*/
export interface GetVoiceWaveformApi$$Response {
    /** 波形图 */
    data: number[];
}
/** 获取音频波形图 */
export const GetVoiceWaveformApi = (request: GetVoiceWaveformApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<GetVoiceWaveformApi$$Response>>('/v1/GetVoiceWaveformApi',  request, InjectAbort(GetVoiceWaveformApi, config));
};

/** ========================= **************** GetVoiceWaveformBySrcApi ****************** ========================= */
/** 获取音频波形图，直接传文件路径 请求参数 */
export interface GetVoiceWaveformBySrcApi$$Request {
    /** 文件路径 */
    src: string;
}
/** 获取音频波形图，直接传文件路径 响应参数*/
export interface GetVoiceWaveformBySrcApi$$Response {
    /** 波形图 */
    data: number[];
}
/** 获取音频波形图，直接传文件路径 */
export const GetVoiceWaveformBySrcApi = (request: GetVoiceWaveformBySrcApi$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<GetVoiceWaveformBySrcApi$$Response>>('/v1/GetVoiceWaveformBySrcApi',  request, InjectAbort(GetVoiceWaveformBySrcApi, config));
};

/** ========================= **************** upload ****************** ========================= */
/** 上传文件 请求参数 */
export interface upload$$Request {
    /** 文件列表 */
    file_list: FileListItemTypes[];
}
/** 上传文件 响应参数*/
export interface upload$$Response {
    /** 文件ID列表 */
    file_id_list: number[];
}
/** 上传文件 */
export const upload = (request: upload$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<upload$$Response>>('/v1/upload',  request, InjectAbort(upload, config));
};

/** ========================= **************** cancelUpload ****************** ========================= */
/** 取消上传 请求参数 */
export interface cancelUpload$$Request {
    /** 文件ID */
    file_id: number;
}
/** 取消上传 响应参数*/
export interface cancelUpload$$Response {}
/** 取消上传 */
export const cancelUpload = (request: cancelUpload$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<cancelUpload$$Response>>('/v1/cancelUpload',  request, InjectAbort(cancelUpload, config));
};

/** ========================= **************** uploadProgress ****************** ========================= */
/** 上传文件进度 请求参数 */
export interface uploadProgress$$Request {
    /** 文件ID */
    file_id: number;
}
/** 上传文件进度 响应参数*/
export interface uploadProgress$$Response {
    /** 状态，enum:start(开始),finish(完成),error(失败) */
    status: string;
    /** 错误信息 */
    msg: string;
}
/** 上传文件进度 */
export const uploadProgress = (request: uploadProgress$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<uploadProgress$$Response>>('/v1/uploadProgress',  request, InjectAbort(uploadProgress, config));
};

/** ========================= **************** BatchuploadProgress ****************** ========================= */
/** 批量获取上传文件进度 请求参数 */
export interface BatchuploadProgress$$Request {
    /** 文件ID列表 */
    file_id_list: number[];
}
/** 批量获取上传文件进度 响应参数*/
export interface BatchuploadProgress$$Response {
    /** 状态列表 */
    status_list: StatusListItemTypes[];
}
/** 批量获取上传文件进度 */
export const BatchuploadProgress = (request: BatchuploadProgress$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<BatchuploadProgress$$Response>>('/v1/BatchuploadProgress',  request, InjectAbort(BatchuploadProgress, config));
};

/** ========================= **************** getFile ****************** ========================= */
/** 获取文件信息 请求参数 */
export interface getFile$$Request {
    /** 文件ID */
    file_id: number;
}
/** 获取文件信息 响应参数*/
export interface getFile$$Response {
    /** 名称 */
    name: string;
    /** 原名称 */
    original_name: string;
    /** 时长 */
    duration: number;
    /** 大小 */
    size: number;
    /** 格式 */
    format: string;
    /** 声道 */
    channel: string;
    /** 实际声道数 */
    real_channel: number;
    /** 采样率 */
    sampleRate: string;
    /** 采样精度 */
    samplingAccuracy: string;
    /** 上传时间 */
    createTime: number;
}
/** 获取文件信息 */
export const getFile = (request: getFile$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<getFile$$Response>>('/v1/getFile',  request, InjectAbort(getFile, config));
};

/** ========================= **************** getFileBySrc ****************** ========================= */
/** 获取文件信息 请求参数 */
export interface getFileBySrc$$Request {
    /** 文件路径 */
    src: string;
}
/** 获取文件信息 响应参数*/
export interface getFileBySrc$$Response {
    /** 名称 */
    name: string;
    /** 时长 */
    duration: number;
    /** 大小 */
    size: number;
    /** 格式 */
    format: string;
    /** 声道 */
    channel: string;
    /** 实际声道数 */
    real_channel: number;
    /** 采样率 */
    sampleRate: string;
    /** 采样精度 */
    samplingAccuracy: string;
    /** 上传时间 */
    createTime: number;
}
/** 获取文件信息 */
export const getFileBySrc = (request: getFileBySrc$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<getFileBySrc$$Response>>('/v1/getFileBySrc',  request, InjectAbort(getFileBySrc, config));
};

/** ========================= **************** download ****************** ========================= */
/** 下载 请求参数 */
export interface download$$Request {
    /** 文件ID */
    file_id: number;
}
/** 下载 响应参数*/
export interface download$$Response {
    /** 文件路径 */
    src: string;
}
/** 下载 */
export const download = (request: download$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<download$$Response>>('/v1/download',  request, InjectAbort(download, config));
};

/** ========================= **************** historyFile ****************** ========================= */
/** 音频处理历史记录 请求参数 */
export interface historyFile$$Request {
    /** 文件名称 */
    file_name: string;
    /** 开始时间 */
    begin: number;
    /** 结束时间 */
    end: number;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 音频处理历史记录 响应参数*/
export interface historyFile$$Response {
    /** 记录 */
    history_list: HistoryListItemTypes[];
    /** 总数目 */
    total_count: number;
}
/** 音频处理历史记录 */
export const historyFile = (request: historyFile$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<historyFile$$Response>>('/v1/historyFile',  request, InjectAbort(historyFile, config));
};

/** ========================= **************** deleteFile ****************** ========================= */
/** 删除文件 请求参数 */
export interface deleteFile$$Request {
    /** 文件ID */
    file_id: number;
}
/** 删除文件 响应参数*/
export interface deleteFile$$Response {}
/** 删除文件 */
export const deleteFile = (request: deleteFile$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<deleteFile$$Response>>('/v1/deleteFile',  request, InjectAbort(deleteFile, config));
};

/** ========================= **************** addTag ****************** ========================= */
/** 新增标注 请求参数 */
export interface addTag$$Request {
    /** 文件ID */
    file_id: number;
    /** 开始时间 */
    begin: number;
    /** 结束时间 */
    end: number;
    /** 内容 */
    content: string;
}
/** 新增标注 响应参数*/
export interface addTag$$Response {}
/** 新增标注 */
export const addTag = (request: addTag$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<addTag$$Response>>('/v1/addTag',  request, InjectAbort(addTag, config));
};

/** ========================= **************** editTag ****************** ========================= */
/** 编辑标注 请求参数 */
export interface editTag$$Request {
    /** 标注ID */
    tag_id: number;
    /** 内容 */
    content: string;
}
/** 编辑标注 响应参数*/
export interface editTag$$Response {}
/** 编辑标注 */
export const editTag = (request: editTag$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<editTag$$Response>>('/v1/editTag',  request, InjectAbort(editTag, config));
};

/** ========================= **************** listTag ****************** ========================= */
/** 标注列表 请求参数 */
export interface listTag$$Request {
    /** 文件ID */
    file_id: number;
}
/** 标注列表 响应参数*/
export interface listTag$$Response {
    /** 标注列表 */
    tag_list: TagListItemTypes[];
}
/** 标注列表 */
export const listTag = (request: listTag$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<listTag$$Response>>('/v1/listTag',  request, InjectAbort(listTag, config));
};

/** ========================= **************** getUser ****************** ========================= */
/** 获取用户信息 请求参数 */
export interface getUser$$Request {
    /** 用户ID */
    user_id: number;
}
/** 获取用户信息 响应参数*/
export interface getUser$$Response {
    /** 用户ID */
    user_id: number;
    /** 用户名 */
    username: string;
    /** 超理账号 */
    super: number;
    /** 备注 */
    remark: string;
    /** 组织信息 */
    organization_info: undefined;
    /** 角色信息 */
    role_info: undefined;
}
/** 获取用户信息 */
export const getUser = (request: getUser$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<getUser$$Response>>('/v1/getUser',  request, InjectAbort(getUser, config));
};

/** ========================= **************** addUser ****************** ========================= */
/** 新增用户 请求参数 */
export interface addUser$$Request {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 组织ID */
    organization_id: number;
    /** 角色ID */
    role_id: number;
    /** 备注 */
    remark: string;
}
/** 新增用户 响应参数*/
export interface addUser$$Response {}
/** 新增用户 */
export const addUser = (request: addUser$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<addUser$$Response>>('/v1/addUser',  request, InjectAbort(addUser, config));
};

/** ========================= **************** editUser ****************** ========================= */
/** 编辑用户 请求参数 */
export interface editUser$$Request {
    /** 用户ID */
    user_id: number;
    /** 用户名 */
    username: string;
    /** 组织ID */
    organization_id: number;
    /** 角色ID */
    role_id: number;
    /** 备注 */
    remark: string;
}
/** 编辑用户 响应参数*/
export interface editUser$$Response {}
/** 编辑用户 */
export const editUser = (request: editUser$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<editUser$$Response>>('/v1/editUser',  request, InjectAbort(editUser, config));
};

/** ========================= **************** listUser ****************** ========================= */
/** 用户列表 请求参数 */
export interface listUser$$Request {
    /** 组织ID */
    organization_id: number;
    /** 用户名 */
    user_name: string;
    /** 开始时间 */
    begin: number;
    /** 结束时间 */
    end: number;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 用户列表 响应参数*/
export interface listUser$$Response {
    /** 用户列表 */
    user_list: UserListItemTypes[];
    /** 样本库总数目 */
    total_count: number;
}
/** 用户列表 */
export const listUser = (request: listUser$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<listUser$$Response>>('/v1/listUser',  request, InjectAbort(listUser, config));
};

/** ========================= **************** deleteUser ****************** ========================= */
/** 删除用户 请求参数 */
export interface deleteUser$$Request {
    /** 用户ID */
    user_id: number;
}
/** 删除用户 响应参数*/
export interface deleteUser$$Response {}
/** 删除用户 */
export const deleteUser = (request: deleteUser$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<deleteUser$$Response>>('/v1/deleteUser',  request, InjectAbort(deleteUser, config));
};

/** ========================= **************** changePassword ****************** ========================= */
/** 修改密码 请求参数 */
export interface changePassword$$Request {
    /** 用户ID */
    user_id: number;
    /** 旧密码 */
    old_password: string;
    /** 新密码 */
    new_password: string;
    /** 确认密码 */
    confirm_password: string;
}
/** 修改密码 响应参数*/
export interface changePassword$$Response {}
/** 修改密码 */
export const changePassword = (request: changePassword$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<changePassword$$Response>>('/v1/changePassword',  request, InjectAbort(changePassword, config));
};

/** ========================= **************** resetPassword ****************** ========================= */
/** 重置密码 请求参数 */
export interface resetPassword$$Request {
    /** 用户ID */
    user_id: number;
    /** 新密码 */
    new_password: string;
    /** 确认密码 */
    confirm_password: string;
}
/** 重置密码 响应参数*/
export interface resetPassword$$Response {}
/** 重置密码 */
export const resetPassword = (request: resetPassword$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<resetPassword$$Response>>('/v1/resetPassword',  request, InjectAbort(resetPassword, config));
};

/** ========================= **************** listOperatingRecord ****************** ========================= */
/** 操作记录列表 请求参数 */
export interface listOperatingRecord$$Request {
    /** 用户名 */
    user_name: string;
    /** 组织ID */
    organization_id: number;
    /** 操作类型 */
    action: string;
    /** 开始时间 */
    begin: number;
    /** 结束时间 */
    end: number;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 操作记录列表 响应参数*/
export interface listOperatingRecord$$Response {
    /** 操作记录列表 */
    record_list: RecordListItemTypes[];
    /** 样本库总数目 */
    total_count: number;
}
/** 操作记录列表 */
export const listOperatingRecord = (request: listOperatingRecord$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<listOperatingRecord$$Response>>('/v1/listOperatingRecord',  request, InjectAbort(listOperatingRecord, config));
};

/** ========================= **************** login ****************** ========================= */
/** 登录 请求参数 */
export interface login$$Request {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
}
/** 登录 响应参数*/
export interface login$$Response {
    /** 凭据 */
    token: string;
    /** 用户ID */
    user_id: number;
    /** 用户名 */
    username: string;
    /** 超理账号 */
    super: number;
    /** 备注 */
    remark: string;
    /** 组织信息 */
    organization_info: undefined;
    /** 角色信息 */
    role_info: undefined;
    /** 权限列表 */
    permission_list: PermissionListItemTypes[];
}
/** 登录 */
export const login = (request: login$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<login$$Response>>('/v1/login',  request, InjectAbort(login, config));
};

/** ========================= **************** logout ****************** ========================= */
/** 退出登录 请求参数 */
export interface logout$$Request {}
/** 退出登录 响应参数*/
export interface logout$$Response {}
/** 退出登录 */
export const logout = (request: logout$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<logout$$Response>>('/v1/logout',  request, InjectAbort(logout, config));
};

/** ========================= **************** addOrganization ****************** ========================= */
/** 新增组织 请求参数 */
export interface addOrganization$$Request {
    /** 上级ID，根级为0 */
    parent_id: number;
    /** 名称 */
    name: string;
}
/** 新增组织 响应参数*/
export interface addOrganization$$Response {}
/** 新增组织 */
export const addOrganization = (request: addOrganization$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<addOrganization$$Response>>('/v1/addOrganization',  request, InjectAbort(addOrganization, config));
};

/** ========================= **************** editOrganization ****************** ========================= */
/** 编辑组织 请求参数 */
export interface editOrganization$$Request {
    /** 组织ID */
    organization_id: number;
    /** 上级ID，根级为0 */
    parent_id: number;
    /** 名称 */
    name: string;
}
/** 编辑组织 响应参数*/
export interface editOrganization$$Response {}
/** 编辑组织 */
export const editOrganization = (request: editOrganization$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<editOrganization$$Response>>('/v1/editOrganization',  request, InjectAbort(editOrganization, config));
};

/** ========================= **************** listOrganization ****************** ========================= */
/** 组织列表 请求参数 */
export interface listOrganization$$Request {}
/** 组织列表 响应参数*/
export interface listOrganization$$Response {
    /** 组织列表 */
    organization_list: OrganizationListItemTypes[];
}
/** 组织列表 */
export const listOrganization = (request: listOrganization$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<listOrganization$$Response>>('/v1/listOrganization',  request, InjectAbort(listOrganization, config));
};

/** ========================= **************** deleteOrganization ****************** ========================= */
/** 删除组织 请求参数 */
export interface deleteOrganization$$Request {
    /** 组织ID */
    organization_id: number;
}
/** 删除组织 响应参数*/
export interface deleteOrganization$$Response {}
/** 删除组织 */
export const deleteOrganization = (request: deleteOrganization$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<deleteOrganization$$Response>>('/v1/deleteOrganization',  request, InjectAbort(deleteOrganization, config));
};

/** ========================= **************** addRole ****************** ========================= */
/** 新增角色 请求参数 */
export interface addRole$$Request {
    /** 角色名 */
    role_name: string;
    /** 权限ID列表 */
    permission_id_list: number[];
}
/** 新增角色 响应参数*/
export interface addRole$$Response {}
/** 新增角色 */
export const addRole = (request: addRole$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<addRole$$Response>>('/v1/addRole',  request, InjectAbort(addRole, config));
};

/** ========================= **************** editRole ****************** ========================= */
/** 编辑角色 请求参数 */
export interface editRole$$Request {
    /** 角色ID */
    role_id: number;
    /** 角色名 */
    role_name: string;
    /** 权限ID列表 */
    permission_id_list: number[];
}
/** 编辑角色 响应参数*/
export interface editRole$$Response {}
/** 编辑角色 */
export const editRole = (request: editRole$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<editRole$$Response>>('/v1/editRole',  request, InjectAbort(editRole, config));
};

/** ========================= **************** listRole ****************** ========================= */
/** 角色列表 请求参数 */
export interface listRole$$Request {
    /** 角色名 */
    role_name: string;
    /** 开始时间 */
    begin: number;
    /** 结束时间 */
    end: number;
    /** 页码 */
    page: number;
    /** 单页个数 */
    count: number;
}
/** 角色列表 响应参数*/
export interface listRole$$Response {
    /** 角色列表 */
    role_list: RoleListItemTypes[];
    /** 样本库总数目 */
    total_count: number;
}
/** 角色列表 */
export const listRole = (request: listRole$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<listRole$$Response>>('/v1/listRole',  request, InjectAbort(listRole, config));
};

/** ========================= **************** deleteRole ****************** ========================= */
/** 删除角色 请求参数 */
export interface deleteRole$$Request {
    /** 角色ID */
    role_id: number;
}
/** 删除角色 响应参数*/
export interface deleteRole$$Response {}
/** 删除角色 */
export const deleteRole = (request: deleteRole$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<deleteRole$$Response>>('/v1/deleteRole',  request, InjectAbort(deleteRole, config));
};

/** ========================= **************** listPermission ****************** ========================= */
/** 权限列表 请求参数 */
export interface listPermission$$Request {}
/** 权限列表 响应参数*/
export interface listPermission$$Response {
    /** 权限列表 */
    permission_list: PermissionListItemTypes[];
}
/** 权限列表 */
export const listPermission = (request: listPermission$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.post<BaseServeResponse<listPermission$$Response>>('/v1/listPermission',  request, InjectAbort(listPermission, config));
};


export interface TaskInfoListItemTypes {
  /** 布控任务id */
  task_id: number;
  /** 任务名称 */
  task_name: string;
  /** 布控状态 enum:DEPLOY_CONTROL_ING:布控中,DEPLOY_CONTROL_REVOKE:已撤销 */
  task_status: string;
  /** 语种识别 */
  language: string;
  /** 布控范围，ALL(全部)/SAMPLE(样本库)/MATERIAL(检材库) */
  library: string;
}
export interface AlarmInfoListItemTypes {
  /** 告警音频id */
  file_id: number;
  /** 告警音频名称 */
  file_name: string;
  /** 声纹相似度 */
  score: number;
  /** 语种识别 */
  language: string;
  /** 布控任务名称 */
  task_name: string;
  /** 告警时间 */
  alarm_time: number;
  /** 告警编号 */
  alarm_id: number;
}
export interface ResultInfoListItemTypes {
  /** 开始时间(ms) */
  begin_time: number;
  /** 结束时间(ms) */
  end_time: number;
  /** 置信度 */
  poss: number;
}
export interface SearchFileInfoListItemTypes {
  /** 文件id */
  file_id: number;
  /** 文件名称 */
  file_name: string;
  /** 语种 */
  language: string;
  /** 音频时长(ms) */
  duration: number;
  /** 搜索结果列表 */
  result_info_list: ResultInfoListItemTypes[];
}
export interface CompareResultListItemTypes {
  /** 文件id */
  file_id: number;
  /** 比对分数 */
  score: number;
  /** 音频文件名称 */
  file_name: string;
  /** 语种 */
  language: string;
  /** 比对时间 */
  compare_time: number;
  /** 比对库，SAMPLE(样本库)/MATERIAL(检材库) */
  library: string;
  /** 性别，male(男)/female(女) */
  gender: string;
}
export interface CompareResultListItemTypes {
  /** 文件id */
  file_id: number;
  /** 比对分数 */
  score: number;
  /** 音频文件名称 */
  file_name: string;
  /** 语种 */
  language: string;
  /** 比对时间 */
  compare_time: number;
  /** 比对库，SAMPLE(样本库)/MATERIAL(检材库) */
  library: string;
  /** 性别，male(男)/female(女) */
  gender: string;
}
export interface CompareVoiceListItemTypes {
  /** 比对音频ID */
  file_id: number;
  /** 比对音频名称 */
  file_name: string;
  /** 比对音频语种 */
  language: string;
  /** 比对音频性别，male(男)/female(女) */
  gender: string;
  /** 比对结果列表 */
  compare_result_list: CompareResultListItemTypes[];
}
export interface SampleFileListItemTypes {
  /** 声纹id */
  voice_print_id: number;
  /** 音频id */
  file_id: number;
  /** 音频名称 */
  file_name: string;
  /** 样本库名称 */
  sample_library_name: string;
  /** 入库时间 */
  create_time: number;
}
export interface SampleListItemTypes {
  /** 姓名 */
  name: string;
  /** 性别 */
  gender: string;
  /** 音频文件id */
  file_id: number;
}
export interface VoiceListItemTypes {
  /** 声纹id */
  id: number;
  /** 编号 */
  code: string;
  /** 姓名 */
  name: string;
  /** 性别，男(male)/女(female) */
  gender: string;
  /** 音频文件id */
  file_id: number;
  /** 创建时间 */
  create_time: number;
}
export interface VoiceInfoListItemTypes {
  /** 文件名称 */
  file_name: string;
  /** 文件id */
  file_id: number;
  /** 文件路径 */
  src: string;
}
export interface MaterialListItemTypes {
  /** 声纹id */
  id: number;
  /** 编号 */
  code: string;
  /** 音频文件id */
  file_id: number;
  /** 是否聚类 */
  is_cluster: boolean;
  /** 创建时间 */
  create_time: number;
}
export interface VoicePrintItemTypes {
  /** 文件路径 */
  src: string;
  /** 声纹向量 */
  vector: string;
  /** 文件id */
  file_id: number;
  /** 文件名称 */
  file_name: string;
}
export interface GroupItemTypes {
  /** 音频标记 */
  voice_print: VoicePrintItemTypes[];
}
export interface HistoryRecordInfoListItemTypes {
  /** 历史记录id */
  id: number;
  /** 任务名称 */
  task_name: string;
  /** 记录类型, enum: VOICE_ANALYSIS,SEARCH_VOICE,VPR */
  record_type: string;
  /** 创建时间 */
  create_time: number;
}
export interface CondenseSliceItemTypes {
  /** 开始时间(ms) */
  begin_time: number;
  /** 结束时间(ms) */
  end_time: number;
}
export interface CondenseSliceItemTypes {
  /** 开始时间(ms) */
  begin_time: number;
  /** 结束时间(ms) */
  end_time: number;
}
export interface ResultFileListItemTypes {
  /** 音频Id */
  file_id: number;
  /** 音频路径 */
  file_path: string;
  /** 音频名称 */
  file_name: string;
  /** 音频时长 */
  file_duration: number;
  /** 原始音频名称 */
  origin_file_name: string;
}
export interface VoicePrintItemTypes {
  /** 文件路径 */
  src: string;
  /** 声纹向量 */
  vector: string;
  /** 文件id */
  file_id: number;
  /** 文件名称 */
  file_name: string;
}
export interface GroupItemTypes {
  /** 音频标记 */
  voice_print: VoicePrintItemTypes[];
}
export interface FileListItemTypes {
  /** 文件路径 */
  src: string;
  /** 是否转换格式 */
  is_convert: boolean;
}
export interface StatusListItemTypes {
  /** 文件ID */
  file_id: number;
  /** 文件名称 */
  file_name: string;
  /** 文件路径 */
  file_src: string;
  /** 状态，enum:start(开始),finish(完成),error(失败) */
  status: string;
  /** 错误信息 */
  msg: string;
}
export interface HistoryListItemTypes {
  /** 文件ID */
  file_id: number;
  /** 文件名称 */
  file_name: string;
  /** 文件路径 */
  file_src: string;
  /** 原文件ID */
  original_file_id: number;
  /** 原文件名称 */
  original_file_name: string;
  /** 原文件路径 */
  original_file_src: string;
  /** 上传时间 */
  createTime: number;
}
export interface TagListItemTypes {
  /** 标注ID */
  id: number;
  /** 开始时间 */
  begin: number;
  /** 结束时间 */
  end: number;
  /** 内容 */
  content: string;
}
export interface UserListItemTypes {
  /** 用户ID */
  id: number;
  /** 用户名 */
  user_name: string;
  /** 组织名 */
  organization_name: string;
  /** 角色名 */
  role_name: string;
  /** 创建时间 */
  create_time: number;
  /** 更新时间 */
  update_time: number;
}
export interface RecordListItemTypes {
  /** 用户名 */
  user_name: string;
  /** 组织名 */
  organization_name: string;
  /** 角色名 */
  role_name: string;
  /** 操作类型 */
  action: string;
  /** 操作内容 */
  content: undefined;
  /** 创建时间 */
  create_time: number;
}
export interface PermissionListItemTypes {
  /** 权限ID */
  id: number;
  /** 父级ID，0为顶级 */
  parent_id: number;
  /** 名称 */
  name: string;
  /** 标识 */
  code: string;
}
export interface OrganizationListItemTypes {
  /** 组织ID */
  organization_id: number;
  /** 上级ID，根级为0 */
  parent_id: number;
  /** 名称 */
  name: string;
}
export interface RoleListItemTypes {
  /** 角色ID */
  id: number;
  /** 角色名 */
  role_name: string;
  /** 权限ID列表 */
  permission_id_list: number[];
  /** 创建时间 */
  create_time: number;
  /** 更新时间 */
  update_time: number;
}
export interface PermissionListItemTypes {
  /** 权限ID */
  id: number;
  /** 父级ID，0为顶级 */
  parent_id: number;
  /** 名称 */
  name: string;
  /** 标识 */
  code: string;
}