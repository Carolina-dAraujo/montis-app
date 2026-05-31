import { Redirect } from 'expo-router';

export default function CadastroLegacyRedirect() {
	return <Redirect href="/(auth)/register" />;
}
