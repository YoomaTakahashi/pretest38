<template>
    <v-container style="max-width: 560px;">
        <PageHeader title="เปลี่ยนรหัสผ่านครังแรก" subtitle="เปลี่ยนรหัสผ่านเพื่อความปลอดภัยของท่าน" icon="mdi-lock-reset" color="#7d0c14"></PageHeader>

        <v-form @submit.prevent="saveMember">
            <v-card rounded="xl" elevation="5" class="pa-5">
                <v-text-field label="รหัสผ่านเดิม" variant="outlined" v-model="form.oldPw" :error-messages="error.oldPw" prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showPw ? 'mdi-eye':'mdi-eye-off'" :type="showPw ? 'text':'password'" @click:append-inner="showPw = !showPw" ></v-text-field>
                <v-text-field label="รหัสผ่านใหม่ (6 อักขระอักษร)" variant="outlined" v-model="form.newPw" :error-messages="error.newPw" prepend-inner-icon="mdi-lock" :append-inner-icon="showPw2 ? 'mdi-eye':'mdi-eye-off'" :type="showPw2 ? 'text':'password'" @click:append-inner="showPw2 = !showPw2" ></v-text-field>
                <v-text-field label="ยืนยันรหัสผ่าน" variant="outlined" v-model="confirm" :error-messages="error.confirm" prepend-inner-icon="mdi-lock-check" :append-inner-icon="showPw3 ? 'mdi-eye':'mdi-eye-off'" :type="showPw3 ? 'text':'password'" @click:append-inner="showPw3 = !showPw3" ></v-text-field>
                <v-btn color="#7d0c14" block prepend-icon="mdi-content-save" type="submit" >เปลี่ยนรหัสผ่าน</v-btn>
            </v-card>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api } from '~/API/base';

definePageMeta({layout:false})

const form =ref({
    oldPw:'',
    newPw:''
})
const error = ref<Record<string,string>>({})
const showPw = ref(false)
const showPw2 = ref(false)
const showPw3 = ref(false)
const confirm = ref('')


function validate(){
    error.value = {}
    if(!form.value.oldPw)error.value.oldPw = 'กรุณากรอกรหัสผ่านเดิม'
    if(form.value.newPw.trim().length < 6)error.value.newPw = 'รหัสผ่านต้องมีอักขระอย่างน้อย 6 ตัว'
    else if(form.value.newPw === form.value.oldPw)error.value.confirm = 'รหัสผ่านต้องไม่ซ้ำกับรหัสเดิม'
    if(confirm.value !== form.value.newPw)error.value.confirm = 'รหัสผ่านไม่ตรงกัน'
    if(!confirm.value)error.value.confirm = 'กรุณากรอกยืนยันรหัสผ่าน'
    return Object.keys(error.value).length === 0
    
}

const saveMember = async()=>{
    const token = localStorage.getItem('token')
    if(!validate())return
    try {
        await axios.put(`${api}/auth/changePw`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('แก้ไขสำเร็จ')
        localStorage.removeItem('statusPw')
        navigateTo('/Evaluatee')
    } catch (error) {
        console.error('Error put',error)
        alert('แก้ไขไม่สำเร็ข')
    }
}
</script>

<style scoped>

</style>