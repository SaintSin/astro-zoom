/**
 * De-slugify a URL segment to Title Case
 * e.g. "getting-started" → "Getting Started"
 */
function deslugify(slug: string): string {
	return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

interface BreadcrumbItem {
	"@type": "ListItem";
	position: number;
	name: string;
	item?: string;
}

/**
 * Generate a BreadcrumbList JSON-LD object from a URL pathname.
 *
 * @param pathname - The current page pathname (e.g. "/docs/getting-started/")
 * @param baseUrl - The site base URL (e.g. "https://example.com")
 * @param pageTitle - Optional human-readable title for the last breadcrumb item
 */
export function generateBreadcrumbJsonLd(
	pathname: string,
	baseUrl: string,
	pageTitle?: string,
) {
	const segments = pathname.split("/").filter(Boolean);

	const homeItem: BreadcrumbItem = {
		"@type": "ListItem",
		position: 1,
		name: "Home",
		...(segments.length > 0 && { item: `${baseUrl}/` }),
	};

	const segmentItems: BreadcrumbItem[] = segments.map((segment, i) => {
		const isLast = i === segments.length - 1;
		const path = `/${segments.slice(0, i + 1).join("/")}`;
		const name = isLast && pageTitle ? pageTitle : deslugify(segment);
		return {
			"@type": "ListItem",
			position: i + 2,
			name,
			...(!isLast && { item: `${baseUrl}${path}/` }),
		};
	});

	return {
		"@type": "BreadcrumbList",
		itemListElement: [homeItem, ...segmentItems],
	};
}
