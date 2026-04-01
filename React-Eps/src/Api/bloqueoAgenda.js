/*
 * API de bloqueo de agenda.
 * Gestiona bloqueo de dias/horarios en la agenda medica.
 */
import axios from "./axios"; // usa tu instancia configurada

export const bloquearDia = async (data) => {
    const response = await axios.post("/bloqueo-agenda", data);
    return response.data;
};
