<!-- This is the job Details Page

  @author Joshua Ee <jeee0002@student.monash.edu>
  @author Wei Hung Pan <wpan0017@student.monash.edu>
  @author Kuan Wai Shuet <wkua0005@student.monash.edu>
  @author Suchit Sudhir Krishna <skri0010@student.monash.edu>
  @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>

  Created at     : 20-08-2022 17:30
  Last modified  : 20-10-2022 23:00
-->

<style>
@import "../assets/styles/profile-card.css";
</style>

<template>
  <v-card>
    <v-img
      height="250"
      src="https://timelinecovers.pro/facebook-cover/download/breaking-bad-aaron-paul-bryan-cranston-jesse-pinkman-walter-white-facebook-cover.jpg"
    >
      <v-btn class="ma-6" absolute left fab small to="/homepage">
        <v-icon dark> mdi-arrow-left </v-icon>
      </v-btn>
    </v-img>

    <v-card-title>
      Job Details
      <v-spacer></v-spacer>
    </v-card-title>

    <v-avatar size="150">
      <img v-bind:src="job.image" alt="user" />
    </v-avatar>

    <!-- Job Title -->
    <h1>{{ job.jobTitle }}</h1>

    <!-- Company Details -->
    <h3>{{ job.employerName }}</h3>
    <p>
      {{ job.employerContactPerson }} <br />
      {{ job.employerAddress }}
    </p>

    <!-- Job Type -->
    <h3>Job type: {{ job.jobType }}</h3>

    <!-- Application Deadline -->
    <v-card-text class="black--text" align="left">
      <h1 align="left">Application Deadline</h1>
      <br />
      <p class="text-justify">
        {{ job.advertisementEndDate.substring(0, 10) }}
      </p>
    </v-card-text>

    <!-- Job Description -->
    <v-card-text class="black--text" align="left">
      <h1 align="left">Job Description</h1>
      <br />
      <div v-html="job.jobDescription"></div>

      <h3 align="left">Additional Information</h3>
      <br />
      <div v-html="additionalInformation" class="text-justify"></div>
    </v-card-text>

    <!-- Job Requirement -->
    <v-card-text class="black--text" align="left">
      <h1 align="left">Job Requirement</h1>
      <br />
      <div v-html="job.jobRequirement"></div>
    </v-card-text>

    <!-- Company About -->
    <v-card-text class="black--text" align="left">
      <h1 align="left">About This Company</h1>
      <br />
      <p class="text-justify">
        {{ job.employerOverview }}
      </p>
    </v-card-text>

    <v-card-actions>
      <v-col
        class="text-right"
        v-if="this.$store.state.user.role.localeCompare('STUDENT') === 0"
      >
        <v-btn
          right
          color="blue darken-1"
          dark
          large
          @click="routeToApplication"
        >
          Apply
          <v-icon right dark> mdi-pencil </v-icon>
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import { axiosConfig } from "../axiosConfig";
import store from "../store";

let axiosInstance;

export default {
  data: () => ({
    job: null,
    companyLogo: null,
  }),
  methods: {
    /**
     * This method is used to route to job application page after the user clicks the apply button
     */
    routeToApplication() {
      this.$router.push({
        name: "application",
        params: { selectedJob: this.job },
      });
    },
    /**
     * This method is used to check if the job has additional information to display
     */
    addInfoCheck() {
      if (isNaN(this.additionalInformation)) {
        this.additionalInformation = "No additional information.";
      } else {
        this.additionalInformation = this.job.jobAdditionalInformation;
      }
    },
  },
  /**
   * This method will be run on page load
   */
  mounted() {
    this.job = this.$route.params.selectedJob;
    axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase()
    );
    let data = {
      jobId: this.job._id,
    };
    // send axios request to update job counter
    axiosInstance
      .post(
        process.env.VUE_APP_BACKEND_LINK + "stud/statistics/topJobsCounter",
        data
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    this.addInfoCheck();
  },
};
</script>
