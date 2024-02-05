<template>
  <v-dialog max-width="800px">
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        right
        color="#2C4C9C"
        dark
        large
        slot="activator"
        class="details"
      >
        Details
        <v-icon right dark> mdi-magnify </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h2>Applications</h2>
      </v-card-title>
      <StudApplication :applications="applications" />
    </v-card>
  </v-dialog>
</template>

<script>

import StudApplication from "./StudApplication.vue"
import { axiosConfig } from "../axiosConfig";
// import EmpJob from './EmpJob.vue'

export default {
    name: 'AppsList',
    props: ['showApps', 'jobData'],
    components: {
        StudApplication,
        // EmpJob
    },
    data() {
        return {
            // job: [],
            axiosInstance: null,
            applications: []
        }
    },
    // created() {
    //   this.applications = [
    //   {
    //     id: 10001,
    //     name: "Jane Doe",
    //     summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi quod placeat quos, debitis, consequuntur explicabo fugit aspernatur impedit hic nulla asperiores cum error doloribus! Reiciendis atque inventore nam accusantium hic."
    //   },
    //   {
    //     id: 10002,
    //     name: "John Doe",
    //     summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi quod placeat quos, debitis, consequuntur explicabo fugit aspernatur impedit hic nulla asperiores cum error doloribus! Reiciendis atque inventore nam accusantium hic."
    //   },
    //   {
    //     id: 10003,
    //     name: "Elizabeth Holmes",
    //     summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi quod placeat quos, debitis, consequuntur explicabo fugit aspernatur impedit hic nulla asperiores cum error doloribus! Reiciendis atque inventore nam accusantium hic."
    //   }
    //   ]
    // },
    async mounted(){
      this.axiosInstance = axiosConfig(
        this.$store.state.user.token,
        this.$store.state.user.role.toLowerCase()
      );
    // this.reqPath = this.getRoleRoute("job/myjob/"+this.$store.state.user.id);
    await this.axiosInstance
      .get(process.env.VUE_APP_BACKEND_LINK+"emp/jobapply/show/" + this.jobData._id)
      .then((response) => {
        // this.jobs = response.data[0];
        this.applications = response.data;
      });
    }
}

</script>

<style lang="scss" scoped>
// @import "../assets/styles/myjobs-apps.css";
</style>