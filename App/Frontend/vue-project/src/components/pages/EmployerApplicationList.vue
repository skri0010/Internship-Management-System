<!-- This is the main Admin dashboard component

  @author : Wei Hung <wpan007@student.monash.edu
  Created at     : 11-09-2022 10:00
  Last modified  : 10-20-2022 10:00
-->
<template>
  <main>
    <v-card>
      <!-- Searchbar for the employer application table -->
      <v-card-title>
        <!-- Search -->
        <v-text-field
          v-model="employerApplicationSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <!-- Employer application application table -->
      <v-data-table
        :headers="employerApplicationHeaders"
        :items="employerApplications"
        :search="employerApplicationSearch"
        :loading="employerApplicationLoading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2"
                @click="showEmployerApplicationDetails(item)"
                text
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small> mdi-magnify </v-icon>
              </v-btn>
            </template>
            <span>Application Details</span>
          </v-tooltip>
          <v-tooltip bottom>
            <!-- Approve, Reject -->
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2"
                @click="confirmApprove(item)"
                text
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small> mdi-check </v-icon>
              </v-btn>
            </template>
            <span>Approve Application</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2"
                @click="confirmReject(item)"
                text
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small> mdi-close </v-icon>
              </v-btn>
            </template>
            <span>Reject Application</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <!-- Confirmation dialog for Approving application -->
    <v-dialog v-model="approveConfirmationDialog" persistent width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Approve Application
        </v-card-title>
        <v-card-text>
          Are you sure you want to approve this application?
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
          <v-btn color="primary" text @click="approve()"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirmation dialog for Rejecting application -->
    <v-dialog v-model="rejectConfirmationDialog" persistent width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Reject Application
        </v-card-title>
        <v-card-text class="text-left">
          <p>Are you sure you want to reject this application?</p>
          <validation-observer ref="observer">
            <validation-provider
              v-slot="{ errors }"
              name="Reject Feedback"
              rules="required"
            >
              <v-text-field
                v-model="feedback"
                label="Reject Reason"
                outlined
                dense
                color="#2C4C9C"
                autocomplete="false"
                required
                :counter="100"
                :error-messages="errors"
              />
            </validation-provider>
          </validation-observer>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red lighten-3"
            text
            @click="
              rejectConfirmationDialog = false;
              $refs.observer.reset();
            "
          >
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="reject()"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Fullscreen dialog for showing employer application details -->
    <v-dialog
      v-model="applicationDetailDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <EmployerApplicationDetailDialog
        :employerApplication="currentEmployerApplication"
        @close="applicationDetailDialog = false"
      ></EmployerApplicationDetailDialog>
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
  </main>
</template>
<script>
import { axiosConfig } from "../../axiosConfig";
import EmployerApplicationDetailDialog from ".././EmployerApplicationDetailDialog.vue";
import { required } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

setInteractionMode("lazy");

extend("required", {
  ...required,
  message: "{_field_} cannot be empty",
});

export default {
  // Specify necessary components
  name: "MyJobList",
  components: {
    EmployerApplicationDetailDialog,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      // Table details for emp applications
      employerApplicationHeaders: [
        {
          text: "Employer Name", // Employer Name
          align: "start",
          filterable: true,
          value: "employerName",
        },
        {
          text: "Employer Email", // Employer Email
          align: "start",
          value: "employerEmail",
        },
        {
          text: "Employer Industry", //Employer Industry
          align: "start",
          value: "employerIndustry",
        },
        {
          text: "Co-Admin Approval", //Co admin flag set? (true or false)
          align: "start",
          value: "coAdminApproval",
        },
        {
          text: "Actions", // Approve/Reject/ShowDetails
          align: "center",
          filterable: false,
          sortable: false,
          value: "actions",
        },
      ],
      employerApplications: [],       // data of all applications
      employerApplicationSearch: null,// search content for searchbar of table
      employerApplicationLoading: true,// true will show loading animation for table
      applicationDetailDialog: false, // true will show confirmation dialog
      currentEmployerApplication: null,// store current selected employer application
      axiosInstance: null,
      feedback: null,         // feedback provided by admin to employer
      notification: false,    // true will show notification snackbar
      notiColor: "#19946b",   // determine the color for the notification snackbar
      notificationText: null, // content of the notification snackbar
      approveConfirmationDialog: false, // true will show confirmation dialog
      rejectConfirmationDialog: false,  // true will show confirmation dialog
    };
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

    // Function to show confirmation dialog for approving
    confirmApprove(employerApplication) {
      this.currentEmployerApplication = employerApplication;
      this.approveConfirmationDialog = true;
    },

    // Function to show confirmation dialog for rejecting
    confirmReject(employerApplication) {
      this.currentEmployerApplication = employerApplication;
      this.rejectConfirmationDialog = true;
    },
    // Function to approve employer job application
    async approve() {
      // TODO: Modify route based on role (COADMIN/ADMIN)
      let role = this.$store.state.user.role.toLowerCase();
      let self = this;
      this.approveConfirmationDialog = false;
      let path = process.env.VUE_APP_BACKEND_LINK;

      if (role == "admin") {
        // Admin can straight away approve but coadmin only sets the flag
        path += `admin/app/adapprove/${this.currentEmployerApplication._id}`;
      } else {
        path += `coadmin/app/coapprove/${this.currentEmployerApplication._id}`;
      }
      await this.axiosInstance
        .put(path)
        .then((res) => {
          // Notification for success
          self.displayNotification(
            `EMPLOYER APPLICATION APPROVED BY ${this.$store.state.user.role.toUpperCase()} SUCCESSFULLY`,
            "#19946b"
          );
          self.showEmployerApplication();
        })
        .catch((err) => {
          self.displayNotification(
            `ERROR FOR ${this.$store.state.user.role.toUpperCase()} APPROVING EMPLOYER APPLICATION`,
            "#94193c"
          );
          self.showEmployerApplication();
        });
    },
    // Function to reject employer job application
    async reject() {
      // TODO: Modify route based on role (COADMIN/ADMIN)
      let role = this.$store.state.user.role.toLowerCase();
      let self = this;
      if (role == "admin") {
        await this.axiosInstance
          .put(
            process.env.VUE_APP_BACKEND_LINK +
              `admin/app/reject/${this.currentEmployerApplication._id}`,
            { feedback: this.feedback }
          )
          .then((res) => {
            self.displayNotification(
              "EMPLOYER APPLICATION REJECTED SUCCESSFULLY",
              "#19946b"
            );
            self.showEmployerApplication();
          })
          .catch((err) => {
            self.displayNotification(
              "ERROR REJECTING EMPLOYER APPLICATION",
              "#94193c"
            );
            self.showEmployerApplication();
          });
      } else {
        await this.axiosInstance
          .put(
            process.env.VUE_APP_BACKEND_LINK +
              `coadmin/app/reject/${this.currentEmployerApplication._id}`,
            { feedback: this.feedback }
          )
          .then((res) => {
            self.displayNotification(
              "EMPLOYER APPLICATION REJECTED SUCCESSFULLY BY CO-ADMIN",
              "#19946b"
            );
            self.showEmployerApplication();
          })
          .catch((err) => {
            self.displayNotification(
              "ERROR REJECTING EMPLOYER APPLICATION BY CO-ADMIN",
              "#94193c"
            );
            self.showEmployerApplication();
          });

      }
      this.rejectConfirmationDialog = false;
    },
    // Function to show fullscreen dialog about employer application
    showEmployerApplicationDetails(item) {
      this.currentEmployerApplication = item;
      this.applicationDetailDialog = true;
    },
    // Function to request all available applications waiting to be approved by admin
    async showEmployerApplication() {
      this.employerApplicationLoading = true;
      let self = this;
      let role = this.$store.state.user.role.toLowerCase();
      let requestPath = process.env.VUE_APP_BACKEND_LINK;
      if (role == "admin") {
        requestPath += "admin/app/pendingapp";
      }
      else {
        requestPath += "coadmin/app/coadminpendingapp";
      }
      await this.axiosInstance
        .get(requestPath)
        .then((res) => {
          self.employerApplications = res.data;
          self.employerApplicationLoading = false;
        })
        .catch((err) => {
          console.log(err);
          self.displayNotification(
            "ERROR SHOWING EMPLOYER APPLICATIONS",
            "#94193c"
          );
        });
    },
  },
  // On load run this
  async created() {
    this.axiosInstance = axiosConfig(
      this.$store.state.user.token,
      this.$store.state.user.role.toLowerCase()
    );
    this.showEmployerApplication();
  },
};
</script>
