<template>
	<!-- 类别/专题基本信息 -->
	<div class='summarize_info'>
		<!-- 上方展示信息 -->
		<ul class="show_info">
			<li class='info_left'>
				<img style='margin:10px 0 0 10px;' src='../../assets/img/uploader/classify_up.png' />
				<div>
					<p>现在已有</p>
					<p>{{isDetail?basicInfo.numberOfAuthors:''}}</p>
				</div>
			</li>
			<li class='info_middle'>
				<div class='count'>
					<img style='width:1.2vw;margin:10px 0 0 10px;' src='@/assets/img/uploader/proinfo.png'>
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
					<img style='width:1.2vw;margin:10px 0 0 10px;' src='@/assets/img/uploader/watchInfo.png'>
					<div>
						<p>
							<span>观看总次数</span>
							<span>{{isDetail?basicInfo.timesWatched:''}}</span>
						</p>
						<p>
							<span>观看总人数</span>
							<span>{{isDetail?basicInfo.viewers:''}}</span>
						</p>
					</div>
				</div>
			</li>
			<li class='info_right'>
				<div class='time'>
					<p>
						<img style='width:0.99vw;height:2.13vh;margin:0 10px;' src='../../assets/img/uploader/time_info.png' />创建于{{basicInfo.createdAt&&isDetail?basicInfo.createdAt.split('T')[0]:''}}
					</p>
					<!-- <p> 
               <img style='width:19px;height:23px;margin:0 10px;'  src='../../assets/img/uploader/time_info.png'/>
               <span>最近作品添加于</span> 
               <span v-if='basicInfo.newestIwpost'>{{isDetail?basicInfo.newestIwpost.createAt.split('T')[0]+basicInfo.newestIwpost.title:''}}</span>
            </p> -->
					<el-popover placement="top" width="auto" trigger="hover" :content="basicInfo.newestIwpost&&isDetail?basicInfo.newestIwpost.title:''" :disabled='basicInfo.newestIwpost&&basicInfo.newestIwpost.title&&basicInfo.newestIwpost.title.length<20?true:false'>
						<template #reference>
							<p>
								<img style='width:0.99vw;height:2.13vh;margin:0 10px;' src='../../assets/img/uploader/time_info.png' />
								<i>最近作品添加于</i> <span v-if='basicInfo.newestIwpost'>{{isDetail?basicInfo.newestIwpost.createAt.split('T')[0]+basicInfo.newestIwpost.title:''}}</span>
							</p>
						</template>
					</el-popover>
				</div>
				<div class='earn'>
					<img style='width:1.2vw;margin:10px 0 0 10px;' src='@/assets/img/uploader/earnings.png'>
					<div class='money'>
						<p>RMB</p>
						<p>{{isDetail?basicInfo.totalRevenue:''}}</p>
					</div>
				</div>
			</li>
		</ul>
		<!-- 下方创作者列表 -->
		<ul class='up_list'>
			<li v-for="(item, index) in basicInfo.authors" :key="index">
				<div>
					<img :src='item.avatarUrl.length>0?item.avatarUrl:require("@/assets/position/listImage.png")' @click="toUploader(item)" />
					<!-- <p>{{item.name}}</p> -->
					<el-popover placement="top" width="auto" trigger="hover" :content="item.name" :disabled='item.name&&item.name.length<9?true:false'>
						<template #reference>
							<p>{{item.name}}</p>
						</template>
					</el-popover>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { useRouter } from 'vue-router'
import {} from 'vue'
export default {
	name: 'summarize',
	components: {},
	props: {
		isDetail: {
			type: Boolean,
			required: true,
		},
		basicInfo: {
			type: Object,
			required: true,
		},
	},
	setup() {
		const router = new useRouter()
		const toUploader = (item) => {
			router.push({
				name: 'uploaderEdit',
				params: { id: item.id, name: 'uploader' },
			})
		}

		return {
			toUploader,
		}
	},
}
</script>

<style lang="less" scoped >
.summarize_info {
	padding: 2.08vw;
	height: 100%;
	.show_info {
		height: 20.83vw;
		display: grid;
		justify-content: space-between;
		grid-template-columns: 15.63vw 25.52vw 27.6vw;
		.info_left {
			background-color: #b6b6b7;
			position: relative;
			div {
				width: 50%;
				position: absolute;
				text-align: center;
				color: #fff;
				top: 50%;
				margin: -8.33vh 0 0 3.13vw;
				p:nth-child(1) {
					font-size: 16px;
				}
				p:nth-child(2) {
					font-size: 3.91vw;
					font-weight: 300;
					margin-top: 24px;
				}
			}
		}
		.info_middle {
			.count:nth-child(1) {
				margin-bottom: 2.08vw;
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
			.count {
				background-color: #b6b6b7;
				height: 9.38vw;
			}
			.count > div {
				height: 77%;
				p {
					display: flex;
					align-items: center;
					justify-content: space-around;
					margin: 0 10px;
					height: 3.13vw;
					line-height: 3.13vw;
					color: #fff;
					span {
						font-size: 0.83vw;
					}
					span:nth-child(1) {
						width: 5.21vw;
					}
					span:nth-child(2) {
						width: 7.81vw;
						text-align: right;
						font-size: 2.6vw;
						font-weight: 300;
					}
				}
			}
		}
		.info_right {
			div {
				background-color: #b6b6b7;
				p {
					height: 2.34vw;
					line-height: 2.34vw;
					color: #fff;
				}
			}
			.time {
				height: 4.69vw;
				margin-bottom: 2.08vw;
			}
			.time > p {
				display: flex;
				align-items: center;
				font-size: 0.73vw;
				span {
					font-size: 0.73vw;
				}
			}
			.time > p:nth-child(2) {
				span {
					width: 65%;
					text-overflow: ellipsis; //超出显示省略号
					overflow: hidden; //超出部分文字隐藏
					white-space: nowrap; //强制不换行
				}
			}
			.earn {
				height: 14.06vw;
				position: relative;
				.money {
					position: absolute;
					top: 50%;
					p:nth-child(1) {
						margin: -2.86vw 0 0 0.52vw;
					}
					p:nth-child(2) {
						font-size: 3.91vw;
						font-weight: 300;
						margin: -2.31vh 0 0 18.52vh;
					}
				}
			}
		}
	}
	.up_list {
		height: 100%;
		margin-top: 2.08vw;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12.5vw, 12.5vw));
		justify-items: center;
		overflow: scroll;
		li {
			width: 10.42vw;
			height: 12.5vw;
			margin: 0.78vw 0;
			box-shadow: 0 0 20px #ccc;
			div {
				padding-top: 1.04vw;
				text-align: center;
				img {
					width: 8.33vw;
					height: 8.33vw;
				}
				p {
					margin: 0.52vw 5px 0 5px;
					font-size: 1.04vw;
					font-weight: bolder;
					text-overflow: ellipsis; //超出显示省略号
					overflow: hidden; //超出部分文字隐藏
					white-space: nowrap; //强制不换行
				}
			}
		}
	}
}
@media screen and (max-height: 620px) {
	.summarize_info {
		.up_list {
			height: 19vh;
		}
	}
}

@media screen and (min-height: 621px) and (max-height: 656px) {
	.summarize_info {
		.up_list {
			height: 23vh;
		}
	}
}
</style>
