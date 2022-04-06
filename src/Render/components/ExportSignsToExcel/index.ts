import XLSX, { ParsingOptions, WorkBook, WorkSheet } from 'xlsx';

import fs from 'fs';
import { generateFilePath } from '@/Render/utils/fs';
import { message } from 'antd';

/** 导出数据类型 */
export interface ExportMarkType {
  [index: string]: string;
}

/** 字符串转ArrayBuffer */
const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

/** 导出Excel配置, 生成Blob */
const workbook2blob = (data: ExportMarkType[]) => {
  const sheet1: WorkSheet = XLSX.utils.json_to_sheet(data);
  // const sheet2: WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet1, '标注区域内容');
  // XLSX.utils.book_append_sheet(workbook, sheet2, '标注区域内容2'); //添加1个sheet
  const wbout = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  } as ParsingOptions);

  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  return blob;
};

/** blob 转 arraybuffer */
const blobToDataURL = (blob) => {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = (e) => {
      resolve(e.target?.result);
    };
    fr.readAsArrayBuffer(blob);
  });
};

/**
 * 导出标注
 * @param data 导出数据 (键名为中文, 即表头名称)
 * @param fileName 导出文件名 (带后缀)
 */
export const onExportSign = async (data: ExportMarkType[], info: { src: string; fileName: string }) => {
  const blob = workbook2blob(data); //导出excel的Blob
  const b64string = (await blobToDataURL(blob)) as string;
  const buffer = Buffer.from(b64string, 'base64');
  const filePath = generateFilePath(info.src, `${info.fileName}_` + '导出标注内容', '.xlsx');
  if (!fs.existsSync(filePath)) {
    fs.writeFile(filePath, buffer, 'utf8', (err: NodeJS.ErrnoException | null) => {
      if (err) {
        message.error({ content: '导出标注失败', duration: 1.5 });
      } else {
        message.success({ content: '导出标注成功', duration: 1.5 });
      }
    });
  }
};
