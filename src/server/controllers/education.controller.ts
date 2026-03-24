import { TEducation } from "../services/education.service";
import { BaseController } from "./base.controller";

class EducationController extends BaseController {
  addEducation({ payload }: { payload: TEducation }) {
    return this.educationService.create(payload);
  }
  deleteEducation({ id }: { id: string }) {
    return this.educationService.delete(id);
  }
  editEducation({ id, payload }: { id: string; payload: TEducation }) {
    return this.educationService.update(id, payload);
  }
}

export const educationController = new EducationController();
