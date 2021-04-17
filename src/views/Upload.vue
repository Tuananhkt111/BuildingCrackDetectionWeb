<template>
  <div class="app">
    <div class="wrapper">
      <div class="title">
        File Upload
      </div>
      <div class="file_upload_list">
        <ul>
          <li>
            <div class="file_item" v-if="file">
              <div class="format">
                <p>MP4</p>
              </div>
              <div class="file_progress">
                <div class="file_info">
                  <div class="file_name">
                    {{ file.name }}
                  </div>
                  <div class="file_size_wrap" @click="closeFile">
                    <div class="file_size">{{ size }}</div>
                    <div class="file_close">X</div>
                  </div>
                </div>
                <div class="progress">
                  <div class="inner_progress" style="width: 100%;"></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <p class="invalid" style="padding-top: 10px">{{ wrongFormatFile }}</p>
      <div class="des-field">
        <InputText
          id="description"
          v-model.trim="description"
          required="true"
          class="form-control form-control-alternative"
          placeholder="Description"
        />
        <p class="invalid">{{ errors.description }}</p>
      </div>
      <div class="p-grid">
        <div class="choose_file p-col-6">
          <label for="choose_file">
            <input
              type="file"
              id="choose_file"
              name="choose_file"
              @change="chooseFile"
              accept="video/mp4"
            />
            <span>Choose File</span>
          </label>
        </div>
        <div class="detect p-col-6" @click="detect">
          <label for="detect" id="divDetect">
            <span id="spanDetect">Detect</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import urlConstants from "../util/urlConstants";
import axios from "axios";
import flightApi from "../apis/flights";
import * as yup from "yup";
import { useForm, useField } from "vee-validate";
import moment from "moment";

export default {
  setup() {
    const schema = yup.object({
      description: yup
        .string()
        .label("Description")
        .required()
        .max(40),
    });

    const { errors, meta, handleReset, validate } = useForm({
      validationSchema: schema,
    });

    const { value: description } = useField("description");

    return {
      description,
      errors,
      meta,
      handleReset,
      validate,
    };
  },

  components: {},
  data() {
    return {
      file: null,
      size: null,
      check: false,
      polling: null,
      wrongFormatFile: "",
    };
  },

  created() {
    this.pollData();
  },

  computed: {
    ...mapGetters("application", ["getVideo"]),
  },

  methods: {
    ...mapActions("application", ["setVideo"]),
    ...mapActions("flight", ["setFlightList"]),

    closeFile() {
      this.file = null;
      document.getElementById("choose_file").value = null;
      document.getElementById("divDetect").style.border = "2px dashed grey";
      document.getElementById("divDetect").style.cursor = "not-allowed";
      document.getElementById("spanDetect").style.cursor = "not-allowed";
      document.getElementById("spanDetect").style.color = "grey";
    },
    async chooseFile() {
      this.file = null;
      const tmp = document.getElementById("choose_file").files[0];
      if (tmp.type == "video/mp4") {
        this.file = document.getElementById("choose_file").files[0];
        let user = JSON.parse(localStorage.getItem("user"));
        let videoName = user.locations[0].name;
        videoName +=
          " " +
          moment(this.file.lastModifiedDate).format("DD-MM-YYYY HH_mm_ss");
        let res = await flightApi.checkExistsInDb(videoName);
        if (res && res.data === "Video exists") {
          this.$toast.add({
            severity: "error",
            summary: "Failed",
            detail: "Video exists",
            life: 3000,
          });
          this.file = null;
          document.getElementById("choose_file").value = null;
        } else {
          this.wrongFormatFile = "";
          var totalBytes = this.file.size;
          if (totalBytes < 1000000) {
            this.size = Math.floor(totalBytes / 1000) + "KB";
          } else {
            this.size = Math.floor(totalBytes / 1000000) + "MB";
          }
          document.getElementById("divDetect").style.border =
            "2px dashed #8178d3";
          document.getElementById("divDetect").style.cursor = "pointer";
          document.getElementById("spanDetect").style.cursor = "pointer";
          document.getElementById("spanDetect").style.color = "#8178d3";
        }
      } else {
        this.wrongFormatFile = " Wrong format file";
      }
    },

    async detect() {
      if (
        this.meta.valid &&
        this.file != null &&
        this.description !== null &&
        this.description !== ""
      ) {
        const location = JSON.parse(localStorage.getItem("user")).locations[0]
          .name;
        const token = localStorage.getItem("jwtToken");
        let formData = new FormData();
        formData.append("video", this.file);
        formData.append("token", token);
        formData.append("description", this.description);
        formData.append("locationName", location);
        formData.append("recordDate", this.file.lastModified);
        const url = urlConstants.PYTHON_URL + "detect";
        axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        let user = JSON.parse(localStorage.getItem("user"));
        let videoName = user.locations[0].name;
        videoName += " " + moment(this.file.lastModifiedDate).format("DD-MM-YYYY HH_mm_ss");
        this.setVideo(videoName);
        localStorage.setItem("video", this.getVideo);
        await this.pollData();
      } else {
        this.validate();
      }
    },

    async pollData() {
      this.polling = setInterval(async () => {
        let res = await flightApi.checkExists(this.getVideo);
        if (res && res.data === "Video exists") {
          clearInterval(this.polling);
          this.setVideo(null);
          localStorage.removeItem("video");
          this.setFlightList();
        }
      }, 60000);
      setTimeout(() => {
        clearInterval(this.polling);
      }, 36000000);
    },
  },
};
</script>

<style scoped>
* {
  list-style: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #8178d3;
  color: #63686e;
}

.wrapper {
  width: 500px;
  background: #fff;
}

.title {
  background: #f3f4f8;
  padding: 15px;
  font-size: 18px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
}
.file_upload_list li .file_item {
  display: flex;
  border: 1px solid #f3f4f8;
  padding: 15px 20px;
  margin-top: 10px;
}
.file_item .format {
  background: #8178d3;
  border-radius: 10px;
  width: 45px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  font-size: 12px;
  margin-right: 15px;
}

.file_item .file_progress {
  width: calc(100% - 60px);
  font-size: 14px;
}

.file_item .file_info,
.file_item .file_size_wrap {
  display: flex;
  align-items: center;
}
.file_item .file_info {
  justify-content: space-between;
}
.file_item .file_progress .progress {
  width: 100%;
  height: 4px;
  background: #efefef;
  overflow: hidden;
  border-radius: 5px;
  margin-top: 8px;
  position: relative;
}

.file_item .file_progress .progress .inner_progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #58e380;
}
.file_item .file_size_wrap .file_size {
  margin-right: 15px;
}
.file_item .file_size_wrap .file_close {
  border: 1px solid #8178d3;
  color: #8178d3;
  width: 20px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
}

.file_item .file_size_wrap .file_close:hover {
  background: #8178d3;
  color: #fff;
}

.choose_file label {
  display: block;
  border: 2px dashed #8178d3;
  padding: 15px;
  width: calc(100% - 20px);
  margin: 10px;
  text-align: center;
  cursor: pointer;
}
.choose_file #choose_file {
  outline: none;
  opacity: 0;
  width: 0;
}
.choose_file span {
  font-size: 14px;
  color: #8178d3;
}

.detect label {
  display: block;
  border: 2px dashed grey;
  padding: 15px;
  width: calc(100% - 20px);
  margin: 10px;
  text-align: center;
  cursor: not-allowed;
}

.detect #detect {
  outline: none;
  opacity: 0;
  width: 0;
}
.detect span {
  font-size: 14px;
  color: grey;
  cursor: not-allowed;
}

.app {
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-control {
  font-size: 1rem;
  line-height: 1.5;
  display: block;
  width: 100%;
  height: calc(2.75rem + 2px);
  padding: 0.625rem 0.75rem;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  color: #8898aa;
  border: 1px solid #cad1d7;
  border-radius: 0.375rem;
  background-color: #fff;
  background-clip: padding-box;
  box-shadow: none;
}
@media screen and (prefers-reduced-motion: reduce) {
  .form-control {
    transition: none;
  }
}
.form-control::-ms-expand {
  border: 0;
  background-color: transparent;
}
.form-control:focus {
  color: #8898aa;
  border-color: rgba(50, 151, 211, 0.25);
  outline: 0;
  background-color: #fff;
  box-shadow: none, none;
}
.form-control:-ms-input-placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control::-ms-input-placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control::placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control:disabled,
.form-control[readonly] {
  opacity: 1;
  background-color: #ebf0f5;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-inline {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}
@media (min-width: 576px) {
  .form-inline label {
    display: flex;
    margin-bottom: 0;
    align-items: center;
    justify-content: center;
  }
  .form-inline .form-group {
    display: flex;
    margin-bottom: 0;
    flex: 0 0 auto;
    flex-flow: row wrap;
    align-items: center;
  }
  .form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }
}
.form-control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #525f7f;
}
.form-control {
  font-size: 0.875rem;
}
.form-control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #525f7f;
}
.form-control:-ms-input-placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control::placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control:focus:-ms-input-placeholder {
  color: #adb5bd;
}
.form-control:focus::placeholder {
  color: #adb5bd;
}

.des-field {
  margin-top: 10px;
}

.invalid {
  color: red;
  position: sticky;
  left: 5px !important;
}
</style>
