<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="จัดการหัวข้อการประเมิน" subtitle="จัดการข้อมูลหัวข้อการประเมิน" icon="mdi-format-list-bulleted"></page-header>
                    <v-card rounded="xl" elevation="3">
                        <v-card-title>
                            <div class="text-center font-weight-bold text-title-large mb-3"><v-avatar color="#647687" :icon="form.id_topic ? 'mdi-pencil':'mdi-plus'"></v-avatar>จัดการหัวข้อการประเมิน</div>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    <v-col cols="12" md="12"> 
                                        <v-text-field label="ชื่อ" v-model="form.name_topic" :error-messages="error.name_topic" variant="outlined" rounded="lg"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" type="submit" color="primary" prepend-icon="mdi-content-save">{{form.id_topic ? 'อัปเดต':'บันทึก'}}</v-btn>
                                            <v-btn class="text-center text-white ma-2" @click="reset()" color="error" variant="tonal" prepend-icon="mdi-close">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                    <v-card rounded="xl" elevation="3" class="mt-3">
                        <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" class="ma-3"></v-text-field>
                        <div class="d-flex align-center justify-center mb-3">
                            <v-icon icon="mdi-format-list-bulleted" class="mx-2"></v-icon>
                            <div class="text-title-large font-weight-bold">จัดการหัวข้อการประเมิน</div>
                        </div>
                        <v-table hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ชื่อหัวข้อการประเมิน</th>
                                    <th class="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_topic">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.name_topic }}</td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn class="ma-2" color="warning" icon="mdi-pencil" variant="tonal" @click="edit(items)" size="small"></v-btn>
                                            <v-btn class="ma-2" color="error" icon="mdi-delete" variant="tonal" @click="del(items.id_topic)" size="small"></v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-body-medium text-medium-emphasis text-center" colspan="12" v-if="result.length ===0">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'

const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const dataResult = ref([])
const search = ref('')
const form = ref({
    id_topic:null,
    name_topic:''
})
const reset = ()=>{
    form.value = {
        id_topic:null,
        name_topic:''
    }
}

function validate(){
    const f = form.value
    error.value = {}

    if(!f.name_topic.trim())error.value.name_topic = 'กรุณากรอกชื่อหัวข้อการประเมิน'

    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const f = form.value
    try {
        f.id_topic
        ? await axios.put(`${staff}/topic/update/${f.id_topic}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/topic/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        alert('ดำเนินการสำเร็จ')
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error save",error);
        
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/topic/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
    } catch (error) {
        console.error("error get",error)
    }
}

const result = computed(()=>{
    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((item:any)=>{
        return(
            item.name_topic.toLowerCase().includes(s)
        )
    })
})

const edit = async(items:any)=>{
    form.value = {...items}
}

const del = async(id_topic:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/topic/delete/${id_topic}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
    }
}

onMounted(fetch)

</script>

<style scoped>

</style>