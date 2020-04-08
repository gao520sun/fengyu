import request from '../../NetworkService';

const host = 'http://gerenxiangfa.com:40001/mock/11';

// 获取位置
export const getHomeTreasurePosition = (data = {}) => {
  return request({
    host: host,
    uri: '/fy/Treasure/position',
    params: data,
  });
};
