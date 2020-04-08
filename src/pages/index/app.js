/*
 * @Author: gaozhonglei 
 * @Date: 2020-03-30 11:20:49 
 * @Last Modified by: gaozhonglei
 * @Last Modified time: 2020-04-07 15:54:12
 */
import React, { Component } from "react";
import QMap from 'QMap'
import {getImg} from '../../Utils/Commons';
import {getHomeTreasurePosition} from './api';
const xin1 = getImg('xin-1', 'maps');
const xin2 = getImg('xin-2', 'maps');
const xin3 = getImg('xin-3', 'maps');
const xin4 = getImg('xin-4', 'maps');
const xin5 = getImg('xin-5', 'maps');
const currentAddress = getImg('current_address', 'maps');
// 腾讯地图关于map参数设置文档https://lbs.qq.com/javascript_v2/doc/mapoptions.html
export default class App extends Component {
	constructor(props){
		super(props);
		this.map = null;
		this.marker = null;
		this.cityLocation = null;
		
	}
	componentDidMount() {
		window.addEventListener('message', (event)=> {
			let eventData = {};
			const data = event.data || '{}';
            if (typeof data === 'string') {
                eventData = JSON.parse(data);
            } else {
                eventData = data;
            }
			switch (eventData.action) {
				case 'geolocation':
					this.geolocationHandle(eventData.payload);
					break;
			}
			this._log(event.data);
		});
		this.creatQMap();
	}
	// 获取客户端定位后，刷新界面
	geolocationHandle = (data) => {
		if(data){
			let lng = data.coords.longitude;// 经度
			let lat = data.coords.latitude;// 纬度
			this.geolocationLatlng(`${lat},${lng}`);
			this.getTreasurePosition({lng : lng,lat : lat});
			this._log({lat , lng})
		}else {
			this.cityLocation.searchLocalCity();
		}
		
	}
	getTreasurePosition = async ({lng = '',lat = ''}) => {
		const res = await getHomeTreasurePosition({lng,lat});
		let data = [];
		if(res.status === 1) {
			data = res.data.map((item,index) => {
				switch (item.encryptionType) {
					case 1:
						item.img = xin1;
						item.position = `${lat + 0.0003},${lng + 0.001}`
						item.lng = lng + 0.001;
						item.lat = lat + 0.01;
					break;
					case 2:
						item.img = xin2;
						item.position = `${lat + 0.021},${lng + 0.02}`;
						item.lng = lng + 0.02;
						item.lat = lat + 0.01;
					break;
					case 3:
						item.img = xin3;
						item.position = `${lat + 0.0002},${lng + 0.03}`;
						item.lng = lng + 0.03;
						item.lat = lat + 0.01;
					break;
					case 4:
						item.img = xin4;
						item.position = `${lat + 0.01},${lng + 0.004}`;
						item.lng = lng + 0.004;
						item.lat = lat + 0.01;
					break;
				}
				return item;
			})
		}else {

		}
		this.setLetterPosition(data);

	}
	_postMessage = ({action,payload}) => {
		window.ReactNativeWebView.postMessage(JSON.stringify({action:action,payload:payload}))
	}
	_log = (title) => {
		let ply = typeof title === 'string' ? title : JSON.stringify(title);
		this._postMessage({action:'log', payload:ply})
	}
	// 初始化地图
	creatQMap = () => {
		let center = new QMap.LatLng(39.914850, 116.403765);
		this.map = new QMap.Map(document.getElementById("container"), {
			// 地图的中心地理坐标。
			center: center,
			// 初始化地图缩放级别。
			zoom:13,
			// 设置地图的最小缩放级别。
			minZoom:13,
			// 设置地图的最大缩放级别。
			maxZoom:0,
			//如果为 true，在初始化地图时不会清除地图容器内的内容
			noClear: true,
			//若为false则禁止拖拽
			// draggable: false,
			//若为false则禁止滑轮滚动缩放
			scrollwheel: true,
			//若为true则禁止双击放大
			disableDoubleClickZoom: false,
			//地图缩放控件，若为false则不显示缩放控件
			zoomControl: false,
			//地图缩放控件参数
			zoomControlOptions: {
				position: QMap.ControlPosition.BOTTOM_LEFT
			},
			 //地图比例尺控件，若为false则不显示比例尺控件
			 scaleControl: true,
			//地图比例尺控件参数
			scaleControlOptions: {
				position: QMap.ControlPosition.BOTTOM_RIGHT
			},
		});
		this.marker = new QMap.Marker({
			// position: center,
			map: this.map
		})
		 //添加到提示窗
		let info = new QMap.InfoWindow({
			map: this.map
		});
		QMap.event.addListener(this.marker, 'click', function() {
			info.open();
			info.setContent('<div style="text-align:center;white-space:nowrap;'+
			'margin:10px;">单击标记</div>');
			info.setPosition(center);
		});
		this.marker.setDraggable(true);
		this.setCityLocation();
	}
	// 设置周围的数据
	setLetterPosition = (data) => {
		let letterPositionData = data;
		if(letterPositionData.length <=0) {return;}
		let size = new QMap.Size(30, 26);
		for(let i= 0; i< letterPositionData.length; i++) {
			let data = letterPositionData[i];
			let latlngStr = data.position.split(",",2);
			let markPosition = new QMap.LatLng(latlngStr[0], latlngStr[1])
			let icon = new QMap.MarkerImage(data.img,size,undefined,undefined,size);
			let make = new QMap.Marker({
				icon:icon,
				position: markPosition,
				map: this.map
			})
			QMap.event.addListener(make, 'click', () => {
				console.log('value::',data)
				this._postMessage({action:'markerClick',payload:data})
			});
		}
	}	
	// 根据城市定位
	setCityLocation = () => {
		const _this = this;
		let size = new QMap.Size(20, 20);
		let icon = new QMap.MarkerImage(currentAddress,size,undefined,undefined,size);
		this.cityLocation = new QMap.CityService({
			complete : function(result){
				_this.map.setCenter(result.detail.latLng);
				console.log('所在位置: ',result.detail.name)
				if (_this.marker != null) {
					_this.marker.setMap(null);
				}
				//设置marker标记
				_this.marker = new QMap.Marker({
					icon:icon,
					map: _this.map,
					position: result.detail.latLng
				});
			}
		});
	}
	// 根据ip定位
	getGeolocationIp = () => {
		let clientIp = '192.168.1.102';
		// let city = document.getElementById("city");
		  //调用查询ip接口查询信息
		  this.cityLocation.searchCityByIP(clientIp);
	}
	//根据经纬度获取信息
	geolocationLatlng(latlng) {
		//获取经纬度信息
		// let input = '39.892487,116.497659';
		let input = latlng;
		//用,分割字符串截取两位长度
		let latlngStr = input.split(",",2);
		//解析成浮点数 取值第一位 第二位
		let lat = parseFloat(latlngStr[0]);
		let lng = parseFloat(latlngStr[1]);
		//设置经纬度信息
		let latLng = new qq.maps.LatLng(lat, lng);
		//调用城市经纬度查询接口实现经纬查询
		this.cityLocation.searchCityByLatLng(latLng);
	}
	// html5定位
	getHtmlLocation(){
		//判断是否支持 获取本地位置
		if (navigator.geolocation){
		  	navigator.geolocation.getCurrentPosition(this.showPosition,this.showError);
		  }else{
			console.log('浏览器不支持定位.')
		}
	}

	showPosition = (position) => {
		const _this = this;
		var lat=position.coords.latitude; 
		var lng=position.coords.longitude;
		//调用地图命名空间中的转换接口   type的可选值为 1:GPS经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
		let latLng = new QMap.LatLng(lat,lng);
		_this.cityLocation.searchCityByLatLng(latLng);
  	}

  	showError = (error) => {
	let errMsg = '';
	switch(error.code) {
		case error.PERMISSION_DENIED:
			// User denied the request for Geolocation.
			errMsg = "定位失败,用户拒绝请求地理定位"
			break;
		case error.POSITION_UNAVAILABLE:
			// Location information is unavailable.
			errMsg = "定位失败,位置信息是不可用"
			break;
		case error:
			// The request to get user location timed out.
			errMsg = "定位失败,请求获取用户位置超时"
			break;
		case error.UNKNOWN_ERROR:
			// An unknown error occurred.
			errMsg = "定位失败,定位系统失效"
			break;
		}
		this._postMessage({action:"geolocationError", payload:error});
	}

	render() {
        return (
            <div id="container" style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100% ' }}>
			</div>
        );
    }
}
