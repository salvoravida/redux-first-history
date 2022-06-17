// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/reach__router/index.d.ts
/**
 * cloning reach router types so the packages does not depends on reach/router types if not used.
 * to be removed in v6 and deprecate reach-router
 */

interface HLocation<S = unknown> {
   pathname: string;
   search: string;
   state: S;
   hash: string;
   key?: string | undefined;
}
type WindowLocation<S = unknown> = Window['location'] & HLocation<S>;

type HistoryActionType = 'PUSH' | 'POP';
type HistoryLocation = WindowLocation & { state?: any };
interface HistoryListenerParameter {
   location: HistoryLocation;
   action: HistoryActionType;
}
type HistoryListener = (parameter: HistoryListenerParameter) => void;
type HistoryUnsubscribe = () => void;

interface NavigateOptions<TState> {
   state?: TState | undefined;
   replace?: boolean | undefined;
}
interface NavigateFn {
   // eslint-disable-next-line @typescript-eslint/ban-types
   (to: string, options?: NavigateOptions<{}>): Promise<void>;
   (to: number): Promise<void>;
}

export interface ReachHistory {
   readonly location: HistoryLocation;
   readonly transitioning: boolean;
   listen: (listener: HistoryListener) => HistoryUnsubscribe;
   navigate: NavigateFn;
}
