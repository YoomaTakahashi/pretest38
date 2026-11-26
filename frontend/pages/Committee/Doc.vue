<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="เอกสารหรือคู่มือการประเมิน" subtitle="จัดการเอกสารหรือคู่มือการประเมิน" icon="mdi-file-png-box" color="#007fff"></page-header>
                    <v-card rounded="xl" elevation="3" class="mt-3">
                        <div class="d-flex align-center mb-3 mt-4">
                            <v-icon icon="mdi-file-png-box" class="mx-2"></v-icon>
                            <div class="text-title-large font-weight-bold">คู่มือการประเมิน</div>
                        </div>
                        <v-table hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ชื่อเอกสาร</th>
                                    <th class="text-center">วันที่ออกเอกสาร</th>
                                    <th class="text-center">เอกสาร</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_doc">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.name_doc }}</td>
                                    <td class="text-center">{{ formatDate(items.day_doc) }}</td>
                                    <td class="text-center"><v-btn class="ma-2" color="info" icon="mdi-eye" variant="tonal" @click="view(items.file)" size="small"></v-btn></td>
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
const file = ref<File | null>(null)







const token = import.meta.client ? localStorage.getItem('token'):null



const fetch = async()=>{
    try {
        const res3 = await axios.get(`${api}/docnoe/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res3.data
    } catch (error) {
        console.error("error get",error)
    }
}

const result = ref([])

const formatDate= (dateStr:string)=>{
    const date = new Date(dateStr)
    return date.toLocaleDateString('th-TH')
}






const view = (filename:string)=>{
    const url = new URL(`/uploads/document/${filename}`,api).href
    window.open(url,'_blank')
}

onMounted(fetch)

</script>

<style scoped>

</style>