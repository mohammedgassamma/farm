import { cropService } from "@/server/services/crop.service";
import { livestockService } from "@/server/services/livestock.service";

export const getAllUsersFullData = async () => {
  const [crops, livestock] = await Promise.all([
    cropService.findAllWithUsers(),
    livestockService.findAllWithUsers(),
  ]);

  return {
    crops,
    livestock,
  };
};