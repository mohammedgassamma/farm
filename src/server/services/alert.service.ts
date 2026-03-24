import { BaseService } from "./BaseService";

export enum EAlertType {
  SYSTEM = "system",
  LOCAL = "local",
  ECONOMICAL = "economical",
}

export type TAlert = {
  type: EAlertType;
  title: string;
  message: string;
  createdAt: Date;
  id: string;
};

export class AlertService extends BaseService<TAlert> {
  constructor() {
    super("alerts");
  }
}

export const alertService = new AlertService();
