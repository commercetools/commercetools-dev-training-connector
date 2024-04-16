import validator from 'validator';

/**
 * File used to create helpers to validate the fields
 */

const required =
  (fn) =>
  (value, ...args) =>
    !(value === undefined || value === null) && fn(...[String(value), ...args]);

export const standardString = (path, message, overrideConfig = {}) => [
  path,
  [
    [
      required(validator.isLength),
      message,
      [{ min: 2, max: 20, ...overrideConfig }],
    ],
  ],
];

export const standardEmail = (path, message) => [
  path,
  [[required(validator.isEmail), message]],
];

export const standardNaturalNumber = (path, message) => [
  path,
  [
    [
      required((value) =>
        validator.isNumeric(String(value), { no_symbols: true })
      ),
      message,
    ],
  ],
];

export const standardKey = (path, message) => [
  path,
  [
    [
      required(
        (value) =>
          validator.isLength(String(value), { min: 2 }) &&
          /^[a-zA-Z0-9-_]+$/.test(value)
      ),

      message,
    ],
  ],
];

export const standardUrl = (path, message, overrideOptions = {}) => [
  path,
  [
    [
      required(validator.isURL),
      message,
      [
        {
          require_protocol: true,
          require_valid_protocol: true,
          protocols: ['http', 'https'],
          require_host: true,
          require_port: false,
          allow_protocol_relative_urls: false,
          allow_fragments: false,
          allow_query_components: true,
          validate_length: true,
          ...overrideOptions,
        },
      ],
    ],
  ],
];

export const getValidateMessages = (validatorConfigs, item) =>
  validatorConfigs.flatMap(([path, validators]) => {
    return validators.reduce((acc, [validatorFn, message, args = []]) => {
      const valueToValidate = path.reduce((val, property) => {
        return val[property];
      }, item);
      if (!validatorFn(...[valueToValidate, ...args])) {
        return acc.concat(message);
      }
      return acc;
    }, []);
  });


export const array =
  (fn) =>
  (...args) => {
    const [path, validators] = fn(...args);
    return [
      path,
      validators.map(([fn, message, validatorArgs]) => [
        (value, ...args) =>
          Array.isArray(value) &&
          value.every((value) => fn(...[value, ...args])),
        message,
        validatorArgs,
      ]),
    ];
  };

export const region = (path, message) => [
  path,
  [
    [
      required(
        required((value) =>
          validator.isIn(value, [
            'us-central1.gcp',
            'us-east-2.aws',
            'europe-west1.gcp',
            'eu-central-1.aws',
            'australia-southeast1.gcp',
          ])
        )
      ),
      message,
    ],
  ],
];