export interface KoratValue {
  value: any,
  constraints?: KoratValueConstraints,
}

export enum KoratValueType {
  Integer = 0,
  String,
  Boolean,
}

export interface KoratValueConstraints {
  type: KoratValueType,
  required?: boolean,
  maxLength?: number
}

export function isAssignable(constraints: KoratValueConstraints, value: any): boolean {
  return true;
}

export function createValue(value?: any, constraints?: KoratValueConstraints): KoratValue {
  return {
    value,
    constraints,
  };
}
