import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const replacements = [
	['@/mobile/constants/Colors', '@/shared/theme/colors'],
	['@/mobile/constants/fieldConfig', '@/shared/config/fieldConfig'],
	['@/mobile/services/storage', '@/shared/lib/storage'],
	['@/mobile/services/api', '@/services/api'],
	["from 'services/api'", "from '@/services/api'"],
	['@/mobile/components/inputs/', '@/shared/components/inputs/'],
	['@/mobile/components/ui/', '@/shared/components/ui/'],
	['@/mobile/components/LoadingScreen', '@/shared/components/LoadingScreen'],
	['@/mobile/components/AuthScreenWrapper', '@/shared/components/AuthScreenWrapper'],
	['@/mobile/components/common/', '@/shared/components/common/'],
	['@/mobile/components/EmergencyAlertButton', '@/shared/components/EmergencyAlertButton'],
	['@/mobile/services/EmergencyContactsService', '@/features/emergencyContacts/api'],
	['@/mobile/services/EmergencyAlertService', '@/features/emergencyContacts/alertsApi'],
	['@/mobile/services/locationService', '@/features/groups/lib/locationService'],
	['@/mobile/contexts/AuthContext', '@/features/auth/context/AuthProvider'],
	['@/mobile/contexts/OnboardingContext', '@/features/onboarding/context/OnboardingProvider'],
	['@/mobile/src/types/onboarding', '@/features/onboarding/types'],
	['@/mobile/assets/', '@/assets/'],
	['@/mobile/data/', '@/data/'],
	['@/mobile/src/shared/', '@/shared/'],
	['@/mobile/src/features/', '@/features/'],
	['@/features/config/components/ConfigHeader', '@/features/settings/components/ConfigHeader'],
	['@/features/config/components/ConfigCard', '@/features/settings/components/ConfigCard'],
	['@/features/config/styles/configLayout', '@/features/settings/styles/configLayout'],
	['@/features/config/styles/configCard', '@/features/settings/styles/configCard'],
	['@/features/config/styles/configMenu', '@/features/settings/styles/configMenu'],
	['@/features/config/styles/accountData', '@/features/settings/styles/accountData'],
	['@/features/config/styles/permissions', '@/features/settings/styles/permissions'],
	['@/features/config/styles/preferences', '@/features/settings/styles/preferences'],
	['@/features/config/styles/editField', '@/features/settings/styles/editField'],
	['@/features/config/styles/confirmPassword', '@/features/settings/styles/confirmPassword'],
	['@/features/config/hooks/usePreferences', '@/features/settings/hooks/usePreferences'],
	['@/features/config/hooks/useEmergencyContactsList', '@/features/emergencyContacts/hooks/useEmergencyContactsList'],
	['@/features/config/hooks/useEmergencyContacts', '@/features/emergencyContacts/hooks/useEmergencyContacts'],
	['@/features/config/hooks/useEmergencyContactForm', '@/features/emergencyContacts/hooks/useEmergencyContactForm'],
	['@/features/config/hooks/useEmergencyAlerts', '@/features/emergencyContacts/hooks/useEmergencyAlerts'],
	['@/features/config/components/EmergencyContacts', '@/features/emergencyContacts/components/EmergencyContacts'],
	['@/features/config/components/EmergencyContact', '@/features/emergencyContacts/components/EmergencyContact'],
	['@/features/config/styles/emergencyContacts', '@/features/emergencyContacts/styles/emergencyContacts'],
	['@/features/config/styles/emergencyContactForm', '@/features/emergencyContacts/styles/emergencyContactForm'],
	['@/features/config/utils/formatPhoneNumber', '@/features/emergencyContacts/utils/formatPhoneNumber'],
	['@/features/config/hooks/useCrisisLog', '@/features/crisisSupport/hooks/useCrisisLog'],
	['@/features/config/components/CrisisLog', '@/features/crisisSupport/components/CrisisLog'],
	['@/features/config/types/crisisLog', '@/features/crisisSupport/types/crisisLog'],
	['@/features/config/styles/crisisLog', '@/features/crisisSupport/styles/crisisLog'],
	['@/features/config/styles/crisisResources', '@/features/crisisSupport/styles/crisisResources'],
	['@/features/config/styles/copingTools', '@/features/crisisSupport/styles/copingTools'],
	['@/features/config/views/copingTools', '@/features/crisisSupport/views/copingTools'],
	['@/features/config/views/crisisLog', '@/features/crisisSupport/views/crisisLog'],
	['@/features/config/views/crisisResources', '@/features/crisisSupport/views/crisisResources'],
	['@/features/config/views/configMenu', '@/features/settings/views/configMenu'],
	['@/features/config/views/accountData', '@/features/settings/views/accountData'],
	['@/features/config/views/preferences', '@/features/settings/views/preferences'],
	['@/features/config/views/permissions', '@/features/settings/views/permissions'],
	['@/features/config/views/editField', '@/features/settings/views/editField'],
	['@/features/config/views/confirmPassword', '@/features/settings/views/confirmPassword'],
	['@/features/config/views/emergencyContacts', '@/features/emergencyContacts/views/emergencyContacts'],
	['@/features/config/views/addEmergencyContact', '@/features/emergencyContacts/views/addEmergencyContact'],
	['@/features/config/views/editEmergencyContact', '@/features/emergencyContacts/views/editEmergencyContact'],
];

function walk(dir, files = []) {
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		if (ent.name === 'node_modules' || ent.name === '.git') continue;
		const p = path.join(dir, ent.name);
		if (ent.isDirectory()) walk(p, files);
		else if (/\.(ts|tsx)$/.test(ent.name)) files.push(p);
	}
	return files;
}

for (const file of walk(root)) {
	let content = fs.readFileSync(file, 'utf8');
	let changed = false;
	for (const [from, to] of replacements) {
		if (content.includes(from)) {
			content = content.split(from).join(to);
			changed = true;
		}
	}
	if (changed) fs.writeFileSync(file, content);
}

console.log('Import migration done.');
