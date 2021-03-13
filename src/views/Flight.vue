<template>
  <div>
    <div class="card">
      <DataTable
        :rowHover="true"
        :scrollable="true"
        ref="dt"
        :value="getFlightList"
        dataKey="flightId"
        :paginator="true"
        :rows="5"
        v-model:filters="filters"
        :globalFilterFields="['locationName', 'dataCollectorName']"
        filterDisplay="menu"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} flight"
      >
        <template #header>
          <div class="table-header">
            <h5 class="p-m-0" style="font-size:1.25rem">Manage Flights</h5>
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
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </span>
            </span>
          </div>
        </template>

        <template #empty>
          No Flights found.
        </template>
        <Column
          field="locationName"
          header="Location Name"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            {{ slotProps.data.locationName }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by name"
            />
          </template>
        </Column>
        <Column
          field="dataCollectorName"
          header="Collector Name"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            {{ slotProps.data.dataCollectorName }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="video" header="Video" :showFilterMatchModes="false">
          <template #body="slotProps">
            {{ slotProps.data.video }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text"
              @click="seeProduct(slotProps.data)"
              v-tooltip.bottom="'View Detail'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Toast position="bottom-right" />
    <div class="imagePopup" v-if="displayImage" @click="hiddenImage">
      <img
        :src="crack.image"
        style="width:60%; height: 75%; margin-left:270px; margin-top:100px"
      />
    </div>
  </div>
</template>

<script>
import Toast from "primevue/toast";
import Button from "primevue/button";
import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { mapGetters, mapActions } from "vuex";
import webRole from "../util/webRole.js";

export default {
  components: {
    Button,
    Toast,
  },
  computed: {
    ...mapGetters("flight", ["getFlightList"]),

    data() {
      return this.getFlightList;
    },
  },
  data() {
    return {
      product: {},
      filters: {},
      loading: true,
      role: null,
      admin: false,
      displayImage: false,
    };
  },
  created() {
    this.initFilters();
    this.setFlightList();
    this.loading = false;
  },

  mounted() {
    this.role = JSON.parse(localStorage.getItem("user")).role;
    if (this.role === webRole.ADMIN_ROLE) {
      this.admin = true;
    }
  },
  methods: {
    ...mapActions("flight", ["setFlightList"]),


    seeProduct(product){
      this.$router.push(
        "/video?flightId=" + product.flightId
      );
    },
    showImage(crack) {
      document.body.style.overflow = "hidden";
      this.crack = { ...crack };
      this.displayImage = true;
    },
    hiddenImage() {
      document.body.style.overflow = "visible";
      this.displayImage = false;
    },
    editProduct(product) {
      this.handleReset();
      this.product = { ...product };
      this.locationName = this.product.name;
      this.description = this.product.description;
      this.product.created = this.callDate(product.created);
      this.product.lastModified = this.callDate(product.lastModified);
      this.submitted = false;
      this.productDialog = true;
    },

    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD/MM/YYYY hh:mm:ss");
    },
    formatDate(value) {
      return new Date(value).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        locationName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        dataCollectorName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        video: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
      };
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
.invalid {
  color: red;
}

.imagePopup {
  width: 100%;
  height: 100%;
  z-index: 999999;
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, 0.9);
  left: 0;
  align-content: center;
}

@media screen and (max-width: 40em) {
  ::v-deep(.p-datatable) {
    &.p-datatable-responsive-demo {
      .p-datatable-thead > tr > th,
      .p-datatable-tfoot > tr > td {
        display: none !important;
      }

      .p-datatable-tbody > tr > td {
        display: block;
        width: 100%;
        border: 0 none;

        .p-column-title {
          padding: 0.4rem;
          min-width: 30%;
          display: inline-block;
          margin: -0.4em 1em -0.4em -0.4rem;
          font-weight: bold;
        }

        &:last-child {
          border-bottom: 1px solid var(--surface-d);
          text-align: center;
        }

        .p-rating {
          display: inline-block;
        }
      }
    }
  }
}
</style>
