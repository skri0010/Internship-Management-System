import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user : {
        firstName: "Guest",
        lastName: "User",
        email: "",
        role: "",
        profilePic: "https://randomuser.me/api/portraits/women/81.jpg",
        token: "",
        auth: false,
        id: ""
      }
  }

})
