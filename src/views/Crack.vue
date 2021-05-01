<template>
  <div class="p-grid">
    <div class="main-layout-details" style="width: 64.5%">
      <div class="card">
        <DataTable
          :rowHover="true"
          :scrollable="true"
          ref="dt"
          :value="getCrackListConfirm"
          dataKey="id"
          :paginator="true"
          :rows="5"
          :loading="loading"
          :globalFilterFields="[
            'locationName',
            'reporterName',
            'severity',
            'status',
            'crackId',
            'position',
          ]"
          v-model:filters="filters"
          filterDisplay="menu"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate=""
        >
          <div class="table-header" style="background-color: #ffffff">
            <h3
              class="p-m-2"
              style="color: #143178; font-weight: 400; font-size: 22px"
            >
              Cracks
            </h3>
            <span class="p-input-icon-left" style="margin: 2px">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
          <template #empty> No Cracks found. </template>
          <template #loading> Loading Crack, please wait... </template>
          <Column
            header="Id"
            style="max-width: 50px"
            headerStyle="max-width: 30px;border-radius:20px 0 0 20px"
          >
            <template #body="slotProps">
              {{ slotProps.data.crackId }}
            </template>
          </Column>
          <Column
            header="Image"
            headerStyle="max-width: 66px"
            style="max-width: 110px"
          >
            <template #body="slotProps">
              <img
                :src="slotProps.data.imageThumbnails"
                :alt="slotProps.data.imageThumbnails"
                class="product-image"
                style="width: 80px; height: 80px"
                @click="imageClick(slotProps.data.index)"
              />
            </template>
          </Column>
          <div v-if="!isStaff">
            <Column
              field="locationName"
              header="Area Name"
              :showFilterMatchModes="false"
              :showAddButton="false"
              headerStyle="max-width: 218px;"
              style="max-width: 250px"
              :showFilterOperator="false"
            >
              <template #body="slotProps">
                {{ slotProps.data.locationName }}
              </template>
              <template #filter="{ filterModel }">
                <InputText
                  type="text"
                  v-model="filterModel.value"
                  class="p-column-filter"
                  placeholder="Search"
                />
              </template>
            </Column>
          </div>
          <div v-else>
            <Column
              field="position"
              header="Position"
              :showFilterMatchModes="false"
              :showAddButton="false"
              headerStyle="max-width: 218px;"
              style="max-width: 250px"
              :showFilterOperator="false"
            >
              <template #body="slotProps">
                {{ slotProps.data.position }}
              </template>
              <template #filter="{ filterModel }">
                <InputText
                  type="text"
                  v-model="filterModel.value"
                  class="p-column-filter"
                  placeholder="Search"
                />
              </template>
            </Column>
          </div>

          <Column
            header="Severity"
            filterField="severity"
            :showFilterMatchModes="false"
            :filterMenuStyle="{ width: '14rem' }"
            bodyStyle="text-align: left"
            headerStyle="max-width: 93px;"
            style="max-width: 125px"
          >
            <template #body="{ data }">
              <span :class="stockClass(data)">
                {{ data.severity }}
              </span>
            </template>
            <template #filter="{ filterModel }">
              <div class="p-mb-3 p-text-bold">Severity Picker</div>
              <MultiSelect
                v-model="filterModel.value"
                :options="getSeveritysList"
                placeholder="Any"
                class="p-column-filter"
              >
                <template #option="slotProps">
                  <span>{{ slotProps.option }}</span>
                </template>
              </MultiSelect>
            </template>
          </Column>
          <Column
            header="Status"
            filterField="status"
            :showFilterMatchModes="false"
            :filterMenuStyle="{ width: '12rem' }"
            headerStyle="max-width: 126px;"
            style="max-width: 158px"
          >
            <template #body="{ data }">
              <span :class="stockStatus(data)">
                {{ data.status }}
              </span>
            </template>
            <template #filter="{ filterModel }">
              <div class="p-mb-3 p-text-bold">Status Picker</div>
              <MultiSelect
                v-model="filterModel.value"
                :options="getStatusList"
                placeholder="Any"
                class="p-column-filter"
              >
                <template #option="slotProps">
                  <span>{{ slotProps.option }}</span>
                </template>
              </MultiSelect>
            </template>
          </Column>
          <Column
            :filterMenuStyle="{ width: '5rem' }"
            headerStyle="border-radius:0 20px 20px 0;max-width: 126px;"
            style="max-width: 158px"
          >
            <template #body="slotProps">
              <Button
                icon="pi pi-eye"
                class="p-button-rounded p-button-info p-button-text p-mr-2"
                @click="showDetail(slotProps.data)"
                style="margin: 2px"
                v-tooltip.bottom="'View Crack Details'"
              />
              <Button
                icon="pi pi-video"
                class="p-button-rounded p-button-help p-button-text"
                @click="showVideo(slotProps.data)"
                v-tooltip.bottom="'View Detection Result'"
              />
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-info p-button-text"
                @click="showUpdateCrack(slotProps.data)"
                v-tooltip.bottom="'Update Crack'"
                v-if="isStaff && slotProps.data.status === 'UnrecordedRepair'"
              />
              <Button
                v-if="
                  slotProps.data.status == 'RecordedRepair' ||
                  slotProps.data.status == 'UnqualifiedRepair' ||
                  slotProps.data.status == 'Fixed'
                "
                icon="pi pi-calendar-minus"
                class="p-button-rounded p-button-danger p-button-text"
                @click="showMaintenanceOrder(slotProps.data)"
                v-tooltip.bottom="'View Repair Record'"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <Dialog
        v-model:visible="crackInfoDialog"
        :style="{ width: '800px' }"
        :modal="true"
        :baseZIndex="10000"
        :showHeader="false"
        :dismissableMask="true"
        class="dialog"
      >
        <div class="p-grid nested-grid">
          <div class="p-col-5">
            <div class="dialog-title-2">
              <span style="">Crack {{ product.crackId }}</span>
            </div>
            <img
              :src="product.imageThumbnails"
              :alt="product.imageThumbnails"
              class="product-image"
              v-if="product.image"
              @click="imageClick(product.index)"
              style="width: 270px; height: 76%"
            />
          </div>
          <div class="p-col-7">
            <TabView>
              <TabPanel header="Overview">
                <div class="p-grid">
                  <div class="p-col-6">
                    <p class="header-dialog-crack">Area Name</p>
                    <p style="font-weight: 600">{{ product.locationName }}</p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-dialog-crack">Position</p>
                    <p style="font-weight: 600">{{ product.position }}</p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-dialog-crack">Severity</p>
                    <p :class="stockClass(product)">
                      {{ product.severity }}
                    </p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-dialog-crack">Status</p>
                    <p :class="stockStatus(product)">
                      {{ product.status }}
                    </p>
                  </div>
                  <div class="p-col-6" v-if="product.censorName != null">
                    <p class="header-dialog-crack">Censor Name</p>
                    <p style="font-weight: 600">{{ product.censorName }}</p>
                  </div>
                  <div class="p-col-6" v-if="product.censorName != null">
                    <p class="header-dialog-crack">Update By</p>
                    <p style="font-weight: 600">{{ product.updateUserName }}</p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-dialog-crack">Created Date</p>
                    <p style="font-weight: 600">{{ product.created }}</p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-dialog-crack">Last Modified</p>
                    <p style="font-weight: 600">{{ product.lastModified }}</p>
                  </div>
                </div>
              </TabPanel>
              <TabPanel
                header="More details"
                :disabled="
                  (product.description == '' || product.description == null) &&
                    check
                "
              >
                <div style="height: 320px">
                  <div
                    class="desc-box"
                    v-if="
                      !(
                        product.description == '' || product.description == null
                      )
                    "
                  >
                    <p class="header-dialog-crack">Description</p>
                    <p>
                      <span
                        style="font-weight: bold"
                        v-if="product.description != null"
                        >{{ product.description }}</span
                      >
                    </p>
                  </div>
                  <div class="assessment-box" v-if="!check">
                    <p class="header-dialog-crack  p-mb-2">Assessment Result</p>
                    <div class="assessment-content">
                      <div class="p-mr-3">
                        <Knob
                          v-model="product.assessmentResult"
                          :max="100"
                          :min="0"
                          :size="120"
                          readonly="true"
                        />
                      </div>
                      <div>
                        <p class="header-dialog-crack">Point</p>
                        <p style="font-weight: 600;margin-bottom:10px">
                          {{ product.assessmentResult }} /100
                        </p>
                        <p class="header-dialog-crack">
                          Assessment description
                        </p>
                        <p style="font-weight: 600">
                          <span
                            v-if="
                              product.assessmentDescription != null &&
                                product.assessmentDescription != ''
                            "
                            >{{ product.assessmentDescription }}</span
                          >
                          <span
                            v-else
                            style="font-style: italic; color: #adadad"
                            >No description</span
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </Dialog>
      <Galleria
        :value="getCrackListConfirm"
        :numVisible="7"
        containerStyle="max-width: 850px"
        :circular="true"
        :fullScreen="true"
        :showItemNavigators="true"
        :showThumbnails="false"
        v-model:visible="displayCustom"
        v-model:activeIndex="activeIndex"
      >
        <template #item="slotProps">
          <img
            :src="slotProps.item.image"
            style="width: 1100px; display: block"
          />
          <button
            type="button"
            class="buttonView p-link"
            v-tooltip.right="'View Crack Details'"
            @click="showDetail(slotProps.item)"
          >
            <i class="pi pi-fw pi-eye" style="fontsize: 2rem"></i>
          </button>
        </template>
        <template #thumbnail="slotProps">
          <img :src="slotProps.item.imageThumbnails" style="display: block" />
        </template>
      </Galleria>
      <Dialog
        v-model:visible="updateCrackDialog"
        :style="{ width: '700px' }"
        :modal="true"
        class="dialog"
        :showHeader="false"
        :dismissableMask="true"
      >
        <div class="p-grid nested-grid">
          <div class="p-col-5">
            <div class="dialog-title-2">
              <span style="">Update Crack {{ product.crackId }}</span>
            </div>
            <img
              :src="product.imageThumbnails"
              :alt="product.imageThumbnails"
              class="product-image"
              v-if="product.image"
              @click="imageClick(product.index)"
              style="width: 250px; margin-left: 12px"
            />
          </div>
          <div class="p-col-7">
            <div class="p-col-12" style="margin-top:80px">
              <label class="form-control-label">Position</label>
              <InputText
                v-model.trim="position"
                class="form-control form-control-alternative"
                style="width: 100%"
                placeholder="Position"
              />
              <small class="p-invalid">{{ errors.position }}</small>
            </div>
            <div class="p-col-12">
              <label class="form-control-label">Description (Optional)</label>
              <InputText
                v-model.trim="description"
                class="form-control form-control-alternative"
                style="width: 100%"
                placeholder="Description"
              />
              <small class="p-invalid">{{ errors.description }}</small>
            </div>
            <div class="p-col-12">
              <label class="form-control-label serverity">Severity</label><br />
              <div
                v-for="category of getSeveritysList"
                :key="category.key"
                class="p-field-radiobutton"
              >
                <RadioButton
                  :id="category.key"
                  name="category"
                  :value="category"
                  v-model="selectedSeverity"
                />
                <label :for="category.key">{{ category }}</label>
              </div>
              <small class="p-invalid">{{ errors.selectedSeverity }}</small>
            </div>
            <div>
              <Button
                label="Cancel"
                @click="updateCrackDialog = False"
                icon="pi pi-times"
                style="
                  background-color: #fae9ed;
                  border: none;
                  color: #e15b7a;
                  margin-right: 20px;
                "
              />
              <Button
                label="Update"
                @click="updateCrack"
                icon="pi pi-check"
                style="background-color: #ebf8f1; border: none; color: #4cc788"
              />
            </div>
          </div>
        </div>
      </Dialog>
      <Toast position="bottom-right" />
    </div>
    <div style="width: 34%;margin-left:20px">
      <div class="main-layout-details" style="margin-bottom: 20px">
        <div class="chart-title">
          <span>Cracks By Severity {{ getCurrentPeriod }}</span>
        </div>
        <ChartSeverity
          :data="filterChart.data"
          :key="filterChart.check"
        ></ChartSeverity>
      </div>
      <div class="main-layout-details">
        <div class="chart-title">
          <span>Cracks By Status {{ getCurrentPeriod }}</span>
        </div>
        <ChartStatus :data="filterChart" :key="filterChart.check"></ChartStatus>
      </div>
    </div>
  </div>
</template>

<script>
import Knob from "primevue/knob";
import Button from "primevue/button";
import MultiSelect from "primevue/multiselect";
import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { mapGetters, mapActions } from "vuex";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Galleria from "primevue/galleria";
import crackApi from "../apis/cracks.js";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import webRole from "../util/webRole.js";
import Toast from "primevue/toast";
import ChartSeverity from "../chart/CrackBySeveritySmall.vue";
import ChartStatus from "../chart/CrackByStatusSmall.vue";
import contentNoti from "../util/contentNoti.js";

export default {
  setup() {
    const schema = yup.object({
      position: yup
        .string()
        .max(50)
        .label("Position")
        .required(),
      selectedSeverity: yup
        .string()
        .label("Severity")
        .required(),
      description: yup
        .string()
        .max(100)
        .label("Description")
        .nullable(),
    });
    const { errors, meta, handleReset, isSubmitting, validate } = useForm({
      validationSchema: schema,
    });

    const { value: position } = useField("position");
    const { value: description } = useField("description");
    const { value: selectedSeverity } = useField("selectedSeverity");

    return {
      handleReset,
      position,
      description,
      selectedSeverity,
      errors,
      meta,
      isSubmitting,
      validate,
    };
  },

  components: {
    Button,
    MultiSelect,
    TabView,
    TabPanel,
    Knob,
    Galleria,
    Toast,
    ChartSeverity,
    ChartStatus,
  },
  computed: {
    ...mapGetters("crack", [
      "getCrackListConfirm",
      "getStatusList",
      "getSeveritysList",
    ]),

    isStaff() {
      let role = JSON.parse(localStorage.getItem("user")).role;
      if (webRole.STAFF_ROLE === role) return true;
      return false;
    },

    getCurrentPeriod() {
      return (
        " Period " +
        this.filterChart.period +
        "/" +
        this.filterChart.selectedYear
      );
    },
  },
  data() {
    return {
      image: null,
      crackInfoDialog: false,
      showAssessment: false,
      product: {},
      filters: {},
      submitted: false,
      messages: [],
      loading: true,
      check: true,
      displayCustom: false,
      activeIndex: 0,
      updateCrackDialog: false,
      filterChart: {
        selectedYear: null,
        selectedLocation: [],
        period: "",
        data: null,
        check: 0,
      },
    };
  },
  async created() {
    this.initFilters();
    await this.setCrackList().then(() => {
      this.loading = false;
    });
    await this.filter();
  },
  methods: {
    ...mapActions("crack", ["setCrackList"]),

    imageClick(index) {
      this.crackInfoDialog = false;
      this.activeIndex = index - 1;
      this.displayCustom = true;
    },

    async filter() {
      let date = new Date();
      this.filterChart.selectedYear = date.getFullYear();
      if (date.getMonth() < 4) {
        this.filterChart.period = 1;
      } else if (date.getMonth() < 8) {
        this.filterChart.period = 2;
      } else if (date.getMonth() < 12) {
        this.filterChart.period = 3;
      }
      let user = JSON.parse(localStorage.getItem("user"));

      this.filterChart.selectedLocation.locationId = user.locations.map(
        (l) => l.locationId
      );
      this.filterChart.data = this.filterChart.selectedLocation.slice();
      this.filterChart.data.push(this.filterChart.period);
      this.filterChart.data.push(this.filterChart.selectedYear);
      this.filterChart.check++;
    },

    stockClass(data) {
      return [
        {
          low: data.severity === "Low",
          medium: data.severity === "Medium",
          high: data.severity === "High",
        },
      ];
    },
    showVideo(product) {
      this.$router.push(
        "/detection-result-details?detectionResultId=" + product.flightId
      );
    },
    stockStatus(data) {
      return [
        {
          detectedFailed: data.status === "DetectedFailed",
          unconfirmed: data.status === "Unconfirmed",
          unscheduled: data.status === "UnrecordedRepair",
          scheduledformaintenace: data.status === "RecordedRepair",
          fix: data.status === "Fixed",
          unqualifiedRepair: data.status === "UnqualifiedRepair",
        },
      ];
    },
    hideDialog() {
      this.showAssessment = false;
      this.crackInfoDialog = false;
      this.submitted = false;
    },
    showMaintenanceOrder(product) {
      this.product = { ...product };
      this.$router.push(
        "/repair-records?repairRecordId=" + this.product.maintenanceOrderId
      );
    },
    showDetail(product) {
      this.displayCustom = false;
      this.product = { ...product };
      if (
        this.product.assessmentResult != null &&
        this.product.assessmentResult != ""
      ) {
        this.check = false;
      } else {
        this.check = true;
      }
      this.product.created = this.callDate(this.product.created);
      this.product.lastModified = this.callDate(this.product.lastModified);
      this.crackInfoDialog = true;
    },
    showUpdateCrack(product) {
      this.handleReset();
      this.selectedSeverity = product.severity;
      this.product = product;
      this.description = product.description;
      this.position = product.position;
      this.updateCrackDialog = true;
    },

    async updateCrack() {
      if (
        this.meta.valid &&
        this.position != null &&
        this.selectedSeverity != null
      ) {
        await crackApi
          .verifyCrack(
            this.product.crackId,
            this.position,
            this.description,
            this.selectedSeverity
          )
          .then(async (res) => {
            if (res.status == 200) {
              if (this.selectedSeverity === "High") {
                await crackApi
                  .addHighSeverityToQueue(this.product.crackId)
                  .then((res1) => {
                    if (res1.status == 200) {
                      this.$toast.add({
                        severity: "success",
                        summary: contentNoti.SUCCESS_SUMMARY,
                        detail: contentNoti.CRACK_UPDATE_SUCCESS,
                        life: 3000,
                      });
                    }
                  });
              } else if (this.selectedSeverity === "Low") {
                await crackApi
                  .remomveLowSeverity(this.product.crackId)
                  .then((res2) => {
                    if (res2.status == 200) {
                      this.$toast.add({
                        severity: "success",
                        summary: contentNoti.SUCCESS_SUMMARY,
                        detail: contentNoti.CRACK_UPDATE_SUCCESS,
                        life: 3000,
                      });
                    }
                  });
              } else {
                this.$toast.add({
                  severity: "success",
                  summary: contentNoti.SUCCESS_SUMMARY,
                  detail: contentNoti.CRACK_UPDATE_SUCCESS,
                  life: 3000,
                });
              }
              this.setCrackList();
              this.updateCrackDialog = false;
            } else {
              this.$toast.add({
                severity: "error",
                summary: contentNoti.FAIL_SUMMARY,
                detail: contentNoti.CRACK_UPDATE_FAILED,
                life: 3000,
              });
              this.updateCrackDialog = false;
            }
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.CRACK_UPDATE_FAILED,
              life: 3000,
            });
            this.updateCrackDialog = false;
          });
      } else {
        this.validate();
      }
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY HH:mm:ss");
    },

    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        locationName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        position: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        severity: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.IN },
        accuracy: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.GREATER_THAN },
          ],
        },
      };
    },
    filterDate(value, filter) {
      if (
        filter === undefined ||
        filter === null ||
        (typeof filter === "string" && filter.trim() === "")
      ) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      let tmp = this.callDate(value).substring(0, 10);
      return tmp === this.formatDate(filter);
    },
    formatDate(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (month < 10) {
        month = "0" + month;
      }

      if (day < 10) {
        day = "0" + day;
      }
      return day + "-" + month + "-" + date.getFullYear();
    },
  },
};
</script>

<style scoped>
.serverity {
  margin-bottom: 10rem;
  text-align: center;
}
.p-field-radiobutton {
  display: inline-block;
  margin-right: 3.4rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #525f7f;
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
.form-control {
  font-size: 0.875rem;
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
.form-control:focus {
  color: #8898aa;
  border-color: rgba(50, 151, 211, 0.25);
  outline: 0;
  background-color: #fff;
  box-shadow: none, none;
}

.focused .form-control {
  border-color: rgba(50, 151, 211, 0.25);
}
.form-control:disabled,
.form-control[readonly] {
  opacity: 1;
  background-color: #ebf0f5;
}
.form-control-alternative {
  transition: box-shadow 0.15s ease;
  border: 0;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
}
.form-control-alternative:focus {
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-width: 0 0 0 0;
  color: #69707a;
  padding: 1rem;
  font-weight: 700;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.product-image {
  width: 100px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 150px;
  min-height: 320px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
}
textarea {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none; /*remove the resize handle on the bottom right*/
}
.low {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #25c997;
  background-color: #e2fff6;
  text-align: center;
  width: 80px;
}

.medium {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.3px;
  color: #ffb455;
  background-color: #fff4de;
  text-align: center;
  width: 80px;
  text-transform: uppercase;
}

.high {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #ff0019;
  text-align: center;
  width: 80px;
  background-color: #ffe2e5;
}
.buttonView {
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  color: white;
  background: transparent;
  width: 4rem;
  height: 4rem;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
  border-radius: 50%;
  margin: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttonView:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
}

.detectedFailed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #ff5252;
}
.unconfirmed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: rgb(51, 204, 255);
  text-transform: uppercase;
}
.unscheduled {
  border-radius: 2px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #33ccff;
  text-transform: uppercase;

  /* text-align: center;
  width: 110px;
    background-color:#b9eee9; */
}
.header-dialog-crack {
  font-weight: 400;
  color: grey;
  margin-bottom: 5px;
}
.scheduledformaintenace {
  border-radius: 2px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #9933ff;
  font-size: 14px;
  text-transform: uppercase;

  /* text-align: center;
  width: 110px;
    background-color:#e1f0ff; */
}
.fix {
  border-radius: 2px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #00e600;
  text-transform: uppercase;

  /* text-align: center;
  width: 110px;
    background-color:#c7d7db; */
}
.unqualifiedRepair {
  border-radius: 2px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #ff99ff;
  text-transform: uppercase;
}

.dialog-title {
  color: #69707a;
  margin-left: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-title-2 {
  width: 300px;
  height: 30px;
  border-radius: 10px;
  margin: 10px 0 40px 25px;
}
.dialog-title-2 span {
  padding-top: 3px;
  font-weight: 600;
  font-size: 18px;
  font-family: Poppins;
}
.dialog-title-2 span::before {
  content: "";
  width: 5px;
  height: 12px;
  display: block;
  border-radius: 3px;
  padding-bottom: 10px;
  position: relative;
  left: -10px;
  top: 25px;
  background: #007dfe;
}

.p-dialog-titlebar {
  background: black;
}

.p-m-2::before,
.dialog-title::before {
  content: "";
  width: 5px;
  height: 12px;
  display: block;
  border-radius: 3px;
  padding-bottom: 10px;
  position: relative;
  left: -10px;
  top: 0;
  background: #007dfe;
}

.p-m-2 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-grid .nested-grid {
  min-height: 320px;
}

::v-deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f2f9ff;
  color: #4ca4f9;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-width: 0 0 0 0;
  text-align: left;
  box-sizing: content-box;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  justify-content: left;
  align-items: center;
}
::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: left;
  border: 1px solid #e9ecef;
  border-width: 0 0 0 0;
  padding: 1rem 1rem;
  display: flex;

  justify-content: left;
  align-items: center;
}

::v-deep(.p-datatable.p-datatable-hoverable-rows
    .p-datatable-tbody
    > tr:not(.p-highlight):hover) {
  background: rgba(119, 123, 241, 0.1);
}

::v-deep(.p-column-filter-menu-button:hover) {
  color: #2170e7;
}

::v-deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
}

::v-deep(.p-button) {
  background: #464df2;
  color: #ffffff;
  border: 1px solid #464df2;
  margin: 0;
  outline: 0 none;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
}

::v-deep(.p-button.p-button-success, .p-buttonset.p-button-success
    > .p-button, .p-splitbutton.p-button-success > .p-button) {
  color: #ffffff;
  background: #55e757;
  border: 1px solid #55e757;
}

::v-deep(.p-button.p-button-info, .p-buttonset.p-button-info
    > .p-button, .p-splitbutton.p-button-info > .p-button) {
  color: #ffffff;
  background: #7fb4fa;
  border: 1px solid #7fb4fa;
}

::v-deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: rgba(70, 77, 242, 0.9);
  color: #ffffff;
}

::v-deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  padding: 0;
  border: 1px solid transparent;
  text-align: center;
  line-height: 2.286em;
  min-width: 2.286em;
  height: 2.286em;
  color: #83888f;
  margin: 0 0.125em;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
}

::v-deep(.p-dialog .p-dialog-header) {
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
}

::v-deep(.p-dialog) {
  border-radius: 24px;
}

::v-deep(.p-dialog .p-dialog-content) {
  border-radius: 24px;
  min-height: 470px;
}
::v-deep(.p-tabview .p-tabview-nav) {
  margin-top: 20px;
}

::v-deep(.p-tabview .p-tabview-panels) {
  color: #69707a;
}

::v-deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  color: #2170e7;
}

::v-deep(.p-tabview .p-tabview-panels .p-grid .p-col-6) {
  margin: 10px 0;
}

::v-deep(.p-tabview .p-tabview-panels .p-grid .p-col-12) {
  margin: 10px 0;
}
.flex-wrapper {
  display: flex;
  flex-flow: row nowrap;
}

.single-chart {
  width: 33%;
  justify-content: space-around;
}

.assessment-box {
  display: flex;
  flex-direction: column;
}

.assessment-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.desc-box {
  height: 50%;
}

.circular-chart {
  display: block;
  margin: 10px auto;
  max-width: 80%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 2.8;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.circular-chart.orange .circle {
  stroke: #ff9f00;
}

.circular-chart.green .circle {
  stroke: #06b5dd;
}

.circular-chart.blue .circle {
  stroke: #3c9ee5;
}

.percentage {
  fill: #666;
  font-family: sans-serif;
  font-size: 0.5em;
  text-anchor: middle;
}

::v-deep(.p-datatable .p-paginator-bottom) {
  border-width: 0 0 0 0;
}

.main-layout-details {
  border-radius: 24px;
  background-color: white;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
.active .main-layout-details {
  margin-left: 266.5px;
  transition: all 0.2s;
}
.inactive .main-layout-details {
  margin-left: 0;
  transition: all 0.2s;
}
.single-chart {
  width: 70px;
}
.chart-title {
  color: gray;
  font-size: 20px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.p-invalid {
  color: red;
  font-size: 0.8 rem;
  text-align: left !important;
}
</style>
