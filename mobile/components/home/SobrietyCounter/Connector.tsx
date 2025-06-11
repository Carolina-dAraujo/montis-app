import { View } from 'react-native';
import { styles } from './styles';

type ConnectorProps = {
	isCompleted: boolean;
};

export function Connector({ isCompleted }: ConnectorProps) {
	return (
		<View style={[
			styles.connector,
			isCompleted && styles.connectorCompleted
		]} />
	);
}
