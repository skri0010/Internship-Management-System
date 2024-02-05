<!-- This is the main Admin dashboard component

  @author : Wei Hung <wpan007@student.monash.edu
  Created at     : 11-09-2022 10:00
  Last modified  : 10-20-2022 10:00
-->
<template>
  <main>
    <v-card>
      <!-- Searchbar for the job advertisement application table -->
      <v-card-title>
        <v-text-field
          v-model="employerAdvertisementSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <!-- Job advertisement application table -->
      <v-data-table
        :headers="employerAdvertisementHeaders"
        :items="employerAdvertisements"
        :search="employerAdvertisementSearch"
        :loading="employerAdvertisementLoading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:[`item.createdAt`]="{ item }">
          <v-chip :color="getColor(item.createdAt)" dark>
            {{ item.createdAt.substring(0, 10) }}
          </v-chip>
        </template>
        <template v-slot:[`item.advertisementEndDate`]="{ item }">
          <v-chip :color="getColor(item.advertisementEndDate)" dark>
            {{ item.advertisementEndDate.substring(0, 10) }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2"
                @click="showEmployerAdvertisementDetails(item)"
                text
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small> mdi-magnify </v-icon>
              </v-btn>
            </template>
            <span>Advertisement Details</span>
          </v-tooltip>
          <v-tooltip bottom>
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
            <span>Approve Advertisement</span>
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
            <span>Reject Advertisement</span>
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
        <v-card-text class="text-left">
          <p>Are you sure you want to approve this application as</p>
          <validation-observer ref="observer">
            <validation-provider
              v-slot="{ errors }"
              name="Advertisement Type"
              rules="required"
            >
              <v-select
                v-model="jobType"
                :items="type"
                label="Advertisement Type"
                dense
                color="#2C4C9C"
                outlined
                :counter="20"
                :error-messages="errors"
              ></v-select>
            </validation-provider>
          </validation-observer>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red lighten-3"
            text
            @click="approveConfirmationDialog = false; $refs.observer.reset();"
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
            @click="rejectConfirmationDialog = false; $refs.observer.reset();"
          >
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="reject()"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Fullscreen dialog for showing job advertisement details -->
    <v-dialog
      v-model="applicationDetailDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <EmployerAdvertisementDetailDialog
        :job="currentEmployerAdvertisement"
        @close="applicationDetailDialog = false"
      ></EmployerAdvertisementDetailDialog>
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
import EmployerAdvertisementDetailDialog from ".././EmployerAdvertisementDetailDialog.vue";
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
  name: "MyJobList",
  // Page components
  components: {
    EmployerAdvertisementDetailDialog,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      // Headers for tables and their data
      employerAdvertisementHeaders: [
        {
          text: "Employer Name", // Emp name
          align: "start",
          filterable: true,
          value: "employerName",
        },
        {
          text: "Job Title", // Their Job Title
          align: "start",
          value: "jobTitle",
        },
        {
          text: "Hire Type", // Local/International
          align: "start",
          value: "hireType",
        },
        {
          text: "Apply Date", // Apply Date
          align: "start",
          value: "createdAt",
        },
        {
          text: "Advertisement Deadline", //Deadline for app
          align: "start",
          value: "advertisementEndDate",
        },
        {
          text: "Actions",  // Approve/Reject/Show Detilas
          align: "center",
          filterable: false,
          sortable: false,
          value: "actions",
        },
      ],
      // Initializing Necessary Variables
      jobType: "VOLUNTARY",
      type: ["COMPULSORY", "VOLUNTARY"],  // Options available for admin to classify job advertisement
      feedback: null,                     // feedback provided by admin to employer
      employerAdvertisements: [],         // data of all advertisements
      employerAdvertisementSearch: null,  // search content for searchbar of table
      employerAdvertisementLoading: true, // true will show loading animation for table
      applicationDetailDialog: false,     // true will show fullscreen dialog about application detail
      currentEmployerAdvertisement: null, // store current selected employer advertisement
      axiosInstance: null,
      notification: false, // true will show notification snackbar
      notiColor: "#19946b", // determine the color for the notification snackbar
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
    confirmApprove(employerAdvertisement) {
      this.currentEmployerAdvertisement = employerAdvertisement;
      this.approveConfirmationDialog = true;
    },

    // Function to show confirmation dialog for rejecting
    confirmReject(employerAdvertisement) {
      this.currentEmployerAdvertisement = employerAdvertisement;
      this.rejectConfirmationDialog = true;
    },
    // Function to approve employer job application
    async approve() {
      // TODO: Modify route based on role (COADMIN/ADMIN)
      let self = this;
      this.approveConfirmationDialog = false;
      await this.axiosInstance
        .put(
          process.env.VUE_APP_BACKEND_LINK+`admin/advert/approve/${this.currentEmployerAdvertisement._id}`,
          { jobType: this.jobType }
        )
        .then((response) => {
          self.displayNotification(
            "ADVERTISEMENT APPLICATION APPROVED SUCCESSFULLY",
            "#19946b"
          );
          self.showAdvertisement();
        })
        .catch((err) => {
          self.displayNotification(
            "ERROR APPROVING ADVERTISEMENT APPLICATION",
            "#94193c"
          );
          self.showAdvertisement();
        });
      
    },
    // Function to reject employer job application
    async reject() {
      // TODO: Modify route based on role (COADMIN/ADMIN)
      let self = this;
      this.rejectConfirmationDialog = false;
      // Backend service to reject
      await this.axiosInstance
        .put(
          process.env.VUE_APP_BACKEND_LINK+`admin/advert/reject/${this.currentEmployerAdvertisement._id}`,
          { feedback: this.feedback }
        )
        .then((response) => {
          // If rejected
          self.displayNotification(
            "ADVERTISEMENT APPLICATION REJECTED SUCCESSFULLY",
            "#19946b"
          );
          self.showAdvertisement();
        })
        .catch((err) => {
          // If not rejected
          self.displayNotification(
            "ERROR REJECTING ADVERTISEMENT APPLICATION",
            "#94193c"
          );
          self.showAdvertisement();
        });
    },
    // Function to show fullscreen dialog about job advertisement
    showEmployerAdvertisementDetails(item) {
      this.currentEmployerAdvertisement = item;
      this.applicationDetailDialog = true;
    },
    // Function to return corresponding color based on due date difference
    getColor(date) {
      let today = new Date();
      let dueDate = new Date(date);
      if (dueDate < today) {
        return "#808080";
      }
      // Compute colour based on time relevance
      let difference = Math.abs(dueDate - today);
      let days = Math.round(difference / (1000 * 3600 * 24));
      // Colours for different days
      if (days <= 7) {
        return "#E3242B";
      } else if (days <= 14) {
        return "#D4A017";
      } else {
        return "#6CBB3C";
      }
    },
    // Function to request all available advertisement waiting to be approved by admin
    async showAdvertisement() {
      // TODO: Modify route based on role (COADMIN/ADMIN)
      this.employerAdvertisementLoading = true;
      let self = this;
      await this.axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"admin/advert/pendingjob")
        .then((res) => {
          this.employerAdvertisements = res.data;
          this.employerAdvertisementLoading = false;
        })
        .catch((err) => {
          self.displayNotification(
            "ERROR SHOWING ADVERTISEMENT APPLICATIONS",
            "#94193c"
          );
        });
    },
  },
  // On load run this
  mounted() {
    this.axiosInstance = axiosConfig(
      this.$store.state.user.token,
      this.$store.state.user.role.toLowerCase()
    );
    this.showAdvertisement();
  },
};
</script>
