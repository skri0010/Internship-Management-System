<!-- This is the main Admin dashboard component

  @author Suchit Krishna <skri0010@student.monash.edu>
  Created at     : 11-09-2022 10:00
  Last modified  : 10-20-2022 10:00
-->
<template>
  <v-app id="dashboard">
    <v-container fluid>
      <v-subheader class="py-0 d-flex justify-space-between rounded-lg">
        <h1>Dashboard</h1>
      </v-subheader>
      <!-- Alert that disappears after login-->
      <v-alert dense text type="success" v-if="isActive">
        Login Successful! Welcome {{ name }} <strong>...</strong>
      </v-alert>
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <template>
            <!-- Appoint Admin Dialog-->
            <v-dialog v-model="appointDialog" width="500" style="padding: 30px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  style="margin-left: auto"
                  color="blue"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                Add Co-Admin
                  
                <v-icon small style="padding-left: 10px"> mdi-account-multiple-plus </v-icon>
                     
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Appoint Admin
                </v-card-title>

                <v-card-text>
                  <v-text-field
                    v-model="co_admin_email"
                    label="Co-Admin email"
                    :rules="emailRules"
                    required
                    placeholder="example@domain.com"
                  ></v-text-field>
                  <v-btn elevation="2" @click="promote"
                    >Promote to Co-Admin</v-btn
                  >
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="appointDialog = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-col>
      </v-row>

      <v-row style="padding: 30px">
        <!-- Statistics Area-->
        <v-col
          lg="3"
          xl ="3"
          style="height: 150px;margin-bottom: 50px;"
          v-for="(item, index) in activityLog"
          :key="index"
        >
          <v-card elevation="2" class="rounded-lg" >
            <v-card-text class="d-flex justify-space-between align-center">
              <div>
                <strong>{{ item.title }}</strong> <br />
                <span>Overall</span>
              </div>
              <v-avatar
                size="60"
                :color="item.color"
                style="border: 3px solid #444"
              >
                <span style="color: white">{{ item.amount }}</span>
              </v-avatar>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-center">
              <!-- Initialize cards based on statistic type-->
              <span v-if="item.title === 'Job Postings'">
                <PostingsDialog></PostingsDialog>
              </span>
              <span v-else-if="item.title === 'Total Students'">
                <StudentsDialog></StudentsDialog>
              </span>
              <span v-else-if="item.title === 'Total Employers'">
                <EmployersDialog></EmployersDialog>
              </span>
              <span v-else-if="item.title === 'Total Admins'">
                <AdminDialog></AdminDialog>
              </span>
            </v-card-actions>
            <v-card-actions class="d-flex justify-space-between">
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row style="padding:30px">
        <v-col lg="6" xl="6" class = 'd-flex flex-column'>
          <v-card 
            color="rgba(153, 204, 255, 0.7)"
            dark
            class='flex d-flex flex-column'
          >
            <v-card-text>
              <v-sheet color="rgba(153, 204, 255, 1)">
                <EmployerChart></EmployerChart>
              </v-sheet>
            </v-card-text>

            <v-card-text>
              <div class="text-h4 font-weight-thin black--text">
                Employers by Sector
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-center">
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="rgba(0, 0, 0, .7)"
                    block
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    Go to Report
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2">
                    Additional Information
                  </v-card-title>

                  <v-card-text>
                    <v-row>
                      <v-col style="height: 200px" class="mt-2">
                        <v-card
                          elevation="2"
                          style="height: 150px"
                          color="blue-grey lighten-3"
                        >
                          <v-card-text
                            class="d-flex justify-space-between align-center"
                          >
                            <div>
                              <span
                                class="
                                  d-flex
                                  justify-space-between
                                  align-center
                                "
                                >Sector 1</span
                              ><br />
                              <strong
                                style="font-size: 40px; justify-content: center"
                                >TBD</strong
                              >
                            </div>
                          </v-card-text>
                          <v-card-actions
                            class="d-flex justify-space-between"
                          ></v-card-actions>
                        </v-card>
                      </v-col>
                      <v-col style="height: 200px" class="mt-2">
                        <v-card
                          elevation="2"
                          style="height: 150px"
                          color="blue-grey lighten-3"
                        >
                          <v-card-text
                            class="d-flex justify-space-between align-center"
                          >
                            <div>
                              <span
                                class="
                                  d-flex
                                  justify-space-between
                                  align-center
                                "
                                >Sector 2</span
                              ><br />
                              <strong
                                style="font-size: 40px; justify-content: center"
                                >TBD</strong
                              >
                            </div>
                          </v-card-text>
                          <v-card-actions
                            class="d-flex justify-space-between"
                          ></v-card-actions>
                        </v-card>
                      </v-col>
                      <v-col style="height: 200px" class="mt-2">
                        <v-card
                          elevation="2"
                          style="height: 150px"
                          color="blue-grey lighten-3"
                        >
                          <v-card-text
                            class="d-flex justify-space-between align-center"
                          >
                            <div>
                              <span
                                class="
                                  d-flex
                                  justify-space-between
                                  align-center
                                "
                                >Sector 3</span
                              ><br />
                              <strong
                                style="font-size: 40px; justify-content: center"
                                >TBD</strong
                              >
                            </div>
                          </v-card-text>
                          <v-card-actions
                            class="d-flex justify-space-between"
                          ></v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-divider></v-divider>

                  <!-- <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false">
                    I accept
                  </v-btn>
                </v-card-actions> -->
                </v-card>
              </v-dialog>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="1"></v-col>
        <v-col cols="12" lg="5" class="d-flex flex-column">
          <v-card>
            <v-card-title>Top Postings</v-card-title>
            <v-card-text class="py-0">
              <v-timeline align-top dense>
                <v-timeline-item color="yellow" small>
                  <strong
                    ><a @click="routeToDetail(0)">{{
                      this.TopJobPostings[0].job
                    }}</a></strong
                  >
                  <div class="text-caption">
                    {{ this.TopJobPostings[0].views }} Views
                  </div>
                </v-timeline-item>
                <v-timeline-item color="grey" small>
                  <strong
                    ><a @click="routeToDetail(1)">{{
                      this.TopJobPostings[1].job
                    }}</a></strong
                  >
                  <div class="text-caption mb-2">
                    {{ this.TopJobPostings[1].views }} Views
                  </div>
                </v-timeline-item>

                <v-timeline-item color="brown lighten-1" small>
                  <strong
                    ><a @click="routeToDetail(2)">{{
                      this.TopJobPostings[2].job
                    }}</a></strong
                  >
                  <div class="text-caption">
                    {{ this.TopJobPostings[2].views }} Views
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
          <br />
          <div>
            <vue-good-table :columns="columns" :rows="rows" />
          </div>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="notification"
        timeout="1000"
        :color="notiColor"
        v-bind="{
          bottom: true,
          right: true,
        }"
      >
        {{ notificationText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="notification = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
// student, who found a job, who didint
/* eslint-disable */
import { axiosConfig } from "../axiosConfig";
import store from "../store";
import PostingsDialog from "./AdminDialogs/PostingsDialog.vue";
import AdminDialog from "./AdminDialogs/AdminDialog.vue";
import StudentsDialog from "./AdminDialogs/StudentsDialog.vue";
import EmployersDialog from "./AdminDialogs/EmployersDialog.vue";
import EmployerChart from "./AdminDialogs/EmployerChart.vue";

export default {
  data: () => ({
    //Initialize variables for dashboard
    notification: false,
    notiColor: "#19946b",
    notificationText: null,
    name: "",
    isActive: true,
    appointDialog: false,
    co_admin_email: "",
    //Set rules for appointing admin
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    activityLog: [
      {
        // Total Students Card Info
        title: "Total Students",
        amount: 0,
        icon: "mdi-account",
        color: "cyan lighten-3",
      },
      {
        // Total Employers Card Info
        title: "Total Employers",
        amount: 0,
        icon: "mdi-account-group-outline",
        color: "green darken-2",
      },
      {
        // Total Admins Card Info
        title: "Total Admins",
        amount: 0,
        icon: "mdi-account-group-outline",
        color: "blue-grey darken-1",
      },
      {
        // Total Job Postings Card Info
        title: "Job Postings",
        amount: 0,
        icon: "mdi-account-group-outline",
        color: "deep-orange darken-1",
      },
    ],
    // Object of top jobs for rankings board
    TopJobPostings: [
      {
        job: "No Data",
        views: 0,
        link: {},
      },
      {
        job: "No Data",
        views: 0,
        link: {},
      },
      {
        job: "No Data",
        views: 0,
        link: {},
      },
    ],
  }),

  methods: {
    //Notification to inform admin of successful or unsuccessful notification
    displayNotification(message, color) {
      this.notificationText = message;
      this.notification = true;
      this.notiColor = color;
    },
    //Method to promote to admin
    promote(){
      // first check if email is valid
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.co_admin_email)) {
        this.promote_admin();
    } else {
      this.displayNotification(
          // Failure for incorrect email
          "Invalid email",
          "#94193c"
        );
    }
    },
    async promote_admin() {
      // Get axios instance from role
      let role = this.$store.state.user.role.toLowerCase();
      if (role == "admin") {
        let axiosInstance = axiosConfig(
          store.state.user.token,
          store.state.user.role.toLowerCase()
        );
        let self = this;
        //Promote from api call
        axiosInstance
          .patch(
            process.env.VUE_APP_BACKEND_LINK + "admin/admin/updateUserRole",
            {
              newRole: "COADMIN",
              email: self.co_admin_email,
            }
          )
          .then((response) => {
            console.log(response);
            if (response.data == '')
            {
              this.displayNotification("PROMOTION FAILED: E-mail user did not sign up yet.", "#94193c");
            }
            else{
            // Frontend success message
            this.displayNotification("PROMOTION SUCCESSFUL", "#19946b");
            }

          })
          .catch((error) => {
            console.log(error);
            // Frontend failure message
            this.displayNotification("PROMOTION FAILED", "#94193c");
          });
        this.appointDialog = false;
      } else {
        this.displayNotification(
          // Failure for incorrect role
          "PROMOTION FAILED: ONLY ADMIN CAN PROMOTE",
          "#94193c"
        );
        this.appointDialog = false;
      }
    },
    //Method to load dashboard data through backend
    async loadDashboardData(axiosInstance) {
      let self = this;

      // update the number of users
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK + "admin/users/getUsers")
        .then(function (response) {
          // Initialize User info
          let allStudents = 0;
          let allEmployers = 0;
          let allAdmins = 0;
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].userRole == "STUDENT") {
              allStudents += 1;
            } else if (response.data[i].userRole == "EMPLOYER") {
              allEmployers += 1;
            } else if (
              (response.data[i].userRole == "ADMIN") |
              (response.data[i].userRole == "COADMIN")
            ) {
              allAdmins += 1;
            }
          }
          self.activityLog[0].amount = allStudents;
          self.activityLog[1].amount = allEmployers;
          self.activityLog[2].amount = allAdmins;
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
      // update the number of postings
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK + "admin/app")
        .then(function (response) {
          let allPostings = 0;
          let employer_applications = response.data.rows;
          // update the number of employers
          // self.activityLog[1].amount = employer_applications.length;
          // for each employer
          employer_applications.forEach((element) => {
            if (element.status === "APPROVED") {
              allPostings += 1;
            } else if (element.status === "PENDING") {
              allPostings += 1;
            } else if (element.status === "REJECTED") {
              allPostings += 1;
            }
          });
          self.activityLog[3].amount = allPostings;
        })
        .catch(function (error) {
          console.log(error);
        });
      // update the rankings board for jobs
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK + "admin/admin/getTopJobs")
        .then(async (res) => {
          const data = res.data;
          let array = [];
          array = data.sort((a, b) => a.views <= b.views);
          // Update Top 1 Job instance
          const job1 = await axiosInstance
            .get(
              process.env.VUE_APP_BACKEND_LINK +
                `admin/job/search/${array[0].jobId}`
            )
            .then((res) => {
              return res.data;
            });
          // Update Top 2 Job instance
          const job2 = await axiosInstance
            .get(
              process.env.VUE_APP_BACKEND_LINK +
                `admin/job/search/${array[1].jobId}`
            )
            .then((res) => {
              return res.data;
            });
          // Update Top 3 Job instance
          const job3 = await axiosInstance
            .get(
              process.env.VUE_APP_BACKEND_LINK +
                `admin/job/search/${array[2].jobId}`
            )
            .then((res) => {
              return res.data;
            });

          // Update The links to redirect to posting
          self.TopJobPostings[0].link = job1;
          self.TopJobPostings[1].link = job2;
          self.TopJobPostings[2].link = job3;
          // Update The Job Titles
          self.TopJobPostings[0].job = job1.jobTitle;
          self.TopJobPostings[1].job = job2.jobTitle;
          self.TopJobPostings[2].job = job3.jobTitle;
          // Update The top Posting Views
          self.TopJobPostings[0].views = array[0].views;
          self.TopJobPostings[1].views = array[1].views;
          self.TopJobPostings[2].views = array[2].views;
        });
    },
    // Method to route to details page from rankings board
    routeToDetail(job) {
      this.$router.push({
        name: "jobdetails",
        params: { selectedJob: this.TopJobPostings[job].link },
      });
    },
  },
  // On landing load user details
  mounted() {
    let axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase()
    );
    this.loadDashboardData(axiosInstance);
    this.name = store.state.user.firstName;
    // Hide login alert
    this.isActive = true;
    setTimeout(() => {
      this.isActive = false;
    }, 5000);
  },
  components: {
    PostingsDialog,
    AdminDialog,
    StudentsDialog,
    EmployersDialog,
    EmployerChart,
  },
};
</script>

<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
