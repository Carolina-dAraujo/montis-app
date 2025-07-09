import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function TermsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Termos de Uso</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Termos de Uso do Aplicativo Montis</Text>
                <Text style={styles.updated}>Última atualização: 03 de julho de 2025</Text>

                <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
                <Text style={styles.paragraph}>
                    Ao acessar e utilizar o aplicativo Montis, você concorda com estes Termos de Uso e com a nossa Política de Privacidade. Se você não concorda, por favor, não utilize o Montis.
                </Text>

                <Text style={styles.sectionTitle}>2. Descrição do Serviço</Text>
                <Text style={styles.paragraph}>
                    Montis é um aplicativo de apoio à sobriedade voltado para pessoas em recuperação da dependência alcoólica. A plataforma oferece ferramentas para fortalecer a jornada de sobriedade, como:
                    {'\n\n'}• Registro de dias sóbrios{'\n'}• Diário emocional{'\n'}• Ativação de modo de crise{'\n'}• Contato com padrinhos e familiares autorizados{'\n'}• Recursos personalizados de apoio
                    {'\n\n'}Montis não oferece serviços médicos ou terapêuticos e não substitui atendimento profissional de saúde.
                </Text>

                <Text style={styles.sectionTitle}>3. Cadastro e Acesso</Text>
                <Text style={styles.paragraph}>
                    O uso do Montis é gratuito para pessoas em recuperação.
                    {'\n\n'}O cadastro requer informações pessoais básicas e consentimento para o tratamento dos dados conforme nossa Política de Privacidade.
                    {'\n\n'}A criação de conta por familiares ou padrinhos requer autorização do usuário principal (em recuperação).
                </Text>

                <Text style={styles.sectionTitle}>4. Uso Responsável</Text>
                <Text style={styles.paragraph}>
                    Você concorda em utilizar o Montis com responsabilidade, respeitando a privacidade e a segurança de todos os usuários. É proibido:
                    {'\n\n'}• Compartilhar dados falsos{'\n'}• Utilizar o app com identidade de terceiros{'\n'}• Acessar dados de outros usuários sem permissão{'\n'}• Usar o app para fins que contrariem os princípios de sobriedade e apoio mútuo
                </Text>

                <Text style={styles.sectionTitle}>5. Conteúdo do Usuário</Text>
                <Text style={styles.paragraph}>
                    Ao inserir informações no app (como entradas de diário, marcações de crise ou dados pessoais), você continua sendo o titular desses dados. Ao mesmo tempo, autoriza o Montis a utilizá-los de forma anonimizada para melhorar o serviço.
                </Text>

                <Text style={styles.sectionTitle}>6. Privacidade e Proteção de Dados</Text>
                <Text style={styles.paragraph}>
                    Levamos sua privacidade a sério. Os dados fornecidos são armazenados com segurança e utilizados de acordo com nossa Política de Privacidade. Informações sensíveis (como registros de sobriedade e crises) são criptografadas.
                </Text>

                <Text style={styles.sectionTitle}>7. Modo de Crise</Text>
                <Text style={styles.paragraph}>
                    O Montis permite que o usuário ative um "modo de crise", que pode notificar contatos previamente autorizados (como padrinhos ou familiares). O uso desta funcionalidade depende de configurações realizadas pelo próprio usuário.
                </Text>

                <Text style={styles.sectionTitle}>8. Limitação de Responsabilidade</Text>
                <Text style={styles.paragraph}>
                    O Montis é uma ferramenta de apoio. Não substituímos médicos, terapeutas, psicólogos ou grupos presenciais de recuperação. Em caso de emergência, procure ajuda especializada ou ligue para serviços de emergência.
                </Text>

                <Text style={styles.sectionTitle}>9. Encerramento de Conta</Text>
                <Text style={styles.paragraph}>
                    Você pode encerrar sua conta a qualquer momento. Também nos reservamos o direito de suspender contas que violem estes termos ou que utilizem a plataforma de forma abusiva ou indevida.
                </Text>

                <Text style={styles.sectionTitle}>10. Alterações nos Termos</Text>
                <Text style={styles.paragraph}>
                    Podemos atualizar estes Termos de Uso periodicamente. Mudanças relevantes serão informadas dentro do próprio aplicativo. A continuidade do uso após a notificação representa aceitação das alterações.
                </Text>

                <Text style={styles.sectionTitle}>11. Contato</Text>
                <Text style={styles.paragraph}>
                    Para dúvidas, sugestões ou solicitações, entre em contato através do e-mail: suporte@montis.app.br
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
