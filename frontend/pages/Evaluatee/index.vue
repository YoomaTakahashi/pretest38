<template>
    <v-container>
        <PageHeader title="หน้าหลักผู้รับการประเมินผล" subtitle="แสดงข้อมูลเชิงสถิติของผู้รับการประเมินผล" icon="mdi-view-dashboard" color="#7d0c14"></PageHeader>

        <v-row>
            <v-col cols="12" md="4" v-for="(b,i) in box" :key="b.title">
                <v-card :color="cards[i].color" variant="tonal" rounded="xl" class="pa-4">
                    <div class="d-flex align-center">
                        <v-avatar :color="cards[i].color" size="56" class="me-4">
                            <v-icon :icon="cards[i].icon" size="32" color="white"></v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-body-medium">{{ b.title }}</div>
                            <div class="text-headline-large font-weight-bold">{{ b.value }}</div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-card class="mt-3" rounded="xl" elevation="2">
            <v-card-title class="pa-4">
                <v-icon icon="mdi-celendar-check" color="red-darken-4" class="me-3"></v-icon>
                รอบการประเมินทั้งหมด
            </v-card-title>
            <v-table hover>
                    <thead>
                        <tr>
                            <th class="text-center">ลำดับ</th>
                            <th class="text-center">ชื่อ - นามสกุล</th>
                            <th class="text-center">รอบการประเมิน</th>
                            <th class="text-center">สถานะการประเมิน</th>
                            <th class="text-center">ปีการประเมิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in result" :key="item.id_eva">
                            <td class="text-center">{{ 1 }}</td>
                            <td class="text-center">{{ item.fname }}-{{ item.lname }}</td>
                            <td class="text-center">{{ item.round_sys }}</td>
                            <td class="text-center">{{  }}</td>
                            <td class="text-center">{{ item.year_sys }}</td>
                        </tr>
                        <tr v-if="result.length === 0">
                            <td colspan="12" class="text-center text-medium-emphasis py-6">ยังไม่มีรอบการประเมิน</td>
                        </tr>
                    </tbody>
                </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api,eva } from '~/API/base';

const box = ref<any>([])
const result = ref<any>([])

const cards = [
    {color:'blue',icon:'mdi-file-document'},
    {color:'success',icon:'mdi-check-circle'},
    {color:'error',icon:'mdi-clock-alert'},
]


const status:any = {
    1: {text:'รอการรประเมินตนเอง',color:'error'},
    2: {text:'รอกรรมการประเมิน',color:'warning'},
    3: {text:'ประเมินสำเร็จ',color:'success'},
}

const fetch =async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${api}/dash/eva`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
        const res2 = await axios.get(`${eva}/table`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res2.data
    } catch (error) {
        console.error('Error get',error)
    }
}
onMounted(fetch)
</script>

<style scoped>

</style>