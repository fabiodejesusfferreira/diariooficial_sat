import * as PlayerRepository from "../repositories/diarioRepository";
import * as httpResponse from "../utils/http-helper";

export const getDiarioService = async () => {
  const data = await diarioRepository.findAllPlayers();
  let response = null;

  data
    ? (response = await httpResponse.OK(data))
    : (response = await httpResponse.noContent());

  return response;
};
