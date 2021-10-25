const fs = require('fs');
const path = require('path');
const servicePath = path.join(process.cwd(), 'src/Render/service/index.ts');
const YAML = require('yamljs');
const axios = require('axios');
let findInner = `
/**
 * @readOnly {只读， 脚本更改}
 * @Message {来源} {npm run codec:service}
 * @Swagger 自动生成接口请求信息
 *
*/

import axiosInstance, { AxiosRequestConfig, InjectAbort } from '@/Render/axios';

import { BaseServeResponse } from '@/Types/BaseTypes';
`;

let ItemInterface = ``;

const handleArrayInterface = (key, value, schemasObject) => {
  key = key
    .split('_')
    .map((item) => {
      item = item.split('').map((k, i) => {
        if (i === 0) {
          return k.toLocaleUpperCase();
        }
        return k;
      });
      item = item.join('');
      return item;
    })
    .join('');
  if (value.items.$ref) {
    const schemas = value.items.$ref.split('#/components/schemas/')[1];
    let properties = schemasObject[schemas].properties;
    let _string = ``;
    for (const [key, val] of Object.entries(properties)) {
      _string += `
  /** ${val.description} */
  ${key}: ${val.type === 'array' ? handleArrayInterface(key, val, schemasObject) : val.type};`;
    }
    const itemInterface = `\nexport interface ${key}ItemTypes {${_string}\n}`;
    ItemInterface += itemInterface;
    return `${key}ItemTypes[]`;
  } else {
    return `${value.items.type}[]`;
  }
};

const request = (name, value, schemasObject) => {
  let schemas = '';
  try {
    schemas = value.requestBody.content['application/json'].schema.$ref.split('#/components/schemas/')[1];
  } catch (error) {
    return `export interface ${name}$$Request {}`;
  }
  if (!schemas) {
    return `export interface ${name}$$Request {}`;
  }

  let properties = schemasObject[schemas].properties;
  let reqString = ``;
  for (const [key, value] of Object.entries(properties)) {
    reqString += `
    /** ${value.description} */
    ${key}: ${value.type === 'array' ? handleArrayInterface(key, value, schemasObject) : value.type};`;
  }
  const string = `export interface ${name}$$Request {${reqString}
}`;
  return string;
};
const response = (name, value, schemasObject) => {
  let schemas = '';
  try {
    schemas = value.responses['200'].content['application/json'].schema.$ref.split('#/components/schemas/')[1];
  } catch (error) {
    return `export interface ${name}$$Response {}`;
  }
  if (!schemas) {
    return `export interface ${name}$$Response {}`;
  }

  try {
    schemas = schemasObject[schemas].properties.data.$ref.split('#/components/schemas/')[1];
  } catch (error) {
    return `export interface ${name}$$Response {}`;
  }
  let properties = schemasObject[schemas].properties;
  let resString = ``;
  for (const [key, value] of Object.entries(properties)) {
    resString += `
    /** ${value.description} */
    ${key}: ${value.type === 'array' ? handleArrayInterface(key, value, schemasObject) : value.type};`;
  }
  return `export interface ${name}$$Response {${resString}
}`;
};

const call = (methods, __name) => {
  if (methods === 'get' || methods === 'delete') {
    return `InjectAbort(${__name}, request))`;
  }
  return ` request, InjectAbort(${__name}, config))`;
};

axios.request({ url: 'http://127.0.0.1:5002/doc/swagger/', method: 'get' }).then(({ data }) => {
  nativeObject = YAML.parse(data);
  for (const [key, value] of Object.entries(nativeObject.paths)) {
    let methods = Object.keys(value)[0];
    const names = key.split('/');
    const __name = names[names.length - 1];
    // console.log(`${key}: ${value}`, value);
    // console.log(value[methods]);

    findInner += `
/** ========================= **************** ${__name} ****************** ========================= */
/** ${value[methods].description} 请求参数 */
${request(__name, value[methods], nativeObject.components.schemas)}
/** ${value[methods].description} 响应参数*/
${response(__name, value[methods], nativeObject.components.schemas)}
/** ${value[methods].description} */
export const ${__name} = (request: ${__name}$$Request, config?: AxiosRequestConfig) => {
  return axiosInstance.${methods}<BaseServeResponse<${__name}$$Response>>('${key}', ${call(methods, __name)};
};
`;
  }
  fs.writeFileSync(servicePath, `${findInner}\n${ItemInterface}`.replace(/integer/g, 'number').replace(/array/g, '[]'), { encoding: 'utf-8' });
});
