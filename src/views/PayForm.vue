<template>
  <div
    class="fixed-top d-flex align-items-center justify-content-center"
    style="bottom: 0; overflow-y: auto"
  >
    <b-form>
      <h2>Checkout</h2>
      <b-form-group id="card-input-group" label-for="cardno">
        <b-form-input
          id="cardno"
          v-model="form.card_number"
          type="number"
          required
          placeholder="Enter card number"
        ></b-form-input>
      </b-form-group>

      <b-form inline>
        <label class="sr-only"></label>
        <b-input
          v-model="authmodel.authorization.pin"
          id="cardpin"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="Card PIN"
        ></b-input>

        <label class="sr-only"></label>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-input v-model="form.cvv" id="cardcvv" placeholder="CVV"></b-input>
        </b-input-group>
      </b-form>
      <br />
      <b-form inline>
        <label class="sr-only" for="inline-form-input-name">Expiry Month</label>
        <b-input
          v-model="form.expiry_month"
          id="cardmonth"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="MM"
        ></b-input>

        <label class="sr-only" for="inline-form-input-username">Expiry Year</label>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-input v-model="form.expiry_year" id="cardyear" placeholder="YY"></b-input>
        </b-input-group>
      </b-form>
      <br />
      <b-form-checkbox v-model="form.save" class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>
      <br />
      <b-button @click="onSubmit" variant="primary">Pay</b-button>
      <br />
      <br />
      <!-- Set Credentials MODAL -->
      <div>
        <b-button outline-warning id="show-btn" @click="showModal">Set encryption keys</b-button>
        <b-modal ref="my-modal" hide-footer title="Set encryption credentials">
          <div class="d-block text-center">
            <b-form>
              <b-form-group id="card-input-group" label-for="pubkey">
                <b-form-input
                  id="pubkey"
                  v-model="payload.public_key"
                  required
                  placeholder="Enter public key"
                ></b-form-input>
              </b-form-group>
              <b-form-group id="card-input-group" label-for="enckey">
                <b-form-input
                  id="enckey"
                  v-model="payload.enckey"
                  required
                  placeholder="Enter encryption key"
                ></b-form-input>
              </b-form-group>
            </b-form>
          </div>
        </b-modal>
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
let headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE,PUT,POST,GET,OPTIONS",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  Authorization: "Bearer FLWSECK_TEST-a514d8f1abd080db1502a144f22954dc-X"
};

export default {
  data() {
    return {
      form: {
        card_number: "",
        pin: "",
        cvv: "",
        amount: 2000,
        expiry_month: "",
        expiry_year: "",
        tx_ref: "MC-" + new Date().getTime(),
        data: null,
        type: "card",
        redirect_url:
          "https://webhook.site/3ed41e38-2c79-4c79-b455-97398730866c",
        phone_number: "07033950328",
        email: "ekeneeze3@gmail.com",
        currency: "NGN"
      },
      payload: {
        public_key: "FLWPUBK-348ea9a0fef6ec91be8c3d323350f7fd-X",
        email: "ekene@gmail.com",
        country: "NG",
        currency: "NGN",
        enckey: "611d0eda25a3c931863d92c4"
      },
      // cardAuthModel:"",
      authmodel: {
        authorization: {
          mode: "pin",
          pin: ""
        }
      }
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      const chargePayload = { ...this.form, ...this.payload };
      const pinPayload = {
        ...this.form,
        ...this.payload,
        ...this.authmodel
      };
      const encryptPayload = payData => {
        axios
          .post("http://localhost:3311/encrypt", payData)
          .then(function(response) {
            const encrypted_payload = response.data;
            console.log(encrypted_payload);
            chargeCard(encrypted_payload);
          })
          .catch(function(e) {
            console.log(e);
          });
      };
      encryptPayload(chargePayload);

      const chargeCard = payload => {
        axios
          .post(
            "https://api.flutterwave.com/v3/charges?type=card",
            payload,
            headers
          )
          .then(function(chargeRes) {
            // HANDLE INITIAL CHARGE RESPONSE
            if (chargeRes.data) {
              console.log("Charge response returned");
              if (chargeRes.data.meta.authorization.mode === "pin") {
                console.log("PINPAYLOAD TO RE_ENCRYPT " + pinPayload);
                encryptPayload(pinPayload);
              } else if (
                chargeRes.data.meta.authorization.mode === "avs_noauth"
              ) {
                // HANDLE AVS CARD CHARGE
                console.log("AVS authmodel returned");
              } else if (
                chargeRes.data.meta.authorization.mode === "vbvsecure"
              ) {
                // HANDLE 3DS CARD CHARGE
                console.log("3DS authmodel returned");
              } else {
                console.log("Invalid Authmodel returned");
              }
              // HANDLE AUTHORIZED CHARGE RESPONSE
            } else if (chargeRes.data.data.flw_ref) {
              console.log("AUTHORIZED CHARGE RESPONSE BELOW");
              console.log(chargeRes);
              const flwRef = chargeRes.data.data.flw_ref;
              console.log(chargeRes.data.data.flw_ref);

              const OtpPayload = {
                otp: "12345",
                public_key: pinPayload.public_key
              };
              // VALIDATE PAYMENT
              axios
                .post(
                  `https://rave-api-v2.herokuapp.com/v3/charges/${flwRef}/validate`,
                  OtpPayload
                )
                .then(function(response) {
                  console.log(response);
                  if ((response.message = "Charge validated")) {
                    const txRef = response.data.data.tx_ref;
                    // NOW VERIFY PAYMENT

                    const SEC_KEY =
                      "FLWSECK-611d0eda25a3fdf506137831019c9197-X";
                    axios
                      .get(
                        `https://rave-api-v2.herokuapp.com/v3/transactions/${txRef}/verify`,
                        {
                          headers: {
                            Authorization: `Bearer ${SEC_KEY}`
                          }
                        }
                      )
                      .then(function(response) {
                        console.log("VERIFICATION RESPONSE " + response.data);
                        if (response.data.status === "successful") {
                          alert("Transaction verified");
                        }
                      })
                      .catch(function(error) {
                        console.log(error);
                        console.log(error.message);
                        console.log(error.response);
                      });
                  }
                })
                .catch(function(error) {
                  console.log(error);
                  console.log(error.message);
                  console.log(error.response);
                });
            } else {
              console.log("expected charge logic not feasible");
            }
          });
      };

      //......................... INDIVIDUAL CALLS
      // axios
      //   .post("http://localhost:3111/encrypt", chargePayload)
      //   .then(function(response) {
      //     const encrypted_payload = response.data;
      //     console.log(encrypted_payload);
      //     axios
      //       .post(
      //         "https://rave-api-v2.herokuapp.com/v3/charges",
      //         // "https://7fe721a8.ngrok.io/v3/charges",
      //         encrypted_payload,
      //         headers
      //       )
      //       .then(function(chargeRes) {
      //         console.log(chargeRes);
      //         // HANDLE PIN AUTH CARD CHARGES
      //         if (chargeRes.data.meta.authorization.mode === "pin") {
      //           const pinPayload = {
      //             ...this.form,
      //             ...this.payload,
      //             ...this.authmodel
      //           };
      //           console.log(pinPayload);
      //           // axios.post(
      //           //   "https://7fe721a8.ngrok.io/v3/charges",
      //           //   pinPayload,
      //           //   config
      //           // ).then(function(finalResponse){
      //           //   console.log(finalResponse)
      //           // }).catch(function(error){
      //           //   console.log(error.message)
      //           // })
      //           // HANDLE AVS CARD CHARGES
      //         } else if (
      //           chargeRes.data.meta.authorization.mode === "avs_noauth"
      //         ) {
      //           console.log("Authmodel is not PIN");
      //         } else if (chargeRes.data.meta.authorization.mode === "pin") {
      //         } else {
      //           console.log("No auth model returned");
      //         }
      //       })
      //       .catch(function(chargeError) {
      //         console.log(chargeError);
      //         console.log(chargeError.message);
      //         console.log(chargeError.response);
      //       });
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
    },
    showModal() {
      this.$refs["my-modal"].show();
    }
  }
};
</script>
