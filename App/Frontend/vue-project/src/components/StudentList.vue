<!-- This is the Students Report List Page for Admin To view

  @author Poon Yeong Shian <yeon0001@student.monash.edu>
  Created at     : 11-09-2022 10:00
  Last modified  : 10-20-2022 10:00
-->
<template>
  <main>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="studentSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="studentsHeaders"
        :items="students"
        :search="studentSearch"
        :loading="studentsLoading"

        loading-text="Loading... Please wait"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2"
                @click="showStudentReport(item)"
                text
                icon
                v-bind="attrs" 
                v-on="on"
              >
                <v-icon small> mdi-magnify </v-icon>
              </v-btn>
            </template>
            <span>Show Report</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="reportDialog" scrollable persistent max-width="100%">
      <v-card>
        <v-card-title>
          <h2>REPORT</h2>
          <v-spacer></v-spacer>
          <v-btn large icon @click="closeReportDialog">
            <v-icon large> mdi-close </v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-4" style="overflow-y: auto">
          <v-row>
            <v-col v-for="item in reports" :key="item.reportDate" cols="12" xl="6">
              <ReportListCard :report="item"></ReportListCard>
            </v-col>
          </v-row>
          
        </v-card-text>
      </v-card>
    </v-dialog>
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
        <v-btn color="white" text v-bind="attrs" @click="notification = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </main>
</template>

<script>
import { axiosConfig } from "../axiosConfig";
import ReportListCard from "./ReportListCard.vue";

export default {
  name: "MyStudentList",
  data() {
    return {
      //Student Table Data
      studentsHeaders: [
        {
          text: "Student First Name",
          align: "start",
          filterable: true,
          value: "firstName",
        },
        {
          text: "Student Last Name",
          align: "start",
          filterable: true,
          value: "lastName",
        },
        {
          text: "Student Email",
          align: "start",
          value: "email",
        },
        {
          text: "Student Field",
          align: "start",
          value: "fieldOfStudy",
        },
        {
          text: "Actions",
          align: "center",
          filterable: false,
          sortable: false,
          value: "actions",
        },

      ],
      students: [],
      studentSearch: null,
      studentsLoading: true,
      studentReportDialog: false,
      currentStudent: null,
      axiosInstance: null,
      reports: null,
      content: null,
      reportDialog: false,
      notification: false, // true will show notification snackbar
      notiColor: "#19946b", // determine the color for the notification snackbar
      notificationText: null, // content of the notification snackbar
    };
  },
  components: {
    ReportListCard,
  },
  /* eslint-disable */
  /* Disable error logging for this file */
  methods: {
    // Function to display message to the user
    displayNotification(message, color) {
      this.notificationText = message;
      this.notification = true;
      this.notiColor = color;
    },
    toggleReminder(name) {
      console.log(name);
    },
    closeReportDialog() {
      this.reportDialog = false;
    },
    // Function to retrieve and display student reports
    showStudentReport(item) {
      this.currentStudent = item;
      let self = this;
      // Get all student reports for display
      this.axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"stud/report/retrieve", {
          params: {
            studentEmail: item.email,
          },
        })
        .then((response) => {
          this.reports = response.data;
          this.reportDialog = true;
        }).catch(err => {
          self.displayNotification(
            "ERROR RETRIEVING STUDENT REPORT",
            "#94193c"
          );
        });
        
    },
  },
  // On load run this
  async mounted() {
    this.axiosInstance = axiosConfig(
      this.$store.state.user.token,
      this.$store.state.user.role.toLowerCase()
    );
    let self = this;
    // show all students regardless of if they have reports
    await this.axiosInstance
      .get(process.env.VUE_APP_BACKEND_LINK+"admin/student/studentlist")
      .then((res) => {
        console.log(res);
        this.students = res.data;
        this.studentsLoading = false;
      })
      .catch((err) => {
        self.displayNotification("ERROR RETRIEVING STUDENT LIST", "#94193c");
      });
  },
};
</script>

<style></style>
