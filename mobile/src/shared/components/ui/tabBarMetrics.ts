/** Layout constants for the floating tab bar pill. */
export const TAB_BAR_PILL_HEIGHT = 56;
export const TAB_BAR_BOTTOM_GAP = 10;
export const TAB_BAR_HORIZONTAL_INSET = 16;

export function getTabBarHeight(bottomInset: number): number {
	return TAB_BAR_BOTTOM_GAP + TAB_BAR_PILL_HEIGHT + bottomInset;
}

export function getTabBarScrollPadding(bottomInset: number, extra = 24): number {
	return getTabBarHeight(bottomInset) + extra;
}

/** Bottom offset for FABs / floating controls above the tab bar pill. */
export function getFloatingActionBottom(bottomInset: number, gap = 16): number {
	return getTabBarHeight(bottomInset) + gap;
}
