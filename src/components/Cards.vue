<template>
  <b-container>
    <div v-if="meals.length">
      <b-row>
        <div v-bind:key="data.index" v-for="data in meals">
          <b-col l="4">
            <b-card
              v-bind:title="data.strCategory"
              v-bind:img-src="data.strCategoryThumb"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-card-text>{{ `${data.strCategoryDescription.slice(0,100)}...` }}</b-card-text>
              <span>
                <strong>Price: NGN500</strong>
              </span>
              <br />
              <b-button @click="pay" variant="primary">Order Food</b-button>
            </b-card>
          </b-col>
        </div>
      </b-row>
    </div>
    <div v-else>
      <h5>No meals available yet 😢</h5>
    </div>
  </b-container>
</template>

<script>
// import axios from "axios";
// const cart = [];
// const getUserDetails = () => {};
// const API_publicKey = "FLWPUBK_TEST-31d61a13026483fc38f15f0e90232374-X";
import router from "../router";
export default {
  computed: {
    meals() {
      return this.$store.state.meals;
    }
  },
  methods: {
    pay() {
      router.push({ name: "pay" });
    }
  }
};
</script>
























// const payWithRave = () => {
//   var x = getpaidSetup({
//     PBFPubKey: API_publicKey,
//     customer_email: "user@example.com",
//     amount: 2000,
//     customer_phone: "234099940409",
//     currency: "NGN",
//     redirect_url: getUserDetails(),
//     txref: "rave-123456",
//     meta: [
//       {
//         metaname: "flightID",
//         metavalue: "AP1234"
//       }
//     ],
//     onclose: function() {},
//     callback: function(response) {
//       var txref = response.tx.txRef; // collect txRef returned and pass to a 					server page to complete status check.
//       console.log("This is the response returned after a charge", response);
//       if (
//         response.tx.chargeResponseCode == "00" ||
//         response.tx.chargeResponseCode == "0"
//       ) {
//         // redirect to a success page
//       } else {
//         // redirect to a failure page.
//       }
//       x.close(); // use this to close the modal immediately after payment.
//     }
//   });
// };
