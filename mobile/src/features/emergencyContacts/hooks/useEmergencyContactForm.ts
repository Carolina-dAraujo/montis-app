import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { formatPhoneNumber } from '@/features/emergencyContacts/utils/formatPhoneNumber';
import { EmergencyContactFormValues } from '@/features/emergencyContacts/components/EmergencyContactFormFields';

const EMPTY_FORM: EmergencyContactFormValues = {
	name: '',
	phone: '',
	relationship: '',
};

export function useEmergencyContactForm(initialValues: EmergencyContactFormValues = EMPTY_FORM) {
	const [contact, setContact] = useState<EmergencyContactFormValues>(initialValues);
	const [focusedInput, setFocusedInput] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = useCallback((field: keyof EmergencyContactFormValues, value: string) => {
		if (field === 'phone') {
			setContact((prev) => ({ ...prev, phone: formatPhoneNumber(value) }));
			return;
		}
		setContact((prev) => ({ ...prev, [field]: value }));
	}, []);

	const isFormValid =
		contact.name.trim().length > 0 &&
		contact.phone.trim().length > 0 &&
		contact.relationship.trim().length > 0;

	const handleCancel = useCallback((message: string) => {
		if (contact.name || contact.phone || contact.relationship) {
			Alert.alert(
				'Cancelar',
				message,
				[
					{ text: 'Continuar editando', style: 'cancel' },
					{ text: 'Cancelar', style: 'destructive', onPress: () => router.back() },
				]
			);
		} else {
			router.back();
		}
	}, [contact]);

	const validateBeforeSave = useCallback(() => {
		if (!isFormValid) {
			Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
			return false;
		}
		if (isSubmitting) {
			return false;
		}
		return true;
	}, [isFormValid, isSubmitting]);

	return {
		contact,
		setContact,
		focusedInput,
		setFocusedInput,
		isSubmitting,
		setIsSubmitting,
		handleChange,
		isFormValid,
		handleCancel,
		validateBeforeSave,
	};
}
