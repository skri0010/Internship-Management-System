<!-- This is the job Details Page

  @author Joshua Ee <jeee0002@student.monash.edu>
  @author Kuan Wai Shuet <wkua0005@student.monash.edu>

  Created at     : 20-08-2022 17:30
  Last modified  : 20-10-2022 23:00
-->

<template>
  <v-container fluid id="user-profile" tag="section">
    <v-row justify="center">
      <v-col cols="12" md="7">
        <!-- User info card -->
        <JobDetailsCard></JobDetailsCard>

      </v-col>
    </v-row>
    <v-row>
    </v-row>
    <FooterCard></FooterCard>
  </v-container>
</template>

<script>
  import JobDetailsCard from './/JobDetailsCard.vue'
  import FooterCard from './/FooterCard.vue';
  export default {
    data: () => ({
    }),
    watch: {
    },
    methods: { 
    },
    components: { JobDetailsCard, FooterCard}
  }
</script>