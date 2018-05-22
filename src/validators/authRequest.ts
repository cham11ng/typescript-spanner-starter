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
    password: Joi.string()
      .min(6)
      .max(100)
      .label('Password')
      .required(),
    password_confirmation: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .label('Confirmation Password')
      .options({
        language: {
          any: {
            allowOnly: 'must match password'
          }
        }
      })
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
