import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';

import { BpmnElement, Control, DndPanel, InsertNodeInPolyline, Menu, MiniMap, SelectionSelect, Snapshot } from '@logicflow/extension';
import { FLOW_DRAG_KEY, initFlowConfig, optionsConfig } from './config';
import LogicFlow, { Extension, GraphModel } from '@logicflow/core';
import React, { useEffect, useRef, useState } from 'react';

import { AppEventNames } from '~/src/Types/EventTypes';
import { Button } from 'antd';
import PubSub from 'pubsub-js';
import TreeMenu from './TreeMenu';
import utils from '@/Render/utils/index';

const plugins: Extension[] = [Menu, MiniMap, DndPanel, SelectionSelect, Control, Snapshot, InsertNodeInPolyline];

plugins.forEach((plugin) => LogicFlow.use(plugin));
interface Props {
  graphData?: {};
}

const Wrap: React.FC<Props> = (props) => {
  const { graphData } = props;
  const refContainer = useRef<HTMLDivElement>(null);
  const [logicFlow, setLogicFlow] = useState<LogicFlow>();
  const [viewSize, setViewSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    PubSub.subscribe(AppEventNames.CHANGE_THEME, (_, theme: AppThemeColor) => {
      console.log('theme', theme);
      if (theme === 'light') {
        logicFlow?.setTheme({
          baseNode: { fill: '#fff', stroke: '#f60', strokeWidth: 1 }
        });
      } else {
        logicFlow?.setTheme({
          baseNode: { fill: '#f60', stroke: '#00f', strokeWidth: 1 }
        });
      }
    });
  }, [logicFlow]);

  useEffect(() => {
    if (viewSize.width === 0 || viewSize.height === 0) return;
    try {
      const container = refContainer.current as HTMLElement;
      const options = optionsConfig({ plugins, container });
      const lf = new LogicFlow(options);
      const { patternItems, rightKeyMenu, navButton } = initFlowConfig(lf);

      // 在控制菜单添加导航栏按钮
      // lf.extension.control.addItem(navButton);
      // 配置右键菜单(追加菜单)
      // lf.extension.menu.addMenuConfig(rightKeyMenu);

      // 左侧节点添加面板
      lf.setPatternItems(patternItems);
      // 配置右键菜单(覆盖默认菜单)
      lf.extension.menu.setMenuConfig(rightKeyMenu);
      // 限制节点移动
      lf.graphModel.addNodeMoveRules((model, deltaX, deltaY) => {
        if (['000', 'xxxxxxx'].includes(model.id)) {
          return false;
        }
        return true;
      });

      // addNode(lf);

      // 缩放比例
      lf.zoom(1);

      render(lf);
      setLogicFlow(lf); // 缓存实例

      // 显示缩略图
      lf.extension.miniMap.show(viewSize.width - 152 - 5, viewSize.height - 242 - 5);
      /* 事件 */
      const events = [
        { ev: 'connection:not-allowed', type: '不允许建立连接' },
        { ev: 'anchor:dragstart', type: 'dragstart' },
        { ev: 'anchor:drop', type: 'drop' },
        { ev: 'node:mousemove', type: '鼠标移动节点' },
        { ev: 'node:mouseenter', type: '鼠标进入节点' },
        { ev: 'node:mouseleave', type: '鼠标离开节点' },
        { ev: 'node:add', type: '添加事件' },
        { ev: 'node:click', type: '点击事件' },
        { ev: 'node:drop', type: '节点拖拽放开' },
        { ev: 'edge:adjust', type: '边拖拽调整' },
        { ev: 'node:dnd-add', type: '外部拖入节点添加时触发' },
        { ev: 'blank:mousemove', type: '画布鼠标移动' },
        { ev: 'blank:drop', type: '画布拖拽放开' }
      ];

      events.forEach((event) => {
        lf.on(event.ev, (data) => {
          console.log(event.type, '=====', data);
        });
      });

      const { eventCenter } = lf.graphModel;

      eventCenter.on('node:mousemove', (args) => {
        console.log('兹定于:', args.position);
      });
    } catch (error) {
      console.log('error:', error);
    }
  }, [viewSize]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize, false);

    document.addEventListener(
      'mousemove',
      utils.throttle((e) => {
        const { top, left } = getRealPos(e);
        console.log('document事件:', top - 217, left - 361);
      }, 300)
    );
  }, []);

  const resize = () => {
    if (refContainer.current) {
      const rect = refContainer.current.getBoundingClientRect();
      setViewSize({
        width: Math.floor(rect.width),
        height: Math.floor(rect.height)
      });
    }
  };

  /** 渲染流程图 */
  const render = (logicflow: LogicFlow) => {
    const config = {
      nodes: [
        {
          id: '000',
          type: 'circle',
          x: 400,
          y: 100,
          properties: { describe: '描述: 音频浓缩(过滤静音 无效音 保留人声部分)' },
          text: { x: 400, y: 100, value: '开始11', draggable: true, editable: false }
        }
      ],
      edges: []
    };
    const gd = graphData || config; // 回显|新建
    logicflow.render(gd);
  };
  /** 添加一个节点 */
  const addNode = (logicflow: LogicFlow) => {
    // 添加节点
    let idIndex = 3;
    const timer = setInterval(() => {
      logicflow.addNode({
        id: `${idIndex}`,
        type: 'rect',
        x: 200,
        y: 50 + idIndex * 150,
        text: `节点${idIndex}`,
        properties: {}
      });
      const edge = {
        sourceNodeId: `${idIndex - 1}`,
        targetNodeId: `${idIndex}`,
        type: 'polyline',
        text: `连线${idIndex}`,
        properties: {}
      };
      console.log('edge', idIndex, edge);
      logicflow.addEdge(edge);
      // logicflow.deleteNode()
      idIndex++;
      if (idIndex > 5) {
        clearInterval(timer);
      }
    }, 1000);
  };

  // 下载缩略图
  const downloadImage = async (bgColor = '#fff') => {
    if (logicFlow) {
      const snapshot: Snapshot = logicFlow.extension.snapshot;
      snapshot.getSnapshot('缩略图', bgColor);
      const res = (await snapshot.getSnapshotBase64(bgColor)) as any;
      console.log('缩略图', res.data);
    }
  };
  // 获取当前选中
  const getSelectNodeID = () => {
    if (!logicFlow) return;
    const graphModel: GraphModel = logicFlow.graphModel;
    const selectNode = graphModel.selectElements;
    let id: string = '';
    for (const value of selectNode) {
      const obj = value[1];
      if (obj.id) {
        id = obj.id;
      }
      console.log('id:', value[0]);
      console.log('properties:', obj);
    }
    return id;
  };
  // 获取当前选中
  const getSelect = () => {
    if (!logicFlow) return;
    // 获取所有的节点
    const graphModel: GraphModel = logicFlow.graphModel;
    const selectNode = graphModel.selectElements;
    // graphModel.resize(200, 200);
    for (const value of selectNode) {
      const obj = value[1];
      console.log('id:', value[0]);
      console.log('properties:', {
        id: obj.id,
        text: obj.text.value,
        properties: obj.properties
      });
    }
    logicFlow.render({
      nodes: [...graphModel.nodes],
      edges: [
        ...graphModel.edges,
        {
          sourceNodeId: '222',
          targetNodeId: '333',
          type: 'polyline',
          text: '3333'
        }
      ]
    });

    console.log('所有节点', graphModel.nodes);
    console.log('所有连线', graphModel.edges);
  };

  const update = () => {
    if (!logicFlow) return;
    const id = getSelectNodeID();
    getData('222');
    console.log('id', id);
    const nodeModel = logicFlow.getNodeModelById(id);
    if (nodeModel) {
      nodeModel.updateText('hello world');
      logicFlow.setProperties(id, {
        disabled: false,
        scale: 2,
        aaa: 333
      });
    }
  };
  const select = () => {
    if (!logicFlow) return;
    const graphModel: GraphModel = logicFlow.graphModel;
    if (graphModel) {
      graphModel.selectNodeById('333');
      const res = graphModel.getPointByClient({ x: 400, y: 560 });
      console.log('getPointByClient', res);
    }
  };

  // 获取流程图数据
  const getData = (id?: string) => {
    if (!logicFlow) return;
    // http://logic-flow.org/api/nodeModelApi.html#getdata
    const nodeModel = logicFlow.getNodeModelById(id);
    const properties = nodeModel.getProperties();
    console.log('获取属性:', properties);
    if (id) {
      console.log('数据获取:', logicFlow.getDataById(id));
      console.log('数据所有获取:', logicFlow.getGraphData());

      return logicFlow.getDataById('000');
    } else {
      return logicFlow.getGraphData();
    }
  };

  /** 点击菜单 */
  const onMenuClick = (item: any) => {
    console.log('item', item);
    if (logicFlow) {
      console.log('first', logicFlow);
    }
  };
  const getRealPos = (e) => {
    const { clientX, clientY } = e;
    const { left, top } = e.target.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    return { x, y, left, top };
  };
  /** 流程图dom事件 */
  const onMouseMove = utils.throttle((e) => {
    if (!logicFlow) return;
    // 获取所有的节点
    const graphModel: GraphModel = logicFlow.graphModel;

    console.log('incoming', graphModel.incoming);
    console.log('incoming', logicFlow.incoming);
    console.log('onMouseMove', getRealPos(e));
  }, 300);

  /** 拖拽移动,激活选中样式 */
  const onDragHandle = (e: React.DragEvent, active: boolean) => {
    if (!utils.getDargType(e, FLOW_DRAG_KEY)) return;
    e.preventDefault();
    e.stopPropagation();
    console.log('active', active);
  };
  // onDrop
  const onDrop = (e: React.DragEvent) => {
    if (!utils.getDargType(e, FLOW_DRAG_KEY) && !logicFlow) return;
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer?.getData(FLOW_DRAG_KEY);
    const res = JSON.parse(data);
    console.log('logicFlow:', logicFlow);
    console.log('onDrop:', res);
  };

  return (
    <div className="flex-col ui-h-100 ui-w-100" style={{ padding: 20 }}>
      <div>
        <Button type="primary" onClick={() => downloadImage()}>
          下载
        </Button>
        <Button type="primary" onClick={() => getSelect()}>
          打印
        </Button>
        <Button type="primary" onClick={() => update()}>
          更新
        </Button>
        <Button type="primary" onClick={() => select()}>
          选中节点
        </Button>
      </div>
      <div className="flex flex-1 ui-h-100">
        <div className="left-menu" style={{ width: 300 }}>
          <TreeMenu onClick={onMenuClick} />
        </div>
        <div
          onDragEnter={(e: React.DragEvent) => onDragHandle(e, true)}
          onDragOver={(e: React.DragEvent) => onDragHandle(e, true)}
          onDragLeave={(e: React.DragEvent) => onDragHandle(e, false)}
          onDrop={onDrop}
          onMouseMove={onMouseMove}
          className="flex-1 ui-w-100 ui-h-100"
        >
          <div id="container" className="ui-w-100 ui-h-100" ref={refContainer} style={{ border: '1px solid #f60' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Wrap;
