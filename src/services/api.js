import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

export async function fetchDoctors() {
  const { data } = await api.get('/doctors');
  return data.doctors;
}

export async function fetchDoctorAvailability(doctorId, date) {
  const { data } = await api.get(`/doctors/${doctorId}/availability`, {
    params: { date },
  });
  return data;
}

export async function fetchAppointment(id) {
  const { data } = await api.get(`/appointments/${id}`);
  return data.appointment;
}

export async function fetchAppointmentByCallId(callId) {
  const { data } = await api.get('/appointments/by-call', {
    params: { callId },
  });
  return data.appointment;
}

export async function fetchAppointments() {
  const { data } = await api.get('/appointments');
  return data.appointments;
}

export async function deleteAppointment(id) {
  const { data } = await api.delete(`/appointments/${id}`);
  return data;
}

export async function fetchPatients() {
  const { data } = await api.get('/patients');
  return data.patients;
}

export async function fetchCallDetails(callId) {
  const { data } = await api.get(`/calls/${callId}`);
  return data;
}

export async function fetchCrmLeads() {
  const { data } = await api.get('/crm-leads');
  return data.leads;
}

export default api;
