const DATE_FORMAT_OPTIONS = {
	day: "2-digit",
	month: "short",
	year: "numeric",
};

const DATE_TIME_FORMAT_OPTIONS = {
	day: "2-digit",
	month: "short",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	hour12: true,
};

function parseDateLike(value) {
	if (!value) {
		return null;
	}

	const parsedDate = new Date(value);

	return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function formatDate(value) {
	const parsedDate = parseDateLike(value);

	return parsedDate ? parsedDate.toLocaleDateString("en-GB", DATE_FORMAT_OPTIONS) : "-";
}

export function formatDateTime(value) {
	const parsedDate = parseDateLike(value);

	return parsedDate ? parsedDate.toLocaleString("en-GB", DATE_TIME_FORMAT_OPTIONS) : "-";
}

export function formatDateRange(fromDate, toDate) {
	if (!fromDate && !toDate) {
		return "-";
	}

	return `${formatDate(fromDate)} to ${formatDate(toDate)}`;
}
