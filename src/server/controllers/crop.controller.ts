import { TCrop } from "../services/crop.service";
import { BaseController } from "./base.controller";

class CropController extends BaseController {
  addCrop({ payload }: { payload: TCrop }) {
    return this.cropService.create(payload);
  }
  deleteCrop({ id }: { id: string }) {
    return this.cropService.delete(id);
  }
  editCrop({ id, payload }: { id: string; payload: TCrop }) {
    return this.cropService.update(id, payload);
  }
}

export const cropController = new CropController();
