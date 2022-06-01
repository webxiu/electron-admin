import { NativeImage, ReadBookmark, Data } from 'electron';
/**
 * 读取剪贴板中的文件路径
 */
export function readFilePaths(): string[];

/**
 * 写入文件路径到剪贴板
 * @param PathList 路径数组
 */
export function writeFilePaths(PathList: string[]): string[];
/**
 * 清空
 */
export function clear(): void;

/**
 * 保存剪贴板中的图片到jpeg 同步法
 * @param targetPath 保存到什么地方
 * @param compressFactor 压缩率
 */
export function saveImageAsJpegSync(targetPath: string, compressFactor: number): boolean;

/**
 * 保存剪贴板中的图片到jpeg 异步法
 * @param targetPath 保存到什么地方
 * @param compressFactor 压缩率
 */
export function saveImageAsJpeg(targetPath: string, compressFactor: number): Promise<boolean>;

/**
 * 保存剪贴板中的图片到png 同步法
 * @param targetPath 保存到什么地方
 */
export function saveImageAsPngSync(targetPath: string): boolean;

/**
 * 保存剪贴板中的图片到jpeg 异步法
 * @param targetPath 保存到什么地方
 */
export function saveImageAsPng(targetPath: string): Promise<boolean>;
/**
 * 判断监听板中是否为图像
 */
export function hasImage(): boolean;
/**
 * 写入图片到剪贴板 同步法
 * @param imaePath 图片路径
 */
export function putImageSync(imaePath: string): boolean;
/**
 * 写入图片到剪贴板 异步法
 * @param imaePath 图片路径
 */
export function putImage(imaePath: string): Promise<boolean>;

interface Clipboard {
  // Docs: https://electronjs.org/docs/api/clipboard

  /**
   * An array of supported formats for the clipboard `type`.
   */
  availableFormats(type?: 'selection' | 'clipboard'): string[];
  /**
   * Clears the clipboard content.
   */
  clear(type?: 'selection' | 'clipboard'): void;
  /**
   * Whether the clipboard supports the specified `format`.
   *
   * @experimental
   */
  has(format: string, type?: 'selection' | 'clipboard'): boolean;
  /**
   * Reads `format` type from the clipboard.
   *
   * `format` should contain valid ASCII characters and have `/` separator. `a/c`,
   * `a/bc` are valid formats while `/abc`, `abc/`, `a/`, `/a`, `a` are not valid.
   *
   * @experimental
   */
  read(format: string): string;
  /**
   * * `title` String
   * * `url` String
   *
   * Returns an Object containing `title` and `url` keys representing the bookmark in
   * the clipboard. The `title` and `url` values will be empty strings when the
   * bookmark is unavailable.  The `title` value will always be empty on Windows.
   *
   * @platform darwin,win32
   */
  readBookmark(): ReadBookmark;
  /**
   * Reads `format` type from the clipboard.
   *
   * @experimental
   */
  readBuffer(format: string): Buffer;
  /**
   * The text on the find pasteboard, which is the pasteboard that holds information
   * about the current state of the active application’s find panel.
   *
   * This method uses synchronous IPC when called from the renderer process. The
   * cached value is reread from the find pasteboard whenever the application is
   * activated.
   *
   * @platform darwin
   */
  readFindText(): string;
  /**
   * The content in the clipboard as markup.
   */
  readHTML(type?: 'selection' | 'clipboard'): string;
  /**
   * The image content in the clipboard.
   */
  readImage(type?: 'selection' | 'clipboard'): NativeImage;
  /**
   * The content in the clipboard as RTF.
   */
  readRTF(type?: 'selection' | 'clipboard'): string;
  /**
   * The content in the clipboard as plain text.
   */
  readText(type?: 'selection' | 'clipboard'): string;
  /**
   * Writes `data` to the clipboard.
   */
  write(data: Data, type?: 'selection' | 'clipboard'): void;
  /**
   * Writes the `title` (macOS only) and `url` into the clipboard as a bookmark.
   *
   * **Note:** Most apps on Windows don't support pasting bookmarks into them so you
   * can use `clipboard.write` to write both a bookmark and fallback text to the
   * clipboard.
   *
   * @platform darwin,win32
   */
  writeBookmark(title: string, url: string, type?: 'selection' | 'clipboard'): void;
  /**
   * Writes the `buffer` into the clipboard as `format`.
   *
   * @experimental
   */
  writeBuffer(format: string, buffer: Buffer, type?: 'selection' | 'clipboard'): void;
  /**
   * Writes the `text` into the find pasteboard (the pasteboard that holds
   * information about the current state of the active application’s find panel) as
   * plain text. This method uses synchronous IPC when called from the renderer
   * process.
   *
   * @platform darwin
   */
  writeFindText(text: string): void;
  /**
   * Writes `markup` to the clipboard.
   */
  writeHTML(markup: string, type?: 'selection' | 'clipboard'): void;
  /**
   * Writes `image` to the clipboard.
   */
  writeImage(image: NativeImage, type?: 'selection' | 'clipboard'): void;
  /**
   * Writes the `text` into the clipboard in RTF.
   */
  writeRTF(text: string, type?: 'selection' | 'clipboard'): void;
  /**
   * Writes the `text` into the clipboard as plain text.
   */
  writeText(text: string, type?: 'selection' | 'clipboard'): void;
}

type availableFormats = Clipboard['availableFormats'];

type writeText = Clipboard['availableFormats'];
type writeImage = Clipboard['writeImage'];
type writeRTF = Clipboard['writeRTF'];
type writeHTML = Clipboard['writeHTML'];
type writeFindText = Clipboard['writeFindText'];
type writeBookmark = Clipboard['writeBookmark'];
type writeBuffer = Clipboard['writeBuffer'];
type readImage = Clipboard['readImage'];
type write = Clipboard['write'];
// type clear=Clipboard['clear'];
type readBookmark = Clipboard['readBookmark'];
type readFindText = Clipboard['readFindText'];
type readText = Clipboard['readText'];
type readHTML = Clipboard['readHTML'];
type has = Clipboard['has'];
type readRTF = Clipboard['readRTF'];
type readBuffer = Clipboard['readBuffer'];
type read = Clipboard['read'];

export {
  availableFormats,
  writeText,
  writeRTF,
  writeImage,
  writeHTML,
  writeFindText,
  writeBuffer,
  writeBookmark,
  write,
  readText,
  readRTF,
  readImage,
  readHTML,
  readFindText,
  readBuffer,
  readBookmark,
  read,
  has
  // clear,
};
