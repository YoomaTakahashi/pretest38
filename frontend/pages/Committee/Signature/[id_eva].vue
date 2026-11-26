<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="เอกสารหรือคู่มือการประเมิน" subtitle="จัดการเอกสารหรือคู่มือการประเมิน" icon="mdi-file-png-box" color="#007fff"></page-header>
                    <v-card rounded="xl" elevation="3">
                        <v-card-title>
                            <div class=" font-weight-bold text-title-large mb-3">เอกสารหรือคู่มือการประเมิน</div>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form v-if="!result.signature" @submit.prevent="saveMember">
                                <v-row>
                                    <!-- <v-col cols="12" md="6"> 
                                        <v-text-field label="ชื่อเอกสาร" v-model="name_doc" :error-messages="error.name_doc" variant="outlined" rounded="lg"></v-text-field>
                                    </v-col> -->
                                    <v-col cols="12" md="12"> 
                                        <v-file-input label="เอกสาร" v-model="file" :error-messages="error.file" variant="outlined" rounded="lg" accept=".png , .jpg" hint="รองรับเฉพาะไฟล์ PNG และ JPG ขนาดไม่เกิน 10MB เท่านั้น"></v-file-input>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" type="submit" color="primary" prepend-icon="mdi-content-save">บันทึก</v-btn>
                                            <v-btn class="text-center text-white ma-2" @click="reset()" color="error" variant="tonal" prepend-icon="mdi-close">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <v-card v-else rounded="xl" elevation="3" class="mt-3">
                                <!-- <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" class="ma-3"></v-text-field> -->
                                <div class="d-flex align-center mb-3 mt-3">
                                    <v-icon icon="mdi-file-png-box" class="mx-2"></v-icon>
                                    <div class="text-title-large font-weight-bold">เอกสารหรือคู่มือการประเมิน</div>
                                </div>
                                <v-table hover>
                                    <thead>
                                        <tr>
                                            <th class="text-center">ลำดับ</th>
                                            <th class="text-center">ชื่อลายเซ็น</th>
                                            <!-- <th class="text-center">วันที่ออกเอกสาร</th> -->
                                            <th class="text-center">เอกสาร</th>
                                            <!-- <th class="text-center">จัดการ</th> -->
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-center">{{ 1}}</td>
                                            <td class="text-center">{{ result.signature }}</td>
                                            <!-- <td class="text-center">{{ formatDate(items.day_doc) }}</td> -->
                                            <!-- <td class="text-center"></td> -->
                                            <td class="text-center">
                                                <center>
                                                    <v-btn class="ma-2" color="info" icon="mdi-eye" variant="tonal" @click="view(result.signature)" size="small"></v-btn>
                                                    <v-btn class="ma-2" color="error" icon="mdi-delete" variant="tonal" @click="del()" size="small"></v-btn>
                                                </center>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-body-medium text-medium-emphasis text-center" colspan="12" v-if="result.length ===0">ไม่พบข้อมูล</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, commit, staff } from '~/API/base'

const error = ref<Record<string,string>>({})
const file = ref<File | null>(null)
const dataResult = ref([])
const search = ref('')
const name_doc = ref('')
const id_eva = useRoute().params.id_eva

const reset = ()=>{
    name_doc.value = ''
    file.value = null
}

function validate(){
    error.value = {}
    const maxSize = 10*1024*1024
    if(!file.value)error.value.file = 'กรุณาเลือกไฟล์เอกสาร'
    else if(file.value.size > maxSize)error.value.file = 'ไฟล์มีขนาดเกิน 10MB'

    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const formdata = new FormData
    formdata.append('file',file.value!)
    try {
        await axios.post(`${commit}/signature/save/${id_eva}`,formdata,{headers:{Authorization:`Bearer ${token}`}})
        alert('ดำเนินการสำเร็จ')
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error save",error);
        
    }
}

const fetch = async()=>{
    try {
        const res3 = await axios.get(`${commit}/signature/show/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res3.data
    } catch (error) {
        console.error("error get",error)
    }
}

const result = ref([])




const del = async()=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${commit}/signature/delete/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
    }
}



const view = (filename:string)=>{
    const url = new URL(`/uploads/signature/${filename}`,api).href
    window.open(url,'_blank')
}

onMounted(fetch)

</script>

<style scoped>

</style>