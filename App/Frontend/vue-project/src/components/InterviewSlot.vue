<template>
  <v-layout align-center justify-center>
    <v-card
      class="elevation-6 mt-10 mb-10 mx-auto pa-12"
      justify="center"
      max-width="60%"
    >
      <v-card-title class="pa-0">
        <v-col class="pa-6" cols="12">
          <h2 class="text-center">Interview Slot Selection Form</h2>
          <br />
          <h6 class="text-center">
            Please select any 3 available interview slots for the student to
            choose from
          </h6>
        </v-col>
      </v-card-title>

      <form>
        <v-row>
          <v-col cols="12">
            <!-- First row -->
            <v-row>
              <h3 class="pl-4">Interview Slot 1:</h3>
            </v-row>

            <v-row>
              <v-text-field
                v-model="interviewSlot1"
                type="datetime-local"
                label="Interview Slot 1"
                outlined
                dense
                color="#2C4C9C"
                autocomplete="false"
                required
              >
              </v-text-field>
            </v-row>

            <v-row>
              <h3 class="pl-4">Interview Slot 2:</h3>
            </v-row>

            <v-row>
              <v-text-field
                v-model="interviewSlot2"
                type="datetime-local"
                label="Interview Slot 2"
                outlined
                dense
                color="#2C4C9C"
                autocomplete="false"
                required
              >
              </v-text-field>
            </v-row>

            <v-row>
              <h3 class="pl-4">Interview Slot 3:</h3>
            </v-row>

            <v-row>
              <v-text-field
                v-model="interviewSlot3"
                type="datetime-local"
                label="Interview Slot 3"
                outlined
                dense
                color="#2C4C9C"
                autocomplete="false"
                required
              >
              </v-text-field>
            </v-row>
          </v-col>
        </v-row>
      </form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="clear()"> Clear </v-btn>
        <v-btn
          color="#2C4C9C"
          dark
          tile
          depressed
          type="submit"
          @click="submit()"
        >
          SUBMIT
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  components: {},
  data: () => ({
    // input field variables
    interviewSlot1: [null],
    interviewSlot2: [null],
    interviewSlot3: [null],
  }),

  methods: {
    clear() {
      // this.$refs.observer.reset();
    },
    async submit() {
      // if (await this.$refs.observer.validate()) {
      //   this.getData();
      //   this.clear();
      // }
    },
  },
};
</script>
<style>
.v-expansion-panel-header__icon {
  padding-left: 4px;
}
.signup {
  background-color: #2c4c9c;
}
</style>
