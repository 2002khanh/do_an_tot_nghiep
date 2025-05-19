import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const IS_PUBLIC_PERMISSION = 'isPublicPermission';
export const SkipCheckPermission = () =>
  SetMetadata(IS_PUBLIC_PERMISSION, true);

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsEndDateAfterStartDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEndDateAfterStartDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { startDate } = args.object as any;
          return new Date(value) > new Date(startDate);
        },
        defaultMessage(args: ValidationArguments) {
          return 'End date must be after start date';
        },
      },
    });
  };
}
