<template>
	<div class='img_Account_pre'>
		<div class='side_bar'>
			<span class='top_icon'></span>
			<ul class='middle_box'>
				<li>
					<div>标题</div>
					<div class='title'>{{parametersData.title}}</div>
				</li>
				<li>
					<img :src="parametersData.imageUrl?parametersData.imageUrl:require('../../assets/img/imgaccount/add_img.png')" /><br />
				</li>
				<li>
					<div class='info'>{{parametersData.excerpt}}</div>
				</li>
			</ul>

			<div class='left_icons'>
				<div v-for="item in iconArr" :key="item.type">
					<el-popover placement="left" width="auto" trigger="hover" :content="item.title">
						<template #reference>
							<img :src="item.iconUrl" @click="clickLeftIcon(item.type)" />
						</template>
					</el-popover>
				</div>
				<el-popover placement="left" width="auto" trigger="hover" content="返回">
					<template #reference>
						<img src="@/assets/img/preview/balck8.png" @click="back" />
					</template>
				</el-popover>
			</div>
			<audio ref="audio" autoplay='true' loop='true' style="width:200px;display:none;" controls :src='contentMusic'></audio>
		</div>
		<div class='right_content'>
			<el-carousel :autoplay='false' arrow="always" indicator-position='none' v-if='parametersData.imagePage&&parametersData.imagePage.length>0' @change="changeCarousel">
				<el-carousel-item v-for="item in parametersData.imagePage" :key="item.imageId">
					<img :src='item.imageUrl' style='object-fit: cover;width:100%;height:80%;'>
					<div class='title'>{{item.comment}}</div>
					<div>{{item.comment}}</div>
				</el-carousel-item>
			</el-carousel>
			<audio ref="audio1" autoplay='true' loop='true' style="width:200px;display:none;" controls :src='imgMusic'></audio>
			<el-image class='fullscreen_icon' @click="fullscreen()" :src="require('../../assets/img/imgaccount/fullscreen.png')" :preview-src-list="srcList" :initial-index="1" fit="cover">
			</el-image>
		</div>
		<!-- 分享模态框 -->
		<el-dialog v-model="dialogVisible" :width="showModelAccontObj.type === 'h5' ? '20vw' : '30%'" :show-close="false" :lock-scroll="false" :before-close="handleClose">
			<!-- H5海报 -->
			<div v-if="showModelAccontObj.type === 'h5'" id="h5Fenxiang">
				<el-popover placement="right" :width="50" trigger="click">
					<template #reference>
						<div>
							<div class="dian_h5"></div>
							<div class="qrcodeBox_title">
								<div class="qrcodeBox_title_font" :title="leftInfo">{{ leftInfo }}</div>
							</div>
							<div style="text-align: center">
								<img :src="infoImageUrl" class="h5img" v-if="infoImageUrl" />
								<img src="@/assets/position/listImage.png" class="h5img" v-else />
							</div>
							<div style="text-align: center; margin-top: 7vh">
								<div class="qrcode" id="qrcode" ref="qrCodeUrl"></div>
							</div>
						</div>
					</template>
					<div @click="h5Fenxiang" class="popoverFont">下载</div>
				</el-popover>
			</div>
			<!-- 微博 -->
			<div v-else-if="showModelAccontObj.type === 'weibo'">
				<el-input v-model="showModelAccontObj.fenxiangUrl" :rows="4" resize="none" type="textarea" @blur="blurInput" maxlength="40" show-word-limit placeholder="请输入要分享的内容标题"></el-input>
				<div style="text-align: right; margin-top: 1.2vh">
					<el-button type="primary" @click="fenxiangFn(showModelAccontObj.type)">分享</el-button>
				</div>
			</div>
			<!-- 其他分享 -->
			<div v-else>
				<el-input style="width: 20vw; min-height: 5vh" v-model="showModelAccontObj.fenxiangUrl" readonly />
				<div class="fenxiangUrl_imgBox" @click="copyUrl">
					<el-popover placement="right" width="auto" trigger="hover" content="复制链接">
						<template #reference>
							<img src="@/assets/img/preview/fenxiang.png" />
						</template>
					</el-popover>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	nextTick,
	onMounted,
	reactive,
	ref,
	toRefs,
	getCurrentInstance,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as previewFns from './preview'
import html2Canvas from 'html2canvas'
import QRCode from 'qrcodejs2'
import { ElMessage } from "element-plus";

export default {
	name: '',
	setup(props, context) {
		const router = new useRouter()
		const route = new useRoute()
		const data = reactive({
			infoImageUrl: '', //封面图地址
			leftInfo: '', //标题
			returnUrl: '',
			showModelAccontObj: '',
			dialogVisible: false, //是否显示分享模态框
			parametersData: {},
			imgMusic: '', //当前图片背景音乐地址
			contentMusic:'',//整个图片内容背景音乐
			currIdx: 0, //当前图片id，
			srcList: [], //大图显示图片地址
			iconArr: [
				{
					title: 'Instagram',
					iconUrl: require('@/assets/icon/heightPrecision/instagram_0.png'),
					type: 'instagram',
					fenxiangUrl: '',
				},
				{
					title: 'Twitter',
					iconUrl: require('@/assets/icon/heightPrecision/twitter_0.png'),
					type: 'twitter',
					fenxiangUrl: '',
				},
				{
					title: 'Facebook',
					iconUrl: require('@/assets/icon/heightPrecision/facebook_0.png'),
					type: 'facebook',
					fenxiangUrl: '',
				},
				{
					title: 'QQ',
					iconUrl: require('@/assets/icon/heightPrecision/qq_0.png'),
					type: 'qq',
					fenxiangUrl: '',
				},
				{
					title: '微博',
					iconUrl: require('@/assets/icon/heightPrecision/weibo_0.png'),
					type: 'weibo',
					fenxiangUrl: '',
				},
				{
					title: '微信',
					iconUrl: require('@/assets/icon/heightPrecision/weixin_0.png'),
					type: 'weixin',
					fenxiangUrl: '',
				},
				{
					title: 'H5海报',
					iconUrl: require('@/assets/icon/heightPrecision/h5_0.png'),
					type: 'h5',
					fenxiangUrl: '',
				},

			],
		})
		nextTick(() => {
			;(async () => {
				await previewFns
					.details({ id: route.params.id })
					.then((res) => {
						data.parametersData = res.data
						data.returnUrl = res.data.returnUrl
						data.leftInfo = res.data.title
						data.imgMusic = res.data.imagePage[0].audioUrl
						data.contentMusic = res.data.mainVideoUrl
						data.infoImageUrl = res.data.imageUrl
						data.srcList = [res.data.imagePage[0].imageUrl]
					})
			})()
		})
		//切换换背景音乐
		function changeCarousel(target, origin) {
			data.currIdx = target
			data.imgMusic = data.parametersData.imagePage[data.currIdx].audioUrl
		}
		//图片全屏预览
		function fullscreen() {
			data.srcList = [
				data.parametersData.imagePage[data.currIdx].imageUrl,
			]
		}
		//其他分享
		const clickLeftIcon = (type) => {
			data.showModelAccontObj = {}
			data.dialogVisible = true
			data.iconArr.map((item) => {
				if (item.type === type) {
					item.iconUrl = require(`@/assets/icon/heightPrecision/${type}_1.png`)
					if (item.type !== 'weibo') {
						item.fenxiangUrl = data.returnUrl
					}
					data.showModelAccontObj = item
				} else {
					item.iconUrl = require(`@/assets/icon/heightPrecision/${item.type}_0.png`)
					item.fenxiangUrl = ''
				}
			})
			if (type === 'h5') {
					showQrcode()
			}
		}
		//微博分享
		function fenxiangFn(type) {
			if (type === 'weibo') {
				let shareUrl = 'https://service.weibo.com/share/share.php?'
				shareUrl += 'url=' + encodeURIComponent(data.returnUrl)
				shareUrl +=
					'&title=' +
					encodeURIComponent(data.showModelAccontObj.fenxiangUrl)
					window.open(
						shareUrl,
						'_blank',
						'height=100, width=400',
						'scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes'
					)
			}
		}
		//下载H5海报
		function h5Fenxiang() {
			html2Canvas(document.getElementById('h5Fenxiang'), {
				useCORS: true,
				allowTaint: true,
			}).then((canvas) => {
				let dataURL = canvas.toDataURL('image/png', 1.0)
				if (dataURL !== '') {
					var a = document.createElement('a')
					a.download = data.leftInfo
					a.href = dataURL
					a.click()
				}
			})
		}
		//H5分享创建二维码
		const instance = getCurrentInstance()
		function creatQrCode() {
			if (!document.getElementById('qrcode').title) {
				new QRCode(instance.refs.qrCodeUrl, {
					text: data.returnUrl, // 需要转换为二维码的内容
					width: 120,
					height: 120,
					colorDark: '#000000',
					colorLight: '#ffffff',
					correctLevel: QRCode.CorrectLevel.H,
				})
			}
		}
		function showQrcode() {
			nextTick(() => {
				creatQrCode()
			})
		}
		//关闭弹框
		function handleClose() {
			data.dialogVisible = false
			data.iconArr.map((item) => {
				item.iconUrl = require(`@/assets/icon/heightPrecision/${item.type}_0.png`)
			})
		}
		const back = () => {
			router.push({
				path: sessionStorage.getItem('lasterRouter'),
			})
		}
		return {
			...toRefs(data),
			changeCarousel,
			fullscreen,
			clickLeftIcon,
			fenxiangFn,
			h5Fenxiang,
			creatQrCode,
			back,
			handleClose,
			showQrcode
		}
	},
	methods:{
	   copyUrl() {
			this.$copyText(this.showModelAccontObj.fenxiangUrl).then(() => {
				ElMessage.success({
					message: '链接已复制',
					type: 'success',
				})
			}),
				(error) => {
					console.log('error', error)
					ElMessage.success({
						message: '复制失败',
						type: 'success',
					})
				}
		}
	},
}
</script>

<style lang="less"  scoped>
.img_Account_pre {
	display: grid;
	grid-template-columns: 18% 82%;
	justify-items: center;
	margin: 30px;
	.side_bar {
		width: 100%;
		height: calc(100vh - 60px);
		background-color: #fff;
		box-shadow: #d1d1d1 0px 0px 10px;
		position: relative;
		.top_icon {
			position: absolute;
			top: 20px;
			left: calc(50% - 10px);
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background-color: #dddddd;
		}
		.middle_box {
			height: 70%;
			position: absolute;
			top: 60px;
			display: flex;
			flex-direction: column;
			li:nth-child(1) {
				margin: 0 15px 30px;
				text-align: left;
				div {
					color: #ccc;
					margin-bottom: 5px;
				}
				.title {
					color: rgb(19, 17, 17);
					font-weight: bolder;
					font-size: 17px;
				}
			}
			li:nth-child(2) {
				margin: 0 0 30px;
				img {
					width: 100%;
					height: 183px;
					object-fit: cover;
					cursor: pointer;
				}
			}
			li:nth-child(3) {
				color: rgb(160, 157, 157);
				margin: 0 15px 30px;
				font-size: 14px;
			}
			li:nth-child(4) {
				text-align: center;
			}
			li:nth-child(5) {
				display: flex;
				justify-content: center;
				img {
					cursor: pointer;
				}
			}
		}
		.left_icons {
			height: 160px;
			position: absolute;
			bottom: 60px;
			right: 20px;
			display: flex;
			flex-direction: column;
			align-items: center;
			div {
				img {
					width: 1vw;
					height: 1vw;
					cursor: pointer;
				}
			}
		}
	}
	.right_content {
		width: calc(100vw - 473px);
		height: calc(100vh - 60px);
		overflow: hidden;
		.fullscreen_icon {
			position: absolute;
			bottom: 24%;
			right: 8%;
			cursor: pointer;
		}
		:deep(.el-carousel) {
			height: calc(100vh - 60px);
			.el-carousel__container {
				height: calc(100vh - 60px);
				display: flex;
				justify-content: center;
				.el-carousel__item {
					width: 90%;
					left: 5%;
					img {
						align-items: center;
					}
					.title {
						font-size: 20px;
						font-weight: bolder;
					}
				}
				.el-carousel__arrow--left {
					left: 0;
					top: 38%;
				}
				.el-carousel__arrow--right {
					right: 0;
					top: 38%;
				}
			}
		}
	}
}
.h5img {
	margin-top: 3vh;
	width: 18vw;
	height: 21vh;
	object-fit: cover;
}
.dian_h5 {
  background-color: rgb(220, 220, 220);
  width: 1vw;
  height: 2vh;
  position: relative;
  top: -3vh;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}
.qrcodeBox_title_font {
  font-size: 1.8vh;
  font-weight: bold;
  color: #000;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.fenxiangUrl_imgBox {
  position: absolute;
  top: 55%;
  right: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  box-shadow: 0 0 2vh #b6b6b7;
  width: 4.5vw;
  height: 9vh;
  cursor: pointer;
  img {
    width: 1.5vw;
    height: 3vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.popoverFont:hover{
  cursor: pointer;
  color: blue;
}
.qrcode {
  display: inline-block;
  img {
    width: 16.6vw;
    height: 13.2vh;
    background-color: #fff;
    padding: 0.6vh;
    box-sizing: border-box;
  }
}
</style>

