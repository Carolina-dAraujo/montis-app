import { Redirect } from 'expo-router';

/** @deprecated Use /settings */
export default function ConfigLegacyRedirect() {
	return <Redirect href="/settings" />;
}
