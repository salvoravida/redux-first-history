import React from 'react';
import { History } from 'history';

export interface HistoryRouterProps {
   basename?: string;
   children?: React.ReactNode;
   history: History;
}
export declare function HistoryRouter({
   basename,
   children,
   history,
}: HistoryRouterProps): JSX.Element;
