<template>
	<!-- 文字内容新增及编辑 -->
	<div class='text_Account_add'>
		<div class='side_bar'>
			<span class='top_icon'></span>
			<ul class='middle_box'>
				<li>
					<div>标题</div>
					<el-input v-model="parametersData.title" :disabled='isDisabledEnter' @blur="blur()" size='mini' class='edit' />
				</li>
				<li>
					<img @click='imageClick()' :src="parametersData.imageUrl?parametersData.imageUrl:require('../../../assets/img/imgaccount/add_img.png')" /><br />
				</li>
				<li>
					<el-input v-model="parametersData.excerpt" :disabled='isDisabledEnter' :rows="4" type="textarea" @blur="blur()" placeholder="Please input" />
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
			<div class='select_box'>
				<!-- 作者 -->
				<div>
					<el-popover placement="left" width="auto" trigger="hover" content="作者">
						<template #reference>
							<img class="author_icon" src="@/assets/img/search/author.png" />
						</template>
					</el-popover>
					<el-select v-model="parametersData.authorId" @change="saveImgManage(parametersData)" placeholder="请选择作者">
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
					<el-select v-model="parametersData.categoryId" @change="saveImgManage(parametersData)" placeholder="请选择类别">
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
					<el-select multiple collapse-tags v-model="parametersData.subjectIds" @change="saveImgManage(parametersData)" placeholder="请选择主题">
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
				<!-- 选中的关键词列表 -->
				<p class='choosed_tags'>
					<el-tag v-for="(tag,index) in choosedKeyWords" :key="tag" class="mx-1" closable :disable-transitions="false" @close="handleClose(index)">
						{{ tag.name }}
					</el-tag>
				</p>

			</div>
			<div class='text_box'>
				<div class='right_title'></div>
				<div class="tab_change">
					<p v-for="(item, index) in tabData" :key="index">
						<el-popover placement="bottom" width="auto" trigger="hover" :content="item.iconName">
							<template #reference>
								<div class='icon_box' :class="{'actIcon':idx==index}" @click="changeMode(item.name,index)" >
									<img :src="idx == index ? item.image_act : item.image" style="width:40px;height:40px;cursor: pointer;" />
								</div>
							</template>
						</el-popover>
					</p>

				</div>
				<div class='text_content'>
					<textarea ref="textarea"></textarea>
					<!-- <el-select class="code-mode-select" v-model="mode" @change="changeMode">
							<el-option v-for="mode in modes" :key="mode.value" :label="mode.label" :value="mode.value">
							</el-option>
						</el-select> -->
				</div>
				<!-- <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
					<el-tab-pane name="first">
						<template #label>
							<img src='@/assets/img/imgaccount/源码输入.png'>
						</template>
						<div class='text_content'>
							<textarea ref="textarea"></textarea>
							<el-select class="code-mode-select" v-model="mode" @change="changeMode">
								<el-option v-for="mode in modes" :key="mode.value" :label="mode.label" :value="mode.value">
								</el-option>
							</el-select>
						</div>
					</el-tab-pane>
					<el-tab-pane name="second">
						<template #label>
							<img src='@/assets/img/imgaccount/文本输入.png'>
						</template>
						<div class='text_content'>无</div>
					</el-tab-pane>
					<el-tab-pane name="third">
						<template #label>
							<img src='@/assets/img/imgaccount/Macdown.png'>
						</template>
						<div class='text_content'>无</div>
					</el-tab-pane>
				</el-tabs> -->

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

// 引入全局实例
import _CodeMirror from 'codemirror'

// 核心样式
import 'codemirror/lib/codemirror.css'
// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/cobalt.css'

// 需要引入具体的语法高亮库才会有对应的语法高亮效果
// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/r/r.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/swift/swift.js'
import 'codemirror/mode/vue/vue.js'

// 尝试获取全局实例
const CodeMirror = window.CodeMirror || _CodeMirror

export default {
	name: '',
	components: { VideoImageList },
	setup(props, context) {
		const router = new useRouter()
		const route = new useRoute()
		const audio = ref(null)
		const audio1 = ref(null)
		// let activeName = ref('first')
		const data = reactive({
			// 内部真实的内容
			code: '',
			// 默认的语法类型
			mode: 'javascript',
			// 编辑器实例
			coder: null,
			// 默认配置
			options: {
				// 缩进格式
				tabSize: 2,
				// 主题，对应主题库 JS 需要提前引入
				theme: 'cobalt',
				// 显示行号
				lineNumbers: true,
				line: true,
			},
			// 支持切换的语法高亮类型，对应 JS 已经提前引入
			// 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
			modes: [
				{
					value: 'css',
					label: 'CSS',
				},
				{
					value: 'javascript',
					label: 'Javascript',
				},
				{
					value: 'html',
					label: 'XML/HTML',
				},
				{
					value: 'x-java',
					label: 'Java',
				},
				{
					value: 'x-objectivec',
					label: 'Objective-C',
				},
				{
					value: 'x-python',
					label: 'Python',
				},
				{
					value: 'x-rsrc',
					label: 'R',
				},
				{
					value: 'x-sh',
					label: 'Shell',
				},
				{
					value: 'x-sql',
					label: 'SQL',
				},
				{
					value: 'x-swift',
					label: 'Swift',
				},
				{
					value: 'x-vue',
					label: 'Vue',
				},
				{
					value: 'markdown',
					label: 'Markdown',
				},
			],
			idx: 0,
			tabData: [
				{
					image: require('@/assets/img/imgaccount/源码输入.png'),
					image_act: require('@/assets/img/imgaccount/源码输入.png'),
					name: 'javascript',
					iconName: '源码格式',
				},
				{
					image: require('@/assets/img/imgaccount/文本输入.png'),
					image_act: require('@/assets/img/imgaccount/文本输入.png'),
					name: '',
					iconName: '文本格式',
				},
				{
					image: require('@/assets/img/imgaccount/Macdown.png'),
					image_act: require('@/assets/img/imgaccount/Macdown.png'),
					name: 'markdown',
					iconName: 'MarkDown',
				},
			],
			isDisabledEnter: false,
			inputValue: '',
			showPopover: false, //关键词弹出框
			classifyOptions: [],
			subjectOptions: [],
			authorOptions: [],
			keyWordsOptions: [],
			currentDetail: {},
			parametersData: {
				editorMode: 'TEXT', //编辑器格式(SOURCE_CODE,TEXT,MARKDOWN)
				mimeType: 'POST_TEXT',
				excerpt: '', //侧边简介
				title: '', //标题
				content: '', //内容
				wordCount: 0, //文本内容字数
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
		// function handleClick(tab, event) {
		// 	activeName = tab.props.name
		// 	if (activeName == 'third') {
		// 		changeMode('markdown')
		// 	}
		// }
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
									// data.parametersData.mainVideoId =
									// 	res.mainVideoId
									// data.parametersData.mainVideoUrl =
									// 	res.mainVideoUrl
									// data.parametersData.auditInfo.name =
									// 	res.auditInfo.name
									data.parametersData.imageId = res.imageId
									data.parametersData.imageUrl = res.imageUrl
									data.parametersData.excerpt = res.excerpt
									// data.parametersData.imagePage =
									// 	res.imagePage
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
									// if (res.imagePage.length > 0) {
									// 	data.isDisabledEnter = false
									// 	data.currentDetail = res.imagePage[0]
									// 	data.detailMusic =
									// 		res.imagePage[0].audioUrl
									// }
									// if (audio.value) {
									// 	audio.value.volume = res.auditInfo
									// 		.volume
									// 		? res.auditInfo.volume
									// 		: 0.1
									// }
									// if (audio1.value) {
									// 	audio1.value.volume =
									// 		res.imagePage[0].audioVolume
									// 	console.log(
									// 		'audio.valueaudio.valueaudio.value',
									// 		audio1.value.play
									// 	)
									// }
								})
						})()
					})
				} else if (route.query && route.query.author) {
					data.parametersData.authorId = parseInt(route.query.author)
				} else if (route.query && route.query.type) {
					data.parametersData.categoryId = parseInt(route.query.type)
				} else if (route.query && route.query.theme) {
					data.parametersData.subjectIds = [
						parseInt(route.query.theme),
					]
				}
			})
		}

		//新增保存、
		const saveImgManage = (obj) => {
			//设置当前
			// if (Object.entries(data.currentDetail).length > 0) {
			// 	if (data.parametersData.imagePage.length > 0) {
			// 		Object.assign(
			// 			data.parametersData.imagePage[data.currIdx],
			// 			data.currentDetail
			// 		)
			// 	}
			// }
			let request = obj
			if (!obj.title) {
				request = JSON.parse(JSON.stringify(obj))
				request.title = '文字内容标题'
			}
			addOrEdite.iwpostSave(request).then((res) => {
				if (res.code === 200) {
					data.parametersData.id = res.data
				}
			})
		}
		//点击显示图片列表
		const imageClick = () => {
			data.paramObj.pageType = 'image'
			data.paramObj.funFormName = 'imagePage'
			data.showAddVideo = true
			data.paramObj.chooseIds = [data.parametersData.imageId]
		}

		//选择图片
		const chooseAccount = (obj) => {
			data.isDisabledEnter = false
			data.parametersData.imageUrl = obj.accessPath
			data.parametersData.imageId = obj.id
			saveImgManage(data.parametersData)
		}
		const drawerClose = () => {
			data.showAddVideo = false
		}
		function blur() {
			// if (data.parametersData.imagePage.length > 0) {
			saveImgManage(data.parametersData)
			// } else {
			// 	ElMessage.warning({
			// 		message: '请先选择图片内容',
			// 		type: 'warning',
			// 	})
			// }
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

		const back = () => {
			router.push({ path: sessionStorage.getItem('lasterRouter') })
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
			handleClose,
			handleInputConfirm,
			chooseKeyWorld,
			keywordList,
			choosedKeyWords,
			changeInputVal,
			// handleClick,
			// activeName,
		}
	},
	mounted() {
		// 初始化
		this._initialize()
	},
	methods: {
		// 初始化
		_initialize() {
			// 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
			this.coder = CodeMirror.fromTextArea(
				this.$refs.textarea,
				this.options
			)
			// 编辑器赋值
			this.coder.setValue(this.value || this.code)

			// 支持双向绑定
			this.coder.on('change', (coder) => {
				this.parametersData.content = coder.getValue()
			})
		},
		// 更改模式
		changeMode(val,index) {
			// 修改编辑器的语法配置
			this.idx = index
			if(val){
			  this.coder.setOption('mode', `text/${val}`)
			}
		},
	},
}
</script>

<style lang="less"  scoped>
.choosed_tags {
	// width: 260px;
	margin-top: 10px;
	:deep(.el-tag) {
		// padding:5px 10px;
		color: #fff;
		background: #37c8f7;
		border: none;
		border-radius: 16px;
		text-align: center;
		cursor: pointer;
		margin: 5px 5px 0 0;
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
.text_Account_add {
	display: grid;
	justify-content: left; /* 相对父元素水平居中 */
	grid-template-columns: 360px auto;
	margin: 30px;
	.side_bar {
		width: 323px;
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
		width: calc(100vw - 420px);
		// margin: 60px;
		height: calc(100vh - 60px);
		display: grid;
		grid-template-columns: 30% auto;
		.select_box {
			height: 85%;
			width: 100%;
			display: grid;
			grid-template-rows: 50% 10% 10% 10%;
			align-items: end;
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
		.text_box {
			height: calc(100vh - 60px);

			.right_title {
				height: 50px;
				background: #9b9a9a;
			}
			.tab_change {
				width: 100%;
				height: 30px;
				display: grid;
				 grid-template-columns:33.3% 33% 33.6%;
				 align-items: center;
				 text-align: center;
				 padding-bottom: 30px;
				 background-color: #EEEEEF;
				.icon_box {
					height:60px;
					line-height:60px;
					border: 1px solid rgb(230, 227, 227);
					img{
			           margin-top:10px;
					}
				}
			}
			.text_content {
				width: 100%;
				height: calc(100vh - 180px);
			}
		}
	}
}
:deep(.CodeMirror) {
	height: 100%;
	// background-color:#fff;
}
.actIcon{
	 background-color: #FFFFFF;
}
</style>

