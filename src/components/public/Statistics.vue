<template>
	<div class='statistics' v-if='isDetail'>
		<!-- 切换统计类型 -->
		<div class="tab_change">
			<p v-for="(item, index) in statisticsTypeData" :key="index">
				<el-popover placement="bottom" width="auto" trigger="hover" :content="item.name">
					<template #reference>
						<img :src="typeInx == index ? item.image_act : item.image" style="width:40px;height:40px;cursor: pointer;" @click="clickType(item, index)" />
					</template>
				</el-popover>
			</p>
		</div>
		<div class='tj_top'>
			<div class='select_y'>
				<p v-for='(item,index) in tabData' :key='index'>
					<el-popover placement="right" width="auto" trigger="hover" :content="item.name">
						<template #reference>
							<img :src='idx==index?item.image:item.image_act' @click="clickImg(item,index)" />
						</template>
					</el-popover>

				</p>
			</div>
			<div class='select_x'>
				<el-radio-group v-model="radio" style='margin-right:20px;' @change='changeRadio'>
					<el-radio label="WEEK" value='WEEK'>按周统计</el-radio>
					<el-radio label="YEAR_MONTH" value='YEAR_MONTH'>按月统计</el-radio>
					<el-radio label="DAY" value='DAY'>自定义统计</el-radio>
				</el-radio-group>
				<el-date-picker @calendar-change="handleChange" @change='customTimeChange' v-model="customTime" :disabled='disabled' :disabledDate="disabledDate" type="daterange" value-format="YYYY-MM-DD" range-separator="--" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</div>
		</div>
		<div v-if="chartShow" id="myChart"></div>
	</div>
</template>
<script>
// 引入echarts
import * as echarts from 'echarts'
import * as uploaderFns from '../homePage/upMain/uploader.js'
import * as categoryFns from '../../api/classify/index'
import * as projectFns from '../../api/project/index'
import { nextTick, ref, toRefs, reactive } from 'vue'
import { useRoute } from 'vue-router'
export default {
	name: 'statistics',
	props: {
		isDetail: {
			type: Boolean,
			required: true,
		},
	},
	setup() {
		const route = new useRoute()
		let customTime = ref(null)
		//  let disabled = ref(true)
		let statisticData = reactive({
			chartShow: false,
			disabled: true,
			xdata: [],
			ydata: [],
			Ymax: 1000,
			radio: 'WEEK',
			parmasData: {
				authorId: null, //作者id
				categoryId: null, //类别id
				subjectId: null, //专题id
				dim: 'WEEK', //统计维度MONTH,WEEK
				geCreatedAt: getPassYearFormatDate(), //开始时间
				iwpostIdIn: [],
				leCreatedAt: getNowFormatDate(), //结束时间
				mimeType: 'POST_VIDEO', //统计的类型
			},
			idx: 0,
			typeInx: 0,
			tabData: [
				{
					image: require('@/assets/img/uploader/TJBF.png'),
					image_act: require('@/assets/img/uploader/tjbf_act.png'),
					name: '播放统计',
				},
				//  {
				//      image:require('@/assets/img/uploader/TJSR.png'),
				//      image_act:require('@/assets/img/uploader/tjsr_act.png'),
				//  },
			],
			statisticsTypeData: [
				{
					image: require('../../assets/img/uploader/resouce_video.png'),
					image_act: require('../../assets/img/uploader/resouce_video_a.png'),
					name: '视频',
					mimeType: 'POST_VIDEO',
				},
				{
					image: require('../../assets/img/uploader/resouce_img.png'),
					image_act: require('../../assets/img/uploader/resouce_img_a.png'),
					name: '图片',
					mimeType: 'POST_IMAGE',
				},
				{
					image: require('../../assets/img/uploader/resouce_text.png'),
					image_act: require('../../assets/img/uploader/resouce_text_a.png'),
					name: '文档',
					mimeType: 'POST_TEXT',
				},
				{
					image: require('../../assets/img/uploader/resouce_audio.png'),
					image_act: require('@/assets/img/uploader/resouce_audio_a.png'),
					name: '音频',
					mimeType: 'POST_AUDIO',
				},
			],
		})
		if (route.params && route.params.id) {
			// props.isDetail=true;
			if (route.params.name == 'uploader') {
				statisticData.parmasData.authorId = Number(route.params.id)
			} else if (route.params.name == 'classify') {
				statisticData.parmasData.categoryId = Number(route.params.id)
			} else if (route.params.name == 'special') {
				statisticData.parmasData.subjectId = Number(route.params.id)
			}
			init(statisticData.parmasData)
		}
		// else{
		//   //新增界面
		//   props.isDetail=false;
		// }
		//获取当前时间
		function getNowFormatDate() {
			var date = new Date()
			var seperator1 = '-'
			// var seperator2 = ":";
			let month =
				date.getMonth() + 1 < 10
					? '0' + (date.getMonth() + 1)
					: date.getMonth() + 1
			let strDate =
				date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
			// let hh = date.getHours()<10 ? '0' + date.getHours() : date.getHours()
			// let mf = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
			// let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
			// var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + "T" + hh + seperator2 + mf + seperator2 + ss;
			var currentdate =
				date.getFullYear() +
				seperator1 +
				month +
				seperator1 +
				strDate +
				'T23:59:59'
			return currentdate
		}
		//获取一年前的当前时间
		function getPassYearFormatDate() {
			var nowDate = new Date()
			var date = new Date(nowDate)
			date.setDate(date.getDate() - 365)
			var seperator1 = '-'
			//  var seperator2 = ":";
			var year = date.getFullYear()
			let month =
				date.getMonth() + 1 < 10
					? '0' + (date.getMonth() + 1)
					: date.getMonth() + 1
			let strDate =
				date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
			// let hh = date.getHours()<10 ? '0' + date.getHours() : date.getHours()
			// let mf = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
			// let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
			// var currentdate = year + seperator1 + month + seperator1 + strDate + "T" + hh + seperator2 + mf + seperator2 + ss;
			var currentdate =
				year + seperator1 + month + seperator1 + strDate + 'T00:00:00'
			return currentdate
		}
		//获取30天前的当前时间
		function getPassMonthFormatDate() {
			var nowDate = new Date()
			var date = new Date(nowDate)
			date.setDate(date.getDate() - 30)
			var seperator1 = '-'
			//  var seperator2 = ":";
			var year = date.getFullYear()
			let month =
				date.getMonth() + 1 < 10
					? '0' + (date.getMonth() + 1)
					: date.getMonth() + 1
			let strDate =
				date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
			// let hh = date.getHours()<10 ? '0' + date.getHours() : date.getHours()
			// let mf = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
			// let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
			// var currentdate = year + seperator1 + month + seperator1 + strDate + "T" + hh + seperator2 + mf + seperator2 + ss;
			var currentdate =
				year + seperator1 + month + seperator1 + strDate + 'T00:00:00'
			return currentdate
		}
		const pickDay = reactive({
			left: null,
			right: null,
		})
		const handleChange = (val) => {
			let [left, right] = val
			if (left && right && left.getTime() == right.getTime()) {
				right = null
			}
			pickDay.left = left
			pickDay.right = right
		}
		const disabledDate = (date) => {
			let time = date.getTime()
			let currTime = new Date().getTime()
			if (currTime < time) {
				//大于当前时间
				return true
			}
			if (!pickDay.left) {
				//未选择时间
				return false
			}
			if (!pickDay.right) {
				//只选择一个时间,前后范围一个月
				let leftTime = pickDay.left.getTime()
				return Math.abs(time - leftTime) > 30 * 24 * 60 * 60 * 1000
			} else {
				//选择了时间范围
				return false
			}
		}

		//播放、收入激活样式
		function clickImg(item, index) {
			statisticData.idx = index
		}
		//统计类型激活样式
		function clickType(item, index) {
			statisticData.typeInx = index
			statisticData.parmasData.mimeType = item.mimeType
			init(statisticData.parmasData)
		}

		//按周，按月搜索
		function changeRadio(value) {
			if (value == 'DAY') {
				statisticData.parmasData.geCreatedAt = getPassMonthFormatDate()
				statisticData.parmasData.leCreatedAt = getNowFormatDate()
				statisticData.disabled = false
			} else {
				statisticData.parmasData.geCreatedAt = getPassYearFormatDate()
				statisticData.parmasData.leCreatedAt = getNowFormatDate()
				statisticData.disabled = true
				customTime.value = null
			}
			statisticData.parmasData.dim = value
			init(statisticData.parmasData)
		}

		//按日期搜索
		function customTimeChange(value) {
			console.log('value', value)
			if (value && statisticData.radio == 'DAY') {
				statisticData.parmasData.geCreatedAt = value[0] + 'T00:00:00'
				statisticData.parmasData.leCreatedAt = value[1] + 'T23:59:59'
			} else {
				statisticData.parmasData.geCreatedAt = getPassMonthFormatDate()
				statisticData.parmasData.leCreatedAt = getNowFormatDate()
			}
			init(statisticData.parmasData)
		}
		function colorfn(params) {
			//固定显示圆柱颜色
			var colorList = [
				'#004C63',
				'#007193',
				'#049587',
				'#99BB74',
				'#E08333',
				'#B83723',
				'#0AAF9F',
				'#E89589',
				'#16A085',
				'#4A235A',
				'#C39BD3 ',
				'#F9E79F',
				'#BA4A00',
				'#ECF0F1',
				'#616A6B',
				'#EAF2F8',
				'#4A235A',
				'#3498DB',
				'#A6D297',
				'#008B92',
				'#ABCD05',
				'#FDD900',
				'#F5B900',
				'#F29800',
				'#F9B880',
				'#F29987',
				'#CD92BE',
				'#A686B8',
				'#8B9BCE',
				'#C8D5ED',
				'#85CBD2',
				'#A6D297',
				'#FFF8CC',
			]
			return colorList[params.dataIndex]
		}
		function initChart() {
			statisticData.chartShow = false
			//随机显示圆柱颜色
			// function colorfn(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
			const colors = ['#5470C6', '#91CC75', '#EE6666']
			const option = {
				color: colors,
				tooltip: {
					// trigger: 'axis',
					axisPointer: {
						type: 'cross',
					},
				},
				grid: {
					right: '20%',
				},
				xAxis: [
					{
						type: 'category',
						axisTick: {
							alignWithLabel: true,
						},
						// axisLabel: { interval: 0, rotate: 30 },
						data: [...statisticData.xdata],
					},
				],
				yAxis: [
					{
						type: 'value',
						name: '',
						min: 0,
						max: statisticData.Ymax,
						position: 'left',
						axisLine: {
							show: false,
							lineStyle: {
								color: colors[0],
							},
						},
						axisLabel: {
							show: false,
							formatter: '{value}',
						},
					},
					{
						type: 'value',
						name: '',
						min: 0,
						max: statisticData.Ymax,
						position: 'left',
						offset: 60,
						axisLine: {
							show: false,
							lineStyle: {
								color: colors[1],
							},
						},
						axisLabel: {
							show: false,
							formatter: '{value}',
						},
					},
				],
				series: [
					// {
					//     name: '播放量',
					//     type: 'line',
					//     // y轴
					//     // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
					//     data:[...statisticData.ydata],
					//     label: {
					//         show: true,
					//         position: 'top',
					//         textStyle: {
					//             fontSize: 20,
					//             width:20
					//         }
					//     },
					//     itemStyle: {
					//         normal: {
					//             color:colorfn
					//         },
					//     },

					// },
					{
						name: '',
						type: 'bar',
						yAxisIndex: 1,
						// y轴
						// data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
						data: [...statisticData.ydata],
						label: {
							show: true,
							position: 'top',
							textStyle: {
								fontSize: 20,
								width: 20,
							},
						},
						itemStyle: {
							normal: {
								color: colorfn,
							},
						},
					},
				],
			}
			nextTick(() => {
				statisticData.chartShow = true
				setTimeout(() => {
					let myChart = echarts.init(
						document.getElementById('myChart')
					)
					myChart.setOption(option, true)
					window.onresize = function () {
						myChart.resize()
					}
				}, 100)
			})
		}
		function init(parmas) {
			if (route.params.name == 'uploader') {
				uploaderFns.statistics(parmas).then((res) => {
					if (res.code == 200) {
						let xarr = []
						let yarr = []
						res.data.forEach((item) => {
							xarr.push(item.dimKey)
							yarr.push(item.timesWatched)
						})
						statisticData.xdata = xarr
						statisticData.ydata = yarr
						statisticData.Ymax = Math.max(...yarr)
						initChart()
					}
				})
			} else if (route.params.name == 'classify') {
				categoryFns.categoryStatistics(parmas).then((res) => {
					if (res.code == 200) {
						let xarr = []
						let yarr = []
						res.data.forEach((item) => {
							xarr.push(item.dimKey)
							yarr.push(item.timesWatched)
						})
						statisticData.xdata = xarr
						statisticData.ydata = yarr
						statisticData.Ymax = Math.max(...yarr)
						initChart()
					}
				})
			} else if (route.params.name == 'special') {
				projectFns.subjectStatistics(parmas).then((res) => {
					if (res.code == 200) {
						let xarr = []
						let yarr = []
						res.data.forEach((item) => {
							xarr.push(item.dimKey)
							yarr.push(item.timesWatched)
						})
						statisticData.xdata = xarr
						statisticData.ydata = yarr
						statisticData.Ymax = Math.max(...yarr)
						initChart()
					}
				})
			}
		}

		return {
			...toRefs(statisticData),
			customTime,
			customTimeChange,
			clickImg,
			clickType,
			init,
			initChart,
			changeRadio,
			getNowFormatDate,
			getPassYearFormatDate,
			getPassMonthFormatDate,
			disabledDate,
			pickDay,
			handleChange,
			//  disabled
		}
	},
}
</script>

<style scoped lang="less">
.statistics {
	width: 100%;
	height: calc(100vh - 230px);
	overflow: scroll;
	:deep(.el-radio__inner) {
		border-radius: 0;
	}
	:deep(.el-radio__input.is-checked .el-radio__inner) {
		border-color: #ccc;
		background-color: #ccc;
	}
	:deep(.el-radio__input.is-checked + .el-radio__label) {
		color: #000;
	}
	:deep(.el-radio__input.is-checked .el-radio__inner::after) {
		box-sizing: content-box;
		border-radius: 0;
		border: 1px solid #fff;
		border-left: 0;
		border-top: 0;
		content: ' ';
		top: 1px;
		left: 4px;
		position: absolute;
		width: 3px;
		height: 7px;
		-webkit-transform: rotate(45deg) scale(0);
		background-color: #ccc;
		transform: rotate(45deg) scale(1);
		transform: rotate(45deg) scaleY(1);
	}
	.tab_change {
		width: 50%;
		height: 30px;
		display: flex;
		margin: 2vh 0;
		justify-content: space-around;
	}
	.tj_top {
		.select_y {
			width: 25%;
			height: 2.08vw;
			display: flex;
			justify-content: space-between;
			margin: 2.08vw 0px 2.08vw 3.13vw;
			img {
				cursor: pointer;
			}
		}
		.select_x {
			width: 100%;
			margin: 2.08vw 0px 2.08vw 3.13vw;
		}
	}
	#myChart {
		width: 100%;
		height: 26vw;
	}
}
</style>
