<template>
    <div class="w-50 mt-5">
        <input type="text" v-model="title" class="form-control mb-3" placeholder="title">
        <button ref="dropzone" class="btn btn-dark w-100 p-5 mb-3">
            Upload
        </button>
        <quill-editor ref="editor" :modules="modules" theme="snow" toolbar="full" class="mb-3" style="height: 220px"></quill-editor>
        <input type="submit" @click.prevent="store" class="btn btn-primary" value="add">
        <input type="button" @click.prevent="getContent" class="btn btn-primary ms-3" value="content">

        <div class="mt-5">
            <div v-if="post">
                <h4>{{post.title}}</h4>
                <div v-for="image in post.images">
                    <img :src="image.preview_url" class="mb-3">
                    <img :src="image.url" class="mb-3">
                </div>
                <div class="ql-snow">
                    <div v-html="post.content" class="ql-editor"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Dropzone from "dropzone";
import axios from "axios";
import { QuillEditor } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {

    name: "Index",

    components:{
        QuillEditor
    },

    setup: () =>{
      const modules = {
        name: 'imageUploader',
        module: ImageUploader,
        options: {
            upload: file => {
                return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append("image", file);

                    axios.post('/api/posts/images', formData)
                        .then(res => {
                            console.log(res)
                            resolve(res.data.url);
                        })
                        .catch(err => {
                            reject("Ошибка загрузки");
                            console.error("Error:", err)
                        })
                })
            },
        }
      }
      return {modules}
    },

    data(){
        return {
            dropzone:null,
            title: null,
            post: null,
        }
    },

    mounted() {
        this.dropzone = new Dropzone(this.$refs.dropzone,
            {
                url: "/api/posts/",
                autoProcessQueue: false,
                addRemoveLinks: true,
            })
        this.getPost()
    },

    methods:{
      store(){
          const data = new FormData();
          const files = this.dropzone.getAcceptedFiles();
          files.forEach((file) => {
              data.append('images[]', file)
              this.dropzone.removeFile(file)
          })
          data.append('title', this.title);
          data.append('content', this.$refs.editor.getHTML());
          this.title = ''
          this.$refs.editor.setContents('');
          axios.post('/api/posts/', data).then(res => {
              this.getPost()
          })
      },
      getPost(){
          axios.get('/api/posts')
              .then(res =>
                  this.post = res.data.data
              )
      },
      getContent(){
        console.log(JSON.stringify(this.content))
        console.log(this.$refs.editor.getHTML())
      }
    }
}
</script>

<style>
.dz-error-mark, .dz-success-mark{
    display: none;
}
</style>
