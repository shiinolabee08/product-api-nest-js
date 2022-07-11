import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValid } from 'postcode';

@ValidatorConstraint({ name: 'IsValidUkPostCode' })
export class IsValidUkPostCodeConstraint
implements ValidatorConstraintInterface {
  validate(value?) {
    return isValid(value || '');
  }

  public defaultMessage() {
    return 'Please enter a valid Postcode.';
  }
}

export function IsValidUkPostCode(validationOptions?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidUkPostCodeConstraint,
    });
  };
}
