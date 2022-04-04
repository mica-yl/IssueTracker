import React, { Reducer, ReducerState, useReducer } from 'react';

type ErrorMsg={source:string, message:string};

type Command =
{command:'push', arg:ErrorMsg }|{command:'clear'}|{command:'pop'};

function reducer(state:ReducerState<Reducer<ErrorMsg[], Command>>, action:Command) {
  switch (action.command) {
    case 'clear':
      return [];
    case 'push':
      return state.concat([action.arg]);
    case 'pop':
      return state.slice(0, -1);
    default:
      return state;
  }
}

export default function useErrorBanner() {
  const [errorQueue, dispatchError] = useReducer(reducer, []);
  function ErrorBanner({ display = true }:{display?:boolean}) {
    if (display && errorQueue.length > 0) {
      return (
        <h2 style={{ backgroundColor: 'red' }}>

          {errorQueue.map((err) => <p>{`${err.source} : ${err.message}`}</p>)}
        </h2>
      );
    } return null;
  }
  ErrorBanner.defaultProps = {
    display: true,
  };
  return {
    pushError(error:ErrorMsg) {
      dispatchError({ command: 'push', arg: error });
    },
    clearAllErrors() {
      dispatchError({ command: 'clear' });
    },
    ErrorBanner
    ,
  };
}