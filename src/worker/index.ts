import { Communicate } from "../interfaces";
import {
	ACKNOWLEDGE_MESSAGE,
	CLOSE_EXTENSION,
	CONNECT,
	CONNECTION_INITIATED,
	INIT_EXTENSION,
} from "../states";

chrome.action.disable();
chrome.tabs.onUpdated.addListener(
	(
		tabId: number,
		changeInfo: chrome.tabs.TabChangeInfo,
		tab: chrome.tabs.Tab
	) => {
		if (changeInfo.status === "complete") {
			chrome.action.enable();
		}
	}
);

chrome.action.onClicked.addListener(({ id }) => {
	if (id) {
		chrome.tabs.sendMessage(id, {
			status: INIT_EXTENSION,
		});
	}
});

chrome.runtime.onConnect.addListener(async (port: chrome.runtime.Port) => {
	if (port.name === CONNECT) {
		// Perform some operation when connection is established

		port.onMessage.addListener(
			(message: Communicate, port: chrome.runtime.Port) => {
				console.log("received at worker", message);
				switch (message.status) {
					case CONNECTION_INITIATED:
						port.postMessage({
							status: ACKNOWLEDGE_MESSAGE,
						});
						break;
					case CLOSE_EXTENSION:
						port.disconnect();
						break;
					default:
						break;
				}
				return true;
			}
		);
	}
});
