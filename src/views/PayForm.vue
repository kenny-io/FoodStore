<template>
  <div
    class="fixed-top d-flex align-items-center justify-content-center"
    style="bottom: 0; overflow-y: auto"
  >
    <b-form>
      <b-form-group id="card-input-group" label-for="cardprice">
        <b-form-input
          id="cardprice"
          v-model="form.cardprice"
          type="number"
          required
          placeholder="Enter Price"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="card-input-group" label-for="cardno">
        <b-form-input
          id="cardno"
          v-model="form.cardno"
          type="number"
          required
          placeholder="Enter card number"
        ></b-form-input>
      </b-form-group>

      <b-form inline>
        <label class="sr-only"></label>
        <b-input
          v-model="form.cardpin"
          id="cardmonth"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="Card PIN"
        ></b-input>

        <label class="sr-only"></label>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-input v-model="form.cvv" id="cardyear" placeholder="CVV"></b-input>
        </b-input-group>
      </b-form>
      <br />
      <b-form inline>
        <label class="sr-only" for="inline-form-input-name">Expiry Month</label>
        <b-input
          v-model="form.expirymonth"
          id="cardmonth"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="MM"
        ></b-input>

        <label class="sr-only" for="inline-form-input-username">Expiry Year</label>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-input v-model="form.expiryyear" id="cardyear" placeholder="YY"></b-input>
        </b-input-group>
      </b-form>
      <br />
      <b-form-checkbox v-model="form.save" class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>
      <br />
      <b-button @click="onSubmit" variant="primary">Pay</b-button>
      <!-- <b-button @click="onSubmit">Pay</b-button> -->
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import https from "https";
import proxy from "../proxy";
// import httpsAgent from 'https'
let config = {
  headers: {
    // "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE,PUT,POST,GET,OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  }
};

export default {
  data() {
    return {
      form: {
        cardno: "",
        cardpin: "",
        cvv: "",
        cardprice: "",
        expirymonth: "",
        expiryyear: ""
      },
      payload: {
        pubkey: "FLWPUBK_TEST-31d61a13026483fc38f15f0e90232374-X",
        email: "ekene@gmail.com",
        country: "NG",
        currency: "NGN",
        seckey: "FLWSECK_TEST-a514d8f1abd080db1502a144f22954dc-X"
      }
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      const chargePayload = { ...this.form, ...this.payload };

      //...................... REQUEST

      // const agent = new https.Agent({
      //   rejectUnauthorized: false
      // });
      // axios
      //   .post(
      //     "https://encryption-server.static-flutterwave.com/encrypt",
      //     { httpsAgent: agent },
      //     chargePayload,
      //     config
      //   )
      //   .then(function(response) {
      //     console.log(response);
      //     axios
      //       .post(
      //         "https://api.ravepay.co/flwv3-pug/getpaidx/api/charge",
      //         response
      //       )
      //       .then(function(chargeRes) {
      //         console.log(chargeRes);
      //       })
      //       .catch(function(chargeError) {
      //         console.log(chargeError);
      //       });
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });

      //.........................

      axios
        .post(
          "https://encryption-server.eks-flutterwave.com/",
          chargePayload,
          config
        )
        .then(function(response) {
          console.log(response);
          axios
            .post(
              "https://api.ravepay.co/flwv3-pug/getpaidx/api/charge",
              response
            )
            .then(function(chargeRes) {
              console.log(chargeRes);
            })
            .catch(function(chargeError) {
              console.log(chargeError);
            });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
