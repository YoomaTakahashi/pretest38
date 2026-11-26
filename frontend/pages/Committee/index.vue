<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="รายชื่อผู้รับการประเมินผล" subtitle="สามารถดูคะแนนประเมินตนเองได้" icon="mdi-clipboard-search" color="#007fff"></page-header>
                    <v-card rounded="xl" elevation="3" class="mt-3">
                        <div class="d-flex align-center mb-3 mt-4">
                            <v-icon icon="mdi-account-group" class="mx-2"></v-icon>
                            <div class="text-title-large font-weight-bold">รายชื่อผู้รับการประเมินผล    </div>
                        </div>
                        <v-table hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ชื่อ</th>
                                    <th class="text-center">นามสกุล</th>
                                    <th class="text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center">รอบการประเมิน</th>
                                    <th class="text-center">สถานะการประเมิน</th>
                                    <th class="text-center">คะแนนประเมิน</th>
                                    <!-- <th class="text-center">เอกสาร</th>
                                    <th class="text-center">จัดการ</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.fname }}</td>
                                    <td class="text-center">{{ items.lname }}</td>
                                    <td class="text-center">{{ formatDate(items.day_eva) }}</td>
                                    <td class="text-center">รอบที่{{items.round_sys }} ปี {{ items.year_sys}}</td>
                                    <td class="text-center">
                                            <v-chip :color="bg(items.status_eva)" :prepend-icon="icon(items.status_eva)" variant="tonal" size="small">{{ items.status_eva === 1 ? 'รอการประเมินตนเอง':items.status_eva === 2 ? 'รอกรรมการประเมิน':'ประเมินสำเร็จ' }}</v-chip>
                                    </td>
                                    <td class="text-center">
                                        <v-btn  color="info" prepend-icon="mdi-pen" variant="outlined" size="small" @click="go(items.id_eva)">ตรวจสอบ</v-btn>
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
import { api, commit, staff } from '~/API/base'

const bg = (status:any)=>{
    if(status === 1)return "error"
    if(status === 2)return "warning"
    if(status === 3)return "success"
}

const icon = (status:any)=>{
    if(status === 1)return "mdi-close"
    if(status === 2)return "mdi-clock"
    if(status === 3)return "mdi-checl-circle"
}



const token = import.meta.client ? localStorage.getItem('token'):null



const fetch = async()=>{
    try {
        const res3 = await axios.get(`${commit}/show`,{headers:{Authorization:`Bearer ${token}`}})
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




const go = (id_eva:number)=>{
    navigateTo({path:`/Committee/Score_member/${id_eva}`})
}


onMounted(fetch)

</script>

<style scoped>

</style>