import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CalendarListProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    trackedDays?: string[]; // Array of date strings (e.g., date.toDateString())
}

interface MonthData {
    year: number;
    month: number;
    days: (Date | null)[];
}

const screenWidth = Dimensions.get('window').width;
const PADDING_HORIZONTAL = 16;
const GAP_BETWEEN_DAYS = 4;
const DAYS_IN_WEEK = 7;
const DAY_SIZE = (screenWidth - PADDING_HORIZONTAL - GAP_BETWEEN_DAYS * (DAYS_IN_WEEK * 2)) / DAYS_IN_WEEK;

export default function CalendarList({ selectedDate, onDateSelect, trackedDays = [] }: CalendarListProps) {
    const router = useRouter();
    const [months, setMonths] = useState<MonthData[]>([]);

    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    useEffect(() => {
        generateMonths();
    }, []);

    const generateMonths = () => {
        const monthsData: MonthData[] = [];
        const currentDate = new Date();

        for (let i = -6; i <= 6; i++) {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();

            monthsData.push({
                year,
                month,
                days: generateCalendarDays(year, month)
            });
        }

        setMonths(monthsData);
    };

    const generateCalendarDays = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const startDayOfWeek = firstDay.getDay();
        const prevMonthDate = new Date(year, month, 1 - startDayOfWeek);

        const days: (Date | null)[] = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(prevMonthDate);
            date.setDate(prevMonthDate.getDate() + i);
            days.push(date);
        }

        return days;
    };

    const isSelectedDate = (date: Date | null) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date: Date | null, year: number, month: number) => {
        if (!date) return false;
        return date.getFullYear() === year && date.getMonth() === month;
    };

    const isTracked = (date: Date | null) => {
        if (!date) return false;
        return trackedDays.includes(date.toDateString());
    };

    const handleDateSelect = (date: Date) => {
        onDateSelect(date);
        router.push({ pathname: '/tracking/[date]', params: { date: date.toISOString() } });
    };

    const renderMonth = (monthData: MonthData) => {
        return (
            <View key={`${monthData.year}-${monthData.month}`} style={styles.monthContainer}>
                <View style={styles.monthHeader}>
                    <Text style={styles.monthTitle}>
                        {monthNames[monthData.month]} {monthData.year}
                    </Text>
                </View>

                <View style={styles.weekHeader}>
                    {weekDays.map((day, index) => (
                        <Text key={index} style={styles.weekDay}>
                            {day}
                        </Text>
                    ))}
                </View>

                <View style={styles.calendar}>
                    {monthData.days.map((date, index) => {
                        const inCurrentMonth = isCurrentMonth(date, monthData.year, monthData.month);
                        const today = isToday(date);
                        const selected = isSelectedDate(date);
                        const tracked = isTracked(date);

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayContainer,
                                    selected && styles.selectedDay,
                                    today && !selected && styles.todayDay,
                                    !today && !selected && tracked && styles.trackedDay,
                                    !inCurrentMonth && styles.otherMonth,
                                ]}
                                onPress={() => date && handleDateSelect(date)}
                                disabled={!date}
                            >
                                {date && (
                                    <Text
                                        style={[
                                            styles.dayText,
                                            selected && styles.selectedDayText,
                                            today && !selected && styles.todayDayText,
                                            !today && !selected && tracked && styles.trackedDayText,
                                            !inCurrentMonth && styles.otherMonthText,
                                        ]}
                                    >
                                        {date.getDate()}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {months.map((monthData) => renderMonth(monthData))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
    monthContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    monthHeader: {
        marginBottom: 8,
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
        borderTopWidth: 1,
        borderTopColor: '#D1D5DB',
        paddingVertical: 4,
    },
    monthTitle: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#595858',
    },
    weekHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 8,
        width: DAY_SIZE * 7,
    },
    weekDay: {
        width: DAY_SIZE,
        marginHorizontal: 2,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: '#6B7280',
    },
    calendar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    dayContainer: {
        width: DAY_SIZE,
        height: DAY_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2,
        marginVertical: 2,
        borderRadius: 8,
        backgroundColor: '#E3E3E3',
    },
    selectedDay: {
        backgroundColor: '#254A8E',
    },
    todayDay: {
        borderColor: '#2563EB',
        borderWidth: 1.5,
        backgroundColor: '#E0EDFF',
    },
    otherMonth: {
        opacity: 0.3,
    },
    dayText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: '#595858',
    },
    selectedDayText: {
        color: '#FFFFFF',
        fontFamily: 'Inter-SemiBold',
    },
    todayDayText: {
        color: '#2563EB',
        fontFamily: 'Inter-SemiBold',
    },
    otherMonthText: {
        color: '#9CA3AF',
    },
    trackedDay: {
        backgroundColor: '#60A5FA', // medium blue
    },
    trackedDayText: {
        color: '#fff',
        fontFamily: 'Inter-SemiBold',
    },
});
