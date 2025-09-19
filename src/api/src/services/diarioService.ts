import * as diarioRepository from "../repositories/diarioRepository"; // Corrigido
import * as httpResponse from "../utils/htt-helper"; // Assumindo que este arquivo existe

export const getDiarioService = async () => {
  const data = await diarioRepository.findAll(); 
  let response = null;

  if (data) {
    response = await httpResponse.OK(data);
  } else {
    response = await httpResponse.noContent();
  }

  return response;
};