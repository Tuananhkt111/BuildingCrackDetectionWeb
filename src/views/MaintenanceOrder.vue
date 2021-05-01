<template>
  <div class="p-grid">
    <div class="chart-box">
      <div class="main-layout-details" style="width: 29%">
        <div class="chart-title">
          <span>Repair Records By Status {{ getCurrentPeriod }}</span>
        </div>
        <ChartStatus :data="filterChart" :key="filterChart.check"></ChartStatus>
      </div>
      <div class="main-layout-details" style="width: 70%">
        <div class="chart-title">
          <span>Repair Records Timeline</span>
        </div>
        <OrderTimeline :parentMethod="editProduct"></OrderTimeline>
      </div>
    </div>
    <div class="main-layout-details">
      <div class="card">
        <DataTable
          ref="dt"
          dataKey="maintenanceOrderId"
          :value="getMaintenanceOrderList"
          v-model:expandedRows="expandedRows"
          @row-expand="onRowExpand"
          @row-collapse="onRowCollapse"
          :paginator="true"
          :rows="5"
          :rowHover="true"
          v-model:filters="filters"
          filterDisplay="menu"
          :globalFilterFields="[
            'maintenanceWorkerName',
            'locationName',
            'status',
            'maintenanceOrderId',
            'maintenanceExpense'
          ]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate=""
        >
          <div class="table-header-main">
            <h3
              class="p-m-2"
              style="color: #143178;font-weight: 400;font-size:22px"
            >
              Repair Records
            </h3>
            <span class="p-input-icon-left">
              <span class="p-input-icon-left" style="margin: 2px">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </span>
            </span>
          </div>
          <template #empty> No Repair Record found. </template>
          <Column
            :expander="true"
            headerStyle="width: 30px;border-radius: 20px 0 0 20px"
          />
          <Column header="Id" style="width:2rem">
            <template #body="slotProps">
              {{ slotProps.data.maintenanceOrderId }}
            </template>
          </Column>
          <Column
            field="maintenanceWorkerName"
            header="Repairer"
            :showFilterMatchModes="false"
            :showAddButton="false"
            :showFilterOperator="false"
          >
            <template #body="slotProps">
              {{ slotProps.data.maintenanceWorkerName }}
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
          <div v-if="!isStaff">
            <Column
              field="locationName"
              header="Area Name"
              :showFilterMatchModes="false"
              :showAddButton="false"
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
              field="maintenanceExpense"
              header="Repair Expense"
              :showFilterMatchModes="false"
              :showAddButton="false"
              :showFilterOperator="false"
            >
              <template #body="slotProps">
                {{
                  slotProps.data.maintenanceExpense.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }}
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
            header="Status"
            filterField="status"
            :showFilterMatchModes="false"
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <span :class="stockStatusOrder(data)">
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
            header="Repair Date"
            filterField="maintenanceDate"
            dataType="date"
            style="min-width: 20px"
            headerStyle="width: 13em"
            :showAddButton="false"
            :showFilterOperator="false"
          >
            <template #body="{ data }">
              {{ callDate(data.maintenanceDate) }}
            </template>
            <template #filter="{ filterModel }">
              <Calendar
                v-model="filterModel.value"
                dateFormat="dd/mm/yy"
                placeholder="dd/mm/yyyy"
              />
            </template>
          </Column>
          <Column headerStyle="width: 5em;border-radius:0 20px 20px 0">
            <template #body="slotProps">
              <Button
                icon="pi pi-eye"
                class="p-button-rounded p-button-info p-button-text"
                @click="editProduct(slotProps.data)"
                v-tooltip.bottom="'View Record Details'"
              />
            </template>
          </Column>
          <template #expansion="slotProps">
            <div class="orders-subtable">
              <div class="table-header">
                <h3
                  class="p-m-3"
                  id="sub-table-title"
                  style="color: #143178;font-weight: 400;font-size:18px"
                >
                  List of Cracks
                </h3>
              </div>
              <DataTable :value="slotProps.data.cracks">
                <Column
                  header="Id"
                  style="width:3rem"
                  headerStyle="border-radius:20px 0 0 20px"
                >
                  <template #body="slotProps">
                    {{ slotProps.data.crackId }}
                  </template>
                </Column>
                <Column
                  header="Image"
                  headerStyle="width: 150px;"
                  class="small"
                >
                  <template #body="slotProps">
                    <img
                      :src="slotProps.data.imageThumbnails"
                      :alt="slotProps.data.imageThumbnails"
                      class="product-image"
                      style="width:80px; height: 80px;"
                      @click="showImage(slotProps.data)"
                    />
                  </template>
                </Column>
                <Column
                  field="severity"
                  headerStyle=""
                  header="Severity"
                  sortable
                >
                  <template #body="slotProps">
                    <span :class="stockClass(slotProps.data)">
                      {{ slotProps.data.severity }}
                    </span>
                  </template>
                </Column>
                <Column field="status" headerStyle="" header="Status" sortable>
                  <template #body="slotProps">
                    <span :class="stockStatus(slotProps.data)">
                      {{ slotProps.data.status }}
                    </span>
                  </template>
                </Column>
                <Column
                  field="created"
                  headerStyle=""
                  header="Created Date"
                  sortable
                >
                  <template #body="slotProps">
                    <span>{{ callDate(slotProps.data.created) }}</span>
                  </template>
                </Column>
                <Column
                  :filterMenuStyle="{ width: '5rem' }"
                  headerStyle="border-radius:0 20px 20px 0; "
                >
                  <template #body="slotProps">
                    <Button
                      icon="pi pi-eye"
                      @click="showDetail(slotProps.data)"
                      class="p-button-rounded p-button-info p-button-text"
                      v-tooltip.bottom="'View Crack Details'"
                    />

                    <Button
                      icon="pi pi-video"
                      @click="showVideo(slotProps.data)"
                      class="p-button-rounded p-button-help p-button-text"
                      v-tooltip.bottom="'View Detection Result'"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </template>
        </DataTable>
      </div>
      <Dialog
        v-model:visible="productDialog"
        :style="{ width: '700px' }"
        :modal="true"
        :showHeader="false"
        :dismissableMask="true"
        class="dialog"
      >
        <div class="dialog-title-2">
          <span style="">Repair Record {{product.maintenanceOrderId}}</span>
        </div>
        <div class="p-col-12 order-detail">
          <div class="p-grid nested-grid">
            <TabView>
              <TabPanel header="Overview">
                <div class="p-grid record-content">
                  <div class="p-col-6">
                    <p class="header-detail">Repairer</p>
                    <p style="font-weight: 600">
                      {{ product.maintenanceWorkerName }}
                    </p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-detail">Area Name</p>
                    <p style="font-weight: 600">{{ product.locationName }}</p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-detail">Status</p>
                    <p :class="stockStatusOrder(product)" style="width:150px">
                      {{ product.status }}
                    </p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-detail">Repair Date</p>
                    <p style="font-weight: 600">
                      {{ product.maintenanceDate }}
                    </p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-detail">Create By</p>
                    <p style="font-weight: 600">{{ product.createUserName }}</p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-detail">Created</p>
                    <p style="font-weight: 600">
                      {{ callDate(product.created) }}
                    </p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-detail">Expense</p>
                    <p style="font-weight: 600">
                      {{
                        product.maintenanceExpense.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      }}
                    </p>
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="More details">
                <div class="p-grid record-content" style="height: 320px">
                  <div class="desc-box p-col-6">
                    <p class="header-dialog-crack p-mb-2">Description</p>
                    <p>
                      <span
                        style="font-weight: bold"
                        v-if="
                          !(
                            product.description == '' ||
                            product.description == null
                          )
                        "
                        >{{ product.description }}</span
                      >
                      <span v-else style="font-style: italic; color: #adadad"
                        >No description</span
                      >
                    </p>
                  </div>
                  <div class="assessment-box p-col-6" v-if="check">
                    <p class="header-dialog-crack p-mb-2">Assessment Result</p>
                    <div class="assessment-content">
                      <span style="font-style: italic; color: #adadad">
                        No assessment result yet
                      </span>
                    </div>
                  </div>
                  <div class="assessment-box p-col-6" v-else>
                    <p class="header-dialog-crack p-mb-2">Assessment Result</p>
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
                        <p class="header-dialog-crack">Assessor Name</p>
                        <p style="font-weight: 600;margin-bottom:10px">
                          {{ product.assessorName }}
                        </p>
                        <p class="header-dialog-crack">Assessment Date</p>
                        <p style="font-weight: 600;margin-bottom:10px">
                          {{ callDate(product.assessmentDate) }}
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
                  <div class="p-col-6">
                    <p class="header-detail">Last Modified</p>
                    <p style="font-weight: 600">
                      {{ callDate(product.lastModified) }}
                    </p>
                  </div>
                  <div class="p-col-6">
                    <p class="header-detail">Update By</p>
                    <p style="font-weight: 600">{{ product.updateUserName }}</p>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </Dialog>
      <Dialog
        v-model:visible="crackInfoDialog"
        :style="{ width: '800px' }"
        :modal="true"
        :showHeader="false"
        :dismissableMask="true"
        class="dialog"
      >
        <div class="p-grid nested-grid">
          <div class="p-col-5">
            <div class="dialog-title-2" style="margin-top: 10px; margin-bottom: 15px; height: auto">
              <span style="">Crack {{product.crackId}}</span>
            </div>
            <img
              :src="product.imageThumbnails"
              :alt="product.imageThumbnails"
              class="product-image"
              v-if="product.image"
              @click="imageClick(product.index)"
              style="width: 300px; height: 76%"
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
                  (product.description == '' ||
                  product.description == null) &&
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
        :value="cracks"
        :numVisible="7"
        containerStyle="max-width: 850px"
        :circular="true"
        :fullScreen="true"
        :showItemNavigators="true"
        :showThumbnails="false"
        v-model:visible="displayImage"
        v-model:activeIndex="activeIndex"
      >
        <template #item="slotProps">
          <img
            :src="slotProps.item.image"
            style="width: 1100px; display: block;"
          />
          <button
            type="button"
            class="buttonView p-link"
            v-tooltip.right="'View Crack Details'"
            @click="showDetail(slotProps.item)"
          >
            <i class="pi pi-fw pi-eye" style="fontSize: 2rem;"></i>
          </button>
        </template>
        <template #thumbnail="slotProps">
          <img :src="slotProps.item.imageThumbnails" style="display: block;" />
        </template>
      </Galleria>
      <Toast position="bottom-right" />
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import MultiSelect from "primevue/multiselect";
import Toast from "primevue/toast";
import Knob from "primevue/knob";
import { mapGetters, mapActions } from "vuex";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import moment from "moment";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import crackApi from "../apis/cracks.js";
import Galleria from "primevue/galleria";
import webRole from "../util/webRole.js";
import ChartStatus from "../chart/OrderByStatusSmall.vue";
import OrderTimeline from "../chart/OrderRecordTimeline.vue";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    MultiSelect,
    Knob,
    TabView,
    TabPanel,
    Galleria,
    ChartStatus,
    OrderTimeline,
  },

  computed: {
    ...mapGetters("maintenanceOrder", [
      "getMaintenanceOrderList",
      "getStatusList",
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

  async created() {
    this.initFilters(this.$route.query.repairRecordId);
    this.setMaintenanceOrderList();
    this.loading = false;
    await this.filter();
  },

  data() {
    return {
      crackInfoDialog: false,
      productDialog: false,
      showAssessment: false,
      product: {},
      crack: {},
      cracks: [],
      filters: {},
      submitted: false,
      expandedRows: [],
      loading: true,
      displayImage: false,
      check: true,
      activeIndex: 0,
      filterChart: {
        selectedYear: null,
        selectedLocation: [],
        period: "",
        data: null,
        check: 0,
      },
    };
  },

  methods: {
    ...mapActions("maintenanceOrder", ["setMaintenanceOrderList"]),

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
      this.filterChart.selectedLocation = user.locations.map(
        (l) => l.locationId
      );
      this.filterChart.data = this.filterChart.selectedLocation.slice();
      this.filterChart.data.push(this.filterChart.period);
      this.filterChart.data.push(this.filterChart.selectedYear);
      this.filterChart.check++;
    },

    onRowExpand(event) {
      this.expandedRows = this.getMaintenanceOrderList.filter(
        (p) => p.maintenanceOrderId == event.data.maintenanceOrderId
      );
      this.cracks = [];
      this.cracks = event.data.cracks;
    },
    onRowCollapse() {
      this.cracks = [];
    },
    hideDialog() {
      this.productDialog = false;
      this.showAssessment = false;
      this.submitted = false;
      this.crackInfoDialog = false;
    },
    showImage(crack) {
      this.crackInfoDialog = false;
      this.activeIndex = crack.index - 1;
      this.displayImage = true;
    },
    hiddenImage() {
      this.displayImage = false;
    },
    async showDetail(product) {
      this.displayImage = false;
      this.product = await crackApi.getById(product.crackId);
      if (
        this.product.assessmentResult != null &&
        this.product.assessmentResult != ""
      ) {
        this.check = false;
      } else {
        this.check = true;
      }
      this.product.created = this.callDate(new Date(this.product.created + "Z"));
      this.product.lastModified = this.callDate(new Date(this.product.lastModified + "Z"));
      this.product.index = product.index;
      this.crackInfoDialog = true;
    },
    editProduct(product) {
      this.product = { ...product };
      if (
        this.product.assessmentResult != null &&
        this.product.assessmentResult != 0
      ) {
        this.check = false;
      } else {
        this.check = true;
      }
      this.product.maintenanceDate = this.callDate(
        this.product.maintenanceDate
      );
      this.productDialog = true;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    initFilters(search) {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        maintenanceOrderId: {
          operator: FilterOperator.AND,
          constraints: [{ value: search, matchMode: FilterMatchMode.EQUALS }],
        },
        maintenanceWorkerName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        maintenanceExpense: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.GREATER_THAN },
          ],
        },
        locationName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        status: { value: null, matchMode: FilterMatchMode.IN },
        maintenanceDate: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
      };
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.getMaintenanceOrderList.length; i++) {
        if (this.getMaintenanceOrderList[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },

    showVideo(product) {
      this.$router.push(
        "/detection-result-details?detectionResultId=" + product.flightId
      );
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
    stockStatus(data) {
      return [
        {
          detectedFailed: data.status === "DetectedFailed",
          unconfirmed: data.status === "Unconfirmed",
          unscheduled: data.status === "UnrecordedRepair",
          scheduledformaintenace: data.status === "RecordedRepair",
          unqualifiedrepair: data.status === "UnqualifiedRepair",
          fix: data.status === "Fixed",
        },
      ];
    },
    stockStatusOrder(data) {
      return [
        {
          waitingrepair: data.status === "WaitingForRepair",
          completed: data.status === "Completed",
        },
      ];
    },
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY HH:mm:ss");
    },
  },
};
</script>

<style scoped>
textarea {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none; /*remove the resize handle on the bottom right*/
}
.dialog-title {
  color: #69707a;
  margin-left: 44px;
  display: flex;
  align-items: center;
}

.dialog-title-order {
  color: #69707a;
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.p-dialog-titlebar {
  background: black;
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
  min-height: 270px;
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
.dialog-title::before,
.dialog-title-order::before {
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

.p-dialog .product-image {
  width: 150px;
  min-height: 320px;
  display: block;
  box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);
}
.small {
  background-color: #005204;
}
.p-fluid .p-dialog-footer .p-button {
  /* margin-bottom: -10px; */
  margin-top: -20px;
}
.orders-subtable {
  border-radius: 24px;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  color: #69707a;
  padding: 1rem;
  font-weight: 700;
}

.confirmation-content {
  display: flex;
  align-items: center;
}
.underline {
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 1px solid black;
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
  color: #ffad44;
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
.detectedFailed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ff5252;
}
.unconfirmed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #0dc8de;
  text-align: center;
  text-transform: uppercase;

  width: 110px;
  background-color: #f8f9ff;
}
.unscheduled {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #fd517d;
  text-transform: uppercase;

  /* text-align: center;
  width: 110px;
    background-color:#b9eee9; */
}
.waitingrepair {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #ff0000;
  text-transform: uppercase;

  text-align: center;
  background-color: #ffcccc;
  text-transform: uppercase;
}
.completed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #00e04b;
  text-align: center;
  width: 110px;
  background-color: #e8fcee;
  text-transform: uppercase;
}
.unscheduled {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #fd517d;
  text-transform: uppercase;

  /* text-align: center;
  width: 110px;
    background-color:#b9eee9; */
}
.scheduledformaintenace {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #51bea5;
  font-size: 14px;
  text-transform: uppercase;

  /* text-align: center;
  width: 110px;
    background-color:#e1f0ff; */
}
.fix {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #89bfdc;
  text-transform: uppercase;
  /* text-align: center;
  width: 110px;
    background-color:#c7d7db; */
}
.unqualifiedrepair {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #ffad44;
  text-transform: uppercase;
}

.p-col-12 .nested-grid {
  min-height: 345px;
}

.p-col-12 .order-detail .nested-grid {
  min-height: 200px;
}

.p-m-2::before {
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
.p-m-3::before {
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
}
.p-m-3 {
  display: flex;
  align-items: center;
}

.dialog-title-2 {
  height: 30px;
  border-radius: 10px;
  margin-left: 10px;
  margin-bottom: 5px;
}
.dialog-title-2 span {
  padding-top: 3px;
  font-weight: 600;
  font-size: 18px;
  font-family: Poppins;
}
::v-deep(.p-tabview .p-tabview-nav) {
  margin-top: 20px;
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

#sub-table-title {
  font-size: 1.1rem;
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
}
::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: left;
  border: 1px solid #e9ecef;
  border-width: 0 0 0 0;
  padding: 1rem 1rem;
}

::v-deep(.p-datatable.p-datatable-hoverable-rows
    .p-datatable-tbody
    > tr:not(.p-highlight):hover) {
  background: white;
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

::v-deep(.p-datatable-row-expansion
    .p-datatable-wrapper
    .p-datatable-table
    .p-datatable-thead
    .p-column-header-content
    .p-column-title) {
  display: block;
}

::v-deep(.p-dialog .p-dialog-header) {
  background: #ffffff;
  color: #69707a;
  font-weight: 700;
  border-bottom: 0 none;
  padding: 1rem;
}

::v-deep(.p-dialog .p-dialog-content) {
  color: #69707a;
  min-height: 462px;
}

::v-deep(.p-tabview.p-component) {
  width: 100%;
}
.header-detail {
  font-weight: 400;
  color: grey;
  margin-bottom: 5px;
}
.table-header-main {
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

.p-grid .nested-grid {
  min-height: 320px;
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

::v-deep(.p-datatable .p-paginator-bottom) {
  border-width: 0 0 0 0;
}

.main-layout-details {
  border-radius: 24px;
  padding: 20px;
  background-color: white;
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

.record-content {
  min-height: 341px;
}

.chart-title {
  color: gray;
  font-size: 20px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.chart-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
}
</style>
