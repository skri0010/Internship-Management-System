<template lang="html">
  <div>
    <div class="box">
        <a class="button" @click="onClick()" href="#popup1">View Reports</a>
    </div>

    <div id="popup1" class="overlay">
        <div class="popup">
            <br>
            <a class="close" href="#">&times;</a>
            <div class="content" id = "content">
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { axiosConfig } from "../axiosConfig";
import store from "../store";
let axiosInstance;

export default {
    name:'MyPopup',
  data(){
    return {
      popupActivo:false,
      reports:[]
      
    }
  },
  props:{
    email: String,
  },
  methods:{
  onClick() {
      // todo: modify in database
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"stud/report/retrieve", {
            params: {
                studentEmail: this.email
            }
        })
        .then(response => {
            this.reports=response.data;
            let context = document.getElementById("content");
            
            let data = "";
            if (response.data.length != 0){
                for (let i = 0; i < response.data.length; i++) {
                    data += `<div class="seperator">
                    <h5><span>Date:    ${response.data[i].reportDate}</span></h5>
                    </div>
                    <p>Email: ${response.data[i].studentEmail}</p>
                    <p>Company Name: ${response.data[i].companyName}</p>
                    <p>Hours Worked: ${response.data[i].hoursWorked}</p>
                    <p>Gained Benefits: ${response.data[i].gainedBenefits}</p>
                    <p>Report Title: ${response.data[i].reportTitle}</p>  
                    <p>Report Type: ${response.data[i].reportType}</p>
                    <p>Summary work done: ${response.data[i].summaryWorkDone}</p>`;
                } 
            }else{
                data += "<div>No Reports Here</div>";
            }
            
            context.innerHTML=data;
        })

       
    },
    
  },
  async mounted() {
    axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase(),
    );  
  },
    
}
</script>

<style>




.button {
  font-size: 1em;
  padding: 10px;
  color: #fff;
  border-radius: 20px/50px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease-out;
}
.button:hover {
  background: #12acc4;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 500ms;
  visibility: hidden;
  opacity: 0;
}
.overlay:target {
  visibility: visible;
  opacity: 1;
}

.popup {
  margin: 70px auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  width: 50%;
  position: relative;
  transition: all 5s ease-in-out;
  
}


.popup .close {
  position: absolute;
  top: 20px;
  right: 30px;
  transition: all 200ms;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}
.popup .close:hover {
  color: #12acc4;
}
.popup .content {
  max-height: 100%;
  overflow: auto;
}

@media screen and (max-width: 700px){
  .box{
    width: 70%;
  }
  .popup{
    width: 70%;
  }
}

.seperator h5 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1em;
}

.seperator h5::before,
.seperator h5::after {
  content: "";
  display: block;
  flex-grow: 1;
  height: 1px;
  background: #ccc;
}

.seperator h5 span {
  padding: 0 2em;
}
</style>