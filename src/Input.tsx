import React, {
  ChangeEvent, useState, FocusEvent, useEffect,
} from 'react';

import FormControl from 'react-bootstrap/FormControl';

export type Nothing = {type:'invalid'};
export type Just<X> = {type:'valid', value:X};
export type Maybe<X> = Just<X>|Nothing;

const Nothing: Nothing = { type: 'invalid' };
const Just = (e:X):Just<X> => ({ type: 'valid', value: e });

export function Maybe<X, Y>(value:Maybe<X>, f:(i:X)=> Y, g:()=> Y):Y {
  if (value.type === 'valid') {
    return f(value.value);
  }
  g();
}

type Validation<X> = {
  format:(i:X)=>string,
  displayFormat:(i:X, editFormat:string)=>string,
  unformat:(i:string)=>X,
  match:RegExp,
  equals:(a:X, b:X)=> boolean
}

type InputTypes = 'number'|'date';
type InputValues = number|Date;

const NumValidition : Validation<number> = (function () {
  function format(num:number) {
    return num != null ? num.toString() : '';
  }
  return {
    format,
    displayFormat: (_, old) => old,
    unformat(str:string) {
      // const val = parseInt(str, 10);
      const val = Object.is(str, '') ? NaN : Number(str);
      return Number.isNaN(val) ? null : val;
    },
    match: /^-?\d*\.?\d*e?-?\d*$/,
    equals: (x, y) => x === y,
  };
}());

const DateValidition : Validation<Date> = (function () {
  function fixDateString(str:string) {
    // yyyy-mm-dd
    if (str === '') return '';
    const { groups: { year, month, day } } = str.match(/(?<year>\d*)(-(?<month>\d*)(-(?<day>\d*))?)?/);
    const date = [year, month, day]
      .map((v, i) => (v && v !== '' ? v.padStart(i === 0 ? 4 : 2, '0') : '01'))
      .join('-')
      .replace('--', '');
    return date;
  }

  return {
    format(date:Date) {
      return (date !== null && 'toISOString' in date) ? date.toISOString().split('T')[0] : '';
    },
    displayFormat(date) {
      return (date != null) ? date.toDateString() : '';
    },
    unformat(str:string) {
    // bug : missing padding for year , month or day causes a day dec
      const date = fixDateString(str);
      const val = new Date(date);
      return Number.isNaN(val.getTime()) ? null : val;
    },
    match: /^\+?[\d-]*$/,
    equals: (x, y) => (x !== null && y !== null) && (x.getTime() === y.getTime()),
  };
}());

// function useValue<X>(initValue, validation:Validation<X>) {
//   const { format, unformat, match } = validation;
//   const [value, setValue] = useState(format(globalValue));
//   const [valid, setValid] = useState(true);
// }
type InputProps={
  onChange:(_a:ChangeEvent<HTMLInputElement>, _b:Maybe<InputValues>)=>void,
  value:InputValues,
  validitionType:InputTypes

};
export default function Input(props:InputProps) {
  const {
    onChange, value: globalValue, validitionType,
    ...rest
  } = props;
  const {
    format, displayFormat, unformat,
    match, equals,
  } = (function choose(choice) {
    switch (choice) {
      case 'number': return NumValidition;
      case 'date': return DateValidition;
      default: throw Error('not a type');
    }
  }(validitionType));
  const [value, setValue] = useState(format(globalValue));
  const [valid, setValid] = useState(true);
  const [focus, setFocus] = useState(false);
  useEffect(function autoformat() {
    const gv = format(globalValue);
    if (!equals(unformat(gv), unformat(value))) {
      setValue(gv);
    }
  }, [globalValue]);

  function $onBlur(e:FocusEvent<HTMLInputElement>) {
    if (value === '') {
      setValid(true);
      onChange(e, Just(null));
    } else {
      const $value = unformat(value.toString());
      const $valid = !Object.is($value, null);
      setValid($valid);
      onChange(e, $valid ? Just($value) : Nothing);
    }
  }
  function $onChange(e:ChangeEvent<HTMLInputElement>) {
    if (e.target.value.match(match)) {
      setValue(e.target.value);
    }
  }
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormControl
      {...rest}
      type="text"
      value={(focus || !valid || value === '') ? value : displayFormat(globalValue, value)}
      onBlur={(e) => (setFocus(false), $onBlur(e))}
      onFocus={() => setFocus(true)}
      isValid={valid && value !== '' && !focus}
      isInvalid={!valid}
      onChange={$onChange}
    />
  );
}
