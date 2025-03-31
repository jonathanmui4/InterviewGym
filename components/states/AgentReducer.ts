import { CallStatus } from "../Enums";

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

interface AgentState {
    isSpeaking: boolean;
    callStatus: CallStatus;
    messages: SavedMessage[];
}

type AgentAction =
  | { type: 'CALL_CONNECTING' }
  | { type: 'CALL_STARTED' }
  | { type: 'CALL_ENDED' }
  | { type: 'SPEECH_STARTED' }
  | { type: 'SPEECH_ENDED' }
  | { type: 'MESSAGE_RECEIVED'; payload: SavedMessage };

export const initialState: AgentState = {
    isSpeaking: false,
    callStatus: CallStatus.INACTIVE,
    messages: []
}

export const AgentReducer = (state: AgentState, action: AgentAction): AgentState => {
    switch (action.type) {
        case 'CALL_CONNECTING':
          return { ...state, callStatus: CallStatus.CONNECTING };
        case 'CALL_STARTED':
          return { ...state, callStatus: CallStatus.ACTIVE };
        case 'CALL_ENDED':
          return { ...state, callStatus: CallStatus.FINISHED };
        case 'SPEECH_STARTED':
          return { ...state, isSpeaking: true };
        case 'SPEECH_ENDED':
          return { ...state, isSpeaking: false };
        case 'MESSAGE_RECEIVED':
          return { 
            ...state, 
            messages: [...state.messages, action.payload]
          };
        default:
          return state;
      }
}
