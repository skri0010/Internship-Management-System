<template>
  <v-card>
    <v-card>
    <v-card-title>
      <!-- Job Title -->
      <p class="text-uppercase text-h3 font-weight-light">{{ job.employerName }}- </p>
      <p class="text-uppercase text-h3 font-weight-bold">{{ job.jobTitle }}</p>
      <v-spacer></v-spacer>
      <v-btn large icon @click="closeJobDetailDialog">
        <v-icon large> mdi-close </v-icon>
      </v-btn>
    </v-card-title>
    </v-card>
    

    <!-- Field for Company Details -->
    <v-card-text class="black--text text-left">
      <v-row>
        <v-col cols="12">
          <v-card elevation="4" class="text-left mt-4"> 
            <v-card-title>
              Employer Details
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p class="text-subtitle-2"> Contact: {{ job.employerContactPerson }} </p>
              <p class="text-subtitle-2"> Address: {{ job.employerAddress }} </p>
              <p class="text-subtitle-2"> Overview: <br/> {{ job.employerOverview }} </p>
            </v-card-text>
          </v-card>
          

          <!-- Field for Application Deadline -->
          <v-card elevation="4" class="text-left mt-4"> 
            <v-card-title>
              Application Deadline
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p class="text-subtitle-2"> Close Date: {{ job.advertisementEndDate.substring(0, 10) }} </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <!-- Field for Job Description -->
          <v-card elevation="4" class="text-left"> 
            <v-card-title>
              Job Description
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p v-html="job.jobDescription"></p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <!--Field for Job Requirment-->
          <v-card elevation="4" class="text-left"> 
            <v-card-title>
              Job Requirement
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p v-html="job.jobRequirement"></p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="job.jobAdditionalInformation" cols="12">
          <!--Field for Additional Information-->
          <v-card elevation="4" class="text-left"> 
            <v-card-title>
              Additional Information
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p v-html="job.jobAdditionalInformation"></p>
            </v-card-text>
          </v-card>
          <div class="text-justify"></div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "JobDetailDialog",
  props: {
    job: Object,
  },
  data: () => ({}),
  methods: {
    /**
     * This method is used to close the job detail dialog
     */
    closeJobDetailDialog() {
      this.$emit("close");
    },
  },
  created() {},
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap");
.v-application .text-h3 {
  font-family: "Roboto Condensed", sans-serif !important;
}
.v-card__title{
  font-weight: 700 !important;
}
p{
  font-weight: 500 !important;
  color: #000000;
}
</style>
