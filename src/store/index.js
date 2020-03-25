/* eslint-disable no-console */


import { createStore ,applyMiddleware, compose} from "redux";
import todoList from "./reducer/index";
console.log(process.env.NODE_ENV);
export default function configStore() {
	const store = createStore(todoList, 
	(process.env.NODE_ENV === 'development') &&
	  typeof window === 'object' &&
	  typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f // add support for Redux dev tools
  );
	return store;
}

