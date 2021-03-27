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
        <div class="detect p-col-6" @click="detect" >
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
export default {
  components: {},
  data() {
    return {
      file: null,
      size: null,
      check: false,
    };
  },
  computed: {
    ...mapGetters("application", ["getIsDetect"]),
  },

  methods: {
    ...mapActions("application", ["setIsDetect"]),

    closeFile() {
      this.file = null;
      document.getElementById("divDetect").style.border = "2px dashed grey";
      document.getElementById("divDetect").style.cursor = "not-allowed";
      document.getElementById("spanDetect").style.cursor = "not-allowed";
      document.getElementById("spanDetect").style.color = "grey";
    },
    chooseFile() {
      this.file = document.getElementById("choose_file").files[0];
      console.log(this.file);
      var totalBytes = this.file.size;
      if (totalBytes < 1000000) {
        this.size = Math.floor(totalBytes / 1000) + "KB";
      } else {
        this.size = Math.floor(totalBytes / 1000000) + "MB";
      }
      document.getElementById("divDetect").style.border = "2px dashed #8178d3";
      document.getElementById("divDetect").style.cursor = "pointer";
      document.getElementById("spanDetect").style.cursor = "pointer";
      document.getElementById("spanDetect").style.color = "#8178d3";
    },

    detect() {
      if (this.file != null) {
        const location = JSON.parse(localStorage.getItem("user")).locations[0].name;
        const token = localStorage.getItem("jwtToken");
        let formData = new FormData();
        formData.append("video", this.file);
        formData.append("token", token);
        formData.append("locationName", location);
        formData.append("recordDate", this.file.lastModified);
        const url = urlConstants.PYTHON_URL + "detect";
        axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        localStorage.setItem("detecting", true);
        this.setIsDetect(true); 
      }
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
  margin-left: 350px;
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

</style>
