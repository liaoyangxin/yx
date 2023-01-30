<template>
	<!-- 基本信息 -->
	<div class='basic_info'>
		<div class='basic_info_top'>
			<div class='toimg' style='width:14.58vw;' @click="leftImageClick">
				<img class='photo' :disabled='disabledState' :src="basicInfo.photoUrl?basicInfo.photoUrl:require('@/assets/img/uploader/up_photo.png')">
				<img v-if='disabledState' class='toimg_disabled' src='@/assets/img/uploader/disable303.png'>
			</div>
			<ul class='info'>
				<li>
					<span>证件号码:</span>
					<span>
						<el-input v-model="basicInfo.identificationNumber	" :disabled='disabled&&isDetail' @blur="blur(basicInfo.identificationNumber)" size='mini' class='edit' />
					</span>
				</li>
				<li>
					<span>姓名:</span>
					<span>
						<el-input v-model="basicInfo.name" @blur="blur(basicInfo.name)" :disabled='disabled' size='mini' class='edit' />
					</span>
				</li>
				<li>
					<span>性别:</span>
					<span>
						<el-select v-model="basicInfo.gender" placeholder="请选择性别" :disabled='disabled' size='mini' @change="blur(basicInfo.gender)">
							<el-option label="男" value="男"></el-option>
							<el-option label="女" value="女"></el-option>
						</el-select>
					</span>
				</li>
				<li>
					<span>出生日期:</span>
					<span>
						<el-date-picker v-model="basicInfo.birthday" :disabled='disabled' type="date" @blur="blur(basicInfo.gender)" style='width:200px' value-format="YYYY-MM-DD" placeholder="请选择出生日期" size='mini'> </el-date-picker>
					</span>

				</li>
				<li>
					<span>国籍:</span>
					<span>
						<el-input v-model="basicInfo.country" :disabled='disabled' @blur="blur(basicInfo.gender)" size='mini' class='edit' />
					</span>
				</li>

				<li v-if='isDetail'>
					<span>加入时间：</span>
					<span>
						<el-input v-model="basicInfo.createdAt" size='mini' disabled />
					</span>
				</li>
			</ul>
			<div class='category_box'>
				<img style='width:1.2vw;margin:0.52vw 0 0 0.52vw;' src='@/assets/img/uploader/typeicon.png'>
				<div class='classify' v-if='isDetail'>
					<div class='item_box'>
						<p v-for="item,index in basicInfo.categories" :key="index">
							<el-popover placement="top" width="auto" trigger="hover" :content="item.name" :disabled='item.name&&item.name.length<4?true:false'>
								<template #reference>
									<p>{{item.name}}</p>
								</template>
							</el-popover>
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class='basic_info_bottom'>
			<div class='bottom_left'>
				<img style='width:1.2vw;margin:0.52vw 0 0 0.52vw;' src='@/assets/img/uploader/earnings.png'>
				<div class='money'>
					<p>RMB</p>
					<p>{{isDetail?basicInfo.money:''}}</p>
				</div>
			</div>
			<div class='bottom_right'>
				<div class='count_work count'>
					<img style='width:1.2vw;margin:0.52vw 0 0 0.52vw;' src='@/assets/img/uploader/proinfo.png'>
					<div class="work_data">
						<div>
							<img style='width:1.2vw;margin:0.52vw 0 0 0.52vw;'>
							<span><img src='@/assets/img/uploader/videoIcon.png'></span>
							<span><img src='@/assets/img/uploader/audioIcon.png'></span>
							<span><img src='@/assets/img/uploader/textIcon.png'></span>
							<span><img src='@/assets/img/uploader/imgIcon.png'></span>

						</div>
						<div>
							<span>作品总数</span>
							<span>{{isDetail?basicInfo.contentQuantity:''}}</span>
							<span>{{isDetail?basicInfo.musicQuantity:''}}</span>
							<span>{{isDetail?basicInfo.wordQuantity:''}}</span>
							<span>{{isDetail?basicInfo.imageQuantity:''}}</span>
						</div>
						<div>
							<span>作品总时长</span>
							<span>{{isDetail?basicInfo.contentDuration:''}}</span>
							<span>{{isDetail?basicInfo.musicDuration:''}}</span>
							<span>{{isDetail?basicInfo.wordDuration:''}}</span>
							<span>{{isDetail?basicInfo.imageDuration:''}}</span>
						</div>
					</div>
				</div>
				<div class='count'>
					<img style='width:1.2vw;margin:0.52vw 0 0 0.52vw;' src='@/assets/img/uploader/watchInfo.png'>
					<div>
						<p>
							<span>观看总次数</span>
							<span class='pgs'></span>
							<span>{{isDetail?basicInfo.timesWatched:''}}</span>
						</p>
						<p>
							<span>观看总人数</span>
							<span class='pgs'></span>
							<span>{{isDetail?basicInfo.viewers:''}}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
		<el-drawer v-if="showAddVideo" v-model="showAddVideo" :destroy-on-close="true" direction="rtl" size="65%;" :with-header="false" :show-close="false" :before-close="drawerClose">
			<div style="margin: 50px 90px 0px 90px">
				<VideoImageList :paramObj="paramObj" :showTitleIcon="false" :rowNumber="3" @chooseAccount="chooseAccount"></VideoImageList>
			</div>
		</el-drawer>
	</div>
</template>

<script>
import VideoImageList from '@/components/public/videoImageList/index/index.vue'
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
export default {
	name: 'BasicDesc',
	components: { VideoImageList },
	props: {
		isDetail: {
			type: Boolean,
			required: true,
		},
		basicInfo: {
			type: Object,
			required: true,
		},
		disabledState: {
			type: Boolean,
			required: true,
		},
		disabled: {
			type: Boolean,
			required: true,
		},
	},
	setup(props, { emit }) {
		const data = reactive({
			showAddVideo: false,
			paramObj: {
				chooseIds: [],
				pageType: 'video',
				funFormName: 'videoPage',
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
			showTitleIcon: false, //不显示头部图标
			checkBox: false, //不支持多选
		})

		const leftImageClick = () => {
			if (props.disabled && props.disabledState) {
				ElMessage.error('请先输入证件号码！')
			} else {
				data.showAddVideo = true
				data.paramObj.pageType = 'image'
				data.paramObj.funFormName = 'imagePage'
				data.paramObj.chooseIds = [props.basicInfo.photoId]
			}
		}
		const chooseAccount = (obj) => {
			props.basicInfo.photoUrl = obj.accessPath
			props.basicInfo.photoId = obj.id
			emit('blur', props.basicInfo)
		}
		const drawerClose = () => {
			data.showAddVideo = false
		}
		function blur(value) {
			// isCardNo(props.basicInfo.identificationNumber)
			emit('blur', props.basicInfo)
		}
		// let isCardNo = function(card){
		//     //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
		//     var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
		//     if(reg.test(card) === false){
		//          data.disabled = true
		//         // ElMessage.error('请输入正确的证件号码.')
		//     }else{
		//     // if(props.basicInfo.id&&props.basicInfo.state==1){
		//             data.disabled = false
		//     // }
		//     }
		// };

		return {
			...toRefs(data),
			...toRefs(props),
			blur,
			drawerClose,
			chooseAccount,
			leftImageClick,
			// isCardNo
		}
	},
}
</script>

<style lang="less" scoped >
.basic_info {
	width: 42.71vw;
	margin: auto;
	position: absolute;
	left: 50%;
	top: 45%;
	margin-left: -21.35vw;
	margin-top: -32.41vh;
	&_top {
		height: 14.58vw;
		display: flex;
		justify-content: space-between;
		margin-bottom: 2.34vw;
		.toimg {
			position: relative;
			.toimg_disabled {
				position: absolute;
				width: 14.58vw;
				height: 14.58vw;
				top: 0;
				left: 0;
			}
		}
		.photo {
			width: 14.58vw;
			height: 14.58vw;
			object-fit: cover;
		}
		.info {
			width: 14.58vw;
			color: #b6b6b7;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			li {
				display: flex;
				justify-content: space-between;
				span {
					font-size: 0.83vw;
					width: 4.17vw;
				}
				span:nth-child(2) {
					width: 10.42vw; //200px
					// text-align: center;
					:deep(.el-input__inner) {
						width: 10.42vw; //200px
						background-color: #eeeeef;
						height: 1.45833vw;
						line-height: 1.45833vw;
					}
					:deep(.el-input__inner:focus) {
						border-color: #eeeeef;
					}
					:deep(.el-input__inner:hover) {
						border-color: #eeeeef;
					}
					// :deep(.el-input__suffix){
					//     right:20px;
					// }
				}
			}
		}
		.category_box {
			width: 7.81vw;
			color: #fff;
			background-color: #b6b6b7;
			position: relative;
			.classify {
				text-align: center;
				height: 11.15vw;
				overflow: scroll;
				position: absolute;
				left: 0.52vw;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.item_box > p > p {
					height: 1.56vw;
					width: 6.77vw;
					margin: 0 auto;
					font-size: 0.83vw;
					text-overflow: ellipsis; //超出显示省略号
					overflow: hidden; //超出部分文字隐藏
					white-space: nowrap; //强制不换行
					cursor: pointer;
				}
			}
		}
	}
	&_bottom {
		height: 19.79vw;
		display: flex;
		justify-content: space-between;
		.bottom_left {
			width: 14.58vw;
			height: 35.19vh;
			background-color: #b6b6b7;
			color: #fff;
			position: relative;
			.money {
				position: absolute;
				top: 50%;
				margin: -3.91vw 0 0 0.52vw;
				p:nth-child(2) {
					font-size: 5.21vw;
					font-weight: 300;
				}
			}
		}
		.bottom_right {
			width: 26.04vw;
			height: 35.19vh;
			.count:nth-child(1) {
				margin-bottom: 1.85vh;
			}
			.count {
				background-color: #b6b6b7;
				height: 16.67vh;
			}
			.count_work {
				.work_data {
					div {
						margin: 0 15px;
						display: grid;
						grid-template-columns: 24% 19% 19% 19% 19%;
						text-align: center;
                        color: #fff;
					}
				}
			}
			.count > div > p {
				display: flex;
				align-items: center;
				justify-content: space-around;
				margin: 0 0.52vw;
				height: 5.56vh;
				line-height: 5.56vh;
				color: #fff;
				span {
					font-size: 0.83vw;
				}
				span:nth-child(1) {
					width: 5.21vw;
				}

				span:nth-child(3) {
					width: 7.81vw;
					text-align: right;
					font-size: 2.6vw;
					font-weight: 300;
				}
			}
		}
	}
}
.forbid::before {
	content: ' ';
	background: url('../../../assets/img/uploader/disable303.png') no-repeat;
	background-size: 100% 100%;
	width: 280px;
	height: 280px;
	position: absolute;

}
</style>
