import joi from 'joi';
import { Types } from 'mongoose';

export const createMessageSchema = joi.object({
  sender: joi.string().required(),

  receiver: joi.custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) return true, value;
    return helpers.message({ custom: 'Receiver ID validation' });
  }, 'Receiver ID validation').required(),

  content: joi.string().min(1).max(1000).required(),

});

// export function validateMessage(message) {
//   return createMessageSchema.validate(message);
// }

export const singleMessageSchema = joi.object({
  messageID: joi.custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) return true, value;
    return helpers.message({ custom: 'Message ID validation' });
  }, 'Message ID validation').required(),
});

// export function validateSingleMessage(params) {
//   return singleMessageSchema.validate(params);
// }


export const flags = {
  inbox: 'inbox',
  outbox: 'outbox'
}


export const allMessagesSchema = joi.object({
  flag: joi.valid(...Object.values(flags)).required(), // destrcturing the values from the flags object => values (compare to ['inbox','outbox'])

  sender: joi.custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) return true, value;
    return helpers.message({ custom: 'Sender ID validation' });
  }, 'Sender ID validation'),

  receiver: joi.custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) return true, value;
    return helpers.message({ custom: 'Receiver ID validation' });
  }, 'Receiver ID validation'),

});
