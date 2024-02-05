<!-- This is the Employer Application Details component

  @author Wei Hung Pan <wpan0017@student.monash.edu>
  @author Deeksha Sridhar <dsri0006@student.monash.edu> 
  @author Zeenath Zaeema Nashath <znas0003@student.monash.edu> 
  @author Mohammed Rashid <mras0018@student.monash.edu> 

  Created at     : 19-08-2022 
  Last modified  : 20-10-2022 
-->

<template>
  <v-card>
    <v-card>
      <v-card-title>
        <!-- Job Title -->
        <p class="text-uppercase text-h3 font-weight-bold">
          {{ employerApplication.employerName }}
        </p>
        <v-spacer></v-spacer>
        <v-btn large icon @click="closeEmployerApplicationDetailDialog">
          <v-icon large> mdi-close </v-icon>
        </v-btn>
      </v-card-title>
    </v-card>

    <!-- Company Details -->
    <v-card-text class="black--text text-left">
      <v-row>
        <v-col cols="12">
          <v-card elevation="4" class="text-left mt-4">
            <v-card-title> Company Details </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p class="text-subtitle-2">
                Email: {{ employerApplication.employerEmail }}
              </p>
              <p class="text-subtitle-2">
                Address: {{ employerApplication.employerAddressStreet }},
                {{ employerApplication.employerAddressCity }},
                {{ employerApplication.employerAddressState }}
              </p>
              <p class="text-subtitle-2">
                Website: {{ employerApplication.employerWebsite }}
              </p>
              <p class="text-subtitle-2">
                Industry: {{ employerApplication.employerIndustry }}
              </p>
            </v-card-text>
          </v-card>

          <!-- Application Deadline -->
          <v-card elevation="4" class="text-left mt-4">
            <v-card-title> Company Contact Person </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p class="text-subtitle-2">
                Name: {{ employerApplication.employerContactPerson }}
              </p>
              <p class="text-subtitle-2">
                ContactNo: {{ employerApplication.employerContactPersonNo }}
              </p>
              <p class="text-subtitle-2">
                Email: {{ employerApplication.employerContactPersonEmail }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <!-- Job Description -->
          <v-card elevation="4" class="text-left">
            <v-card-title> Job Details </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p class="text-subtitle-2">
                Salary Range (RM): {{ employerApplication.salaryRange }}
              </p>
              <p class="text-subtitle-2">
                Hire Type: {{ employerApplication.hireType }}
              </p>
              <p class="text-subtitle-2">
                Work Arrangement: {{ employerApplication.workArrangement }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="employerApplication.remark" cols="12">
          <v-card elevation="4" class="text-left">
            <v-card-title> Remark </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p class="text-subtitle-2">{{ employerApplication.remark }}</p>
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
    employerApplication: Object,
  },
  data: () => ({}),
  methods: {
    closeEmployerApplicationDetailDialog() {
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

.v-card__title {
  font-weight: 700 !important;
}

p {
  font-weight: 500 !important;
  color: #000000;
}
</style>
