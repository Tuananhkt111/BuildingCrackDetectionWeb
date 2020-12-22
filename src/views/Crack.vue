<template>
  <div>
    <div class="card">
      <DataTable
        :scrollable="true"
        ref="dt"
        :value="products"
        v-model:selection="selectedProducts"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div class="table-header">
            <h3 class="p-m-2">Manage Cracks</h3>

            <span class="p-input-icon-left">
              <Button
                label="Export"
                icon="pi pi-upload"
                class="p-button-help"
                @click="exportCSV($event)"
                style="margin:2px"
              />
              <span class="p-input-icon-left" style="margin:2px">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global']"
                  placeholder="Search..."
                />
              </span>
            </span>
          </div>
        </template>
        <template #empty>
          No Cracks found.
        </template>
        <Column headerStyle="width: 3rem"></Column>
        <Column header="Image" headerStyle="width: 100px">
          <template #body="slotProps">
            <img
              :src="'demo/images/product/' + slotProps.data.image"
              :alt="slotProps.data.image"
              class="product-image"
            />
          </template>
        </Column>
        <Column
          field="locationName"
          header="Location Name"
          headerStyle="width: 200px"
        >
          <template #body="slotProps">
            {{ slotProps.data.locationName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['locationName']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="ReporterName"
          header="Reporter Name"
          headerStyle="width: 200px"
        >
          <template #body="slotProps">
            {{ slotProps.data.ReporterName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['ReporterName']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          filterField="Position"
          filterMatchMode="contains"
          header="Position"
          headerStyle="width: 200px"
        >
          <template #body="slotProps">
            {{ slotProps.data.Position }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['Position']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="Severity"
          header="Severity"
          filterMatchMode="equals"
          headerStyle="width: 150px"
        >
          <template #body="slotProps">
            <span :class="'customer-badge status-' + slotProps.data.Severity">{{
              slotProps.data.Severity
            }}</span>
          </template>
          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['Severity']"
              :options="severitys"
              placeholder="Severity"
              class="p-column-filter"
              :showClear="true"
            >
              <template #option="slotProps">
                <span :class="'customer-badge status-' + slotProps.option">{{
                  slotProps.option
                }}</span>
              </template>
            </Dropdown>
          </template>
        </Column>
        <Column
          field="status"
          header="Status"
          filterMatchMode="equals"
          headerStyle="width: 150px"
        >
          <template #body="slotProps">
            <span :class="'customer-badge status-' + slotProps.data.status">{{
              slotProps.data.status
            }}</span>
          </template>

          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['status']"
              :options="statuses"
              placeholder="Status"
              class="p-column-filter"
              :showClear="true"
            >
              <template #option="slotProps">
                <span :class="'customer-badge status-' + slotProps.option">{{
                  slotProps.option
                }}</span>
              </template>
            </Dropdown>
          </template>
        </Column>
        <Column
          field="description"
          header="Description"
          :sortable="true"
          headerStyle="width: 150px"
          ><template #body="slotProps">
            <ScrollPanel style="width: 100%; height: 80px">
              {{ slotProps.data.description }}
            </ScrollPanel>
          </template>
        </Column>
        <Column
          field="Created"
          header="Created"
          filterMatchMode="custom"
          :filterFunction="filterDate"
          headerStyle="width: 250px"
          
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.Created }}</span>
          </template>
          <template #filter>
            <Calendar
              appendTo="body"
              v-model="filters['Created']"
              dateFormat="dd-mm-yy"
              class="p-column-filter"
              placeholder="CreatedDate"
            />
          </template>
        </Column>
        <Column
          field="LastModified"
          header="LastModified"
          filterMatchMode="custom"
          :filterFunction="filterDate"
          headerStyle="width: 250px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.LastModified }}</span>
          </template>
          <template #filter>
            <Calendar
              appendTo="body"
              v-model="filters['LastModified']"
              dateFormat="dd-mm-yy"
              class="p-column-filter"
              placeholder="CreatedDate"
            />
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Button
              icon="pi pi-star"
              class="p-button-rounded p-button-warning p-button-text"
              @click="showAssessmentDialog(slotProps.data)"
            />
            <Button
              icon="pi pi-calendar-minus"
              class="p-button-rounded p-button-danger p-button-text"
              @click="showAssessmentDialog(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="showAssessment"
      :style="{ width: '450px' }"
      header="Assessment"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <Rating
          :modelValue="product.AssessmentResult.Rating"
          :readonly="true"
          :stars="5"
          :cancel="false"
        />
      </div>
      <div class="p-field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="product.AssessmentResult.Description"
          required="true"
          rows="3"
          cols="20"
          disabled
        />
      </div>
      <template #footer>
        <Button
          label="Close"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<script>
import Location from "../data/LocationService.js";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Rating from "primevue/rating";
import ScrollPanel from "primevue/scrollpanel";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    Dropdown,
    Rating,
    ScrollPanel,
  },
  data() {
    return {
      products: null,
      showAssessment: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      messages: [],
      statuses: ["Waiting for maintenance", "Completed"],
      severitys: ["Low", "Medium", "High"],
    };
  },
  locationService: null,
  created() {
    this.locationService = new Location();
  },

  mounted() {
    this.locationService.getCracks().then((data) => (this.products = data));
  },
  methods: {
    hideDialog() {
      this.showAssessment = false;
      this.submitted = false;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
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
    exportCSV() {
      this.$refs.dt.exportCSV();
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
      let tmp = value.substring(0, 10);
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
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-image {
  width: 100px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 150px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
