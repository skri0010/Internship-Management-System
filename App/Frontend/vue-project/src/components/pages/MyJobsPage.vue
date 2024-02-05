<!-- This is the Employer My Jobs component

  @author Wei Hung Pan <wpan0017@student.monash.edu>
  @author Deeksha Sridhar <dsri0006@student.monash.edu> 
  @author Zeenath Zaeema Nashath <znas0003@student.monash.edu> 
  @author Mohammed Rashid <mras0018@student.monash.edu> 

  Created at     : 19-08-2022 
  Last modified  : 15-09-2022 
-->

<template>
  <main id="myjobs">
    <div class="jobs">
      <!-- Main All MyJob table list -->
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="jobSearch"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <!-- Data table for all jobs by the employer -->
        <v-data-table
          :headers="jobHeaders"
          :items="jobAdverts"
          :search="jobSearch"
          :loading="jobLoading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.advertisementEndDate`]="{ item }">
            <v-chip :color="getColor(item.advertisementEndDate)" dark>
              {{ toLocalTime(item.advertisementEndDate) }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-2"
                  @click="showJobDetails(item)"
                  text
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon small> mdi-magnify </v-icon>
                </v-btn>
              </template>
              <span>Job Details</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-2"
                  @click="showApplicants(item)"
                  text
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon small> mdi-account-details </v-icon>
                </v-btn>
              </template>
              <span>Show Applicants</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-2"
                  :disabled="new Date(item.advertisementEndDate) < new Date()"
                  @click="confirmClose(item)"
                  text
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon small> mdi-close </v-icon>
                </v-btn>
              </template>
              <span>Close job advertisement</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card>
      
      <v-row justify="center">
        <!-- Dialog to show applicants table list -->
        <v-dialog
          v-model="applicantDialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn large icon @click="closeApplicantDialog">
                <v-icon large> mdi-close </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="px-4" height="100%">
              <v-text-field
                v-model="applicantSearch"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                :search="applicantSearch"
                :loading="applicantLoading"
                :headers="applicantHeaders"
                :items="applicants"
                class="elevation-1"
              >
                <template v-slot:[`item.applicantId`]="{ item }">
                  {{ item.applicantId.email }}
                </template>
                <template v-slot:[`item.interviewAppointment`]="{ item }">
                  {{ toLocalTime(item.interviewAppointment) }}
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mr-0"
                        :disabled="!(item.applicationStatus == 'PENDING')"
                        @click="addAppointment(item)"
                        text
                        icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon small> mdi-pencil </v-icon>
                      </v-btn>
                    </template>
                    <span>Appoint Interview Time</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mr-0"
                        :disabled="!(item.applicationStatus == 'PENDING')"
                        @click="confirmApprove(item)"
                        text
                        icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon small> mdi-check </v-icon>
                      </v-btn>
                    </template>
                    <span>Accept Applicant</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mr-0"
                        :disabled="!(item.applicationStatus == 'PENDING')"
                        @click="confirmReject(item)"
                        text
                        icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon small> mdi-close </v-icon>
                      </v-btn>
                    </template>
                    <span>Reject Applicant</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mr-0"
                        @click="showPdf(item)"
                        text
                        icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon small> mdi-magnify </v-icon>
                      </v-btn>
                    </template>
                    <span>Show Resume</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="jobDetailDialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <JobDetailDialog
            :job="currentJob"
            @close="jobDetailDialog = false"
          ></JobDetailDialog>
        </v-dialog>
      </v-row>
      <!-- PDF dialog to show resume -->
      <v-dialog v-model="pdfDialog" persistent max-width="80%">
        <v-card>
          <v-card-title>
            <h2>PDF</h2>
            <v-spacer></v-spacer>
            <v-btn large icon @click="closePdfDialog">
              <v-icon large> mdi-close </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text style="overflow-y: auto">
            <v-tabs
              fixed-tabs
              background-color="indigo"
              dark
              v-model="activeTab"
            >
              <v-tab @click="showFile('applicationform')">
                Application Form
              </v-tab>
              <v-tab @click="showFile('coverletter')"> Cover Letter </v-tab>
              <v-tab @click="showFile('recommendationletter')">
                Recommendation Letter
              </v-tab>
              <v-tab @click="showFile('resume')"> Resume </v-tab>
            </v-tabs>
            <vue-pdf-app style="height: 75vh" :pdf="pdfContent"></vue-pdf-app>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Appointment Dialog for appointing a DateTime for interview -->
      <v-dialog v-model="appointmentDialog" persistent max-width="700px">
        <v-card>
          <v-card-title> Interview Appointment: </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="interviewSlot"
              type="datetime-local"
              label="Interview Slot"
              outlined
              dense
              color="#2C4C9C"
              autocomplete="false"
              required
            >
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="closeAppointmentDialog">
              Close
            </v-btn>
            <v-btn color="primary" text @click="saveAppointment"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- Confirmation dialog for Closing application -->
    <v-dialog v-model="closeJobConfirmationDialog" persistent width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Close Advertisement
        </v-card-title>
        <v-card-text>
          Are you sure you want to stop accepting applicants?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red lighten-3"
            text
            @click="closeJobConfirmationDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="closeJobAdvert()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirmation dialog for Appoving application -->
    <v-dialog v-model="approveConfirmationDialog" persistent width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Approve Application
        </v-card-title>
        <v-card-text>
          Are you sure you want to accept this applicant?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red lighten-3"
            text
            @click="approveConfirmationDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="acceptApplicant()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirmation dialog for Rejecting application -->
    <v-dialog v-model="rejectConfirmationDialog" persistent width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Reject Application
        </v-card-title>
        <v-card-text>
          Are you sure you want to reject this applicant?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red lighten-3"
            text
            @click="rejectConfirmationDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="rejectApplicant()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Notification snackbar to provide feedback on actions by user -->
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
    <FooterCard></FooterCard>
  </main>
</template>

<script>
import FooterCard from "../FooterCard.vue";
import JobDetailDialog from "../JobDetailDialog.vue";
import { axiosConfig } from "../../axiosConfig";
import VuePdfApp from "vue-pdf-app";
import "vue-pdf-app/dist/icons/main.css";

export default {
  data: () => ({
    jobSearch: "", // variable to store the filter of searching main my jobs data table
    applicantSearch: "", // variable to store the filter of searching applicants data table
    jobAdverts: [], // variable to store all jobs by the employer
    applicants: [], // variable to store all applicants by the selected job
    // headers for the data table at main page
    jobHeaders: [
      {
        text: "Job Title",
        align: "start",
        filterable: true,
        value: "jobTitle",
      },
      {
        text: "Hiring Type",
        align: "start",
        value: "hireType",
      },
      {
        text: "Advertisement Deadline",
        align: "start",
        value: "advertisementEndDate",
      },
      {
        text: "Actions",
        align: "center",
        filterable: false,
        sortable: false,
        value: "actions",
      },
    ],
    // headers for the data table at applicants dialog
    applicantHeaders: [
      {
        text: "Applicant",
        align: "start",
        filterable: true,
        value: "applicantId",
      },
      {
        text: "Interview Appointment",
        align: "start",
        value: "interviewAppointment",
      },
      {
        text: "Status",
        align: "start",
        value: "applicationStatus",
      },
      {
        text: "Actions",
        align: "center",
        filterable: false,
        sortable: false,
        value: "actions",
      },
    ],
    currentJob: null, // variable to store current selected job
    currentApplicant: null, // variable to store current selected applicant
    interviewSlot: null, // value for the datetime textfield at interview appointment dialog
    reqPath: null, // variable to store the request path to backend
    axiosInstance: null, // instance used to send http request to backend server
    applicantDialog: false, // true will show the aapplicant dialog
    appointmentDialog: false, // true will show the interview appointment allocation dialog
    pdfDialog: false, // true will show the pdf dialog
    jobLoading: true, // true will show the loading indicator for main my jobs data table
    applicantLoading: false, // true will show the loading indicator for applicants data table at applicants dialog
    jobDetailDialog: false, // true will show the job detail dialog
    pdfContent: "", // content to show at the vue pdf app component
    jobApplicationForm: null, // application form of the applicant
    jobApplicationCoverLetter: null, // cover letter of the applicant
    jobApplicationRecommendationLetter: null, // recommendation letter of the applicant
    jobApplicationResume: null, // resume of the applicant
    notification: false, // true will show notification snackbar
    notiColor: "#19946b", // determine the color for the notification snackbar
    notificationText: null, // content of the notification snackbar
    activeTab: 0, // Active tab for Tab component at pdfDialog
    approveConfirmationDialog: false, // true will show confirmation dialog
    rejectConfirmationDialog: false,  // true will show confirmation dialog
    closeJobConfirmationDialog: false,// true will show confirmation dialog
  }),
  /* eslint-disable */
  /* Disable error logging for this file */
  methods: {
    confirmApprove(applicant) {
      this.currentApplicant = applicant;
      this.approveConfirmationDialog = true;
    },
    confirmReject(applicant) {
      this.currentApplicant = applicant;
      this.rejectConfirmationDialog = true;
    },
    confirmClose(job) {
      this.currentJob = job;
      this.closeJobConfirmationDialog = true;
    },
    // Function to close the applicant dialog
    closeApplicantDialog() {
      this.applicantDialog = false;
      this.applicants = [];
      this.jobApplicationForm = null;
      this.jobApplicationCoverLetter = null;
      this.jobApplicationRecommendationLetter = null;
      this.jobApplicationResume = null;
    },
    // Function to close the interview appointment allocation dialog
    closeAppointmentDialog() {
      this.appointmentDialog = false;
      this.currentApplicant = null;
      this.interviewSlot = null;
    },
    // Function to close the pdf dialog
    closePdfDialog() {
      this.pdfDialog = false;
      this.pdfContent = null;
      this.activeTab = 0;
    },
    // Function to close the recruitment for selected job
    closeJobAdvert() {
      this.jobLoading = true;
      let self = this;
      this.axiosInstance
        .put(process.env.VUE_APP_BACKEND_LINK + "emp/job/" + this.currentJob._id, {
          advertisementEndDate: new Date(),
        })
        .then((response) => {
          console.log(response);
          self.getMyJob();
          self.displayNotification("JOB RECRUITMENT CLOSED", "#19946b");
        })
        .catch((error) => {
          self.displayNotification(
            "ERROR CLOSING JOB ADVERTISEMENT",
            "#94193c"
          );
          console.log(error);
        });
      this.closeJobConfirmationDialog = false;
    },
    // Function to show the pdf dialog
    showPdf(item) {
      this.currentApplicant = item;
      this.showFile("applicationform");
      this.pdfDialog = true;
    },
    // Helper function to get the selected file and set to pdfContent
    async showFile(file) {
      let route;
      let self = this;
      if (file == "applicationform") {
        if (
          this.jobApplicationForm != null &&
          this.jobApplicationForm[0] == this.currentApplicant._id
        ) {
          this.pdfContent = this.jobApplicationForm[1];
        } else {
          route = "jobapplyform/show/" + this.currentApplicant._id;
          await this.requestFile(route)
            .then((res) => {
              self.jobApplicationForm = [
                self.currentApplicant._id,
                res.data.jobApplicationForm,
              ];
              self.pdfContent = res.data.jobApplicationForm;
            })
            .catch((err) => {
              self.displayNotification(
                "APPLICATION FORM DOES NOT EXIST",
                "#94193c"
              );
            });
        }
      } else if (file == "coverletter") {
        if (
          this.jobApplicationCoverLetter != null &&
          this.jobApplicationCoverLetter[0] == this.currentApplicant._id
        ) {
          this.pdfContent = this.jobApplicationCoverLetter[1];
        } else {
          route = "jobapplycoverletter/show/" + this.currentApplicant._id;

          await this.requestFile(route)
            .then((res) => {
              self.jobApplicationCoverLetter = [
                self.currentApplicant._id,
                res.data.coverLetter,
              ];
              self.pdfContent = res.data.coverLetter;
            })
            .catch((err) => {
              self.displayNotification(
                "COVER LETTER DOES NOT EXIST",
                "#94193c"
              );
            });
        }
      } else if (file == "recommendationletter") {
        if (
          this.jobApplicationRecommendationLetter != null &&
          this.jobApplicationRecommendationLetter[0] ==
            this.currentApplicant._id
        ) {
          this.pdfContent = this.jobApplicationRecommendationLetter[1];
        } else {
          route =
            "jobapplyrecommendationletter/show/" + this.currentApplicant._id;

          await this.requestFile(route)
            .then((res) => {
              self.jobApplicationRecommendationLetter = [
                self.currentApplicant._id,
                res.data.recommendationLetter,
              ];
              self.pdfContent = res.data.recommendationLetter;
            })
            .catch((err) => {
              self.displayNotification(
                "RECOMMENDATION LETTER DOES NOT EXIST",
                "#94193c"
              );
            });
        }
      } else if (file == "resume") {
        if (
          this.jobApplicationResume != null &&
          this.jobApplicationResume[0] == this.currentApplicant._id
        ) {
          this.pdfContent = this.jobApplicationResume[1];
        } else {
          route = "jobapplyresume/show/" + this.currentApplicant._id;
          await this.requestFile(route)
            .then((res) => {
              self.jobApplicationResume = [
                self.currentApplicant._id,
                res.data.resume,
              ];
              self.pdfContent = res.data.resume;
            })
            .catch((err) => {
              self.displayNotification("RESUME DOES NOT EXIST", "#94193c");
            });
        }
      } else {
        self.displayNotification("INVALID FILE REQUEST", "#94193c");
      }
    },

    // Function to display message to the user
    displayNotification(message, color) {
      this.notificationText = message;
      this.notification = true;
      this.notiColor = color;
    },

    // Helper function to send http request to the backend server
    requestFile(path) {
      return this.axiosInstance.get(this.getRoleRoute(path));
    },
    // Function to accept selected applicant
    async acceptApplicant() {
      let self = this;
      await this.axiosInstance
        .put(
          process.env.VUE_APP_BACKEND_LINK +
            "emp/jobapply/approve/" +
            this.currentApplicant._id
        )
        .then((response) => {
          self.displayNotification("APPLICANT ACCEPTED", "#19946b");
          self.showApplicants(self.currentJob);
        })
        .catch((error) => {
          self.displayNotification("ERROR APPROVING APPLICANT", "#94193c");
        });
      this.approveConfirmationDialog = false;
    },
    // Function to reject selected applicant
    async rejectApplicant(item) {
      let self = this;
      await this.axiosInstance
        .put(
          process.env.VUE_APP_BACKEND_LINK +
            "emp/jobapply/reject/" +
            this.currentApplicant._id
        )
        .then((response) => {
          self.displayNotification("APPLICANT REJECTED", "#19946b");
          self.showApplicants(self.currentJob);
        })
        .catch((error) => {
          self.displayNotification("ERROR REJECTING APPLICANT", "#94193c");
        });
      this.rejectConfirmationDialog = false;
    },
    // Function to appoint interview appointment to selected applicant
    async saveAppointment() {
      let self = this;
      await this.axiosInstance
        .put(process.env.VUE_APP_BACKEND_LINK + "emp/jobapply/appointment", {
          id: this.currentApplicant._id,
          interviewTime: new Date(this.interviewSlot).toISOString(),
        })
        .then((response) => {
          self.showApplicants(self.currentJob);
          self.currentApplicant = response.data;
          self.closeAppointmentDialog();
          self.displayNotification("APPOINTMENT ADDED SUCCESSFULLY", "#19946b");
        })
        .catch((error) => {
          self.displayNotification("ERROR ADDING APPOINTMENT TIME", "#94193c");
        });
    },
    // Function to show the interview appointment allocation dialog
    addAppointment(item) {
      this.appointmentDialog = true; // Show the appointment dialog
      this.currentApplicant = item; // set current selected applicant
      this.interviewSlot = this.toLocalTime(item.interviewAppointment)
        .toJSON()
        .substring(0, 16);
    },
    // Helper function for addAppointment(item) function to translate toLocalTime
    toLocalTime(iso) {
      let time;
      if (iso) {
        time = new Date(iso);
        time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
        time = time.toJSON().substring(0, 16).replace("T", " ");
      } else {
        time ="No Appointment";
      }
      return time;
    },
    // Function to show the applicants dialog and send http request to backend server to get related data
    async showApplicants(item) {
      this.applicantLoading = true;
      this.applicantDialog = true;
      this.currentJob = item;
      let self = this;
      this.axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK + "emp/jobapply/show/" + item._id)
        .then((response) => {
          self.$emit("close"); // close the drawer
          self.applicantLoading = false;
          self.applicants = response.data;
        })
        .catch((error) => {
          self.displayNotification("ERROR SHOWING APPLICANTS", "#94193c");
        });
    },
    // Function to show the job details dialog
    showJobDetails(item) {
      this.jobDetailDialog = true;
      this.currentJob = item;
      console.log(item);
    },
    // Function to return corresponding color based on due date difference
    getColor(date) {
      let today = new Date();
      let dueDate = new Date(date);
      if (dueDate < today) {
        return "#808080";
      }

      let difference = Math.abs(dueDate - today);
      let days = Math.round(difference / (1000 * 3600 * 24));

      if (days <= 7) {
        return "#E3242B";
      } else if (days <= 14) {
        return "#D4A017";
      } else {
        return "#6CBB3C";
      }
    },
    // Function to return http path based on user role
    getRoleRoute(actionPath) {
      let linkHeader = process.env.VUE_APP_BACKEND_LINK;
      if (this.$store.state.user.role.localeCompare("EMPLOYER") == 0) {
        return linkHeader + "emp/" + actionPath;
      } else if (this.$store.state.user.role.localeCompare("STUDENT") == 0) {
        return linkHeader + "stud/" + actionPath;
      } else if (this.$store.state.user.role.localeCompare("ADMIN") == 0) {
        return linkHeader + "admin/" + actionPath;
      } else {
        console.log("ERROR ROLE: " + this.$store.state.user.role);
      }
    },
    // Function to retrieve all the job by current employer
    async getMyJob() {
      this.jobLoading = true;
      this.reqPath = this.getRoleRoute(
        "job/myjob/" + this.$store.state.user.id
      );
      let self = this;
      await this.axiosInstance
        .get(this.reqPath, {
          keyword: "",
          jobType: "",
        })
        .then((response) => {
          self.jobLoading = false;
          self.jobAdverts = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          self.displayNotification("ERROR RETRIEVING JOBS", "#94193c");
        });
    },
  },
  async mounted() {
    this.axiosInstance = axiosConfig(
      this.$store.state.user.token,
      this.$store.state.user.role.toLowerCase()
    );
    this.getMyJob(); // Retrieve all jobs by current employer
  },
  name: "MyJobsPage",
  props: {},
  components: {
    FooterCard,
    VuePdfApp,
    JobDetailDialog,
  },
};
</script>
