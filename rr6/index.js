"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
   return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryRouter = void 0;
/* eslint-disable react/no-children-prop */
var react_1 = __importDefault(require("react"));
var react_router_1 = require("react-router");
function HistoryRouter(_a) {
   var basename = _a.basename, children = _a.children, history = _a.history;
   var _b = react_1.default.useState({
      action: history.action,
      location: history.location,
   }), state = _b[0], setState = _b[1];
   react_1.default.useLayoutEffect(function () { return history.listen(setState); }, [history]);
   return react_1.default.createElement(react_router_1.Router, {
      basename: basename,
      children: children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
   });
}
exports.HistoryRouter = HistoryRouter;