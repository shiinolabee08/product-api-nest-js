import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'IsValidAge' })
export class IsValidAgeConstraint implements ValidatorConstraintInterface {
  validate(value, args: ValidationArguments) {
    const [IsvalidAge] = args.constraints;
    const maxDate = moment().subtract(IsvalidAge, 'years').toDate();
    const birthDate = moment(value).toDate();

    return birthDate <= maxDate;
  }

  public defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `You must be at least ${relatedPropertyName} years old`;
  }
}

export function IsValidAge(
  property: number,
  validationOptions?: ValidationOptions,
) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsValidAgeConstraint,
    });
  };
}
