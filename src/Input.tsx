import React, {
  ChangeEvent, useState, FocusEvent, useEffect,
} from 'react';

type Validation<X> = {
  format:(i:X)=>string,
  unformat:(i:string)=>X,
  match:RegExp,
}

type InputTypes = 'number'|'date';
type InputValues = number|Date;

const NumValidition : Validation<number> = {
  format(num:unknown) {
    return num != null ? num.toString() : '';
  },
  unformat(str:string) {
  // const val = parseInt(str, 10);
    const val = Object.is(str, '') ? NaN : Number(str);
    return Number.isNaN(val) ? null : val;
  },
  match: /^-?\d*\.?\d*e?-?\d*$/,
};

const DateValidition : Validation<Date> = {
  format(num:unknown) {
    return num != null ? num.toString() : '';
  },
  unformat(str:string) {
  // const val = parseInt(str, 10);
    const val = Object.is(str, '') ? NaN : Number(str);
    return Number.isNaN(val) ? null : val;
  },
  match: /^\d{0,2}-[A-Z]{3}-\d{4}$/,
};

// function useValue<X>(initValue, validation:Validation<X>) {
//   const { format, unformat, match } = validation;
//   const [value, setValue] = useState(format(globalValue));
//   const [valid, setValid] = useState(true);
// }

export default function Input(props:
  {
    onChange:(_a:ChangeEvent<HTMLInputElement>, _b:InputValues)=>void,
    value:InputValues,
    validitionType:InputTypes

  }) {
  const { onChange, value: globalValue, validitionType } = props;
  const { format, unformat, match } = (function choose(choice) {
    switch (choice) {
      case 'number': return NumValidition;
      case 'date': return DateValidition;
      default: throw Error('not a type');
    }
  }(validitionType));
  const [value, setValue] = useState(format(globalValue));
  const [valid, setValid] = useState(true);
  function $onBlur(e:FocusEvent<HTMLInputElement>) {
    const val = unformat(value.toString());
    if (Object.is(val, null)) {
      setValid(false);
    } else {
      setValid(true);
      onChange(e, val);
    }
  }
  function $onChange(e:ChangeEvent<HTMLInputElement>) {
    // const match = /^-?\d*\.?\d*e?-?\d*$/;
    if (e.target.value.match(match)) {
      setValue(e.target.value);
    }
  }
  useEffect(function autoformat() {
    const gv = format(globalValue);
    if (unformat(gv) !== unformat(value)) {
      setValue(gv);
    }
  }, [globalValue]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <input
      type="text"
      {...props}
      value={value}
      onBlur={$onBlur}
      style={!valid ? { borderColor: 'red' } : {}}
      onChange={$onChange}
    />
  );
}
