import Joi from 'joi';

export const loginSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .min(10)
      .max(100)
      .label('Email')
      .required(),
    password: Joi.string()
      .min(6)
      .max(100)
      .label('Password')
      .required()
  });

export const resetSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    token: Joi.string()
      .min(10)
      .max(100)
      .label('Verification token')
      .required(),
    email: Joi.string()
      .min(10)
      .max(100)
      .label('Email')
      .required(),
    oldPassword: Joi.string()
      .min(6)
      .max(100)
      .label('Password')
      .required(),
    newPassword: Joi.string()
      .min(6)
      .max(100)
      .label('Password')
      .required()
  });

export const forgotSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .min(10)
      .max(100)
      .label('Email')
      .required()
  });
