<template>
  <FileUpload
    name="demo"
    @upload="myUploader"
    accept="video/*"
    :maxFileSize="10000000000"
    :customUpload="true"
    :uploader= file
  >
    <template #empty>
      <p>Drag and drop files to here to upload.</p>
    </template>
  </FileUpload>
</template>

<script>
import FileUpload from "primevue/fileupload";
export default {
  components: {
    FileUpload,
  },

  data() {
    return {
      file: null,
    };
  },
  methods: {
    myUploader() {
      console.log("AA" + this.file);
    },
  },
};
</script>
