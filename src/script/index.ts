import { Communicate } from "../interfaces";
import {
	ACKNOWLEDGE_MESSAGE,
	CONNECT,
	CONNECTION_INITIATED,
	INIT_EXTENSION,
} from "../states";

let port: chrome.runtime.Port | null = null;

chrome.runtime.onMessage.addListener((message: Communicate, _, resp: any) => {
	console.log("initiated", message);

	if (message.status === INIT_EXTENSION) {
		if (!port) {
			port = chrome.runtime.connect({
				name: CONNECT,
			});
			port.postMessage({
				status: CONNECTION_INITIATED,
			});
		}

		port.onMessage.addListener(
			(message: Communicate, port: chrome.runtime.Port) => {
				console.log("received at script", message);

				switch (message.status) {
					case ACKNOWLEDGE_MESSAGE:
						console.log("connection is working.");
						break;
					default:
						break;
				}
			}
		);
	}
});
