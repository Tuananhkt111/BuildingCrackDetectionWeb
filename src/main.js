import { createApp } from "vue";
import App from "./App.vue";
import store from "./stores";
import router from "./routers";

import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import RadioButton from "primevue/radiobutton";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import ToastService from "primevue/toastservice";
import ConfirmationService from 'primevue/confirmationservice';

import "primeflex/primeflex.css";
import Tooltip from "primevue/tooltip";


import mitt from "mitt";

const emitter = mitt();

const app = createApp(App);

app.use(ConfirmationService);
app.use(store);
app.use(router);
app.use(PrimeVue);
app.component("InputText", InputText);
app.component("Button", Button);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Dialog", Dialog);
app.component("Textarea", Textarea);
app.component("RadioButton", RadioButton);
app.component("InputNumber", InputNumber);
app.use(ToastService);
app.directive("tooltip", Tooltip);

app.config.globalProperties.emitter = emitter;
app.mount("#app");
