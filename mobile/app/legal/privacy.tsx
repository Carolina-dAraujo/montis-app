import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function PrivacyScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Política de Privacidade</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Política de Privacidade do Aplicativo Montis</Text>
                <Text style={styles.updated}>Última atualização: 03 de julho de 2025</Text>

                <Text style={styles.sectionTitle}>1. Compromisso com a Privacidade</Text>
                <Text style={styles.paragraph}>
                    O Montis respeita a privacidade dos seus usuários e está comprometido em proteger os dados pessoais e sensíveis que você compartilha conosco.
                </Text>

                <Text style={styles.sectionTitle}>2. Dados Coletados</Text>
                <Text style={styles.paragraph}>
                    Coletamos apenas as informações necessárias para o funcionamento do aplicativo, como:
                    {'\n\n'}• Nome e e-mail{'\n'}• Datas e registros de sobriedade{'\n'}• Informações inseridas em diários e modo de crise{'\n'}• Dados de contatos de apoio
                </Text>

                <Text style={styles.sectionTitle}>3. Uso dos Dados</Text>
                <Text style={styles.paragraph}>
                    Os dados são utilizados para:
                    {'\n\n'}• Fornecer funcionalidades essenciais do aplicativo{'\n'}• Personalizar sua experiência{'\n'}• Enviar alertas e notificações configuradas por você{'\n'}• Aprimorar o serviço, sempre de forma anonimizada
                </Text>

                <Text style={styles.sectionTitle}>4. Compartilhamento de Informações</Text>
                <Text style={styles.paragraph}>
                    Seus dados não são compartilhados com terceiros sem seu consentimento. Contatos de apoio só recebem notificações se previamente autorizados por você.
                </Text>

                <Text style={styles.sectionTitle}>5. Armazenamento e Segurança</Text>
                <Text style={styles.paragraph}>
                    Utilizamos medidas técnicas e organizacionais para proteger suas informações. Dados sensíveis, como entradas de crise e registros de sobriedade, são criptografados.
                </Text>

                <Text style={styles.sectionTitle}>6. Direitos do Usuário</Text>
                <Text style={styles.paragraph}>
                    Você pode a qualquer momento:
                    {'\n\n'}• Acessar os dados que possui no app{'\n'}• Corrigir ou excluir informações pessoais{'\n'}• Solicitar o encerramento da conta e exclusão dos dados
                </Text>

                <Text style={styles.sectionTitle}>7. Cookies e Tecnologias Semelhantes</Text>
                <Text style={styles.paragraph}>
                    O Montis não utiliza cookies ou tecnologias de rastreamento de terceiros. Toda coleta ocorre dentro do app com consentimento.
                </Text>

                <Text style={styles.sectionTitle}>8. Alterações nesta Política</Text>
                <Text style={styles.paragraph}>
                    Esta política pode ser atualizada conforme melhorias no app ou exigências legais. Avisaremos dentro do aplicativo sempre que mudanças relevantes forem feitas.
                </Text>

                <Text style={styles.sectionTitle}>9. Contato</Text>
                <Text style={styles.paragraph}>
                    Em caso de dúvidas ou solicitações relacionadas à privacidade, entre em contato através do e-mail: suporte@montis.app.br
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        paddingRight: 12,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#222',
    },
    updated: {
        fontSize: 12,
        color: '#666',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 4,
    },
    paragraph: {
        fontSize: 14,
        color: '#444',
        lineHeight: 22,
    },
});
