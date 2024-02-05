# Frontend

Link to Deployment Website: https://dashboard.heroku.com/apps/simp-internship-management

Use the account that was specified to access the deployment website.

***
## vue-project

#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

***

## Framework
### Vue.js

#### General Pages and Components
    - HelpPage.vue --> page through which the user guide will be displayed
    - LoginPage.vue --> page for logging into the website
    - DatePicker.vue --> vue component for displaying dates in an interactive way
    - FooterCard.vue --> vue component representing the footer of the page
    - MyTemplate.vue --> template page 
    - SideBar.vue --> vue component for displaying the sidebar of the page
    - TopBar.vue --> vue component for displaying the topbar of the page

#### Student Pages and Components
    - ApplicationFormPage.vue --> page for displaying the student applying for internship
    - DetailsFormPage.vue --> page for displaying the student's profile page
    - HomePage.vue --> page for displaying all internship opportunities listing
    - ReportsPage.vue --> page for viewing student's reports
    - StudentApplicationsPage.vue --> page for students to view the status of their applications
    - EditReport.vue --> page for editing a report
    - ExperiencesCard.vue --> vue component for displaying the experience list in profile page
    - JobCard.vue --> vue component for displaying the internship opportunity card
    - JobDetailDialog.vue --> vue component for displaying the internship opportunity detail dialog
    - JobDetails.vue --> page for displaying the internship opportunity details
    - JobDetailsCard.vue --> vue component for displaying the internship opportunity details card
    - ProfileCard.vue --> vue component for displaying the students profile
    - ReportsCard.vue --> vue component for displaying a report's card
    - ReportsListCard.vue --> vue component for displaying the list of reports
    - SkillsCard.vue --> page for displaying the skills list in profile page

#### Employer Pages and Components
    - EmployerAdvertisementList.vue --> page for showing all internship opportunities posted by employer
    - EmployerApplicationList.vue --> page for showing all internship applications by students
    - EmployerProfilePage.vue --> page showing employer's details, details can be edited through this
    - EmployerSignupPage.vue --> page through which employers can sign up
    - JobAdvertisementPage.vue --> page for employer to post a new job advertisement
    - MyJobsPage.vue --> page showing all job advertisements made by employer
    - AppsList.vue --> page for viewing all applications for a job posting
    - EmployerAdvertisementDetailDialog.vue --> vue component for displaying the employer advertisement detail dialog
    - EmployerApplicationDetailDialog.vue --> vue component for displaying the employer application detail dialog
    - InterviewSlot.vue --> page for displaying options for selecting interview slot
        

#### Admin Pages and Components
    - AdminDialog.vue --> vue component for displaying admin statistics dialog
    - EmployerChart.vue --> vue component for displaying employer statistics chart
    - EmployersDialog.vue --> vue component for displaying employer statistics dialog
    - PostingsDialog.vue --> vue component for displaying postings statistics dialog
    - StudentsDialog.vue --> vue component for displaying students statistics dialog
    - AdminDashboard.vue --> page for displaying the admin dashboard
    - AdminDBCard.vue --> vue component for displaying the card component in the admin dashboard
    - AdminDetailsFormPage.vue --> page for displaying the admin's details
    - AdminProfile.vue --> page for displaying the admin's profile
    - Popup.vue --> vue component which pops out to display students reports
    - ReportListCard.vue --> vue component for displaying student's reports
    - StudentList.vue --> page for displaying a list of students

#### Configuration Files
    - routes.js --> vue components are listed for use and what roles can access them
    - .env --> backend link to be used on all pages for api call
    - static.json --> json file for deployment to specify folder to deploy from
    - server.js --> the node js server to use for deployment
    - axiosConfig.js --> axiosConfig used for secure api calls to avoid unwanted traffic
    - store.js --> the global store to act as local storage for information needed on all pages
