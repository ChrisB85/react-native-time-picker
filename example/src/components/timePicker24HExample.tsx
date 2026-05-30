import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TimePicker from 'rn-time-picker';

export default function TimePicker24HExample() {
  const [time, setTime] = useState({ hour: 14, minute: 30 });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>24-hour mode</Text>
      <Text style={styles.value}>
        {time.hour.toString().padStart(2, '0')}:
        {time.minute.toString().padStart(2, '0')}
      </Text>
      <TimePicker
        radius={120}
        numberRadius={100}
        is24Hour
        initialHour={14}
        initialMinute={30}
        onValueChange={(hour, minute) => setTime({ hour, minute })}
        customStyles={{
          container: {
            backgroundColor: '#1e293b',
            padding: 12,
            borderRadius: 10,
          },
          clock: {
            backgroundColor: '#0f172a',
          },
        }}
        colors={{
          clockActiveColor: '#3b82f6',
          topActiveColor: 'rgba(59,130,246,0.3)',
          topActiveTextColor: 'white',
          topInActiveTextColor: '#94a3b8',
          topInActiveColor: '#1e293b',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1d4ed8',
  },
});
