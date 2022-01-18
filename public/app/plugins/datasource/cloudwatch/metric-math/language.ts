import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';

// Metric Math: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html
export const METRIC_MATH_FNS = [
  'ABS',
  'ANOMALY_DETECTION_BAND',
  'AVG',
  'CEIL',
  'DATAPOINT_COUNT',
  'DIFF',
  'DIFF_TIME',
  'FILL',
  'FIRST',
  'LAST',
  'FLOOR',
  'IF',
  'INSIGHT_RULE_METRIC',
  'LOG',
  'LOG10',
  'MAX',
  'METRIC_COUNT',
  'METRICS',
  'MIN',
  'MINUTE',
  'HOUR',
  'DAY',
  'DATE',
  'MONTH',
  'YEAR',
  'EPOCH',
  'PERIOD',
  'RATE',
  'REMOVE_EMPTY',
  'RUNNING_SUM',
  'SEARCH',
  'SERVICE_QUOTA',
  'SLICE',
  'SORT',
  'STDDEV',
  'SUM',
  'TIME_SERIES',
];

export const METRIC_MATH_KEYWORDS = ['REPEAT', 'LINEAR', 'ASC', 'DSC']; // standalone magic arguments to functions

export const METRIC_MATH_OPERATORS = [
  '+',
  '-',
  '*',
  '/',
  '^',
  '==',
  '!=',
  '<=',
  '>=',
  '<',
  '>',
  'AND',
  '&&',
  'OR',
  '||',
];

export const language: monacoType.languages.IMonarchLanguage = {
  id: 'metricMath',
  ignoreCase: false,
  brackets: [
    { open: '[', close: ']', token: 'delimiter.square' },
    { open: '(', close: ')', token: 'delimiter.parenthesis' },
    { open: '{', close: '}', token: 'delimiter.curly' },
  ],
  tokenizer: {
    root: [{ include: '@nonNestableStates' }, { include: '@strings' }],
    nonNestableStates: [
      { include: '@variables' },
      { include: '@whitespace' },
      { include: '@numbers' },
      { include: '@assignment' },
      { include: '@keywords' },
      { include: '@operators' },
      { include: '@builtInFunctions' },
      [/[;,.]/, 'delimiter'],
      [/[(){}\[\]]/, '@brackets'], // [], (), {} are all brackets
    ],
    keywords: [[METRIC_MATH_KEYWORDS.map(escapeRegExp).join('|'), 'keyword']],
    operators: [[METRIC_MATH_OPERATORS.map(escapeRegExp).join('|'), 'operator']],
    builtInFunctions: [[METRIC_MATH_FNS.map(escapeRegExp).join('|'), 'predefined']],
    variables: [
      // [/\b[a-z]+[0-9]*\b/, 'variable'], // all metric math variables are lowercase, and potentially followed by a num
      [/\$[a-zA-Z0-9-_]+/, 'variable'], // $ followed by any letter/number we assume could be grafana template variable
    ],
    whitespace: [[/\s+/, 'white']],
    assignment: [[/=/, 'tag']],
    numbers: [
      [/0[xX][0-9a-fA-F]*/, 'number'],
      [/[$][+-]*\d*(\.\d*)?/, 'number'],
      [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number'],
    ],
    // states that start other states (aka nested states):
    strings: [
      [/'/, { token: 'string', next: '@string' }],
      [/"/, { token: 'type', next: '@string_double' }],
    ],
    string: [
      [/{/, { token: 'delimiter.curly', next: '@nestedCurly' }], // escape out of string and into nestedCurly
      [/\(/, { token: 'delimiter.parenthesis', next: '@nestedParens' }], // escape out of string and into nestedCurly
      [/"/, { token: 'type', next: '@string_double' }], // jump into double string
      [/'/, { token: 'string', next: '@pop' }], // stop being a string
      { include: '@nonNestableStates' },
      [/[^']/, 'string'], // anything that is not a quote mark as string
    ],
    string_double: [
      [/[^"]/, 'type'], // mark anything not a quote as a "type" (different string)
      [/"/, { token: 'type', next: '@pop' }], // mark also as a type and stop being in the double string state
    ],
    nestedCurly: [
      [/}/, { token: 'delimiter.curly', next: '@pop' }], // escape out of string and into braces land
      [/'/, { token: 'string', next: '@string' }], // go to string land if see start of string
      [/"/, { token: 'type', next: '@string_double' }], // go to string land if see start of string
    ],
    nestedParens: [
      [/\)/, { token: 'delimiter.parenthesis', next: '@pop' }], // escape out of string and into braces land
      [/'/, { token: 'string', next: '@string' }], // go to string land if see start of string
      [/"/, { token: 'type', next: '@string_double' }], // go to string land if see start of string
    ],
  },
};

export const conf: monacoType.languages.LanguageConfiguration = {
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
