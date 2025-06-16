import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Ajuda() {
    const router = useRouter();

    const services = [
        {
            name: "Alcoólicos Anônimos",
            description:
                "Irmandade de pessoas que compartilham experiências, força e esperança, a fim de resolver seu problema comum e ajudar outros a se recuperarem do alcoolismo.",
            icon: require("assets/images/aa.png"),
            link: "/ajuda/aa",
        },
        {
            name: "Centro de Atenção Psicossocial",
            description:
                "Instituição que oferece serviços de saúde mental. Trabalham para atender as necessidades de pessoas com transtornos mentais e uso prejudicial de álcool.",
            icon: require("assets/images/caps.png"),
            link: "/ajuda/caps",
        },
        {
            name: "Psicólogos parceiros",
            description:
                "Profissionais qualificados que oferecem escuta especializada e acompanhamento psicológico para pessoas em uso de álcool.",
            icon: require("assets/images/psicologia.png"),
            link: "/ajuda/psicologos",
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 50 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                    Encontre serviços:
                </Text>

                {services.map((service, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => router.push("/(tabs)/home")}
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginBottom: 20,
                        }}
                    >
                        <Image
                            source={service.icon}
                            style={{ width: 40, height: 40, marginRight: 12 }}
                            resizeMode="contain"
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                                {service.name}
                            </Text>
                            <Text style={{ color: "#555", marginTop: 4 }}>
                                {service.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
