export interface TOptionProps {
  label: string;
  value: string;
  renderView?: VoidFunction;
  subMenu?: TOptionProps[];
  disabled?: boolean;
}
