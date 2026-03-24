import { BaseService } from "./BaseService";

export type TEducation = {
  title: string;
  videoUrl: string;
  description: string;
  thumbnailUrl: string;
  id: string;
};

export class EducationService extends BaseService<TEducation> {
  constructor() {
    super("educations");
  }
}

export const educationService = new EducationService();
