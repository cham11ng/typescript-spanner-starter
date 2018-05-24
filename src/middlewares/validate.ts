import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

import logger from '../utils/logger';
import * as regex from '../utils/regex';
import spanner from '../config/spanner';
import validate from '../utils/validate';
import { capitalize } from '../utils/string';
import ConflictError from '../exceptions/ConflictError';

/**
 * A validation middleware to validate schema.
 *
 * @param {Joi.Schema} params
 */
export function schema(params: Joi.Schema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validate(req.body, params);

      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * A validation middleware to validate unique field.
 *
 * @param {string[]} rules
 */
export function unique(rules: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (let i = 0, ruleLength = rules.length; i < ruleLength; i++) {
        const rule = rules[i];

        if (!regex.checkRule(rule)) {
          return next(new Error(`Unique Validation: Rule mismatched - ${rules[0]}`));
        }

        const [table, fields] = rule.split(':');
        const [column, request] = fields.split(',');
        const value = req.body[request || column];

        logger.debug('Unique Validation: Checking value in table', JSON.stringify({ table, column, value }, null, 2));

        const [[result]] = await spanner.run({
          json: true,
          sql: `SELECT * FROM ${table} where ${column} = @value limit 1`,
          params: {
            value
          }
        });

        if (result) {
          return next(new ConflictError(`${capitalize(column)} already exists.`));
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
