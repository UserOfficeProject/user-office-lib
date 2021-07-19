import sanitizeHtml, { IOptions } from 'sanitize-html';
import * as Yup from 'yup';

// options to remove all html tags and get only text characters count
const sanitizerValidationConfig: IOptions = {
  allowedTags: [],
  disallowedTagsMode: 'discard',
  allowedAttributes: {},
  allowedStyles: {},
  selfClosing: [],
  allowedSchemes: [],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: [],
};

const sanitizeHtmlAndCleanText = (htmlString: string) => {
  const sanitized = sanitizeHtml(htmlString, sanitizerValidationConfig);

  /**
   * NOTE:
   * 1. Remove all newline characters from counting.
   * 2. Replace the surrogate pairs(emojis) with _ and count them as one character instead of two ("😀".length = 2).
   *    https://stackoverflow.com/questions/31986614/what-is-a-surrogate-pair
   */
  const sanitizedCleaned = sanitized
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '_')
    .trim();

  return sanitizedCleaned;
};

export const richTextInputQuestionValidationSchema = (field: any) => {
  let schema = Yup.string().transform(function (value: string) {
    return sanitizeHtmlAndCleanText(value);
  });

  const config = field.config;

  if (config.required) {
    schema = schema.required('This is a required field');
  }

  if (config.max) {
    schema = schema.max(
      config.max,
      `Value must be at most ${config.max} characters`
    );
  }

  return schema;
};
