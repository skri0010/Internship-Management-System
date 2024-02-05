<!-- This is the home page component.
     The page allows the student to search and browse job listings that are available.

  @author Jacky Foo <jfoo0016@student.monash.edu>
  @author Kuan Wai Shuet <wkua0005@student.monash.edu>
  @author Jordan Poon  <jord0004@student.monash.edu>
  @author Arvind Chandrand <acha0094@student.monash.edu>
  @author Joshua Ee <jeee0002@student.monash.edu>
  @author Pan Wei Hung <wpan0017@student.monash.edu>
  @author Suchit Sudhir Krishna <skri0010@student.monash.edu>
  @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>
  @author Sami Hussein Hamid Saeed <shus0013@student.monash.edu>
  @author Zeenath Zaeema Nashath <znas0003@student.monash.edu>

  Created at     : 01-05-2022 19:40
  Last modified  : 20-10-2022 22:00
-->
<style>
@import "../../assets/styles/home-page.css";
</style>

<template>
    <main id="inspire">
      <!-- Loading Icon while frontend requesting for data -->
      <v-dialog v-model="dialog" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Loading...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-img
        max-height="350"
        src="https://api.time.com/wp-content/uploads/2021/02/laptop-home-office.jpg"
      >
        <v-container 
          class="pt-16" 
          max-height="300"
          >
          <v-card class="mx-auto mt-16 justify-center" max-width="1000" align="center">
            <v-toolbar 
              elevation="4"
              outlined
              shaped>
              <v-text-field
                id="searchBar"
                hide-details
                dense
                active
                v-model="searchJobAdvertKeyword"
                class="mr-4"
                @keydown.enter="searchJobAdvert()"
              ></v-text-field>
              <v-select
              v-if="!(this.$store.state.user.role.toUpperCase().localeCompare('EMPLOYER') === 0)"
                hide-details
                dense
                :items="jobTypes"
                label="Job Type"
                v-model="selectedJobType"
              ></v-select>

              <v-btn icon @click="searchJobAdvert">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>

              <v-btn icon @click="clearSearch()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
          </v-card>
        </v-container>
      </v-img>

      <v-container fluid class="blue darken-4" dark>
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="4"
            v-for="job in jobAdverts"
            :key="job._id"
          >
            <JobCard @showDetails="showJobDetails(job)" :job="job" />
          </v-col>
          <v-col cols="12">
            <v-pagination
              v-model="page"
              class="my-4"
              :total-visible="7"
              :length="pageSize"
              @input="onPageChange"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
      <FooterCard></FooterCard>
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
      <v-dialog
          v-model="jobDialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        > 
        <JobDetailsCard :job="selectedJob" @closeDetails="closeJobDetails"></JobDetailsCard>
      </v-dialog>
    </main>

</template>

<script>
import FooterCard from "../FooterCard.vue";
import JobCard from "../JobCard.vue";
import { axiosConfig } from "../../axiosConfig";
import JobDetailsCard from "../JobDetailsCard.vue";
import store from "../../store";
import axios from "axios";

export default {
  components: { FooterCard, JobCard: JobCard, JobDetailsCard },
  data: () => ({
    drawer: null,
    items: [
      { title: "Dashboard", icon: "mdi-view-dashboard" },
      { title: "Jobs", icon: "mdi-image" },
      { title: "Employer", icon: "mdi-help-box" },
    ],
    expand: false,
    expand2: false,
    searchJobAdvertKeyword: "",
    jobAdverts: [],
    selection: "",
    selectedCourse() {},
    select: null,
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    reqPath: "",
    page: 1,
    pageSize: 0,
    dialog: true,
    axiosInstance: null,
    jobTypes: ["", "VERIFIED", "NOT VERIFIED"],
    selectedJobType: "",
    notification: false, // true will show notification snackbar
    notiColor: "#19946b", // determine the color for the notification snackbar
    notificationText: null, // content of the notification snackbar
    jobDialog: false,
    selectedJob: null
  }),
  async mounted() {
    let userData;

    //get the token from backend
    await axios
      .get(process.env.VUE_APP_BACKEND_LINK+"visitor/users/resolve", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.length === 0) {
          //User is redirected to signon page to signin again due to token being expired.
          // this.$router.push({ name: "signup" });
        } else {
          userData = res.data;
          //Setting important data in vuex global store
          this.$store.state.user.auth = true;
          this.$store.state.user.token = userData.token;
          this.$store.state.user.email = userData.user.email;
          this.$store.state.user.firstName = userData.user.given_name;
          this.$store.state.user.lastName = userData.user.family_name;
          this.$store.state.user.profilePic =
            userData.userDb[0].image != null
              ? userData.userDb[0].image
              : userData.user.picture;
          this.$store.state.user.role = userData.userDb[0].userRole;
        }
      })
      .catch((err) => {
        console.log(err);
        this.$router.push({ name: "signup" });
      });

    this.axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase()
    );

    let data = {
      keyword: "",
      jobType: "",
    };

    this.reqPath = this.getRoleRoute("job/search");
    await this.axiosInstance
      .post(this.reqPath, data)
      .then((response) => {
        this.jobAdverts = response.data[0];
        this.pageSize = response.data[1];
      })
      .catch((err) => {
        console.log(err);
        this.displayNotification(
          "ERROR RETRIEVING JOB ADVERTISEMENTS",
          "#94193c"
        );
      });
    this.dialog = false;

  },
  methods: {

    // Function to display message to the user
    displayNotification(message, color) {
      this.notificationText = message;
      this.notification = true;
      this.notiColor = color;
    },

    /**
     * show job details to user
     * @param {object} job 
     * @returns {void} 
     */
    showJobDetails(job) {
      this.jobDialog = true;
      this.selectedJob = job;
    },

    /**
     * Allowed user to close the job details
     */
    closeJobDetails(){
      this.jobDialog = false;
      this.selectedJob = null;
    },

    /**
     * Allowed user to search jobs
     * @returns {void} 
     */
    searchJobAdvert() {
      this.dialog = true;
      this.axiosInstance
        .post(this.reqPath, {
          keyword: this.searchJobAdvertKeyword,
          jobType: this.mapJobType(this.selectedJobType),
        })
        .then((response) => {
          this.jobAdverts = response.data[0];
          this.pageSize = response.data[1];
          this.dialog = false;
        });
    },

    /**
     * Allowed user to clear search at the homepage 
     * @returns {void} 
     */
    clearSearch() {
      this.dialog = true;
      this.axiosInstance
        .post(this.reqPath, {
          keyword: "",
          jobType: "",
        })
        .then((response) => {
          this.jobAdverts = response.data[0];
          this.pageSize = response.data[1];
          this.dialog = false;
        });
      this.searchJobAdvertKeyword = null;
      this.selectedJobType = "";
    },

    /**
     * Check user's role 
     * @param {string} actionPath 
     * @returns {void} 
     */
    getRoleRoute(actionPath) {
      let linkHeader = process.env.VUE_APP_BACKEND_LINK;
      if (this.$store.state.user.role.localeCompare("EMPLOYER") == 0) {
        return linkHeader + "emp/" + actionPath;
      } else if (this.$store.state.user.role.localeCompare("STUDENT") == 0) {
        return linkHeader + "stud/" + actionPath;
      } else if (this.$store.state.user.role.localeCompare("ADMIN") == 0) {
        return linkHeader + "admin/" + actionPath;
      } 
      else if (this.$store.state.user.role.localeCompare("COADMIN") == 0) {
        return linkHeader + "coadmin/" + actionPath;
      }else {
        console.log("ERROR ROLE: " + this.$store.state.user.role);
      }
    },

    onPageChange(newPage) {
      this.axiosInstance
        .post(this.reqPath, {
          keyword: this.searchJobAdvertKeyword,
          jobType: this.mapJobType(this.selectedJobType),
          page: newPage,
        })
        .then((response) => {
          this.page = newPage;
          this.jobAdverts = response.data[0];
        });
    },

    /**
     * To check the job type 
     * @param {string} jobType 
     * @returns {string} 
     */
    mapJobType(jobType) {
      if (jobType == "VERIFIED") {
        return "COMPULSORY";
      } else if (jobType == "NOT VERIFIED") {
        return "VOLUNTARY";
      } else {
        return "";
      }
    },
  },
};
</script>
<style></style>
