# Backend
[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

### Usage
Start the project with `npm run dev` command.
After starting, backend server will run at http://localhost:3030/

### Services
- **admin**: Admin service
- **api**: API Gateway service
- **advert**: Employer advertisement service
- **app**: Employer application service
- **prof**: Employer profile service
- **jobapplycoverletter**: Job Application Cover Letter service
- **jobapplyform**: Job Application Form service
- **jobapplyrecommendationletter**: Job Application Recommendation Letter service
- **jobapplyresume**: Job Application Resume service
- **jobapply**: Job application service
- **job**: Job listing service
- **mail**: Email service
- **statistics**: Statistics service
- **student**: Student service
- **report**: Student Report service
- **users**: Users login service

### Available Actions for Services
```
NOTE: default in PARAMS refer to the action from mixins of moleculer-db package
```
* #### admin
REST | PARAMS | ROUTE
--- | --- | ---
GET | default | admin => admin.list
POST | default | admin => admin.create
GET | default | admin/:id => admin.get
PUT | default | admin/:id => admin.update
DELETE | default | admin/:id => admin.remove
GET | - | admin/userCount => admin.userCount - Returns the users based on the roles
GET | - | admin/employerApplicationCount => admin.employerApplicationCount - Returns the number of employers based on their approval status
GET | - | admin/employerJobPostsCount => admin.employerJobPostsCount - Returns number of jobs created by a certain employer.
POST | jobID | admin/topJobsCounter => admin.topJobsCounter - updates the number of users that have viewed a certain job. Should be called with each job view click.
POST | jobID | admin/createTopJobsCounter => admin.createTopJobsCounter - Creates the job view counter when each new job is created.
GET | - | admin/getTopJobs => admin.getTopJobs - Returns the list of all the job view counters created in the database.
POST | userRole, email | admin/createUser => admin.createUser - Admin endpoint which allows any type of user to be created.
PATCH | newRole, email | admin/updateUserRole => admin.updateUserRole - Admin endpoint which updates the user role for the given email.
DELETE | email | admin/deleteUser => admin.deleteUser - Admin endpoint which deletes the user data of the given email.

* #### advert
REST | PARAMS |ROUTE
--- | --- | ---
   GET | default | advert => advert.list
  POST | default | advert => advert.create
   GET | default | advert/:id => advert.get
   PUT | default | advert/:id => advert.update
DELETE | default | advert/:id => advert.remove
  POST | employerName | advert/searchemp => advert.searchByEmp
  POST | employerName, keyword, status | advert/advsearchemp => advert.advSearchByEmp
  POST | keyword, status | advert/search => advert.search
   GET | - | advert/pendingjob => advert.pending
   PUT | id, jobType | advert/approve/:id => advert.approve
   PUT | id, feedback | advert/reject/:id => advert.reject

* #### app
REST | PARAMS |ROUTE
--- | --- | ---
   GET | default | app => app.list
  POST | default | app => app.create
   GET | default | app/:id => app.get
   PUT | default | app/:id => app.update
DELETE | default | app/:id => app.remove
   GET | page | app/adminpendingapp => app.adminPending
   GET | page | app/coadminpendingapp => app.coAdminPending
   PUT | id | app/studapprove/:id => app.coApprove
   PUT | id | app/adapprove/:id => app.adminApprove
   PUT | id | app/studreject/:id => app.coReject
   PUT | id | app/adreject/:id => app.adminReject

* #### prof
REST | PARAMS |ROUTE
--- | --- | ---
   GET | default | prof => prof.list
  POST | default | prof => prof.create
   GET | default | prof/:id => prof.get
   PUT | default | prof/:id => prof.update
DELETE | default | prof/:id => prof.remove

* #### jobapplycoverletter
REST | PARAMS |ROUTE
--- | --- | ---
   GET | default | prof => jobapplycoverletter.list
  POST | default | prof => jobapplycoverletter.create
   GET | default | prof/:id => jobapplycoverletter.get
   PUT | default | prof/:id => jobapplycoverletter.update
DELETE | default | prof/:id => jobapplycoverletter.remove

* #### jobapplyform
REST | PARAMS |ROUTE
--- | --- | ---
   GET | default | prof => jobapplyform.list
  POST | default | prof => jobapplyform.create
   GET | default | prof/:id => jobapplyform.get
   PUT | default | prof/:id => jobapplyform.update
DELETE | default | prof/:id => jobapplyform.remove

* #### jobapplyrecommendationletter
REST | PARAMS |ROUTE
--- | --- | ---
   GET | default | prof => jobapplyrecommendationletter.list
  POST | default | prof => jobapplyrecommendationletter.create
   GET | default | prof/:id => jobapplyrecommendationletter.get
   PUT | default | prof/:id => jobapplyrecommendationletter.update
DELETE | default | prof/:id => jobapplyrecommendationletter.remove

* #### jobapplyresume
REST | PARAMS |ROUTE
--- | --- | ---
   GET | default | prof => jobapplyresume.list
  POST | default | prof => jobapplyresume.create
   GET | default | prof/:id => jobapplyresume.get
   PUT | default | prof/:id => jobapplyresume.update
DELETE | default | prof/:id => jobapplyresume.remove

* #### jobapply
REST | PARAMS |ROUTE
--- | --- | ---
   GET | default | jobapply => jobapply.list
  POST | default | jobapply => jobapply.create
   GET | default | jobapply/:id => jobapply.get
   PUT | default | jobapply/:id => jobapply.update
DELETE | default | jobapply/:id => jobapply.remove
   PUT | id | jobapply/approve/:id => jobapply.approve
   PUT | id | jobapply/reject/:id => jobapply.reject
   PUT | jobId, applicantId | jobapply/apply => jobapply.apply   
   PUT | interviewTime | jobapply/appointment => jobapply.addAppointment

* #### job
REST | PARAMS |ROUTE
--- | --- | ---
   GET | default | job => job.list
  POST | default | job => job.create
   GET | default | job/:id => job.get
   PUT | default | job/:id => job.update
DELETE | default | job/:id => job.remove
   PUT | employerName, keyword, jobType | job/search => job.searchJob

* #### statistics
REST | PARAMS | ROUTE
--- | --- | ---
GET | - | statistics/getTopEmployers => stud.getTopEmployers - Returns the top employers with the most applicants
GET | - | statistics/getStudentsByUnit => admin.getStudentsByUnit - Gets the number of students enrolled in each unit. (ENG0002 or FIT3199)

* #### student
REST | PARAMS | ROUTE
--- | --- | ---
POST | id, firstName, lastName, email, pronouns, fieldOfStudy, education, workExperience, skills, unit | student/add => student.postStudent
DELETE | id | student/remove => student.deleteStudent
GET | email | student/retrieve => student.getStudentByEmail
GET | - | student/studentlist => student.listStudentProfiles
PATCH | email | student/update => student.update
PATCH | email | student/update-addWorkExp => student.updateAddWorkExp
PATCH | email | student/update-removeWorkExp => student.updateRemoveWorkExp
PATCH | email | student/update-addSkill => student.updateAddSkill
PATCH | email | student/update-removeSkill => student.updateRemoveSkill

* #### report
REST | PARAMS | ROUTE
--- | --- | ---
GET | default | report => report.list
POST | studentEmail, reportType, reportTitle, companyName, reportDate, hoursWorked, summaryWorkDone, gainedBenefits | report/submit => report.submit
GET | studentEmail | report/retrieve => report.getStudentReportByEmail
PATCH | id | report/update => report.update

* #### users
REST | PARAMS | ROUTE
--- | --- | ---
GET | default | users => users.list
POST | default | users => users.create
GET | default | users/:id => users.get
PUT | default | users/:id => users.update
DELETE | default | users/:id => users.remove
GET | - | users/getUsers => users.getUsers
POST | tokenId | users/login => users.login
POST | userRole, email | users/add => users.postUser
GET | - | users/resolve => users.resolve
DELETE | id | users/remove => users.deleteUser
GET | email | users/retrieve => users.getUserByEmail
GET | email | users/getimg => users.getImg
PATCH | email, profilePic | users/updateimg => users.updateProfilePic
POST | email, profilePic | users/uploadimg => users.uploadImg
GET | ids | users/getidspic => users.getIds

### Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)
- **mail.mixin**: Email authentication access for email service. Referred to moleculer-mail package source

### Useful links
* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

### NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose

### Important notes about user data and authentication
- JWT token is stored in cookies which can only accessed from the backend.
- JWT token in the cookies expires one hour after signing in.
- Once the token is expired, user needs to sign in again.
- The JWT token and user data can be accessed in the frontend from the Vuex global store.

### User Authorization
- With every request sent to the api, the role of the user and the auth token must be specified in the header of the axios request.
- This is automatically set by axiosConfig.js file. 
- The axiosConfig function should be called and the auth token and the role from the vuex should be passed as headers for each requst. This should be done for every Vue component that needs to send a request to the backend.
- For an example usage, refer to the Joblist.vue component.
- Note: Visitor endpoint doesnt require this axiosConfig. Use the default axios function.

### Employer Application handling logic
- Employer submits application. (employer user data doesnt get added into the database)
- Admin can approve or reject the application.
- Once admin approves application, only then employer data will be added to the users database.

### Clarification
Visitor apply as Employer -> co admin & Admin check for the application -> Employer profile will be created -> Employer create job advertisement -> co admin & Admin check for the Job advertisement -> Student apply for the job
(Create application at employer_application -> Approve/reject action at employer_application service -> Create employer at user service and employer_profile service -> Create job advertisement application at employer_advertisement service -> Create Job at job service -> Student job application can be create at job_application service refer to id at job)

### Deploy instructions
login to the container - heroku container:login
push changes to heroku - heroku container:push web --app pure-earth-99612
deploy changes to heroku - heroku container:release web --app pure-earth-99612

Link to Deployment Website: https://dashboard.heroku.com/apps/pure-earth-99612

Use the account that was specified to access the deployment website