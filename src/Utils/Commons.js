/*
 * @Author: gaozhonglei 
 * @Date: 2020-03-30 11:15:07 
 * @Last Modified by: gaozhonglei
 * @Last Modified time: 2020-04-07 15:01:40
 */
import {STATIC_FILE_IP} from '../Config'
const getImg = (name, path, format = 'png') => {
    if (path) {
        return `${STATIC_FILE_IP}/static/images/${path}/${name}.${format}?_t=${1}`;
    }
    return `${STATIC_FILE_IP}/static/images/${name}.${format}`;
}

export {
    getImg
}