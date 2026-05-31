import { Redirect } from 'expo-router';

export default function ConfirmPasswordLegacyRedirect() {
	return <Redirect href="/(config)/confirm-password" />;
}
