import { ScrollView, StyleSheet } from 'react-native';
import BasicTimePickerExample from './components/basicComponent';
import CustomizedTimePickerExample from './components/customizedComponent';
import TimePicker24HExample from './components/timePicker24HExample';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BasicTimePickerExample/>
      <CustomizedTimePickerExample/>
      <TimePicker24HExample/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 50
  },
});
