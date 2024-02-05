import HomePage from './components/pages/HomePage'
//import AccessDenied from './components/pages/AccessDenied'
import LoginPage from './components/pages/LoginPage'
import DetailsForm from './components/pages/DetailsFormPage'
import EmployerApplicationList from '../src/components/pages/EmployerApplicationList.vue'
import EmployerAdvertisementList from '../src/components/pages/EmployerAdvertisementList.vue'
import StudentList from '../src/components/StudentList.vue'
import ApplicationForm from './components/pages/ApplicationFormPage'
import AdminDashboard from '../src/components/AdminDashboard.vue'
import MyJobs from './components/pages/MyJobsPage'
import JobAdvertisement from './components/pages/JobAdvertisementPage.vue'
import EmployerSignUp from './components/pages/EmployerSignupPage.vue'
import JobDetails from './components/JobDetails.vue'
import ReportsPage from "./components/pages/ReportsPage.vue"
import EditReport from "./components/EditReport.vue"
import StudentApplicationsPage from "./components/pages/StudentApplicationsPage"
import EmployerProfile from './components/pages/EmployerProfilePage.vue'
import InterviewSlot from '../src/components/InterviewSlot.vue'
import AdminDetailsFormPage from './components/AdminDetailsFormPage.vue'
import HelpPage from './components/pages/HelpPage'
import VueRouter from 'vue-router'
import store from './store'

const router = new VueRouter({
    routes: [
        {
            path: '/homepage',
            component: HomePage,
            name: 'homepage',
            meta:{
                auth: true,
                role: null
            }
        },
        {
            path: '/login',
            component: LoginPage,
            name: 'login',
            meta:{
                auth: false,
                role: null
            }
        },
        {
            path: '/detailsform',
            component: DetailsForm,
            name: 'detailsform',
            meta:{
                auth: true,
                role: "STUDENT"
            }
        },
        {
            path: '/empapplicationlist',
            component: EmployerApplicationList,
            name: 'employerapplicationlist',
            meta:{
                auth: true,
                role: "ADMIN"
            }
        },
        {
            path: '/empjoblist',
            component: EmployerAdvertisementList,
            name: 'empjoblist',
            meta:{
                auth: true,
                role: "ADMIN"
            }
        },
        {
            path: '/studentList',
            component: StudentList,
            name: 'studentList',
            meta:{
                auth: true,
                role: "ADMIN"
            }
        },
        {
            path: '/application',
            component: ApplicationForm,
            name: 'application',
            meta:{
                auth: true,
                role: "STUDENT"
            }
        },
        {
            path: '/admindashboard',
            component: AdminDashboard,
            name: 'admindashboard',
            meta:{
                auth: true,
                role: "ADMIN"
            }
        }, 
        {
            path: '/myjobs',
            component: MyJobs,
            name: 'myjobs',
            meta:{
                auth: true,
                role: "EMPLOYER"
            }
        },
        {
            path: '/jobadvertisement',
            component: JobAdvertisement,
            name: 'jobadvertisement',
            meta:{
                auth: true,
                role: "EMPLOYER"
            }
        },
        // TO BE REMOVED
        {
            path: '/interviewslot',
            component: InterviewSlot,
            name: 'interviewslot',
            meta:{
                auth: true,
                role: "EMPLOYER"
            }
        }
        
        /*,

        {
            path: '/accessdenied',
            component: AccessDenied,
            name: 'accessdenied',
            meta:{
                auth: false,
                role: "null"
            }
        },
        */,
        {
            path: '/signup',
            component: EmployerSignUp,
            name: 'signup',
            meta:{
                auth: false,
                role: null
            }
        },
        {
            path: '/jobdetails',
            component: JobDetails,
            name: 'jobdetails',
            meta:{
                auth: false,
                role: null
            }
        },
        {
            path: '/reports',
            component: ReportsPage,
            name: 'reportspage',
            meta:{
                auth: true,
                role: "STUDENT"
            }
        },
        {
            path: '/editReport',
            component: EditReport,
            name: 'editReport',
            meta:{
                auth: true,
                role: "STUDENT"
            }
        },
        {
            path: '/studentApplications',
            component: StudentApplicationsPage,
            name: 'studentApplications',
            meta:{
                auth: true,
                role: "STUDENT"
            }
        },
        {
            path: '/empprofile',
            component: EmployerProfile,
            name: 'empprofile',
            meta:{
                auth: true,
                role: "EMPLOYER"
            }
        },
        {
            path: '/admindetailsformpage',
            component: AdminDetailsFormPage,
            name: 'admindetailsformpage',
            meta:{
                auth: true,
                role: "ADMIN"
            }
        },
        {
            path: '/help',
            component: HelpPage,
            name: 'helppage',
            meta: {
                auth: true,
                role: null
            }
        }
    
    ]
})

router.beforeEach( async (to, from, next) => {
    let role = store.state.user.role
    // if roles match or user is admin
    if(to.meta.auth){
        if(store.state.user.auth)
        {   
            if(role == to.meta.role || role == "ADMIN" || role == "COADMIN"|| to.meta.role == null){
                next()

            }
            else{
                next('/login')
            }
        }
        
        else{
            next('/login')

        }

    }
    else{
        next()
    }
})

export default router;
