<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="เพิ่มกรรมการประเมิน" subtitle="เพิ่มกรรมการประเมินทั้งสามคนเพื่อประเมินแบบประเมิน" icon="mdi-account-group"></page-header>
                    <v-card class="mb-3" rounded="xl" elevation="3">
                        <v-list bg-color="transparent">
                            <v-list-item prepend-icon="mdi-account-school" title="ผู้รับการประเมิน" :subtitle="`ชื่อ-สกุล: ${header.fname} ${header.lname} รอบการประเมิน: ${header.round_sys}/${header.year_sys}`" class="text-black px-0"></v-list-item>
                        </v-list>
                    </v-card>
                    <v-card rounded="xl" elevation="3">
                        <v-card-title>
                            <div class=" font-weight-bold text-title-large mb-3"><v-avatar color="#647687" icon="mdi-account-plus"></v-avatar>เพิ่มกรรมการประเมิน</div>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row v-for="(c,index) in List" :key="index">
                                    <v-col cols="12" md="6"> 
                                        <v-select :label="`กรรมการประเมินคนที่ ${index+1}`" v-model="c.id_member" variant="outlined" rounded="lg" :items="MEMBER(index).map((t)=>({title:`${t.fullname_commit}`,value:t.id_member}))"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-select :label="`ตำแหน่งกรรมการประเมินคนที่ ${index+1}`" v-model="c.role" variant="outlined" rounded="lg" :items="ROLE(index)"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" type="submit" color="primary" prepend-icon="mdi-content-save">บันทึก</v-btn>
                                            <v-btn class="text-center ma-2" color="#647687" variant="outlined" prepend-icon="mdi-arrow-left" to="/Staff/eva">ย้อนกลับ</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                    <v-card rounded="xl" elevation="3" class="mt-3">
                        <div class="d-flex align-center mb-3">
                            <v-icon icon="mdi-account-group" class="mx-2"></v-icon>
                            <div class="text-title-large font-weight-bold">กรรมการประเมิน</div>
                        </div>
                        <v-table hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">กรรมการประเมิน</th>
                                    <th class="text-center">ตำแหน่ง</th>
                                    <th class="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in List" :key="items.id_commit">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ nameOf(items.id_member) }}</td>
                                    <td class="text-center">{{ items.role }}</td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn class="ma-2" color="error" icon="mdi-delete" variant="tonal" @click="del(items.id_commit)" size="small"></v-btn>
                                        </center>
                                    </td>
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
const people = ref([])
const header = ref([])
const search = ref('')
const role = ['ประธาน','กรรมการ','เลขา']
const List = ref([
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''}
])

const id_eva = useRoute().params.id_eva
const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    try {
        await axios.post(`${staff}/commit/save/${id_eva}`,List.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('ดำเนินการสำเร็จ')
        await fetch()
    } catch (error) {
        console.error("Error save",error);
        
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/commit/member/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        people.value = res.data.pick
        const res2 = await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        header.value = res2.data
        const useData = res.data.picked
        if(useData.length === 0){
            List.value = [
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''}
            ]
        }else{

            List.value = useData.map((c)=>(
                {id_commit:c.id_commit,id_member:c.id_member,role:c.role}
            ))

            while(List.value.length < 3){
                List.value.push({id_commit:null,id_member:'',role:''})
            }

        }
    } catch (error) {
        console.error("error get",error)
    }
}



const del = async(id_commit:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/commit/delete/${id_commit}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    } catch (error) {
        console.error("error delete",error);
    }
}

const nameMap = computed(()=> Object.fromEntries(people.value.map((p)=>[p.id_member,p.fullname_commit])))
const nameOf = (id:number)=> nameMap.value[id]

const MEMBER = (idx:number)=>{
    const picked = List.value.map((c,i)=>(i !== idx ? c.id_member :null))
    return people.value.filter((p)=> !picked.includes(p.id_member))
}

const ROLE = (idx:number)=>{
    const picked = List.value.map((c,i)=>(i !== idx ? c.role :null))
    return role.filter((p)=> !picked.includes(p))
}

const go = (id_eva:number)=>{
    navigateTo({path:`/Staff/commit-eva-${id_eva}`})
}

onMounted(fetch)

</script>

<style scoped>

</style>