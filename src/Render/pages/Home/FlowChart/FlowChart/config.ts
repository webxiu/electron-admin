import LogicFlow, { Definition } from '@logicflow/core';

export const FLOW_DRAG_KEY = 'flow_drag_key';

/** 流程图-主配置选项 */
export const optionsConfig = ({ plugins, container }) => {
  const option: Definition = {
    plugins: plugins,
    container: container,
    grid: true,
    keyboard: {
      enabled: true
    },
    history: true, // 是否开启历史记录功能，默认开启
    snapline: true, // 是否开启对齐线，默认开启
    background: {
      backgroundColor: '#eee',
      backgroundRepeat: 'repeat'
    },
    style: {
      /** 所有节点的通用主题设置 */
      baseNode: {
        fill: '#999',
        stroke: '#f60',
        strokeWidth: 1,
        /** 其他svg属性 */
        accumulate: 'none'
      }
    }
  };
  return option;
};
/** 流程图-功能模块配置 */
export const initFlowConfig = (lf: LogicFlow) => {
  const patternItems = [
    {
      label: '选区',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAOVJREFUOBGtVMENwzAIjKP++2026ETdpv10iy7WFbqFyyW6GBywLCv5gI+Dw2Bluj1znuSjhb99Gkn6QILDY2imo60p8nsnc9bEo3+QJ+AKHfMdZHnl78wyTnyHZD53Zzx73MRSgYvnqgCUHj6gwdck7Zsp1VOrz0Uz8NbKunzAW+Gu4fYW28bUYutYlzSa7B84Fh7d1kjLwhcSdYAYrdkMQVpsBr5XgDGuXwQfQr0y9zwLda+DUYXLaGKdd2ZTtvbolaO87pdo24hP7ov16N0zArH1ur3iwJpXxm+v7oAJNR4JEP8DoAuSFEkYH7cAAAAASUVORK5CYII=',
      callback: () => {
        lf.openSelectionSelect();
        lf.once('selection:selected', () => {
          lf.closeSelectionSelect();
        });
      }
    },
    {
      type: 'circle',
      text: '开始',
      label: '开始节点',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
      className: 'pattern_start'
    },
    {
      type: 'rect',
      label: '用户任务',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg==',
      className: 'important-node'
    },
    {
      type: 'diamond',
      label: '条件判断',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII=',
      className: 'pattern_start'
    },
    {
      type: 'circle',
      text: '结束',
      label: '结束节点',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAA1BJREFUOBFtVE1IVUEYPXOf+tq40Y3vPcmFIdSjIorWoRG0ERWUgnb5FwVhYQSl72oUoZAboxKNFtWiwKRN0M+jpfSzqJAQclHo001tKkjl3emc8V69igP3znzfnO/M9zcDcKT67azmjYWTwl9Vn7Vumeqzj1DVb6cleQY4oAVnIOPb+mKAGxQmKI5CWNJ2aLPatxWa3aB9K7/fB+/Z0jUF6TmMlFLQqrkECWQzOZxYGjTlOl8eeKaIY5yHnFn486xBustDjWT6dG7pmjHOJd+33t0iitTPkK6tEvjxq4h2MozQ6WFSX/LkDUGfFwfhEZj1Auz/U4pyAi5Sznd7uKzznXeVHlI/Aywmk6j7fsUsEuCGADrWARXXwjxWQsUbIupDHJI7kF5dRktg0eN81IbiZXiTESic50iwS+t1oJgL83jAiBupLDCQqwziaWSoAFSeIR3P5Xv5az00wyIn35QRYTwdSYbz8pH8fxUUAtxnFvYmEmgI0wYXUXcCCSpeEVpXlsRhBnCEATxWylL9+EKCAYhe1NGstUa6356kS9NVvt3DU2fd+Wtbm/+lSbylJqsqkSm9CRhvoJVlvKPvF1RKY/FcPn5j4UfIMLn8D4UYb54BNsilTDXKnF4CfTobA0FpoW/LSp306wkXM+XaOJhZaFkcNM82ASNAWMrhrUbRfmyeI1FvRBTpN06WKxa9BK0o2E4Pd3zfBBEwPsv9sQBnmLVbLEIZ/Xe9LYwJu/Er17W6HYVBc7vmuk0xUQ+pqxdom5Fnp55SiytXLPYoMXNM4u4SNSCFWnrVIzKG3EGyMXo6n/BQOe+bX3FClY4PwydVhthOZ9NnS+ntiLh0fxtlUJHAuGaFoVmttpVMeum0p3WEXbcll94l1wM/gZ0Ccczop77VvN2I7TlsZCsuXf1WHvWEhjO8DPtyOVg2/mvK9QqboEth+7pD6NUQC1HN/TwvydGBARi9MZSzLE4b8Ru3XhX2PBxf8E1er2A6516o0w4sIA+lwURhAON82Kwe2iDAC1Watq4XHaGQ7skLcFOtI5lDxuM2gZe6WFIotPAhbaeYlU4to5cuarF1QrcZ/lwrLaCJl66JBocYZnrNlvm2+MBCTmUymPrYZVbjdlr/BxlMjmNmNI3SAAAAAElFTkSuQmCC',
      className: 'pattern_end'
    }
  ];

  // 右键菜单（必须在 lf.render() 之前设置）
  const rightKeyMenu = {
    showMenu: false,
    nodeMenu: [
      {
        text: '删除',
        callback(node: any) {
          console.log('删除', node);
          lf.deleteNode(node.id);
        }
      },
      {
        text: '编辑',
        callback(node: any) {
          console.log('编辑', node);
          lf.editText(node.id);
        }
      },
      {
        text: '属性',
        callback(node: any) {
          alert(`
              节点id：${node.id}
              节点类型：${node.type}
              节点坐标：(x: ${node.x}, y: ${node.y})`);
        }
      }
    ],
    edgeMenu: [
      {
        text: '删除',
        callback(node: any) {
          console.log('删除', node);
          lf.deleteEdge(node.id);
        }
      },
      {
        text: '属性',
        callback(edge: any) {
          alert(`
              边id：${edge.id}
              边类型：${edge.type}
              边坐标：(x: ${edge.x}, y: ${edge.y})
              源节点id：${edge.sourceNodeId}
              目标节点id：${edge.targetNodeId}`);
        }
      }
    ],
    graphMenu: [
      {
        text: '分享',
        callback() {
          alert('分享成功98！');
        }
      }
    ]
  };

  /** 在控制菜单添加导航栏按钮 */
  const navButton = {
    iconClass: 'custom-minimap',
    title: '',
    text: '导航',
    onMouseEnter: (lf, ev) => {
      const position = lf.getPointByClient(ev.x, ev.y);
      lf.extension.miniMap.show(position.domOverlayPosition.x - 120, position.domOverlayPosition.y + 35);
    },
    onClick: (lf, ev) => {
      const position = lf.getPointByClient(ev.x, ev.y);
      lf.extension.miniMap.show(position.domOverlayPosition.x - 120, position.domOverlayPosition.y + 35);
    }
  };
  return { patternItems, rightKeyMenu, navButton };
};

export const munuList = [
  { id: 1, parent_id: 0, name: '音频预处理', code: 'PreProcessing' },
  { id: 2, parent_id: 1, name: '音频降噪', code: 'AudioDenoise' },
  { id: 3, parent_id: 1, name: '音频浓缩', code: 'AudioCondense' },
  { id: 4, parent_id: 1, name: '人声分离', code: 'VoiceSeparation' },
  { id: 5, parent_id: 0, name: '音频智能处理', code: 'InteProcessing' },
  { id: 6, parent_id: 5, name: '声纹比对', code: 'VoiceCompare' },
  { id: 7, parent_id: 6, name: '1比1', code: 'VoiceCompareOne' },
  { id: 8, parent_id: 6, name: '1比N', code: 'VoiceCompareMore' },
  { id: 9, parent_id: 6, name: 'N比N', code: 'VoiceCompareMoreThanMore' },
  { id: 10, parent_id: 5, name: '音频布控', code: 'AudioTask' },
  { id: 11, parent_id: 10, name: '布控任务', code: 'DeployTask' },
  { id: 12, parent_id: 10, name: '布控告警', code: 'DeployAlarm' },
  { id: 13, parent_id: 5, name: '以音搜音', code: 'VoiceSearch' },
  { id: 14, parent_id: 5, name: '声纹聚类', code: 'VoiceCluster' },
  {
    id: 15,
    parent_id: 5,
    name: '智能鉴伪',
    code: 'AuthenticIdentification'
  },
  { id: 16, parent_id: 0, name: '声纹库管理', code: 'VoiceManagement' },
  { id: 17, parent_id: 16, name: '样本库', code: 'SampleLibrary' },
  { id: 18, parent_id: 16, name: '检材库', code: 'MaterialLibrary' },
  { id: 19, parent_id: 16, name: '专题库', code: 'SpecialLibrary' },
  { id: 20, parent_id: 0, name: '个人中心', code: 'PersonalCenter' },
  { id: 21, parent_id: 20, name: '个人信息', code: 'Personalinformation' },
  { id: 22, parent_id: 0, name: '系统管理', code: 'SystemManagement' },
  { id: 23, parent_id: 22, name: '用户管理', code: 'UserManagement' },
  { id: 24, parent_id: 22, name: '角色管理', code: 'RoleManagement' }
];

/**
 * 对象数组组合节点树
 * @param data 对象数组[必填]
 * @param option 生成字段: 生成指定字段的树形数据选项, 默认为: {key: 'id', title: 'name', parent_id: 'parent_id' }
 * @param fileds 替换生成字段option中的键名, 例如: key->value/title->label, 可配置:{ key: 'value', title: 'label' }
 * @returns 树形结构数组
 */
export const toTreeAndMap = (data: any, option?: any, fileds?: any) => {
  /** 数据字段 */
  const key = option?.key || 'key';
  const title = option?.title || 'title';
  const parent_id = option?.parent_id || 'parent_id';
  /** 替换数据字段 */
  const key_f = fileds?.key || 'key';
  const title_f = fileds?.title || 'title';
  const parent_id_f = fileds?.parent_id || 'parent_id';

  const map = {};
  const tempData: any = [];
  const newArr = data?.map((item) => {
    // const newItem = { ...item, key: item[key], title: item[title], parent_id: item[parent_id] || '0' };
    const newItem = {
      ...item,
      [key_f]: item[key],
      [title_f]: item[title],
      [parent_id_f]: item[parent_id] || 0,
      value: item[key],
      label: item[title],
      level: 1
    };
    // 删除被替换的字段
    option?.key && option?.key !== 'key' && delete newItem[option?.key];
    option?.title && option?.title !== 'title' && delete newItem[option?.title];
    option?.parent_id && option?.parent_id !== 'parent_id' && delete newItem[option?.parent_id];
    return newItem;
  });
  newArr.forEach((item) => (map[item[key_f]] = item));
  newArr.forEach((item) => {
    const parent = map[item[parent_id_f]];
    if (parent) {
      item.level = parent.level + 1;
      item.parent = parent;
      (parent.children || (parent.children = [])).push(item);
    } else {
      tempData.push(item);
    }
  });
  return tempData;
};
