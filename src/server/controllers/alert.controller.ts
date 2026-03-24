import { TAlert } from "../services/alert.service";
import { BaseController } from "./base.controller";

class AlertController extends BaseController {
  addAlert({ payload }: { payload: TAlert }) {
    return this.alertService.create(payload);
  }
  deleteAlert({ id }: { id: string }) {
    return this.alertService.delete(id);
  }
  editAlert({ id, payload }: { id: string; payload: TAlert }) {
    return this.alertService.update(id, payload);
  }
}

export const alertController = new AlertController();
