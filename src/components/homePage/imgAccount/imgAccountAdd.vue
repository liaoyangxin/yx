<template>
<!-- 图片内容新增及编辑 -->
	<div class='img_Account_add'>
		<div class='side_bar'>
			<span class='top_icon'></span>
			<ul class='middle_box'>
				<li>
					<div>标题</div>
					<el-input v-model="parametersData.title" :disabled='isDisabledEnter' @blur="blur()" size='mini' class='edit' />
				</li>
				<li>
					<img @click='imageClick("coverImg")' :src="parametersData.imageUrl?parametersData.imageUrl:require('../../../assets/img/imgaccount/add_img.png')" /><br />
				</li>
				<li>
					<el-input v-model="parametersData.excerpt" :disabled='isDisabledEnter' :rows="4" type="textarea" @blur="blur()" placeholder="Please input" />
				</li>
				<li class='ellipsis'>
					<div @click='imageClick("sideAudio")'>
						<el-popover placement="top" width="auto" trigger="hover" :content="parametersData.auditInfo.name" :disabled='parametersData.auditInfo.name&&parametersData.auditInfo.name.length<12?true:false'>
							<template #reference>
								<p>{{parametersData.auditInfo.name}}</p>
							</template>
						</el-popover>
					</div>
				</li>
				<li>
					<div>
						<img v-if='!parametersData.mainVideoUrl' @click='imageClick("sideAudio")' src="../../../assets/img/imgaccount/add_audio.png" /><br />
						<audio autoplay='true' loop='true' style="width:200px;display:none;" controls ref="audio" v-show='false' :src="parametersData.mainVideoUrl"></audio>
						<div v-if='parametersData.mainVideoUrl' class='music side_music_box'>
							<img @click="upVolume(audio,'audio')" src="../../../assets/img/imgaccount/loud.png">
							<div style='width:26px;height:30px;background:#fff;border-radius:50%;'>
								<img @click="playAudioMain()" :src="musicPlayingMain==true?require('../../../assets/img/imgaccount/puase.png'):require('../../../assets/img/imgaccount/play.png')">
							</div>
							<img @click="downVolume(audio,'audio')" src="../../../assets/img/imgaccount/lowvoice.png">
						</div>
					</div>
				</li>
			</ul>
			<div class='left_icons'>
				<el-tooltip content="删除" effect="light" placement="right">
					<img src="@/assets/img/search/del.png" @click="iconBtn('delete',parametersData)" />
				</el-tooltip><br />
				<el-tooltip :content="parametersData.isDisabled?'启用':'禁用'" effect="light" placement="right">
					<img :src="parametersData.isDisabled?require('@/assets/img/search/used.png'):require('@/assets/img/search/disable.png')" @click="iconBtn('disable',parametersData)" />
				</el-tooltip><br />
				<img src="@/assets/img/uploader/balck8.png" @click="back" />
			</div>
		</div>
		<div class='right_content'>
			<div class='left_content'>
				<div class='top_img_add'>
					<el-carousel :autoplay='false' arrow="always" trigger="click" v-if="parametersData.imagePage.length>0" @change="changeCarousel">
						<el-carousel-item v-for="item in parametersData.imagePage" :key="item.imageId">
							<img :src='item.imageUrl' style='object-fit: cover;width:100%;height:100%;'>
						</el-carousel-item>
					</el-carousel>
					<img class='add_main_img' v-else src="../../../assets/img/imgaccount/cur_img_add.png" @click='imageClick("mainImg")' />
				</div>

				<div class='bottom_box'>
					<div class='select_box'>
						<!-- 作者 -->
						<div>
							<el-popover placement="left" width="auto" trigger="hover" content="作者">
								<template #reference>
									<img class="author_icon" src="@/assets/img/search/author.png" />
								</template>
							</el-popover>
							<el-select v-model="parametersData.authorId" :disabled="!parametersData.imagePage.length>0" @change="saveImgManage(parametersData)" placeholder="请选择作者">
								<el-option v-for="item in authorOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
								</el-option>
							</el-select>
						</div>
						<!-- 主题 -->
						<div>
							<el-popover placement="left" width="auto" trigger="hover" content="类别">
								<template #reference>
									<img class="author_icon" src="@/assets/img/search/type.png" />
								</template>
							</el-popover>
							<el-select v-model="parametersData.categoryId" :disabled="!parametersData.imagePage.length>0" @change="saveImgManage(parametersData)" placeholder="请选择类别">
								<el-option v-for="item in classifyOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
								</el-option>
							</el-select>
						</div>
						<!-- 分类 -->
						<div>
							<el-popover placement="left" width="auto" trigger="hover" content="主题">
								<template #reference>
									<img class="author_icon" src="@/assets/img/search/theme.png" />
								</template>
							</el-popover>
							<el-select multiple collapse-tags v-model="parametersData.subjectIds" :disabled="!parametersData.imagePage.length>0" @change="saveImgManage(parametersData)" placeholder="请选择主题">
								<el-option v-for="item in subjectOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
								</el-option>
							</el-select>
						</div>
						<!-- 关键词 -->
						<div class='keyworlds'>
							<el-popover placement="left" width="auto" trigger="hover" content="关键词">
								<template #reference>
									<img class="author_icon" src="@/assets/img/search/keywords.png" />
								</template>
							</el-popover>
							<el-popover placement="right" trigger="focus" v-model:visible="showPopover" class="right_popover">
								<template #reference>
									<el-input v-model="inputValue" :disabled="isDisabledEnter" @input="changeInputVal" @keydown.enter="handleInputConfirm" @focus="showPopover = true" size="small" placeholder="敲击回车新增">
									</el-input>
								</template>
								<ul v-if="keywordList.length > 0" class="right_popover_list">
									<li v-for="(item, index) in keywordList" :key="item.id" @click="chooseKeyWorld(index)" class="right_popover_item">{{item.name}}</li>
								</ul>
								<ul v-else>
									<li>暂无数据</li>
								</ul>
							</el-popover>
						</div>

					</div>
					<div class='add_img_audio'>
						<audio autoplay='true' ref="audio1" controls v-show='false' :src="detailMusic"></audio>
						<div v-if="currentDetail.audioId" style='text-align:center;' @click='imageClick("mainAudio")' class='ellipsis'>
							<el-popover placement="top" width="auto" trigger="hover" :content="currentDetail.audioName" :disabled='currentDetail.audioName&&currentDetail.audioName.length<12?true:false'>
								<template #reference>
									<p>{{currentDetail.audioName}}</p>
								</template>
							</el-popover>
						</div>

						<div class='music main_music_box' v-if="currentDetail.audioId">
							<img @click="upVolume(audio1,'audio1')" src="../../../assets/img/imgaccount/musicadd.png">
							<div>
								<img @click="playAudio(audio1,currentDetail.audioUrl)" :src="musicPlaying==true?require('../../../assets/img/imgaccount/musicpuase.png'):require('../../../assets/img/imgaccount/musicplay.png')">
							</div>
							<img @click="downVolume(audio1,'audio1')" src="../../../assets/img/imgaccount/musiclow.png">
						</div>
						<img class='add_img_music' v-else @click='imageClick("mainAudio")' src="../../../assets/img/imgaccount/add_img_audio.png" />
					</div>
					<div class='add_img_text'>
						<el-input v-model="currentDetail.title" :disabled='isDisabledEnter' @blur="blur()" size='mini' class='edit' />
						<el-input v-model="currentDetail.comment" :disabled='isDisabledEnter' @blur="blur()" :rows="4" type="textarea" placeholder="Please input" />
						<img class='deleteIcom' @click='deleteImg()' src="../../../assets/img/imgaccount/dele.png" />
					</div>
				</div>
				<!-- 选中的关键词列表 -->
				<div class='choosed_tags'>
					<el-tag v-for="(tag,index) in choosedKeyWords" :key="tag" class="mx-1" closable :disable-transitions="false" @close="handleClose(index)">
						{{ tag.name }}
					</el-tag>
				</div>

			</div>
			<div class='right_add' v-if="parametersData.imagePage.length>0">
				<img @click='imageClick("mainImg")' src="../../../assets/img/imgaccount/add_content_img.png" />
			</div>
		</div>
	</div>
	<!-- 选择组件 -->
	<el-drawer v-if="showAddVideo" v-model="showAddVideo" :destroy-on-close="true" direction="rtl" size="70%;" :with-header="false" :show-close="false" :before-close="drawerClose">
		<div style="margin: 50px 90px 0px 90px">
			<VideoImageList :paramObj="paramObj" :showTitleIcon="false" :rowNumber="3" @chooseAccount="chooseAccount"></VideoImageList>
		</div>
	</el-drawer>
</template>

<script>
import { nextTick, onMounted, reactive, ref, toRefs, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as addOrEdite from '../account/addOrEdite/addOrEdite'
import VideoImageList from '@/components/public/videoImageList/index/index.vue'

export default {
	name: '',
	components: { VideoImageList },
	setup(props, context) {
		const router = new useRouter()
		const route = new useRoute()
		const audio = ref(null)
		const audio1 = ref(null)
		const data = reactive({
			isDisabledEnter: true,
			inputValue: '',
			showPopover: false, //关键词弹出框
			musicPlayingMain: true,
			musicPlaying: true,
			detailMusic: '',
			addimg: '', //判断添加封面图还是主图
			classifyOptions: [],
			subjectOptions: [],
			authorOptions: [],
			keyWordsOptions: [],
			currentDetail: {},
			currIdx: 0,
			parametersData: {
				imagePage: [],
				auditInfo: {
					name: null, // 左侧音频名称
					volume: null, // 左侧音量
				},
				mimeType: 'POST_IMAGE',
				excerpt: '',
				title: '',
			},
			showAddVideo: false,
			titleInputType: 'url',
			paramObj: {
				chooseIds: [],
				pageType: 'video', //选择类型
				funFormName: 'videoPage', // 在组件中获取数据的方法名称
				titleInputType: 'search',
				funFormAttr: {
					duration: null,
					geCreateAt: '',
					leCreateAt: '',
					kw: '',
					pn: 1,
					ps: 11,
					size: null,
					idDesc: true,
				},
			},
		})

		const keywordList = computed(() => {
			let arr = data.keyWordsOptions.filter((v) => !v.choosed)
			if (data.inputValue) {
				arr = arr.filter((v) => v.name.indexOf(data.inputValue) > -1)
			} else {
				arr = data.keyWordsOptions.filter((v) => !v.choosed)
			}
			return arr
		})
		const choosedKeyWords = computed(() => {
			return data.keyWordsOptions.filter((v) => v.choosed)
		})
		dropDownData()
		//下拉框数据
		function dropDownData() {
			Promise.all([
				addOrEdite.dropDownList({ state: 0 }),
				addOrEdite.authorDropDownList({ state: 0 }),
				addOrEdite.subjectDropDownList({ state: 0 }),
				addOrEdite.tagDropDownList({ state: 0 }),
			]).then((res) => {
				data.classifyOptions = res[0]
				data.authorOptions = res[1]
				data.subjectOptions = res[2]
				data.keyWordsOptions = res[3]
				data.parametersData.authorId =
					data.authorOptions.length > 0
						? data.authorOptions[0].id
						: null
				data.parametersData.categoryId =
					data.classifyOptions.length > 0
						? data.classifyOptions[0].id
						: null
				data.parametersData.subjectIds =
					data.subjectOptions.length > 0
						? [data.subjectOptions[0].id]
						: []
				if (route.query && route.query.id) {
					nextTick(() => {
						;(async () => {
							await addOrEdite
								.details({ id: route.query.id })
								.then((res) => {
									data.parametersData.id = res.id
									data.parametersData.title = res.title
									data.parametersData.mainVideoId =
										res.mainVideoId
									data.parametersData.mainVideoUrl =
										res.mainVideoUrl
									data.parametersData.auditInfo.name =
										res.auditInfo.name
									data.parametersData.imageId = res.imageId
									data.parametersData.imageUrl = res.imageUrl
									data.parametersData.excerpt = res.excerpt
									data.parametersData.imagePage =
										res.imagePage
									data.parametersData.subjectIds =
										res.subjectIds
									data.parametersData.authorId = res.authorId
									data.parametersData.tags = res.tags
									data.parametersData.categoryId =
										res.categoryId
									data.parametersData.mimeType = res.mimeType
									data.parametersData.isDisabled =
										res.isDisabled
									if (res.tags && res.tags.length > 0) {
										data.keyWordsOptions.forEach((item) => {
											item.choosed = res.tags.find(
												(i) => i === item.id
											)
												? true
												: false
										})
									}
									if (res.imagePage.length > 0) {
										data.isDisabledEnter = false
										data.currentDetail = res.imagePage[0]
										data.detailMusic =
											res.imagePage[0].audioUrl
									}
									if (audio.value) {
										audio.value.volume = res.auditInfo
											.volume
											? res.auditInfo.volume
											: 0.1
									}
									if (audio1.value) {
										audio1.value.volume =
											res.imagePage[0].audioVolume
										console.log(
											'audio.valueaudio.valueaudio.value',
											audio1.value.play
										)
									}
								})
						})()
					})
				}else if(route.query && route.query.author){
					data.parametersData.authorId =parseInt(route.query.author)
				}else if(route.query && route.query.type){
                    data.parametersData.categoryId = parseInt(route.query.type)
				}else if(route.query && route.query.theme){
                   data.parametersData.subjectIds = [parseInt(route.query.theme)]
				}
			})
		}

		//新增保存、
		const saveImgManage = (obj) => {
			//设置当前
			if (Object.entries(data.currentDetail).length > 0) {
				if (data.parametersData.imagePage.length > 0) {
					Object.assign(
						data.parametersData.imagePage[data.currIdx],
						data.currentDetail
					)
				}
			}

			let request = obj
			if (!obj.title) {
				request = JSON.parse(JSON.stringify(obj))
				request.title = '图片内容标题'
			}
			addOrEdite.iwpostSave(request).then((res) => {
				if (res.code === 200) {
					data.parametersData.id = res.data
				}
			})
		}
		//点击显示图片列表
		const imageClick = (str) => {
			data.addimg = str
			// data.showAddVideo = true
			if (str == 'mainAudio' || str == 'sideAudio') {
				data.paramObj.pageType = 'audio'
				data.paramObj.funFormName = 'audioPage'
				if (data.parametersData.imagePage.length > 0) {
					data.showAddVideo = true
					if (str == 'sideAudio') {
						data.paramObj.chooseIds = [
							data.parametersData.mainVideoId,
						]
					} else {
						let ids = data.parametersData.imagePage.map((i) => {
							if (i.audioId) {
								return parseInt(i.audioId)
							} else {
								return null
							}
						})
						data.paramObj.chooseIds = ids
					}
				} else {
					ElMessage.warning({
						message: '请先选择图片内容',
						type: 'warning',
					})
				}
			} else {
				data.paramObj.pageType = 'image'
				data.paramObj.funFormName = 'imagePage'
				if (str == 'coverImg') {
					if (data.parametersData.imagePage.length > 0) {
						data.showAddVideo = true
						data.paramObj.chooseIds = [data.parametersData.imageId]
					} else {
						ElMessage.warning({
							message: '请先选择图片内容',
							type: 'warning',
						})
					}
				} else {
					data.showAddVideo = true
					let ids = data.parametersData.imagePage.map((i) => {
						if (i.imageId) {
							return parseInt(i.imageId)
						} else {
							return null
						}
					})
					data.paramObj.chooseIds = ids
				}
			}
		}
		//选择图片、音乐
		const chooseAccount = (obj) => {
			let curObj = {}
			if (data.addimg == 'mainImg') {
				//右侧图片
				data.isDisabledEnter = false
				curObj = {
					imageUrl: obj.accessPath,
					imageId: obj.id,
				}
				data.parametersData.imagePage.push(curObj)
			} else if (data.addimg == 'coverImg') {
				//左侧封面图
				data.parametersData.imageUrl = obj.accessPath
				data.parametersData.imageId = obj.id
			} else if (data.addimg == 'mainAudio') {
				//右侧图片音乐
				data.currentDetail.audioId = obj.id
				data.currentDetail.audioName = obj.name
				data.currentDetail.audioUrl = obj.accessPath
				data.currentDetail.audioVolume = 0.5
				nextTick(() => {
					// audio1.value.volume = 1
					playAudio(audio1.value, data.currentDetail.audioUrl, true)
				})
			} else if (data.addimg == 'sideAudio') {
				//左侧封面音乐
				data.parametersData.mainVideoUrl = obj.accessPath
				data.parametersData.mainVideoId = obj.id
				data.parametersData.auditInfo.name = obj.name
				data.parametersData.auditInfo.volume = 0.5
				nextTick(() => {
					// audio.value.volume = 0.1
					playAudioMain(true)
				})
			}
			saveImgManage(data.parametersData)
		}
		const drawerClose = () => {
			data.showAddVideo = false
		}
		function blur() {
			if (data.parametersData.imagePage.length > 0) {
				saveImgManage(data.parametersData)
			} else {
				ElMessage.warning({
					message: '请先选择图片内容',
					type: 'warning',
				})
			}
		}
		//禁用删除图标
		function iconBtn(value, obj) {
			let ids = []
			ids.push(obj.id)
			if (obj.id) {
				if (value == 'delete') {
					ElMessageBox.confirm('删除', {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
						type: 'warning',
						center: true,
					})
						.then(() => {
							addOrEdite.batchDelete({ ids: ids }).then((res) => {
								if (res.code == 200) {
									back()
								}
							})
						})
						.catch(() => {})
				} else if (value == 'disable') {
					if (!obj.isDisabled) {
						//当前启用
						addOrEdite.batchDisable({ ids: ids }).then((res) => {
							if (res.code == 200) {
								data.parametersData.isDisabled = true
							}
						})
					} else {
						//当前禁用
						addOrEdite.batchEnable({ ids: ids }).then((res) => {
							if (res.code == 200) {
								data.parametersData.isDisabled = false
							}
						})
					}
				}
			} else {
				ElMessage.error('请先新增图片内容!')
			}
		}

		function changeCarousel(target, origin) {
			if (data.currentDetail.id) {
				Object.assign(
					data.parametersData.imagePage[origin],
					data.currentDetail
				)
			}
			data.currIdx = target
			data.currentDetail = data.parametersData.imagePage[target]
			//切换歌曲
			let url = data.currentDetail.audioUrl
			nextTick(() => {
				audio1.value.volume = data.currentDetail.audioVolume
					? data.currentDetail.audioVolume
					: 1
				playAudio(audio1.value, url, true)
			})
		}

		//删除主图片
		function deleteImg() {
			data.currentDetail = {}
			data.parametersData.imagePage.splice([data.currIdx], 1)
			data.detailMusic = null
			saveImgManage(data.parametersData)
		}
		//左侧音频
		function playAudioMain(playNow) {
			let target = audio.value
			setTimeout(() => {
				if (playNow || target.paused) {
					target.play()
					target.loop = true
					data.musicPlayingMain = true
					//修改图片为播放状态
				} else {
					target.pause()
					data.musicPlayingMain = false
					//修改图片为暂停状态
				}
			}, 100)
		}
		//右侧音频
		function playAudio(target, url, playNow) {
			data.detailMusic = url
			setTimeout(() => {
				if (playNow || target.paused) {
					target.play()
					target.loop = true
					data.musicPlaying = true
					//修改图片为播放状态
				} else {
					target.pause()
					data.musicPlaying = false
					//修改图片为暂停状态
				}
			}, 100)
		}
		function upVolume(target, target1) {
			if (target.volume >= 1) {
				return
			}
			target.volume = (target.volume * 10 + 1) / 10
			if (target1 == 'audio') {
				//左侧音频
				data.parametersData.auditInfo.volume = target.volume
			} else {
				data.parametersData.imagePage[data.currIdx].audioVolume =
					target.volume
			}
			saveImgManage(data.parametersData)
		}
		function downVolume(target) {
			if (target.volume <= 0) {
				return
			}
			target.volume = (target.volume * 10 - 1) / 10
			if (target == 'audio') {
				//左侧音频
				data.parametersData.auditInfo.volume = target.volume
			} else {
				data.parametersData.imagePage[data.currIdx].audioVolume =
					target.volume
			}
			saveImgManage(data.parametersData)
		}

		const back = () => {
			router.push({ path:sessionStorage.getItem('lasterRouter') })
		}

		//选中tag
		const handleInputConfirm = () => {
			if (
				data.keyWordsOptions.filter((v) => v.name === data.inputValue)
					.length > 0
			) {
				ElMessage.warning({
					message: '该关键词已经存在',
					type: 'warning',
				})
			} else {
				const attr = {
					name: data.inputValue,
				}
				addOrEdite.addKeyWorld(attr).then((res) => {
					res.data.choosed = true
					data.keyWordsOptions.push(res.data)
					data.inputValue = ''
					data.parametersData.tags = data.keyWordsOptions
						.filter((v) => v.choosed)
						.map((item) => item.id)
					saveImgManage(data.parametersData)
					data.showPopover = false
				})
			}
		}
		//选中tag
		const chooseKeyWorld = (i) => {
			const obj = keywordList.value[i]
			data.keyWordsOptions.map((item) => {
				item.choosed = item.id === obj.id ? true : item.choosed
			})
			data.showPopover = false
			data.parametersData.tags = data.keyWordsOptions
				.filter((v) => v.choosed)
				.map((item) => item.id)
			saveImgManage(data.parametersData)
		}
		//撤销选中tag
		const handleClose = (i) => {
			const obj = choosedKeyWords.value[i]
			data.keyWordsOptions.map((item) => {
				item.choosed = item.id === obj.id ? false : item.choosed
			})
			data.parametersData.tags = data.keyWordsOptions
				.filter((v) => v.choosed)
				.map((item) => item.id)
			saveImgManage(data.parametersData)
		}
		function changeInputVal() {
			data.showPopover = false
			setTimeout(() => {
				data.showPopover = true
			}, 100)
		}
		return {
			audio,
			audio1,
			...toRefs(data),
			saveImgManage,
			back,
			// mainImgblur,
			chooseAccount,
			imageClick,
			drawerClose,
			iconBtn,
			blur,
			changeCarousel,
			playAudio,
			playAudioMain,
			upVolume,
			downVolume,
			deleteImg,
			handleClose,
			handleInputConfirm,
			chooseKeyWorld,
			keywordList,
			choosedKeyWords,
			changeInputVal,
		}
	},
}
</script>

<style lang="less"  scoped>
.choosed_tags {
	margin-top: 10px;
	:deep(.el-tag) {
		// padding:5px 10px;
		color: #fff;
		background: #37c8f7;
		border: none;
		border-radius: 16px;
		text-align: center;
		cursor: pointer;
		margin-right: 5px;
		white-space: nowrap;
		line-height: 28px;
		height: 28px;
		.el-tag__close {
			background: #fff;
		}
		.el-tag__close::before {
			color: #37c8f7;
		}
	}
}
.right_popover_list {
	max-height: 90vh;
	overflow-y: auto;
	.right_popover_item {
		padding-left: 0.5vw;
		cursor: pointer;
		&:hover {
			background: #37c8f7;
			color: #fff;
		}
	}
}
.img_Account_add {
	display: flex;
	flex-direction: row; /* 子元素横向排列 */
	justify-content: center; /* 相对父元素水平居中 */
	align-items: center; /*  子元素相对父元素垂直居中 */
	.side_bar {
		width: 323px;
		height: calc(100vh - 60px);
		margin-left: 30px;
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
				.edit :deep(.el-input__inner) {
					background-color: #eeeeef;
				}
			}
			li:nth-child(2) {
				margin: 0 0 30px;
				img {
					width: 323px;
					height: 183px;
					object-fit: cover;
					cursor: pointer;
				}
			}
			li:nth-child(3) {
				margin: 0 15px 30px;
				:deep(.el-textarea__inner) {
					background-color: #eeeeef;
				}
			}
			li:nth-child(4) {
				text-align: center;
								display: flex;
				justify-content: center;
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
			height: 150px;
			position: absolute;
			bottom: 20px;
			right: 20px;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
	.right_content {
		width: calc(100vw - 473px);
		margin: 60px;
		height: calc(100vh - 120px);
		display: flex;
		.left_content {
			width: 80%;
			height: 100%;
			display: grid;
			grid-template-rows: 50% 30% 20%;
			.top_img_add {
				width: 100%;
				height: 100%;
				max-width: 900px;
				:deep(.el-carousel__container) {
					min-height: 40vh;
					max-width: 900px;
					.el-carousel__arrow {
						background: rgba(31, 45, 61, 0.51);
					}
				}
				.add_main_img {
					width: 100%;
					max-width: 900px;
					height: 100%;
					object-fit: cover;
					box-shadow: #d1d1d1 0px 0px 10px;
					cursor: pointer;
				}
			}
			.bottom_box {
				display: grid;
				grid-template-columns: auto auto auto;
				justify-content: space-between;
				justify-items: center;
				grid-gap: 10px 20px;
				max-width: 900px;
				margin-top: 20px;
				height: 100%;
				.select_box {
					height: 85%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					div {
						display: flex;
						justify-content: space-between;
						align-items: center;
						width: 250px;
						.author_icon {
							width: 23px;
							height: 23px;
						}
					}
					.keyworlds {
						width: 240px;
					}
				}
				.add_img_audio {
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					// justify-content: center;
					.add_img_music {
						width: 100%;
						// height:50%;
						cursor: pointer;
						object-fit: cover;
					}
				}
				.add_img_text {
					text-align: right;
					:deep(.el-textarea__inner) {
						background-color: #eeeeef;
					}
					:deep(.el-input__inner) {
						background-color: #eeeeef;
						margin-bottom: 20px;
					}
					.deleteIcom {
						background-color: #ccc;
						border-radius: 50%;
						margin-top: 20px;
					}
				}
			}
		}
		.right_add {
			height: 100%;
			display: flex;
			align-items: center; /*  子元素相对父元素垂直居中 */
			img {
				width: 80%;
				max-width: 400px;
				margin: 28px;
				box-shadow: #d1d1d1 0px 0px 10px;
				cursor: pointer;
				object-fit: cover;
			}
		}
	}
}
.music {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	border: 1px solid rgb(248, 247, 247);
	background: rgba(248, 247, 247, 0.8);
	text-align: center;

	img {
		color: rgb(252, 248, 249);
	}
	img:nth-child(2) {
		width: 10px;
		height: 10px;
	}
}
.side_music_box {
	width: 120px;
	height: 120px;
	background-image: url('../../../assets/img/imgaccount/bgmini.png');
	background-repeat: no-repeat;
	background-position: 50% 50%;

	img {
		cursor: pointer;
	}
}
.main_music_box {
	width: 180px;
	height: 180px;
	background-image: url('../../../assets/img/imgaccount/playbg.png');
	background-repeat: no-repeat;
	background-position: 50% 50%;
	background-size: 25%;
	img {
		cursor: pointer;
	}
}
.ellipsis{
	width: 100%;
	text-align: center;
	cursor: pointer;
	p{
		width: 180px;
		text-overflow: ellipsis; //超出显示省略号
		overflow: hidden; //超出部分文字隐藏
		white-space: nowrap; //强制不换行
	}
}

</style>

