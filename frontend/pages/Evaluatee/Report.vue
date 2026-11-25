<template>
    <v-container>
        <PageHeader title="ผลประเมินของกรรมการประเมิน" subtitle="คะแนนจาก ประธาน กรรมการ เลขา และข้อเสนอแนะ" icon="mdi-clipboard-search" color="#7d0c14"></PageHeader>

        <v-form v-if="user.status_eva === 3">
            <v-card rounded="xl" class="mb-6" elevation="4">
                <v-list-item prepend-icon="mdi-account-circle" :title="`${user.fname}-${user.lname}`" :subtitle="`รอบที่${user.round_sys} /ปี ${user.year_sys}`"></v-list-item>
            </v-card>

            <v-card v-for="(topic,t) in topics" :key="topic.id_topic" rounded="xl" class="mb-6" elevation="5">
                <v-card-title class="pa-4 bg-grey">{{ Number(t)+1 }}.{{ topic.name_topic }}</v-card-title>
                <v-table hover>
                    <thead>
                        <tr>
                            <th class="text-center">ลำดับ</th>
                            <th class="text-center">ชื่อตัวชี้วัด</th>
                            <th class="text-center">รายละเอียดตัวชี้วัด</th>
                            <th class="text-center">น้ำหนักคะแนน</th>
                            <th class="text-center">คะแนนเต็ม</th>
                            <th class="text-center">คะแนนที่ได้</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                            <td class="text-center">{{ Number(i)+1 }}</td>
                            <td class="text-center">{{ indicate.name_indicate }}</td>
                            <td class="text-center">{{ indicate.detail_indicate }}</td>
                            <td class="text-center">{{ indicate.point_indicate }}</td>
                            <td class="text-center">{{ indicate.point_indicate*4 }}</td>
                            <td class="text-center">{{ average(indicate.id_indicate) }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
            <div class="text-end">
                <v-alert color="success" rounded="xl"><v-icon class="me-3" icon="mdi-trophy"/>คะแนนรวมสุทธิ : {{ ((user.total_commit)/3).toFixed(2) }}คะแนน</v-alert>
            </div>

            <v-card class="mt-5" rounded="xl" elevation="5">
                <div class="text-title-medium font-weight-bold mb-4">ลงชื่อกรรมการประเมิน</div>
                <v-row>
                    <v-col cols="12" md="4" v-for="commit in commits" :key="commit.id_commit" class="text-center">
                        <v-img v-if="commit.signature" :src="signUrl(commit.signature)" height="80" class="mb-2"></v-img>
                        <div v-else class="text-medium-emphasis py-6">รอ{{ commit.level_commit }}ประธาน</div>
                        <v-divider class="mb-2"></v-divider>
                        <div>{{ commit.fname }} {{ commit.lname }}</div>
                        <div class="text-medium-emphasis">{{ commit.level_commit }}</div>
                    </v-col>
                </v-row>
            </v-card>

            <div class="text-center mt-4">
                <v-btn color="info" size="large" prepend-icon="mdi-printer" @click="print()">พิมพ์</v-btn>
            </div>
        </v-form>
        <v-alert color="warning" type="warning" v-else-if="user.status_eva === 2" variant="tonal" rounded="xl">รอกรรมการดำเนินการ</v-alert>
        <v-alert color="warning" type="warning" v-else-if="user.status_eva === 1" variant="tonal" rounded="xl">ยังไม่ได้ประเมินตนเอง</v-alert>
        <v-alert type="error" v-else variant="tonal" rounded="xl">ไม่มีแบบประเมิน</v-alert>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';

import { api, eva } from '~/API/base';

const print = ()=>{
    window.print()
}

const user = ref<any>({})
const scores = ref<any>({})
const topics = ref<any>([])
const commits = ref<any[]>([])

const average = (id:number)=>{
    const s = scores.value[id] ?? {}
    return (((s.a ?? 0)+(s.b ?? 0)+((s.c ?? 0))))
}

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        const res2 = await axios.get(`${eva}/selfeva/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
        const res3 = await axios.get(`${eva}/score_commit/commit`,{headers:{Authorization:`Bearer ${token}`}})
        commits.value = res3.data
        const res4 = await axios.get(`${eva}/score_commit/scores`,{headers:{Authorization:`Bearer ${token}`}})
        scores.value = res4.data
    } catch (error) {
        console.error('Error get',error)
    }
}
onMounted(fetch)



</script>

<style scoped>

</style>