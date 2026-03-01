import axios from "./axios"; // usa tu instancia configurada

export const bloquearDia = async (data) => {
    const response = await axios.post("/bloqueo-agenda", data);
    return response.data;
};