import React, {
  CSSProperties, Reducer, ReducerState, useReducer,
} from 'react';

type Key=string|number|symbol;
type MessageType = 'Error'|'Success'|'Warning';
export type Message={source:string, message:string, key?:Key, type?:MessageType};

export type Command =
{command:'push', type?:MessageType, arg:Message }|{command:'clear', key?:Key}|{command:'pop'};

function reducer(state:ReducerState<Reducer<Message[], Command>>, action:Command) {
  switch (action.command) {
    case 'clear':
      if (action.key) {
        return state.filter(({ key }) => key !== action.key);
      }
      return [];
    case 'push':
      return state.concat([action.arg]);
    case 'pop':
      return state.slice(0, -1);
    default:
      return state;
  }
}

function getKey(msg:Message) {
  const key = Object.entries(msg).sort().map(([k, v]) => v.toString())
    .join('-');
    // Buffer.from(key).toString('base64')
  return btoa(key);
}
function NotificationStyle(type:MessageType):CSSProperties {
  return {
    backgroundColor: (function chooseColor() {
      switch (type) {
        case 'Error':
          return 'red';
        case 'Success':
          return '#00ff0a';// green
        case 'Warning':
          return '#ffeb3b';// yellow
        default:
          return 'whitesmoke';
      }
    }()),
  };
}
export default function useErrorBanner() {
  const [MessageQueue, dispatchError] = useReducer(reducer, []);
  function ErrorBanner({ display = true }:{display?:boolean}) {
    if (display && MessageQueue.length > 0) {
      return (
        <h2>

          {MessageQueue.map((msg) => (
            <p
              style={NotificationStyle(msg.type || 'Error')}
              key={getKey(msg)}
            >
              {`${msg.source} : ${msg.message}`}
            </p>
          ))}
        </h2>
      );
    } return null;
  }
  ErrorBanner.defaultProps = {
    display: true,
  };
  return {
    pushError(error:Message) {
      dispatchError({ command: 'push', type: 'Error', arg: error });
    },
    pushSuccess(msg:Message) {
      dispatchError({ command: 'push', type: 'Success', arg: msg });
    },
    clearAllErrors() {
      dispatchError({ command: 'clear' });
    },
    clearErrors(key:Key) {
      dispatchError({ command: 'clear', key });
    },
    ErrorBanner,
    MessageQueue,
  };
}
