export const STORAGE_KEYS = {
	activities: "wwrams.activities",
	reportDraft: "wwrams.reportDraft",
	reports: "wwrams.reports",
};

export const ACTIVITY_STATUSES = ["Completed", "In Progress", "Pending"];

export const ACTIVITY_PRIORITIES = ["High", "Medium", "Low"];

export const DEFAULT_EMPLOYEE = {
	id: "EMP001",
	name: "Divya Azad",
	department: "Software Development",
	designation: "Frontend Intern",
};

export function safeJsonParse(serializedValue, fallbackValue) {
	if (!serializedValue) {
		return fallbackValue;
	}

	try {
		return JSON.parse(serializedValue);
	} catch {
		return fallbackValue;
	}
}

export function createId(prefix) {
	const randomSegment = Math.random().toString(36).slice(2, 7).toUpperCase();

	return `${prefix}-${Date.now()}-${randomSegment}`;
}

export function createEmptyActivity() {
	return {
		id: createId("ACT"),
		title: "",
		project: "",
		date: "",
		hours: "",
		status: "Completed",
		priority: "Medium",
		isEditing: true,
	};
}

export function normalizeActivity(activity = {}) {
	return {
		id: activity.id || createId("ACT"),
		title: activity.title ?? "",
		project: activity.project ?? "",
		date: activity.date ?? "",
		hours: activity.hours ?? "",
		status: ACTIVITY_STATUSES.includes(activity.status) ? activity.status : "Completed",
		priority: ACTIVITY_PRIORITIES.includes(activity.priority) ? activity.priority : "Medium",
		isEditing: activity.isEditing ?? false,
	};
}

export function getStoredArray(storageKey) {
	if (typeof window === "undefined") {
		return [];
	}

	const parsedValue = safeJsonParse(window.localStorage.getItem(storageKey), []);

	return Array.isArray(parsedValue) ? parsedValue : [];
}

export function setStoredValue(storageKey, value) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function removeStoredValue(storageKey) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(storageKey);
}
