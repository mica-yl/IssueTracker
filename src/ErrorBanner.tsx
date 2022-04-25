import React, {
  CSSProperties, Reducer, ReducerState, useReducer,
} from 'react';
import Alert from 'react-bootstrap/Alert';

type Key=string|number|symbol;
type MessageType = 'Error'|'Success'|'Warning';

const invariants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light'] as const;
type Variant = (typeof invariants) [number];

export type Message={source:string, message:string, key?:Key, type?:MessageType};

export type Command =
{command:'push', type?:MessageType, arg:Message }|{command:'clear'|'hide', key?:Key}|{command:'pop'};

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
    case 'hide':
      return state.filter((_, i) => i !== action.key);
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
function NotificationStyle(type:MessageType|Variant):string {
  switch (type) {
    case 'Error':
      return 'danger';
    case 'Success':
      return 'success';// green
    case 'Warning':
      return 'warning';// yellow
    default:
      return type;
  }
}
export default function useErrorBanner() {
  const [MessageQueue, dispatchError] = useReducer(reducer, []);
  const hide = (i) => dispatchError({ command: 'hide', key: i });
  function ErrorBanner({ display = true, alertStyle = {} }:
    {display?:boolean, alertStyle:CSSProperties}) {
    if (display && MessageQueue.length > 0) {
      return (
        <>

          {MessageQueue.map((msg, i) => (
            <Alert
              key={getKey(msg)}
              variant={NotificationStyle(msg.type || 'danger')}
              onClose={() => hide(i)}
              dismissible
              style={alertStyle}
            >
              <Alert.Heading>{msg.source}</Alert.Heading>
              <p>{msg.message}</p>
            </Alert>
          ))}
        </>
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
