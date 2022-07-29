import FlowChart from './FlowChart';
import React from 'react';

interface Props {}

const Wrap: React.FC<Props> = (props) => {
  const graphData = {
    nodes: [
      {
        id: '000',
        type: 'circle',
        x: 400,
        y: 100,
        properties: { describe: '描述: 音频浓缩(过滤静音 无效音 保留人声部分)' },
        text: { x: 400, y: 100, value: '开始11' }
      },
      {
        id: '111',
        type: 'rect',
        x: 400,
        y: 260,
        properties: { describe: '描述: 音频浓缩(过滤静音 无效音 保留人声部分)' },
        text: { x: 400, y: 260, value: '音频浓缩' }
      },
      {
        id: '222',
        type: 'diamond',
        x: 400,
        y: 400,
        properties: { describe: '描述: 音频降噪(神经网络降噪)' },
        text: { x: 400, y: 400, value: '神经网络降噪22' }
      },
      { id: '333', type: 'rect', x: 400, y: 560, properties: { describe: '描述: 音频声道分离(左声道)' }, text: { x: 400, y: 560, value: '声道分离33' } }
    ],
    edges: [
      {
        id: 'b9d88d4f-5d68-4db0-a6c2-6d149c98c2b8',
        type: 'polyline',
        sourceNodeId: '000',
        targetNodeId: '111',
        startPoint: { x: 400, y: 150 },
        endPoint: { x: 400, y: 220 },
        properties: {},
        text: { x: 400, y: 185, value: '11' },
        pointsList: [
          { x: 400, y: 150 },
          { x: 400, y: 220 }
        ]
      },
      {
        id: 'ee786bc8-0731-4c13-8174-b1dc3cc8fef5',
        type: 'polyline',
        sourceNodeId: '111',
        targetNodeId: '222',
        startPoint: { x: 400, y: 300 },
        endPoint: { x: 400, y: 350 },
        properties: {},
        text: { x: 400, y: 315, value: '11' },
        pointsList: [
          { x: 400, y: 300 },
          { x: 400, y: 330 },
          { x: 400, y: 330 },
          { x: 400, y: 320 },
          { x: 400, y: 320 },
          { x: 400, y: 350 }
        ]
      }
    ]
  };
  return (
    <div className="flex-col ui-w-100 ui-h-100">
      <div>
        <div>欢迎使用 流程自动化</div>
        <div>您即将开始自动化流程处理的新旅程，还在等什么呢</div>
        {/* <HailenUpload /> */}
      </div>
      <FlowChart graphData={graphData} />
      {/* <FlowChart graphData={undefined} /> */}
    </div>
  );
};

export default Wrap;
