import { Button, Form, Input, Modal, Radio } from 'antd';
import React, { RefObject, forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { RadioChangeEvent } from 'antd/lib/radio';
import { useInject } from '@/Render/components/Hooks';
import utils from '@/Render/utils';

export interface OpenType {
  open: (params?: { content?: string; marks?: number }) => void;
  onCancel: () => void;
}

interface Props {
  /** 是否为: 查看更多 */
  isShowMore: boolean;
  ref?: RefObject<OpenType>;
  title: string; // '新增标注' | '查看编辑' | '查看更多'
  /** 标注区域时间 与 时长 */
  region: { start: number; end: number; times?: number; name?: string };
  onSubmit: (value: { content: string }) => void;
  onDelete?: () => void;
}
const noop = () => {};

export const MarkVoice = forwardRef((props: Props, ref) => {
  const { Global } = useInject('Global');
  const { title, region, onSubmit, isShowMore, onDelete = noop } = props;
  const [formInstance] = Form.useForm();
  const [content, setContent] = useState<string>('');
  const [isMark, setIsMark] = useState<number>(2);
  const [visible, setVisible] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<object>({ content: undefined, marks: 1 });
  useImperativeHandle(ref, () => ({ open, onCancel }));

  useEffect(() => {
    if (!visible) {
      Global.setShowSignEdit(false);
    }
  }, [visible]);

  /** 标注弹窗(修改标注) */
  const open = (params) => {
    setVisible(true);
    if (params) {
      formInstance.setFieldsValue(params);
      setInitialValues(params);
      setContent(params.content || '');
      /** 设置是否显示标注 */
      setIsMark(params.marks || 1);
    }
  };

  /** 取消标注 */
  const onFinish = (value) => {
    onSubmit(value);
    formInstance.resetFields();
  };

  /** 取消标注 */
  const onCancel = () => {
    formInstance.resetFields();
    setContent('');
    setVisible(false);
  };

  return (
    <Modal title={title} centered visible={visible} footer={null} width={480} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      <div className="voice-wrap">
        <div>
          <span className="label-colon">{isShowMore ? '已浓缩区域' : '当前已框选音频区域'}</span>
          {utils.toHHmmss(region.start)}-{utils.toHHmmss(region.end)}
        </div>
        {isShowMore ? (
          <div className="mt10">
            <span className="label-colon">已浓缩时长</span>
            {utils.toHHmmss(region?.times || 0)}
          </div>
        ) : null}
        <Form
          name="complex-form"
          form={formInstance}
          onFinish={onFinish}
          style={{ marginTop: 20, display: isMark === 2 ? 'none' : 'block' }}
          initialValues={initialValues}
          onValuesChange={({ content }) => setContent(content)}
        >
          {isShowMore ? (
            <Form.Item label="是否进行标注" name="marks">
              <Radio.Group value={isMark} onChange={(e: RadioChangeEvent) => setIsMark(e.target.value)}>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </Form.Item>
          ) : null}
          {/* 如果是音频浓缩 且选择不进行标注时 */}
          {isMark !== 2 ? (
            <Form.Item>
              <Form.Item name="content" rules={[{ required: true, message: '请输入标注内容' }]} noStyle>
                <Input style={{ width: '80%' }} allowClear placeholder="请输入标注内容" maxLength={10} />
              </Form.Item>
              <span style={{ color: '#fff', paddingLeft: 10 }}>{content?.length > 10 ? 10 : content?.length || 0}/10</span>
            </Form.Item>
          ) : null}
          {isShowMore ? <div style={{ marginTop: 40, color: 'var(--bdc)' }}>提示：标注内容会显示在当前已浓缩的音频位置</div> : null}
          <Form.Item style={{ textAlign: 'center', marginTop: 40 }}>
            {title === '查看编辑' ? (
              <Button onClick={onDelete} className="mr20">
                删除
              </Button>
            ) : (
              <Button onClick={onCancel} className="mr20">
                取消
              </Button>
            )}
            <Button type="primary" htmlType="submit">
              {title === '新增标注' ? '确定' : '提交并修改'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
});
