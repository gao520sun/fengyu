/*
 * @Author: gaozhonglei
 * @Date: 2020-04-04 11:41:31
 * @Last Modified by: gaozhonglei
 * @Last Modified time: 2020-04-06 19:35:28
 */
// enum METHOD {
//   GET = 'GET',
//   POST = 'POST',
// }
// interface requestConfig {
//   host: string;
//   uri: string;
//   method?: METHOD;
//   header?: any;
//   params?: any;
// }

const getSortJointParam = (url, data) => {
  const urlParamData = urlParam(url);
  data = {...urlParamData, ...data};
  let keys = Object.keys(data).sort();
  let sign_str = '';
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = data[key] + '';
    if (value) {
      sign_str = valueParam(sign_str, key, value);
    }
  }
  const _urls = url.split('?');
  if (_urls && _urls.length && sign_str) {
    return _urls[0] + '?' + sign_str;
  } else {
    _urls[0];
  }
  return url;
};

const urlParam = url => {
  let query = {};
  try {
    const _urls = url.split('?');
    if (_urls && _urls.length > 1) {
      const search = _urls[1];
      if (search) {
        const searchList = search.split('&');
        for (let i = 0, len = searchList.length; i < len; i++) {
          let _search = searchList[i];
          let separatorIndex = _search.indexOf('=');
          const name = _search.substring(0, separatorIndex);
          const value = _search.substr(separatorIndex + 1) || '';
          if (value) {
            query[name] = value;
          }
        }
      }
    }
  } catch (error) {
    console.warn('url地址参数错误');
  }
  return query;
};

function valueParam(sign_str, key, value) {
  const _temp = key + '=' + value;
  if (sign_str) {
    sign_str += '&' + _temp;
  } else {
    sign_str += _temp;
  }
  return sign_str;
}

const convertRespToJson = response => {
  return response.json();
};
const responseError = error => {
  let errorObj = {status: -1, message: '未知错误', ...error};
  switch (error.errcode) {
    case 403:
      errorObj.message = '禁止访问';
      break;
    case 404:
      errorObj.message = '未找到服务';
      break;
    case 500:
      errorObj.message = '内部服务错误';
      break;
  }
  return errorObj;
};
const defaultAnalyse = (response,config) => {
  console.log(`响应结果: ${config.host + config.uri}`,response)
  if (response.data) {
    return response;
  } else {
    return responseError(response);
  }
};
const errorCatch = e => {
  let errorObj = {status: -1, message: '网络请求失败!', error: e};
  return errorObj;
};
const urlHandel = (config) => {
  let url = config.host + config.uri;
  if (config.method === 'GET') {
    url = getSortJointParam(url, config.params || {});
  }
  console.log(`请求配置: ${config.host + config.uri}`,config)
  return url;
};
const request = (config) => {
  config.method = config.method || 'GET';
  const url = urlHandel(config);
  return new Promise(resolve => {
    fetch(url, {
      method: config.method,
      headers: config.header,
      body: config.method === 'GET' ? null : config.params,
    })
      .then(convertRespToJson)
      .then(res => {
        const data = defaultAnalyse(res,config);
        resolve(data);
      })
      .catch(e => {
        const data = errorCatch(e);
        resolve(data);
      });
  });
};

export default request;
