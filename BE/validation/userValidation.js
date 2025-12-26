import joi from 'joi';
import { Types } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const updateProfileSchema = joi
  .object({
    id: joi.string().custom(objectIdValidator).required(),
    email: joi.string().email().required(),
    userName: joi.string().min(3).max(20).required(),
  })
  .required();

export const changePasswordSchema = joi
  .object({
    email: joi.string().email().required(),
    currentPassword: joi.string().min(6).required(),
    newPassword: joi.string().not(joi.ref('currentPassword')).min(6).required(),
    confirmNewPassword: joi.string().valid(joi.ref('newPassword')).required(),
  })
  .required();