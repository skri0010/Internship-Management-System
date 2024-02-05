<!-- This is the subcomponent for the admin profile options
  @author Suchit Krishna <skri0010@student.monash.edu>
  Created at     : 11-09-2022 10:00
  Last modified  : 10-20-2022 10:00
-->
<template>
  <v-table>
    <v-row style="margin-top: 10px">
      <v-col>
        <v-card>
          <v-card-title>
            View Dashboard
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-btn @click="viewDashboard">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row style="margin-top: -20px">
      <v-col>
        <v-card>
          <v-card-title>
            View Student Reports
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-btn @click="viewStudentReports">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row style="margin-top: -20px">
      <v-col>
        <v-card>
          <v-card-title>
            View Job Listings
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-btn @click="viewJobListings">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row style="margin-top: -20px">
      <v-col>
        <v-card>
          <v-card-title>
            View Employer Applications
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-btn @click="viewApplications">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-table>
</template>
  <script>
export default {
  methods: {
    // Reroute to dashboard
    viewDashboard() {
      this.$router.push({ name: "admindashboard" });
    },
    // Reroute to Job Listings Page
    viewJobListings() {
      this.$router.push({ name: "empjoblist" });
    },
    // Reroute to Student Reports
    viewStudentReports() {
      this.$router.push({ name: "studentList" });
    },
    //Reroute to employer Applications Page
    viewApplications() {
      this.$router.push({ name: "employerapplicationlist" });
    },
  },
};
</script>