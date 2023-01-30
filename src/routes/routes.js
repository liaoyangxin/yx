import HomePage from '@/components/homePage/index.vue'
import Main from '@/components/homePage/main/index.vue'
import Account from '@/components/homePage/account/index.vue'
import AddAccount from '@/components/homePage/account/addOrEdite/addOrEdite.vue'
import UpMain from '@/components/homePage/upMain/index.vue'
import Category from '@/components/homePage/category/index.vue'
import Project from '@/components/homePage/project/index.vue'
import PayForContent from '@/components/homePage/payForContent/index.vue'
import Repository from '@/components/homePage/repository/index.vue'
import Settings from '@/components/homePage/settings/index.vue'
// import AudioAccount from '@/components/homePage/audioAccount/index.vue'
// import AudioAddEditer from '@/components/homePage/audioAccount/addEditer/index.vue'
import ImgAccount from '@/components/homePage/imgAccount/index.vue'
import FontAccount from '@/components/homePage/fontAccount/index.vue'
import Login from '@/components/login'
import Preview from '@/components/preview/preview.vue'
import PreviewComment from '@/components/preview/previewComment.vue'
import OpenViewPreview from '@/components/openView/preview/index.vue'
import UploaderAdd from '@/components/homePage/upMain/uploaderAdd.vue'
import UploaderEdit from '@/components/homePage/upMain/uploaderEdit.vue'
import CategoryAdd from '@/components/homePage/category/categoryAdd.vue'
import CategoryEdit from '@/components/homePage/category/categoryEdit.vue'
import ProjectAdd from '@/components/homePage/project/projectAdd.vue'
import ProjectEdit from '@/components/homePage/project/projectEdit.vue'
import ImgAccountAdd from '@/components/homePage/imgAccount/imgAccountAdd.vue'
import FontAccountAdd from '@/components/homePage/fontAccount/fontAccountAdd.vue'
// import ImgAccountPreview from '@/components/preview/imgAccountPreview.vue'
import FonImgtPreview from '@/components/preview/fonImgtPreview.vue'
import NotPage from '@/components/notPage/index.vue'
const routes = [
	{
		path: '/', name: 'login', component: Login,
	},
	{
		path: '/homePage', name: 'homePage', component: HomePage,
		children: [
			{ path: '/homePage/main', name: 'main', component: Main },
			{ path: '/homePage/account', name: 'account', component: Account },
			{ path: '/homePage/upMain', name: 'upMain', component: UpMain },
			{ path: '/homePage/category', name: 'category', component: Category },
			{ path: '/homePage/project', name: 'project', component: Project },
			{ path: '/homePage/payForContent', name: 'payForContent', component: PayForContent },
			{ path: '/homePage/repository', name: 'repository', component: Repository },
			{ path: '/homePage/settings', name: 'settings', component: Settings },
			// { path: '/homePage/audioAccount', name: 'audioAccount', component: AudioAccount},
			{ path: '/homePage/imgAccount', name: 'imgAccount', component: ImgAccount },
			{ path: '/homePage/fontAccount', name: 'fontAccount', component: FontAccount }
		]
	},
	// { path: '/homePage/audioAccount/addEditer', name: 'audioAddEditer', component: AudioAddEditer},
	{ path: '/preview/:id', name: 'preview', component: Preview },
	{ path: '/previewComment/:id', name: 'previewComment', component: PreviewComment },
	{ path: '/openView/preview/:id', name: 'openViewPreview', component: OpenViewPreview },
	{ path: '/homePage/account/AddAccount', name: 'AddAccount', component: AddAccount },
	{ path: '/homePage/upMain/uploaderAdd', name: 'uploaderAdd', component: UploaderAdd },
	{ path: '/homePage/upMain/uploaderEdit/:id/:name', name: 'uploaderEdit', component: UploaderEdit },
	{ path: '/homePage/category/categoryAdd', name: 'categoryAdd', component: CategoryAdd},
	{ path: '/homePage/category/categoryEdit/:id/:name', name: 'categoryEdit', component: CategoryEdit },
	{ path: '/homePage/project/projectAdd', name: 'projectAdd', component: ProjectAdd },
	{ path: '/homePage/project/projectEdit/:id/:name', name: 'projectEdit', component: ProjectEdit },
	{ path: '/404',name:'404', component: NotPage },
	{
		path: '/:pathMatch(.*)*',
		redirect: '/404'
  },
  { path: '/homePage/imgAccount/imgAccountAdd', name: 'imgAccountAdd', component: ImgAccountAdd },
  { path: '/homePage/fontAccount/fontAccountAdd', name: 'fontAccountAdd', component: FontAccountAdd },
//   { path: '/imgAccountPreview/:id', name: 'imgAccountPreview', component: ImgAccountPreview },
  { path: '/fonImgtPreview/:id/:type', name: 'fonImgtPreview', component: FonImgtPreview },
]

export default routes
