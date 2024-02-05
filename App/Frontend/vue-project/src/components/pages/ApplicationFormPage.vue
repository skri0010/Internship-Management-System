<!-- This is the application form page component.
     This page shows details about application form when user is filling up
     information to apply a job

  @author Joshua Ee <jeee0002@student.monash.edu>
  @author Jordan Poon  <jfoo0016@student.monash.edu>
  @author Kuan Wai Shuet <wkua0005@student.monash.edu>
  @author Pan Wei Hung <wpan0017@student.monash.edu>
  @author Suchit Sudhir Krishna <skri0010@student.monash.edu>
  @author Mohamed Musthafa Mohamed Altaf <mmoh0110@student.monash.edu>

  Created at     : 7-04-2022 19:00
  Last modified  : 20-10-2022 22:00
-->

<template>
  <v-container fluid id="user-profile" tag="section">
    <v-row
      class="mb-6"
      justify="center"
      no-gutters
    >
      <v-col lg="2">
        <v-card>
          <v-btn
            class="ma-6"
            absolute
            left
            fab
            small
            @click="goBack"
          >
            <v-icon
                dark
            >
                mdi-arrow-left
            </v-icon>
          </v-btn>
        </v-card>
      </v-col>
      <v-col md="auto">
        <h1
          class="pt-7"
          style="font-family: 'Trebuchet MS', sans-serif;"
        >
          APPLICANT DETAILS
        </h1>
      </v-col>
      <v-col lg="2">
      </v-col>
    </v-row>
    <br />
    <v-card max-width="800" class="mx-auto">
      <v-window v-model="step" class="white" height="100%">
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="lazy"
        >

          <!-- Page 1 of applicaiton -->
          <v-window-item :value="1"
            @keydown.enter="validate_pg1()">
            <v-col>
              <v-text-field
                filled
                v-model="firstname"
                :rules="nameRules"
                :counter="20"
                label="First name"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                filled
                v-model="lastname"
                :rules="nameRules"
                :counter="20"
                label="Last name"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                filled
                v-model="selectedPronoun"
                :items="pronouns"
                label="Pronouns"
                hint="Let others know how to refer to you"
                persistent-hint
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                filled
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
            <v-btn
              absolute
              bottom
              right
              class="white--text"
              color="blue"
              @click="validate_pg1()"
            >
              Next
            </v-btn>

            <br />
            <div id="error1"></div>
          </v-window-item>


          <!-- Page 2 of applicaiton -->
          <v-window-item :value="2"
            @keydown.enter="validate_pg2()">
            <v-col>
              <v-text-field
                filled
                v-model="fieldofstudy"
                :rules="fieldofstudyRules"
                label="Field of study"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                filled
                v-model="education"
                :rules="educationRules"
                label="Education"
              ></v-text-field>
            </v-col>
            <v-col>
              <SkillsCard></SkillsCard>
            </v-col>
            <v-col>
              <ExperiencesCard></ExperiencesCard>
            </v-col>
            <br />
            <br />
            <br />
            <v-btn
              absolute
              bottom
              left
              class="white--text"
              color="blue"
              @click="step--, (progress_bar -= 33)"
            >
              Back
            </v-btn>
            <v-btn
              absolute
              bottom
              right
              class="white--text"
              color="blue"
              @click="validate_pg2()"
            >
              Next
            </v-btn>
            <div id="error2"></div>
          </v-window-item>


          <!-- Page 3 of applicaiton -->
          <v-window-item :value="3">
            <v-col>
              <v-col>
                <v-textarea
                  filled
                  v-model="personalStatement"
                  height="180px"
                  :rules="personalStatementRules"
                  :counter="500"
                  hint="Maximum 500 characters"
                  label="Personal Statement"
                  required
                >
                  <template v-slot:label>
                    <div>
                      Personal Statement
                    </div>
                  </template>
                </v-textarea>
              </v-col>

              <v-file-input
                :rules="resumeRules"
                v-model="resume"
                filled
                chips
                label="Resume Upload"
                required
              ></v-file-input>
              <v-file-input
                :rules="fileRules"
                v-model="coverLetter"
                filled
                chips
                label="Cover Letter"
              ></v-file-input>
              <v-file-input
                :rules="fileRules"
                v-model="recommendationLetter"
                filled
                chips
                label="Recommendation Letter"
              ></v-file-input>
              <v-col>
                Reminder: Files should be in PDF and not more than 10MB.
              </v-col>

              <v-btn
                absolute
                bottom
                left
                class="white--text"
                color="blue"
                @click="step--, (progress_bar -= 33)"
              >
                Back
              </v-btn>
              <v-btn
                absolute
                bottom
                right
                class="white--text"
                color="success"
                @click="validate_pg3"
                :disabled="!valid"
              >
                Submit
              </v-btn>
            </v-col>
            <br />
            <br />
          </v-window-item>
          <v-progress-linear
            v-model="progress_bar"
            :buffer-value="bufferValue"
            color="blue"
            height="8"
          ></v-progress-linear>
        </v-form>
      </v-window>
    </v-card>
    <FooterCard></FooterCard>
  </v-container>
</template>

<script>
import FooterCard from "../FooterCard.vue";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import ExperiencesCard from "../ApplicationFormComponents/ExperiencesCard.vue";
import SkillsCard from "../ApplicationFormComponents/SkillsCard.vue";
import { axiosConfig } from "../../axiosConfig";
import store from "../../store";

let axiosInstance;

export default {
  components: {
    FooterCard,
    SkillsCard,
    ExperiencesCard,
  },
  data: () => ({
    // This part below is for skills section
    activator: null,
    attach: null,
    colors: ["green", "purple", "indigo", "cyan", "teal", "orange"],
    editing: null,
    editingIndex: -1,
    items: [
      { header: "Select a skill or create one" },
      {
        text: "Vue.js",
        color: "blue",
      },
      {
        text: "Node.js",
        color: "green",
      },
      {
        text: "Java",
        color: "red",
      },
      {
        text: "Molecular",
        color: "red",
      },
    ],

    valid: true,
    firstname: null,
    lastname: null,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 20 || "Name must be less than 20 characters",
    ],
    pronouns: ["He/Him", "She/Her", "They/Them"],
    selectedPronoun: null,
    email: null,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    fieldofstudy: null,
    fieldofstudyRules: [(v) => !!v || "Field of study is required"],
    education: null,
    educationRules: [],
    dialog: false,
    personalStatement:"",
    personalStatementRules: [
      (v) => !!v || "Personal Statement is required",
    ],
    resume: null,
    resumeRules: [
      (v) => !!v || "Resume is required",
      (v) => !v || v.size < 10000000 || 'Avatar size should be less than 10 MB!',
    ],
    coverLetter: null,
    recommendationLetter: null,
    fileRules: [
      (v) => !v || v.size < 10000000 || 'Avatar size should be less than 10 MB!',
    ],
    step: 1,
    progress_bar: 0,
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    studentId: "",
    job: null,
  }),
  watch: {},
  methods: {

    /**
     * Load details of student from database using the email provided
     * @param {string} email
     * @returns {void}
     */
    loadDetails(email) {
      let self = this;
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"stud/student/retrieve", {
          params: {
            email: email,
          },
        })
        .then((response) => self.displayDetails(response.data));
    },

    /**
     * Display student information and details from database
     * @param {object} response
     * @returns {void}
     */
    displayDetails(response) {
      this.firstname = response.firstName;
      this.lastname = response.lastName;
      this.email = response.email;
      this.selectedPronoun = response.pronouns;
      this.fieldofstudy = response.fieldOfStudy;
      this.education = response.education;
      this.studentId = response._id;
    },

    /**
     * Calculate age
     * @param {number} current Current year
     * @param {number} yearOfBirth Year of Birth
     * @returns {string} your calculated age
     */
    displayPronoun(selectedPronoun) {
      if (selectedPronoun != "") {
        return "(" + selectedPronoun + ")";
      } else {
        return "";
      }
    },

    /**
     * Calculate age
     * @param {number} current Current year
     * @param {number} yearOfBirth Year of Birth
     * @returns {string} your calculated age
     */
    displaySkills(skills) {
      var string = "";
      for (let i = 0; i < skills.length; i++) {
        string += skills[i].text + "\n";
      }
      return string;
    },

    /**
     * Validation check for page 1
     * @returns {void}
     */
    validate_pg1() {
      var output_string = "";
      var mailformat = /.+@.+/;
      // checking for empty input fields
      if (
        !this.firstname ||
        !this.lastname ||
        !this.selectedPronoun
      ) {
        output_string = "Input fields cannot be empty, please try again";
      } else if (!this.email.match(mailformat)) {
        output_string = "Email is Invalid. Please try again.";
      } else {
        this.step++;
        this.progress_bar += 33;
      }
      document.getElementById("error1").innerHTML =
        `<p style="color:red">` + output_string + "<p>";
    },

    /**
     * Validation check for page 2
     * @returns {void}
     */
    validate_pg2() {
      var output_string = "";
      // checking for empty input fields
      if (!this.fieldofstudy || !this.education) {
        output_string = "Input fields cannot be empty, please try again";
      } else {
        this.step++;
        this.progress_bar += 33;
      }
      document.getElementById("error2").innerHTML =
        `<p style="color:red">` + output_string + "<p>";
    },

    /**
     * Validation check for page 3
     * @returns {void}
     */
    validate_pg3() {
      var output_string = "";
      // checking for empty input fields
      if (!this.resume) {
        output_string = "File input empty, please try again";
      } else {

        this.progress_bar += 34;
        this.$refs.form.validate()
        this.submit();
      }
      document.getElementById("error3").innerHTML =
        `<p style="color:red">` + output_string + "<p>";
    },

    /**
     * Allowed user to submit jobapplication
     * @returns {void}
     */
    submit(){
      let self = this;
      axiosInstance.put(process.env.VUE_APP_BACKEND_LINK+"stud/jobapply/apply", {
        jobId: this.job._id,
        jobType: this.job.jobType,
        applicantId: this.studentId,
        applicationDetails: this.personalStatement,
      })
      .then(function (response) {
        //route user back to homepage if appplication existed
        if(response.data == 'Application Exist In Database'){
          alert("Application Existed");
          self.$router.push({ name: "homepage" });
          return;
        }
        axiosInstance.post(process.env.VUE_APP_BACKEND_LINK+"stud/statistics/jobApplicantsUpdate", {
          jobId: response.data.jobId
        })

        //calling relavent methods for submmited job application
        self.createAndAttachJobAppForm(response.data._id);
        self.readAndAttachResume(response.data._id);
        self.readAndAttachRecommendationLetter(response.data._id);
        self.readAndAttachCoverLetter(response.data._id);
        alert("SUBMIT SUCCESSFULLY");
        self.$router.push({ name: "homepage" });
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    /**
     * Creating and attaching job application form for employer module to view the data
     * @param {object} jobApplicationId
     * @returns {void}
     */
    async createAndAttachJobAppForm(jobApplicationId) {
      // Read more : https://pdf-lib.js.org
      // Create a new PDFDocument
      const pdfDoc = await PDFDocument.create();

      // Embed the Times Roman font
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      // Add a blank page to the document
      const page = pdfDoc.addPage();

      // Draw a string of text toward the top of the page
      const titlefontSize = 30;
      const fontSize = 18;
      page.drawText("JOB APPLICATION", {
        x: 200,
        y: 800,
        size: titlefontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      page.drawText("Name : " + this.firstname + " " + this.lastname, {
        x: 50,
        y: 750,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      page.drawText("Email : " + this.email, {
        x: 50,
        y: 720,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      page.drawText("Field of study : " + this.fieldofstudy, {
        x: 50,
        y: 690,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      page.drawText("Education : " + this.education, {
        x: 50,
        y: 660,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      // save the pdf document
      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

      this.attachForm(jobApplicationId,pdfDataUri);
    },

    /**
     * Read and attach resume
     * @param {object} jobApplicationId
     * @returns {void}
     */
    readAndAttachResume(jobApplicationId){
      const reader = new FileReader();
      let self = this;

      reader.onloadend = function (e) {
        self.attachResume(jobApplicationId,e.target.result);
      };
      reader.readAsDataURL(this.resume);
    },

    /**
     * Read and attach cover letter
     * @param {object} jobApplicationId
     * @returns {void}
     */
    readAndAttachCoverLetter(jobApplicationId){
      if(this.recommendationLetter != null ){
        const reader = new FileReader();
        let self = this;

        reader.onloadend = function (e) {
          self.attachCoverLetter(jobApplicationId,e.target.result);
        };
        reader.readAsDataURL(this.coverLetter);
      }
    },

    /**
     * Read and attach recommendation letter
     * @param {object} jobApplicationId
     * @returns {void}
     */
    readAndAttachRecommendationLetter(jobApplicationId){
      if(this.recommendationLetter != null ){
        const reader = new FileReader();
        let self = this;

        reader.onloadend = function (e) {
          self.attachRecommendationLetter(jobApplicationId,e.target.result);
        };
        reader.readAsDataURL(this.recommendationLetter);
      }
    },

    /**
     * Attach form and call API to process at the backend
     * @param {object} jobApplicationId
     * @param {object} formB64
     * @returns {void}
     */
    attachForm(jobApplicationId, formB64){
      axiosInstance
        .put(process.env.VUE_APP_BACKEND_LINK+"stud/jobapplyform/attach", {
          _id: jobApplicationId,
          jobApplicationForm: formB64,
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * Attach Resume and call API to process at the backend
     * @param {object} jobApplicationId
     * @returns {void}
     */
    attachResume(jobApplicationId, resumeB64){
      axiosInstance
        .put(process.env.VUE_APP_BACKEND_LINK+"stud/jobapplyresume/attach", {
          _id: jobApplicationId,
          resume: resumeB64,
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * Attaching cover letter  and call API to process at the backend
     * @param {object} jobApplicationId
     * @returns {void}
     */
    attachCoverLetter(jobApplicationId, coverLetterB64){
      axiosInstance
        .put(process.env.VUE_APP_BACKEND_LINK+"stud/jobapplycoverletter/attach", {
          _id: jobApplicationId,
          coverLetter: coverLetterB64,
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * Attaching recommendation letter and call API to process at the backend
     * @param {object} jobApplicationId
     * @param {object} recommendationLetterB64
     * @returns {void}
     */
    attachRecommendationLetter(jobApplicationId, recommendationLetterB64){
      axiosInstance
        .put(process.env.VUE_APP_BACKEND_LINK+"stud/jobapplyrecommendationletter/attach", {
          _id: jobApplicationId,
          recommendationLetter: recommendationLetterB64,
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * Back button at the first validation page
     * @param {object} jobApplicationId
     * @returns {void}
     */
    goBack() {
      if (confirm("We do not save progress of application. Are you sure you would like to go back?")) {
        this.$router.push({
        name: "jobdetails",
        params: { selectedJob: this.job },
      });
      }
    }

  },

  /**
  * The mounted() hook is the most commonly used lifecycle hook in Vue. Vue calls the mounted() hook when your component is added to the DOM.
  * It is most often used to send an HTTP request to fetch data that the component will then render.
  * @returns {void}
  */
  mounted() {
    axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase(),
    );
    console.log("Application form");
    let data = this.$store.state.user;
    this.job = this.$route.params.selectedJob;
    this.studentId = data.id;
    this.loadDetails(data.email);
  },
};
</script>
