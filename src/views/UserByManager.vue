<template>
  <div>
    <div class="card">
      <DataTable
        :scrollable="true"
        ref="dt"
        :value="getUserList"
        dataKey="id"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div class="table-header">
            <h3 class="p-m-2">Manage User</h3>
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
        <Column field="userName" header="User Name">
          <template #body="slotProps">
            {{ slotProps.data.userName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['userName']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="name" header="Full Name">
          <template #body="slotProps">
            {{ slotProps.data.name }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['name']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="email" header="Email">
          <template #body="slotProps">
            {{ slotProps.data.email }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['email']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="phoneNumber" header="Phone Number">
          <template #body="slotProps">
            {{ slotProps.data.phoneNumber }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['phoneNumber']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="role" header="Role">
          <template #body="slotProps">
            <span :class="'customer-badge status-' + slotProps.data.role">{{
              slotProps.data.role
            }}</span>
          </template>
          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['role']"
              :options="roles"
              placeholder="Role"
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
        <Column>
          <template #body="slotProps">
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'View Detail'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="UserUpdateDialog"
      :style="{ width: '450px' }"
      header="User Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-5">
          <p for="userName">User Name</p>
          <label>{{ product.userName }}</label>
        </div>
        <div class="p-field p-col-7">
          <p for="name">Full Name</p>
          <label>{{ product.name }}</label>
        </div>
      </div>
      <div class="p-field">
        <p for="email">Email</p>
        <label>{{ product.email }}</label>
      </div>
      <div class="p-field">
        <p for="phoneNumber">Phone Number</p>
        <label>{{ product.phoneNumber }}</label>
      </div>
      <div class="p-field">
        <p>Address</p>
        <label>{{ product.address }}</label>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <p>Role</p>
          <label>{{ product.role }}</label>
        </div>
        <div class="p-field p-col-6">
          <p>Location</p>
          <label>{{ selectedLocation.name }}</label>
        </div>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <p>Created Date</p>
          <label>{{ product.created }}</label>
        </div>
        <div class="p-field p-col-6">
          <p>Last Modified</p>
          <label>{{ product.lastModified }}</label>
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Update"
          icon="pi pi-user-edit"
          class="p-button-text"
          @click="UpdateUser"
        />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<script>
import Button from "primevue/button";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  components: {
    Button,
    Toast,
    Dropdown,
  },
  computed: {
    ...mapGetters("user", ["getUserList"]),
    ...mapGetters("location", ["getLocationList"]),
  },
  data() {
    return {
      selectedRole: null,
      selectedLocation: null,
      UserUpdateDialog: false,
      product: {},
      filters: {},
      submitted: false,
      messages: [],
      roles: ["Manager", "Staff"],
    };
  },

  async created() {
    await this.setUserList();
    await this.setLocationList();
  },
  methods: {
    ...mapActions("user", ["setUserList"]),
    ...mapActions("location", ["setLocationList"]),
    hideDialog() {
      this.submitted = false;
      this.UserUpdateDialog = false;
    },
    editProduct(product) {
      this.product = { ...product };
      this.selectedLocation = null;
      this.product.created = this.callDate(product.created);
      this.product.lastModified = this.callDate(product.lastModified);
      this.selectedRole = this.product.role;
      const tmp = this.product.locationIds;
      console.log(this.getLocationList);
      if (tmp.length == 1 && this.selectedRole == "Staff") {
        this.selectedLocation = this.getLocationList[
          this.findIndexById(this.product.locationIds[0])
        ];
      } else {
        this.selectedLocation = [];
        for (let i = 0; i < tmp.length; i++) {
          this.selectedLocation.push(
            this.getLocationList[this.findIndexById(tmp[i])]
          );
        }
      }
      // this.selectedLocation = this.product.locationIds;
      console.log(this.selectedLocation);
      this.UserUpdateDialog = true;
    },

    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.getLocationList.length; i++) {
        if (this.getLocationList[i].locationId === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY hh:mm:ss");
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
