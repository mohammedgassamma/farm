import { TLivestock } from "../services/livestock.service";
import { BaseController } from "./base.controller";

class LivestockController extends BaseController {
  addLivestock({ payload }: { payload: TLivestock }) {
    return this.livestockService.create(payload);
  }
  deleteLivestock({ id }: { id: string }) {
    return this.livestockService.delete(id);
  }
  editLivestock({ id, payload }: { id: string; payload: TLivestock }) {
    return this.livestockService.update(id, payload);
  }
}

export const livestockController = new LivestockController();
